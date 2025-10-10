import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all projects to debug
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Generate slugs for all projects
    const projectsWithSlugs = projects?.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug || project.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      has_slug: !!project.slug
    })) || []

    return NextResponse.json({
      total: projects?.length || 0,
      projects: projectsWithSlugs
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}