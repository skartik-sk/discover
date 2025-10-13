import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
    }

    // Get user's projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        categories:category_id (
          name,
          slug,
          color
        ),
        tags:project_tags (
          tag_id,
          tags:tag_id (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Projects fetch error:', projectsError)
    }

    // Get project views count
    const { data: projectViews, error: viewsError } = await supabase
      .from('project_views')
      .select('project_id')
      .in('project_id', projects?.map(p => p.id) || [])

    if (viewsError) {
      console.error('Views fetch error:', viewsError)
    }

    // Calculate statistics
    const totalViews = projectViews?.length || 0
    const projectCount = projects?.length || 0
    const totalTags = projects?.reduce((acc, project) => acc + (project.tags?.length || 0), 0) || 0

    // Format projects with tags
    const formattedProjects = projects?.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      logo_url: project.logo_url,
      website_url: project.website_url,
      github_url: project.github_url,
      is_featured: project.is_featured,
      views: projectViews?.filter(v => v.project_id === project.id).length || 0,
      created_at: project.created_at,
      updated_at: project.updated_at,
      category: project.categories,
      tags: project.tags?.map((tag: any) => tag.tags?.name).filter(Boolean) || []
    })) || []

    // Return dashboard data
    const dashboardData = {
      profile: {
        id: user.id,
        email: user.email,
        name: profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        username: profile?.username || user.email?.split('@')[0] || 'user',
        avatar: user.user_metadata?.avatar_url || profile?.avatar_url || null,
        bio: profile?.bio || 'No bio set yet',
        role: profile?.role || 'tester',
        wallet_address: profile?.wallet_address || null,
        is_verified: profile?.is_verified || false,
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at || user.updated_at
      },
      stats: {
        projects_submitted: projectCount,
        total_views: totalViews,
        total_tags: totalTags,
        featured_projects: projects?.filter(p => p.is_featured).length || 0
      },
      projects: formattedProjects,
      recent_activity: [] // TODO: Implement activity tracking
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}