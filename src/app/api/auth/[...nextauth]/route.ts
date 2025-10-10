import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user exists in our database
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          // Generate unique username from email
          let username = user.email?.split('@')[0]
          let finalUsername = username
          let counter = 1

          // Ensure username is unique
          while (true) {
            const { data: usernameCheck } = await supabaseAdmin
              .from('users')
              .select('username')
              .eq('username', finalUsername)
              .single()

            if (!usernameCheck) break

            finalUsername = `${username}${counter}`
            counter++
          }

          // Create new user
          const { data: newUser, error } = await supabaseAdmin
            .from('users')
            .insert({
              auth_id: user.id,
              email: user.email,
              display_name: user.name,
              username: finalUsername,
              avatar_url: user.image,
              role: 'submitter', // Default role for project submission
            })
            .select()
            .single()

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        } else {
          // Update existing user with latest info
          await supabaseAdmin
            .from('users')
            .update({
              display_name: user.name,
              avatar_url: user.image,
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email)
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        // Fetch user from database
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', session.user?.email)
          .single()

        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          session.user.username = user.username
          session.user.walletAddress = user.wallet_address
        }
      } catch (error) {
        console.error('Error in session callback:', error)
      }

      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
})

export { handler as GET, handler as POST }