import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // Create Supabase client for server-side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const body = await request.json()
    const {
      auth_id,
      email,
      display_name,
      username,
      avatar_url,
      role = 'submitter'
    } = body

    // Validate required fields
    if (!auth_id || !email) {
      return NextResponse.json(
        { error: 'auth_id and email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', auth_id)
      .single()

    if (existingUser) {
      return NextResponse.json({ success: true, user: existingUser })
    }

    // Generate unique username if not provided
    let finalUsername = username || email.split('@')[0]
    let counter = 1

    // Ensure username is unique
    while (true) {
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('username')
        .eq('username', finalUsername)
        .single()

      if (!usernameCheck) break

      finalUsername = `${username || email.split('@')[0]}${counter}`
      counter++
    }

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        auth_id,
        email,
        display_name: display_name || email.split('@')[0],
        username: finalUsername,
        avatar_url,
        role
      })
      .select()
      .single()

    if (error) {
      console.error('User creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}