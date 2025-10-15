import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // Create Supabase client for server-side
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile data by auth_id (not id!)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // If user doesn't exist, create one
      if (profileError.code === 'PGRST116') {
        const { data: newProfile } = await supabaseAdmin
          .from('users')
          .insert({
            auth_id: user.id,
            email: user.email,
            display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            username: user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            role: 'submitter',
            is_active: true
          })
          .select()
          .single()
        
        if (newProfile) {
          // Use the newly created profile
          Object.assign(profile || {}, newProfile)
        }
      }
    }

    // Get user's projects (use profile.id as the user_id in projects table)
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
          tag_name
        )
      `)
      .eq('user_id', profile?.id || user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Projects fetch error:', projectsError)
    }

    // Calculate statistics
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
      views: 0, // TODO: Implement views tracking when table is created
      created_at: project.created_at,
      updated_at: project.updated_at,
      category: project.categories,
      tags: project.tags?.map((tag: any) => tag.tag_name).filter(Boolean) || []
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
        role: profile?.role || 'submitter',
        wallet_address: profile?.wallet_address || null,
        is_verified: profile?.is_verified || false,
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at || user.updated_at
      },
      stats: {
        projects_submitted: projectCount,
        total_views: 0, // TODO: Implement views tracking when table is created
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