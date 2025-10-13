"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: string | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  getAuthHeaders: () => { Authorization: string } | {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle specific auth events
        if (event === 'SIGNED_IN' && session) {
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/signin')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    return { error: error?.message || null }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error && data.user) {
      // Ensure user record exists in our database after successful sign-in
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_id: data.user.id,
            email: data.user.email,
            display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
            username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url,
            role: 'submitter',
          })
        })

        if (!response.ok) {
          console.error('Failed to ensure user record in database')
        }
      } catch (err) {
        console.error('Error ensuring user record:', err)
      }
    }

    return { error: error?.message || null }
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (!error && data.user) {
      // Create user record in our database after successful signup
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_id: data.user.id,
            email: data.user.email,
            display_name: metadata?.display_name || data.user.email?.split('@')[0],
            username: metadata?.username || data.user.email?.split('@')[0],
            avatar_url: metadata?.avatar_url,
            role: 'submitter',
          })
        })

        if (!response.ok) {
          console.error('Failed to create user record in database')
        }
      } catch (err) {
        console.error('Error creating user record:', err)
      }
    }

    return { error: error?.message || null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const getAuthHeaders = () => {
    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`
      }
    }
    return {}
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getAuthHeaders
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}