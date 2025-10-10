import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Get single category by slug
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }

      // Get projects count for this category
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)

      return NextResponse.json({
        ...category,
        projects_count: projectsCount || 0
      })
    }

    // Get all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // Get projects count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('is_active', true)

        return {
          ...category,
          projects_count: count || 0
        }
      })
    )

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon, color, gradient, slug, sort_order } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        slug,
        description,
        icon,
        color,
        gradient,
        sort_order: sort_order || 0
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}