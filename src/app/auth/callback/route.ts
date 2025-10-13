import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=${encodeURIComponent(error.message)}`)
      }

      // Check if user exists in our users table, create if not
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (!existingUser) {
          // Generate unique username from email
          let username = user.email?.split('@')[0] || 'user'
          let finalUsername = username
          let counter = 1

          // Ensure username is unique
          while (true) {
            const { data: usernameCheck } = await supabase
              .from('users')
              .select('username')
              .eq('username', finalUsername)
              .single()

            if (!usernameCheck) break

            finalUsername = `${username}${counter}`
            counter++
          }

          // Create new user in our database
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              auth_id: user.id,
              email: user.email,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              username: finalUsername,
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
              role: 'submitter',
            })

          if (insertError) {
            console.error('Error creating user in database:', insertError)
          }
        }
      }

      // Redirect to dashboard after successful auth
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=Authentication failed`)
    }
  }

  // Redirect to sign in if no code
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
}