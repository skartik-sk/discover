# Dashboard & Google Auth Fix Summary

## 🎯 Issue Resolved

### Problem
1. **Dashboard Error**: "Failed to load dashboard data"
2. **Google Auth**: Not working despite correct Google Console configuration

### Root Cause
The dashboard API was looking up users by the wrong field:
```typescript
// ❌ WRONG - Looking for 'id' field
.eq('id', user.id)

// ✅ CORRECT - Should look for 'auth_id' field  
.eq('auth_id', user.id)
```

## ✅ What Was Fixed

### 1. Dashboard API (`/src/app/api/dashboard/route.ts`)

**Changed:**
- Line 45: Changed user lookup from `.eq('id', user.id)` to `.eq('auth_id', user.id)`
- Added auto-create user profile logic if profile not found
- Fixed projects query to use `profile?.id` instead of `user.id`

**New Flow:**
1. Extract Bearer token from Authorization header
2. Verify token with Supabase auth
3. **Look up user by `auth_id`** (matches Supabase auth user ID)
4. If user doesn't exist, auto-create profile
5. Fetch user's projects using profile ID
6. Calculate stats and return dashboard data

### 2. User Profile Auto-Creation

Added logic to automatically create user profile if missing:
```typescript
if (profileError.code === 'PGRST116') { // Not found
  const { data: newProfile } = await supabaseAdmin
    .from('users')
    .insert({
      auth_id: user.id,  // ← Correct field!
      email: user.email,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      username: user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      role: 'submitter',
      is_active: true
    })
    .select()
    .single()
}
```

## 📋 Next Steps for You

### 1. Verify Supabase Configuration

**Go to Supabase Dashboard → Authentication → URL Configuration**

**Site URL:**
```
https://discover.skartik.xyz
```

**Redirect URLs (must include BOTH):**
```
http://localhost:3000/auth/callback
https://discover.skartik.xyz/auth/callback
```

⚠️ **No trailing slashes!**

### 2. Verify Google Console Configuration

**Go to Google Cloud Console → APIs & Services → Credentials**

**Authorized JavaScript origins:**
```
http://localhost:3000
https://discover.skartik.xyz
https://jbwdjjzgjkajkaybhptr.supabase.co
```

**Authorized redirect URIs (CRITICAL!):**
```
http://localhost:3000/auth/callback
https://discover.skartik.xyz/auth/callback
https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback
```

The **last one** is the Supabase OAuth callback URL - it MUST be included!

### 3. Enable Google Provider in Supabase

**Go to Supabase Dashboard → Authentication → Providers**

1. Find "Google" in the list
2. Toggle it **ON**
3. Paste your Google **Client ID**
4. Paste your Google **Client Secret**
5. Click **Save**

### 4. Test the Fix

#### Option A: Manual Test
1. Open http://localhost:3000/auth/signin
2. Click "Continue with Google"
3. Select your Google account
4. Should redirect to dashboard
5. Dashboard should load without "Failed to load" error

#### Option B: Browser Console Test
1. Open http://localhost:3000/auth/signin
2. Sign in with Google
3. Open browser console (F12)
4. Paste contents of `/test-dashboard.js`
5. Check console output for success/errors

### 5. Check Database

**Verify user was created properly:**

In Supabase Dashboard → SQL Editor:
```sql
SELECT id, auth_id, email, username, display_name, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

**Verify `auth_id` has a value** - it should match your Supabase auth user ID.

### 6. Add Missing Index (Recommended)

Run this in Supabase SQL Editor:
```sql
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
```

This will speed up user lookups.

## 🔍 Debugging Tips

### If Dashboard Still Shows Error

**Check browser console:**
- Look for 401/403/500 errors
- Check Network tab for `/api/dashboard` request
- Look at response body for error details

**Check Supabase logs:**
- Go to Supabase Dashboard → Logs → Auth Logs
- Look for failed authentication attempts
- Check for policy violations

**Verify JWT token:**
```javascript
// Run in browser console
const { data: { session } } = await window.supabase.auth.getSession();
console.log('Token expires:', new Date(session.expires_at * 1000));
```

### If Google Sign In Fails

**"redirect_uri_mismatch" error:**
- You're missing the Supabase callback URL in Google Console
- Add: `https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback`

**"Access blocked" error:**
- OAuth consent screen not configured
- App needs to be in "Testing" mode with test users
- OR publish app for production

**Redirects to sign-in with error:**
- Check Supabase auth logs
- Verify Google provider is enabled in Supabase
- Verify Client ID/Secret are correct

### If User Profile Missing

**Manually create user (temporary fix):**
```sql
INSERT INTO users (auth_id, email, username, display_name, role)
VALUES (
  'your-auth-id-from-supabase', 
  'your@email.com',
  'yourusername',
  'Your Name',
  'submitter'
);
```

Get your auth_id from Supabase Dashboard → Authentication → Users

## 📝 Files Modified

1. `/src/app/api/dashboard/route.ts` - Fixed user lookup field
2. `/GOOGLE_OAUTH_DEBUG.md` - Complete debugging guide (created)
3. `/test-dashboard.js` - Browser test script (created)
4. `/DASHBOARD_FIX_SUMMARY.md` - This file (created)

## 🧪 Testing Checklist

- [ ] Supabase redirect URLs configured
- [ ] Google Console redirect URIs configured (including Supabase URL)
- [ ] Google provider enabled in Supabase with Client ID/Secret
- [ ] Clear browser cookies/cache
- [ ] Try Google sign in
- [ ] Dashboard loads without error
- [ ] User profile displays correctly
- [ ] Projects list appears (if you have any)
- [ ] Stats show correct numbers

## 🚀 Expected Behavior

After the fix:
1. ✅ Google sign in redirects properly
2. ✅ User created in database with `auth_id`
3. ✅ Dashboard loads without errors
4. ✅ Profile displays name, email, avatar
5. ✅ Projects list appears (empty if no projects)
6. ✅ Stats show: 0 views, 0 projects initially

## 📞 Still Having Issues?

If problems persist after verification:

1. Check this document: `/GOOGLE_OAUTH_DEBUG.md`
2. Run test script: `/test-dashboard.js` in browser console
3. Check Supabase logs and browser console
4. Verify all environment variables are set
5. Try in incognito mode (fresh session)
6. Clear all Supabase-related cookies

## 🎉 Success Indicators

You'll know it's working when:
- ✅ No "Failed to load dashboard data" error
- ✅ Dashboard shows your name and email
- ✅ Google profile picture appears
- ✅ Can navigate between pages while staying logged in
- ✅ Header shows user menu with avatar

---

**Server Status:** Dev server running on http://localhost:3000
**Fix Applied:** Yes, code changes are live (hot reload)
**Action Required:** Verify Supabase and Google Console settings above
