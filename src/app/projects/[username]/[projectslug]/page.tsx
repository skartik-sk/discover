import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProjectDetail from '@/components/ProjectDetail'

interface PageProps {
  params: Promise<{
    username: string
    projectslug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, projectslug } = await params

  try {
    // For demo projects without real users, use fallback logic
    if (username === 'demo') {
      // Get all active projects first (simpler query)
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)

      if (projectsError || !projects) {
        return {
          title: 'Project Not Found',
        }
      }

      // Generate slug for each project and find the matching one
      const project = projects.find(p => {
        const generatedSlug = p.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
        return generatedSlug === projectslug
      })

      if (!project) {
        return {
          title: 'Project Not Found',
        }
      }

      // Fetch category for demo project
      const categoryData = project.category_id ? await supabase
        .from('categories')
        .select('name')
        .eq('id', project.category_id)
        .single() : { data: null }

      return {
        title: `${project.title} by Demo User - Web3 Project Hunt`,
        description: project.description || 'Discover innovative Web3 projects',
        keywords: project.tags || [],
        authors: [{ name: 'Demo User' }],
        openGraph: {
          title: project.title,
          description: project.description,
          images: project.logo_url ? [project.logo_url] : [],
          type: 'article',
          siteName: 'Web3 Project Hunt',
        },
        twitter: {
          card: 'summary_large_image',
          title: project.title,
          description: project.description,
          images: project.logo_url ? [project.logo_url] : [],
        },
      }
    }

    // First get the user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, display_name')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (userError || !user) {
      return {
        title: 'Project Not Found',
      }
    }

    // Get the project by user and slug with related data
    const { data: project } = await supabase
      .from('projects')
      .select(`
        *,
        categories:category_id (
          name,
          slug
        ),
        tags:project_tags (
          tag_name
        )
      `)
      .eq('user_id', user.id)
      .eq('slug', projectslug)
      .eq('is_active', true)
      .single()

    if (!project) {
      return {
        title: 'Project Not Found',
      }
    }

    const tagNames = project.tags?.map((tag: any) => tag.tag_name) || []

    return {
      title: `${project.title} by ${user.display_name || user.username} - Web3 Project Hunt`,
      description: project.description || 'Discover innovative Web3 projects',
      keywords: tagNames,
      authors: [{ name: user.display_name || user.username }],
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.logo_url ? [project.logo_url] : [],
        type: 'article',
        siteName: 'Web3 Project Hunt',
        tags: tagNames,
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: project.logo_url ? [project.logo_url] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Project Not Found',
    }
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { username, projectslug } = await params

  try {
    // For demo projects without real users, use fallback logic
    if (username === 'demo') {
      // Get all active projects first (simpler query)
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)

      console.log('Projects query result:', { projectsError, projectsLength: projects?.length })

      if (projectsError || !projects) {
        console.error('Projects query error:', projectsError)
        notFound()
      }

      // Generate slug for each project and find the matching one
      console.log('Looking for project with slug:', projectslug)
      const project = projects.find(p => {
        const generatedSlug = p.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
        console.log(`Project "${p.title}" generates slug: "${generatedSlug}"`)
        return generatedSlug === projectslug
      })

      console.log('Found project:', project ? project.title : 'Not found')

      if (!project) {
        notFound()
      }

      // Fetch related data separately
      console.log('Fetching related data for project ID:', project.id)

      try {
        const [categoriesResult, tagsResult, reviewsResult] = await Promise.all([
          // Get category
          project.category_id ? supabase
            .from('categories')
            .select('id, name, slug, color, gradient')
            .eq('id', project.category_id)
            .single() : Promise.resolve({ data: null, error: null }),

          // Get tags
          supabase
            .from('project_tags')
            .select('tag_name')
            .eq('project_id', project.id),

          // Get reviews with user info
          supabase
            .from('project_reviews')
            .select(`
              id,
              rating,
              review_text,
              created_at,
              users:user_id (
                username,
                display_name,
                avatar_url
              )
            `)
            .eq('project_id', project.id)
        ])

        console.log('Related data results:', {
          categoriesError: categoriesResult.error,
          tagsError: tagsResult.error,
          reviewsError: reviewsResult.error,
          categoriesData: categoriesResult.data,
          tagsData: tagsResult.data,
          reviewsData: reviewsResult.data
        })

        // Increment view count
        await supabase
          .from('projects')
          .update({ views: project.views + 1 })
          .eq('id', project.id)

        // Transform the data with fallback user
        const transformedProject = {
          ...project,
          categories: categoriesResult.data,
          tags: tagsResult.data?.map((tag: any) => tag.tag_name) || [],
          owner: {
            id: project.user_id,
            username: 'demo',
            displayName: 'Demo User',
            avatarUrl: null,
            bio: 'Demo user for showcase projects',
          },
          reviews: reviewsResult.data || [],
        }

        console.log('Transformed project:', transformedProject)
        return <ProjectDetail project={transformedProject} />
      } catch (error) {
        console.error('Error fetching related data:', error)
        // Continue with basic project data even if related data fails
        const transformedProject = {
          ...project,
          categories: null,
          tags: [],
          owner: {
            id: project.user_id,
            username: 'demo',
            displayName: 'Demo User',
            avatarUrl: null,
            bio: 'Demo user for showcase projects',
          },
          reviews: [],
        }
        return <ProjectDetail project={transformedProject} />
      }
    }

    // First get the user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, bio')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (userError || !user) {
      notFound()
    }

    // Get the project by user and slug
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          color,
          gradient
        ),
        tags:project_tags (
          tag_name
        ),
        reviews:project_reviews (
          id,
          rating,
          review_text,
          created_at,
          users:user_id (
            username,
            display_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('slug', projectslug)
      .eq('is_active', true)
      .single()

    if (projectError || !project) {
      notFound()
    }

    // Increment view count
    await supabase
      .from('projects')
      .update({ views: project.views + 1 })
      .eq('id', project.id)

    // Transform the data
    const transformedProject = {
      ...project,
      tags: project.tags?.map((tag: any) => tag.tag_name) || [],
      owner: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
      },
      reviews: project.reviews || [],
    }

    return <ProjectDetail project={transformedProject} />
  } catch (error) {
    console.error('Error fetching project:', error)
    notFound()
  }
}