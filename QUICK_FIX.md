# 🚨 Quick Fix Checklist - Google Auth Not Working

## ✅ Code Fix Applied
Dashboard API now correctly looks up users by `auth_id` field instead of `id`.

## 🔧 Configuration Required (DO THIS NOW!)

### Step 1: Supabase - Enable Google Provider
1. Go to: https://supabase.com/dashboard/project/jbwdjjzgjkajkaybhptr/auth/providers
2. Find "Google" → Click to expand
3. Toggle **ON**
4. Paste Google **Client ID** (from Google Console)
5. Paste Google **Client Secret** (from Google Console)
6. Click **Save**

### Step 2: Supabase - Add Redirect URLs
1. Go to: https://supabase.com/dashboard/project/jbwdjjzgjkajkaybhptr/auth/url-configuration
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   https://discover.skartik.xyz/auth/callback
   ```
3. Click **Save**

### Step 3: Google Console - Add Supabase Callback
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback
   ```
   ⚠️ **This is CRITICAL!** Without this, Google auth won't work.
4. Click **Save**

## 🧪 Test It

1. Go to: http://localhost:3000/auth/signin
2. Click "Continue with Google"
3. Select your Google account
4. Should redirect to dashboard
5. No more "Failed to load dashboard data" error!

## 📋 What to Check in Google Console

**Your OAuth client should have:**

**Authorized JavaScript origins:**
```
http://localhost:3000
https://discover.skartik.xyz
https://jbwdjjzgjkajkaybhptr.supabase.co
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://discover.skartik.xyz/auth/callback
https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback
```

## 🎯 Common Mistakes

❌ **Forgetting the Supabase callback URL in Google Console**
- Must add: `https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback`

❌ **Not enabling Google provider in Supabase**
- Must toggle ON and add Client ID/Secret

❌ **Trailing slashes in redirect URLs**
- Use: `http://localhost:3000/auth/callback`
- NOT: `http://localhost:3000/auth/callback/`

❌ **Wrong Supabase keys in .env.local**
- Must use ANON_KEY, not SERVICE_ROLE_KEY for public client

## 🔍 Still Not Working?

**Check browser console for:**
- "redirect_uri_mismatch" → Missing Supabase URL in Google Console
- "access_denied" → OAuth consent screen issue
- Network 401/403 → Auth token issue
- Network 500 → Check Supabase logs

**Get detailed help:**
- Read: `/GOOGLE_OAUTH_DEBUG.md`
- Read: `/DASHBOARD_FIX_SUMMARY.md`

## 🎉 Success = You Can:
- Sign in with Google
- See dashboard without errors
- See your profile picture and name
- Navigate pages while staying logged in

---

**Remember:** The fix is already applied to code. You just need to configure Supabase and Google Console correctly!
