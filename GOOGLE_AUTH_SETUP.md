# ✅ Google Authentication - Complete Setup Guide

## 📋 Code Review Summary

### ✅ **What's Working Correctly:**

1. **Auth Context (`/src/contexts/auth-context.tsx`)** ✅
   - Properly uses `@supabase/ssr` with `createBrowserClient`
   - Correct OAuth redirect URL
   - Session management working
   - User record creation after auth

2. **Middleware (`/src/middleware.ts`)** ✅
   - Proper SSR cookie handling
   - Protected routes configured
   - Auth state checking working

3. **Packages (`package.json`)** ✅
   - `@supabase/ssr": "^0.7.0"` ✅
   - `@supabase/supabase-js": "^2.74.0"` ✅
   - All dependencies are up-to-date

4. **Auth Callback (`/src/app/auth/callback/route.ts`)** ✅ **FIXED!**
   - Now uses proper SSR authentication with cookies
   - Correctly exchanges code for session
   - Updates user profile picture on signin
   - Proper error handling

---

## 🔧 Configuration Steps

### **Step 1: Environment Variables**

Ensure your `.env.local` file has these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional (not needed for Google auth with Supabase)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these:**
- Go to [Supabase Dashboard](https://app.supabase.com/)
- Select your project
- Go to **Settings → API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### **Step 2: Supabase Dashboard Configuration**

#### **A. URL Configuration**
1. Go to **Authentication → URL Configuration**
2. Set **Site URL:**
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. Add **Redirect URLs:**
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

#### **B. Enable Google Provider**
1. Go to **Authentication → Providers**
2. Find **Google** and click to configure
3. **Enable** the Google provider
4. You'll need to add credentials from Google Cloud Console (next step)

---

### **Step 3: Google Cloud Console Setup**

#### **A. Create OAuth 2.0 Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Choose **Web application**

#### **B. Configure OAuth Consent Screen (if first time)**
1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in required fields:
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid` (these are default)
5. Save and continue

#### **C. Configure Authorized Origins and Redirect URIs**

**Authorized JavaScript origins:**
```
http://localhost:3000
https://yourdomain.com
```

**Authorized redirect URIs:**
```
https://your-project.supabase.co/auth/v1/callback
```

⚠️ **IMPORTANT:** The redirect URI should be Supabase's callback, NOT your app's callback!

**Where to find the Supabase callback URL:**
- In Supabase Dashboard → Authentication → Providers → Google
- It will show you the exact callback URL to use
- It looks like: `https://yourproject.supabase.co/auth/v1/callback`

#### **D. Get Your Credentials**
After creating the OAuth client:
1. Copy **Client ID**
2. Copy **Client Secret**
3. Go back to Supabase Dashboard
4. Paste them into **Authentication → Providers → Google**
5. Click **Save**

---

### **Step 4: Test Your Setup**

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Go to `http://localhost:3000/auth/signin`
   - Click "Sign in with Google"
   - You should be redirected to Google consent screen
   - After allowing, you should be redirected back to your app
   - You should land on `/dashboard`
   - Check if you're logged in

3. **Check for errors:**
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

---

## 🐛 Troubleshooting

### **Issue 1: "Invalid redirect URL"**
**Cause:** URL not whitelisted in Supabase
**Fix:** 
- Go to Supabase → Authentication → URL Configuration
- Add your callback URL to the redirect URLs list

### **Issue 2: "OAuth error: redirect_uri_mismatch"**
**Cause:** Google Cloud Console redirect URI doesn't match
**Fix:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth 2.0 Client
- Make sure the redirect URI matches exactly: `https://yourproject.supabase.co/auth/v1/callback`

### **Issue 3: "Error 400: invalid_request"**
**Cause:** OAuth client not properly configured
**Fix:**
- Complete OAuth consent screen configuration
- Make sure all required fields are filled
- Re-create OAuth client if needed

### **Issue 4: Session not persisting after refresh**
**Cause:** Cookies not being set properly
**Fix:** Already fixed in the updated callback route!

### **Issue 5: User not created in database**
**Cause:** Database permissions or table missing
**Fix:**
- Check if `users` table exists in Supabase
- Check table permissions (should allow INSERT for authenticated users)
- Check browser console for errors

---

## 🧪 Verification Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase project URL and keys are correct
- [ ] Site URL is configured in Supabase
- [ ] Redirect URLs are whitelisted in Supabase
- [ ] Google provider is enabled in Supabase
- [ ] OAuth credentials are added to Supabase
- [ ] Google Cloud Console OAuth client is created
- [ ] Authorized JavaScript origins are added
- [ ] Supabase callback URL is added to authorized redirect URIs
- [ ] OAuth consent screen is configured
- [ ] App is running on `http://localhost:3000`
- [ ] "Sign in with Google" button appears on signin page
- [ ] Clicking button redirects to Google
- [ ] After consent, redirected back to app
- [ ] User is logged in and sees dashboard
- [ ] User record is created in database
- [ ] Session persists after page refresh
- [ ] Sign out works correctly

---

## 📸 What Each Configuration Should Look Like

### Supabase - URL Configuration:
```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - https://yourdomain.com/auth/callback
```

### Supabase - Google Provider:
```
☑ Enabled
Client ID: your-google-client-id.apps.googleusercontent.com
Client Secret: YOUR_SECRET_HERE
```

### Google Cloud Console - OAuth Client:
```
Application type: Web application
Authorized JavaScript origins:
  - http://localhost:3000
  - https://yourdomain.com

Authorized redirect URIs:
  - https://yourproject.supabase.co/auth/v1/callback
```

---

## ✅ Summary of Changes Made

1. **Fixed `/src/app/auth/callback/route.ts`:**
   - Changed from `createClient` to `createServerClient` for proper SSR
   - Now uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of service role key
   - Properly handles cookies for session management
   - Improved user lookup (by `auth_id` instead of `email`)
   - Added avatar update on signin
   - Better error handling

2. **Created documentation:**
   - `GOOGLE_AUTH_CHECKLIST.md` - Quick reference
   - This comprehensive setup guide

---

## 🚀 You're All Set!

Your Google authentication should now work perfectly! If you encounter any issues:

1. Check all configuration steps again
2. Look for error messages in browser console
3. Check Supabase logs in dashboard
4. Verify all URLs match exactly (no trailing slashes difference)

**Need help?** Check the error message carefully - it usually tells you exactly what's wrong!
