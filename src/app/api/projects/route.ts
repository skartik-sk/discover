import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

    // Note: username filtering temporarily disabled due to missing auth_id field in projects table
    // TODO: Add user relationship to projects table to enable username filtering

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

    // Transform the data to include tags as array and generate slug from title
    const transformedProjects = projects.map(project => {
      // Generate slug from title for frontend use
      const projectSlug = project.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      return {
        ...project,
        slug: projectSlug,
        tags: project.tags?.map((tag: any) => tag.tag_name) || [],
        owner: {
          username: 'anonymous',
          displayName: 'Anonymous User'
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
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token)

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
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

    // Get the authenticated user from our users table
    const { data: authUser, error: userError } = await supabaseServer
      .from('users')
      .select('id, username')
      .eq('email', user.email)
      .single()

    if (userError || !authUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get category ID
    const { data: category, error: categoryError } = await supabaseServer
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

      // Note: slug functionality temporarily disabled due to missing slug column in projects table
    // TODO: Add slug column to projects table for URL-friendly project identifiers

    // Create project
    const { data: project, error: projectError } = await supabaseServer
      .from('projects')
      .insert([{
        title,
        description,
        logo_url,
        website_url,
        github_url,
        category_id: category.id,
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

      await supabaseServer
        .from('project_tags')
        .insert(tagInserts)
    }

    // Return the project with user info
    const responseProject = {
      ...project,
      tags: tags || [],
      owner: {
        username: authUser.username,
        displayName: authUser.display_name
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