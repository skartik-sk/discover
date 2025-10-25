# Production Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with the repository pushed
- Vercel account (free tier works)
- Supabase project set up

### Step 1: Prepare Environment Variables

1. Copy `.env.example` to `.env.production`:
```bash
cp .env.example .env.production
```

2. Update all values with your production credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production domain (e.g., `https://yourdomain.com`)
   - `NEXT_PUBLIC_APP_URL` - Same as NEXTAUTH_URL

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.production` file
   - Mark `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`, and `GOOGLE_CLIENT_SECRET` as **Secret**

6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables via CLI
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... add all other variables

# Deploy to production
vercel --prod
```

### Step 3: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > URL Configuration**
3. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: 
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/**`

4. Navigate to **Settings > API**
5. Verify your API keys match the ones in Vercel environment variables

### Step 4: Run Database Migrations

1. Go to Supabase SQL Editor
2. Run the migration files in order:
   ```sql
   -- Run supabase/migrations/001_initial_schema.sql first
   -- Then run supabase/migrations/002_fix_column_naming.sql
   ```

3. Verify tables exist:
   - `users`
   - `categories`
   - `projects`
   - `project_tags`
   - `project_reviews`

### Step 5: Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
4. Add the credentials to Vercel environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🐳 Deploy with Docker

### Build Docker Image

```bash
# Build the image
docker build -t discover-app .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=https://yourdomain.com \
  discover-app
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## 🔧 Environment Variables Reference

### Required for All Deployments

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (SECRET) | `eyJhbG...` |
| `NEXTAUTH_SECRET` | NextAuth secret (SECRET) | Generate with OpenSSL |
| `NEXTAUTH_URL` | Production domain | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | App URL for sharing | `https://yourdomain.com` |

### Optional (Web3 Features)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | `your_project_id` |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy API key | `your_api_key` |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | NFT contract address | `0x000...` |
| `NEXT_PUBLIC_RPC_URL` | Ethereum RPC URL | `https://mainnet.infura.io/v3/...` |

### Optional (Google OAuth)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (SECRET) |

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] All sensitive keys are marked as **Secret** in Vercel
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] No API keys hardcoded in source code
- [ ] `NEXTAUTH_SECRET` is generated with strong random string
- [ ] Supabase Row Level Security (RLS) policies are enabled
- [ ] CORS settings configured in Supabase
- [ ] Rate limiting enabled (Vercel Edge Config recommended)
- [ ] Domain is added to Supabase allowed URLs

---

## 🎨 Custom Domain Setup

### Vercel Custom Domain

1. Go to your Vercel project dashboard
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Update environment variables:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
6. Update Supabase redirect URLs with your custom domain

---

## 📊 Post-Deployment Verification

### 1. Test Core Features

- [ ] Homepage loads correctly
- [ ] Sign up creates user in database
- [ ] Sign in works with email/password
- [ ] Dashboard is accessible
- [ ] Settings page loads
- [ ] Projects page displays correctly
- [ ] Categories page works
- [ ] Submit form is functional

### 2. Test Authentication Flow

```bash
# Test signup
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test signin
curl -X POST https://your-app.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Check Logs

```bash
# Vercel CLI
vercel logs --follow

# Or check in Vercel dashboard -> Deployments -> Logs
```

### 4. Monitor Performance

- Check Vercel Analytics dashboard
- Monitor Supabase database metrics
- Set up error tracking (Sentry recommended)

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with module not found error
**Solution**: 
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Authentication Not Working

**Issue**: Users can't sign in/sign up
**Solution**:
1. Check Supabase URL configuration
2. Verify `NEXTAUTH_URL` matches your domain
3. Check Supabase allowed redirect URLs
4. Verify service role key is correct

### Database Errors

**Issue**: "column does not exist" errors
**Solution**:
1. Run migrations in correct order
2. Check table structure in Supabase
3. Verify RLS policies are not blocking queries

### Images Not Loading

**Issue**: Logo or images return 404
**Solution**:
1. Verify images are in `public/` folder
2. Check image paths start with `/` (e.g., `/logo.png`)
3. Clear Vercel cache and redeploy

---

## 📈 Performance Optimization

### Enable Caching

Add to `next.config.js`:

```js
module.exports = {
  images: {
    domains: ['your-supabase-url.supabase.co'],
  },
  // Enable ISR (Incremental Static Regeneration)
  experimental: {
    isrMemoryCacheSize: 0,
  },
}
```

### Database Optimization

1. Add indexes (already in schema):
   ```sql
   CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
   CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
   ```

2. Enable connection pooling in Supabase (Project Settings > Database > Connection Pooling)

### CDN Configuration

Vercel automatically provides global CDN. For additional optimization:

1. Enable Image Optimization (automatic with Vercel)
2. Use `next/image` component (already implemented)
3. Consider adding Cloudflare in front of Vercel for additional caching

---

## 🎯 Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database migrations run successfully
- [ ] Supabase URLs and redirects configured
- [ ] Custom domain configured (if applicable)
- [ ] Google OAuth configured (if using)
- [ ] All tests pass: `npm run build`
- [ ] Security checklist completed
- [ ] Error tracking set up (Sentry/LogRocket)
- [ ] Analytics configured (Vercel Analytics)
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place for Supabase
- [ ] Documentation updated

---

## 📞 Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **NextAuth.js Documentation**: https://next-auth.js.org

---

**Your app is now production-ready and can be deployed with confidence! 🎉**