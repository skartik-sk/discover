import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Get current project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, views')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Increment views
    const newViews = (project.views || 0) + 1
    const { error: updateError } = await supabase
      .from('projects')
      .update({ views: newViews })
      .eq('id', projectId)

    if (updateError) {
      console.error('Error updating views:', updateError)
      return NextResponse.json(
        { error: 'Failed to update views' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        views: newViews,
        message: 'View counted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in view tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
