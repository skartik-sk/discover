# Complete Setup Guide - Web3 Showcase Platform

## 🚀 Quick Start

This guide will help you set up the Web3 Showcase Platform with all required environment variables and configurations.

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (free tier works)
- Google Cloud Console account (for OAuth)

## 🔧 Environment Variables Setup

### Step 1: Create Environment File

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

### Step 2: Add Required Environment Variables

Copy and paste the following into your `.env.local` file:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================
# SITE CONFIGURATION
# ============================================
# IMPORTANT: For production, set this to your actual domain
# For local development: http://localhost:3000
# For production: https://yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
# Should match NEXT_PUBLIC_SITE_URL
NEXTAUTH_URL=http://localhost:3000
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# ============================================
# GOOGLE OAUTH (OPTIONAL)
# ============================================
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 🔑 Getting Your Environment Variables

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Navigate to **Settings > API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. NextAuth Secret Generation

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET`

### 3. Google OAuth Setup (Required for Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure consent screen if not done already
6. Set application type to **Web application**
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
8. Copy **Client ID** and **Client Secret**

**IMPORTANT FOR GOOGLE AUTH:**
- In your Supabase project, go to **Authentication > Providers**
- Enable **Google** provider
- Add your Google Client ID and Secret
- Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. Supabase Database Setup

Run the SQL migrations in your Supabase project:

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy contents from `supabase/schema.sql`
4. Run the query

## 🌐 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Update environment variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. Add redirect URIs in Google Console:
   - `https://yourdomain.com/api/auth/callback/google`
   - `https://yourdomain.com/auth/callback`

3. Update Supabase Auth settings:
   - Add `https://yourdomain.com` to allowed redirect URLs
   - Add your domain to Site URL in Supabase Auth settings

## 🐛 Troubleshooting

### Google Auth Redirecting to localhost

**Problem:** After Google authentication, it redirects to localhost instead of your production URL.

**Solution:**
1. Ensure `NEXT_PUBLIC_SITE_URL` is set to your production domain
2. Clear browser cache and cookies
3. Check Google Console authorized redirect URIs
4. Verify Supabase redirect URLs include your production domain

### Views Not Tracking

**Problem:** Project views not incrementing.

**Solution:**
- Views are automatically tracked when users visit project detail pages
- The API endpoint `/api/projects/[projectId]/view` handles this
- Check browser console for any errors

### Build Errors

**Problem:** Build fails with environment variable errors.

**Solution:**
1. Ensure all required variables in `.env.local` are set
2. For production builds, set variables in your hosting platform
3. Never commit `.env.local` to git

## 📱 Mobile Optimization

The platform is fully optimized for mobile devices with:
- Responsive typography (mobile-first approach)
- Touch-friendly buttons and cards
- Optimized spacing and layouts
- Proper text wrapping and truncation

## 🧪 Testing

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build Test

```bash
npm run build
npm run start
```

## 🎨 Features

✅ Fully responsive design (mobile-first)
✅ Google OAuth authentication
✅ Project submission and management
✅ View tracking (automatic)
✅ Category browsing
✅ Search functionality
✅ User profiles
✅ Dark theme optimized
✅ SEO optimized

## 📞 Support

If you encounter any issues:
1. Check this guide thoroughly
2. Verify all environment variables are set correctly
3. Check browser console for errors
4. Ensure Supabase database is set up correctly

---

**Made with ❤️ for the Web3 community**
