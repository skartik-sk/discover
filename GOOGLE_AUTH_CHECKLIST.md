# Google Authentication Setup Checklist

## ✅ Code Review Results

### 1. **Auth Context Implementation** ✅ GOOD
- ✅ Uses modern `@supabase/ssr` with `createBrowserClient`
- ✅ Proper session management
- ✅ Auth state change listener implemented
- ✅ Correct redirect URL setup: `${window.location.origin}/auth/callback`
- ✅ User record creation after successful auth

### 2. **Auth Callback Route** ⚠️ NEEDS IMPROVEMENT
**Location:** `/src/app/auth/callback/route.ts`

**Issues Found:**
1. ❌ Using `SUPABASE_SERVICE_ROLE_KEY` instead of `SUPABASE_ANON_KEY`
2. ❌ Not using cookies for SSR authentication
3. ⚠️ Creating a new client instead of using request cookies

**What Should Happen:**
- Use cookies for proper SSR authentication
- Exchange code for session properly
- Store session in cookies

### 3. **Environment Variables Required**
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional for callback)
```

### 4. **Supabase Dashboard Configuration Required**

#### **In Supabase Dashboard → Authentication → URL Configuration:**
1. **Site URL:** `http://localhost:3000` (development) or `https://yourdomain.com` (production)
2. **Redirect URLs:** Add these URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

#### **In Supabase Dashboard → Authentication → Providers → Google:**
1. Enable Google provider
2. Add your Google OAuth credentials:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console

### 5. **Google Cloud Console Configuration Required**

#### **OAuth 2.0 Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable Google+ API
4. Go to **APIs & Services → Credentials**
5. Create OAuth 2.0 Client ID (Web application)
6. Add **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://yourdomain.com`
7. Add **Authorized redirect URIs:**
   - Copy the redirect URI from Supabase Dashboard (looks like: `https://yourproject.supabase.co/auth/v1/callback`)
   - NOT your app's callback URL!

---

## 🔧 Required Fixes

### Priority 1: Fix Auth Callback Route
The callback route needs to be updated to use proper SSR authentication with cookies.

### Priority 2: Verify Environment Variables
Ensure all required environment variables are set correctly.

### Priority 3: Verify Supabase Configuration
Check that all URLs are whitelisted in Supabase dashboard.

### Priority 4: Verify Google OAuth Configuration
Check that redirect URIs match Supabase's callback URL.

---

## 🧪 Testing Checklist

After fixes, test:
1. ✅ Click "Sign in with Google" button
2. ✅ Redirected to Google consent screen
3. ✅ After consent, redirected back to app
4. ✅ Successfully signed in and redirected to dashboard
5. ✅ User record created in database
6. ✅ Session persists on page refresh
7. ✅ Sign out works correctly

---

## 📝 Common Issues & Solutions

### Issue: "Invalid redirect URL"
**Solution:** Add the redirect URL to Supabase → Authentication → URL Configuration

### Issue: "OAuth error" from Google
**Solution:** Check that Supabase's callback URL is added to Google Cloud Console

### Issue: User not redirected after Google auth
**Solution:** Check the callback route implementation and error logs

### Issue: Session not persisting
**Solution:** Ensure cookies are being set properly in the callback route
