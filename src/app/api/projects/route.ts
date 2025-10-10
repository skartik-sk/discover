import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

// Function to create URL-friendly slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const username = searchParams.get('username')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('projects')
      .select(`
        *,
        categories:category_id (
          id,
          slug,
          name,
          icon,
          color,
          gradient
        ),
        tags:project_tags (
          tag_name
        )
      `)
      .eq('is_active', true)

    // Filter by username if specified
    if (username) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        return NextResponse.json({ projects: [], total: 0, hasMore: false })
      }
    }

    // Filter by category if specified
    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    // Filter featured projects if specified
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Search functionality
    if (search) {
      query = query.or(`
        title.ilike.%${search}%,
        description.ilike.%${search}%
      `)
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (username) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (user) {
        countQuery = countQuery.eq('user_id', user.id)
      }
    }

    if (categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (category) {
        countQuery = countQuery.eq('category_id', category.id)
      }
    }

    if (featured === 'true') {
      countQuery = countQuery.eq('is_featured', true)
    }

    if (search) {
      countQuery = countQuery.or(`
        title.ilike.%${search}%,
        description.ilike.%${search}%
      `)
    }

    const { count } = await countQuery

    // Apply pagination and ordering
    const { data: projects, error } = await query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Projects fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    // Get user IDs from projects and fetch user data
    const userIds = [...new Set(projects.map(p => p.user_id).filter(Boolean))]
    let usersData: any[] = []

    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, display_name')
        .in('id', userIds)
      usersData = users || []
    }

    // Transform the data to include tags as array and user info
    const transformedProjects = projects.map(project => {
      const user = usersData.find(u => u.id === project.user_id)

      // Generate slug if it doesn't exist
      let projectSlug = project.slug
      if (!projectSlug) {
        projectSlug = project.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      return {
        ...project,
        slug: projectSlug,
        tags: project.tags?.map((tag: any) => tag.tag_name) || [],
        owner: {
          username: user?.username || 'demo',
          displayName: user?.display_name || 'Demo User'
        }
      }
    })

    return NextResponse.json({
      projects: transformedProjects,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      logo_url,
      website_url,
      github_url,
      category_slug,
      tags,
      is_featured,
      slug
    } = body

    // Validate required fields
    if (!title || !category_slug) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }

    // Get the authenticated user
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('id, username')
      .eq('email', session.user.email)
      .single()

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get category ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category_slug)
      .single()

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Generate or validate slug
    let projectSlug = slug || createSlug(title)

    // Ensure slug is unique for this user
    let finalSlug = projectSlug
    let counter = 1

    while (true) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('slug')
        .eq('user_id', authUser.id)
        .eq('slug', finalSlug)
        .single()

      if (!existingProject) break

      finalSlug = `${projectSlug}-${counter}`
      counter++
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        title,
        slug: finalSlug,
        description,
        logo_url,
        website_url,
        github_url,
        category_id: category.id,
        user_id: authUser.id,
        is_featured: is_featured || false
      }])
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          color,
          gradient
        ),
        users!projects_user_id_fkey (
          username,
          display_name
        )
      `)
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        project_id: project.id,
        tag_name: tag
      }))

      await supabase
        .from('project_tags')
        .insert(tagInserts)
    }

    // Return the project with user info
    const responseProject = {
      ...project,
      tags: tags || [],
      owner: {
        username: project.users?.username,
        displayName: project.users?.display_name
      }
    }

    return NextResponse.json(responseProject, { status: 201 })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}