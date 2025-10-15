# Google OAuth Debug Checklist

## Critical Issue Fixed ✅
**Dashboard API was looking up users by `id` instead of `auth_id`**
- Fixed in: `/src/app/api/dashboard/route.ts`
- Changed: `.eq('id', user.id)` → `.eq('auth_id', user.id)`
- Added: Auto-create user profile if not found

## Supabase Dashboard Configuration

### 1. Authentication Providers
Go to: **Supabase Dashboard → Authentication → Providers**

**Enable Google Provider:**
- ✅ Enable Google provider toggle
- ✅ Add your Google Client ID
- ✅ Add your Google Client Secret

### 2. Site URL Configuration
Go to: **Supabase Dashboard → Authentication → URL Configuration**

**Site URL (for production):**
```
https://discover.skartik.xyz
```

### 3. Redirect URLs (CRITICAL!)
Go to: **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**

**Add these EXACT URLs:**
```
http://localhost:3000/auth/callback
https://discover.skartik.xyz/auth/callback
```

⚠️ **Important:** Make sure there are NO trailing slashes!

### 4. Additional Redirect URLs
**Wildcard patterns to add:**
```
http://localhost:*
http://localhost:*/auth/callback
https://discover.skartik.xyz/*
https://discover.skartik.xyz/auth/callback
```

## Google Console Configuration

### OAuth 2.0 Client Setup
Go to: **Google Cloud Console → APIs & Services → Credentials**

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

⚠️ **The Supabase callback URL is CRITICAL!** Format:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

## Environment Variables Check

**Verify `.env.local` has:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jbwdjjzgjkajkaybhptr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing Steps

### 1. Test Google Sign In
1. Navigate to: http://localhost:3000/auth/signin
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to: http://localhost:3000/auth/callback
5. Then redirect to: http://localhost:3000/dashboard

### 2. Check Browser Console
**If sign-in fails, check for:**
- Network errors (401, 403, 500)
- CORS errors
- Redirect URI mismatch errors

### 3. Check Supabase Logs
Go to: **Supabase Dashboard → Logs → Auth Logs**

Look for:
- Failed authentication attempts
- Redirect URI mismatch errors
- OAuth provider errors

## Common Issues & Fixes

### Issue: "redirect_uri_mismatch"
**Fix:** Add the EXACT Supabase callback URL to Google Console:
```
https://jbwdjjzgjkajkaybhptr.supabase.co/auth/v1/callback
```

### Issue: "Dashboard shows 'Failed to load dashboard data'"
**Fix:** ✅ FIXED! Changed dashboard API to use `auth_id` instead of `id`

### Issue: "User not found in database"
**Fix:** ✅ FIXED! Dashboard API now auto-creates user profile if missing

### Issue: Google sign in shows "Access blocked"
**Fix:** 
- Verify Google OAuth consent screen is configured
- Make sure OAuth app is in "Testing" mode with test users added
- OR publish the app for production

### Issue: Sign in works but user data not saved
**Fix:** Check `auth/callback/route.ts` creates user record:
- Uses `auth_id` field (not `id`)
- Generates unique username
- Saves user metadata (name, email, avatar)

## Database Schema Check

**Verify users table has these columns:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_id VARCHAR(255) UNIQUE,  -- ← This is critical!
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'submitter',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Create index on auth_id:**
```sql
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
```

## Quick Test Script

Run this in your browser console on http://localhost:3000:

```javascript
// Test Supabase connection
const { createClient } = supabase;
const sb = createClient(
  'https://jbwdjjzgjkajkaybhptr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);

// Test Google OAuth
await sb.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/auth/callback'
  }
});
```

## Still Not Working?

### Check RLS Policies
**Verify users table has proper policies:**

```sql
-- Allow authenticated users to read
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_id = auth.uid());

-- Allow service role to insert
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);
```

### Enable Supabase Auth Debug Mode
In Supabase Dashboard → Authentication → Settings:
- Enable "Enable custom access token hook" (if needed)
- Check "Enable phone authentication" is OFF (unless used)
- Verify "Mailer Settings" for email confirmations

### Check Middleware
Your middleware at `/src/middleware.ts` should:
- Use `createServerClient` with cookies
- Not block auth routes
- Properly handle session refresh

## Success Indicators

✅ **Google Sign In Working:**
- Clicking "Continue with Google" opens Google consent
- After selecting account, redirects to `/auth/callback`
- User is created in `users` table with `auth_id`
- Redirects to `/dashboard`

✅ **Dashboard Loading:**
- No "Failed to load dashboard data" error
- Shows user profile with avatar
- Displays user's projects
- Shows stats (total views, projects, submissions)

✅ **Session Persists:**
- Refresh page, still logged in
- Can navigate to protected routes
- Header shows user menu

## Next Steps

1. ✅ Dashboard API fix applied - restart dev server if needed
2. Verify Supabase redirect URLs are exact (no trailing slashes)
3. Verify Google Console has Supabase callback URL
4. Test sign in flow
5. Check browser console and Supabase logs if issues persist
6. Run migration if users table missing `auth_id` index:
   ```bash
   supabase db push --local
   ```

## Contact Support

If still having issues:
1. Export Supabase auth logs
2. Check Google OAuth consent screen status
3. Verify OAuth app not in suspended state
4. Contact Supabase support with project ref: `jbwdjjzgjkajkaybhptr`
