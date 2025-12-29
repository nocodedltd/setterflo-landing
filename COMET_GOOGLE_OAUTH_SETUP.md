# Comet: Setup Google OAuth for SetterFlo

## 🎯 Your Mission
Configure Google OAuth authentication in both Google Cloud Console and Supabase Dashboard so users can sign up/login with "Continue with Google" buttons.

---

## Part 1: Google Cloud Console Setup

### Step 1: Access OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure you're in the **Gemini API** project (or create a new OAuth client in that project)

### Step 2: Configure OAuth Consent Screen
If not already configured:
- **App name:** SetterFlo
- **User support email:** Your email
- **App logo:** (optional, skip for now)
- **Authorized domains:** 
  - `vercel.app`
  - `supabase.co`
- **Developer contact:** Your email
- Click **Save and Continue**

### Step 3: Add Scopes
Click **Add or Remove Scopes**:
- Select: `userinfo.email`
- Select: `userinfo.profile`
- Select: `openid`
- Click **Update** → **Save and Continue**

### Step 4: Create OAuth 2.0 Client
1. Navigate to: **Credentials** tab (or https://console.cloud.google.com/apis/credentials)
2. Click **+ Create Credentials** → **OAuth client ID**
3. **Application type:** Web application
4. **Name:** SetterFlo Production
5. **Authorized JavaScript origins:**
   ```
   https://setterflo-landing.vercel.app
   https://tvrhroxelqhhzwbjuzzg.supabase.co
   ```
6. **Authorized redirect URIs:**
   ```
   https://tvrhroxelqhhzwbjuzzg.supabase.co/auth/v1/callback
   ```
7. Click **Create**
8. **📸 SCREENSHOT:** Copy the **Client ID** and **Client Secret** that appear!

---

## Part 2: Supabase Dashboard Setup

### Step 5: Add Google Provider
1. Go to: https://supabase.com/dashboard/project/tvrhroxelqhhzwbjuzzg/auth/providers
2. Find **Google** in the provider list
3. Click to expand Google settings
4. Toggle **Enable Sign in with Google** to ON

### Step 6: Configure Google Provider
Fill in the fields:
- **Client ID (for OAuth):** Paste from Step 4
- **Client Secret (for OAuth):** Paste from Step 4
- **Authorized Client IDs:** (leave empty for now)
- **Skip nonce check:** Leave OFF (unchecked)
- **Allow users without an email:** Leave OFF

### Step 7: Verify Redirect URL
- Check the **Callback URL (for OAuth)** shown
- It should be: `https://tvrhroxelqhhzwbjuzzg.supabase.co/auth/v1/callback`
- ✅ This matches what you added in Google Console (Step 4)

### Step 8: Save Configuration
- Click **Save** button at the bottom
- Wait for "Successfully updated settings" message

---

## Part 3: Add Production URLs to Supabase

### Step 9: Configure Site URL & Redirect URLs
1. Go to: https://supabase.com/dashboard/project/tvrhroxelqhhzwbjuzzg/auth/url-configuration
2. **Site URL:** 
   ```
   https://setterflo-landing.vercel.app
   ```
3. **Redirect URLs:** Add these (one per line):
   ```
   https://setterflo-landing.vercel.app/auth/callback
   https://setterflo-landing.vercel.app/dashboard
   https://setterflo-landing.vercel.app/onboarding
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/onboarding
   ```
4. Click **Save**

---

## Part 4: Test the Configuration

### Step 10: Verify in Google Cloud
1. Go back to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client ("SetterFlo Production")
3. **📸 SCREENSHOT:** Verify the redirect URI is correct
4. Status should be active (no warnings)

### Step 11: Test OAuth Flow (Optional)
If you want to test now:
1. Open: https://setterflo-landing.vercel.app/signup
2. Look for "Continue with Google" button (should be visible after deployment)
3. Try clicking it - should redirect to Google login
4. After login, should redirect back to SetterFlo

---

## 📸 Required Screenshots
Please provide:
1. ✅ Google OAuth Client created (showing Client ID)
2. ✅ Supabase Google Provider enabled and saved
3. ✅ Supabase redirect URLs configured
4. ❌ Any errors or warnings you see

---

## 🚨 Important Notes
- The **Client Secret** is sensitive - don't share it publicly
- Supabase stores it securely in their dashboard
- The callback URL format is critical: `https://{project-ref}.supabase.co/auth/v1/callback`
- Make sure you're using the EXACT project ref: `tvrhroxelqhhzwbjuzzg`

---

## ✅ When Complete
Reply with:
1. "Google OAuth configured ✅"
2. Screenshots of the configuration
3. Confirm no errors in either dashboard

Then I'll deploy the updated auth pages with the "Continue with Google" buttons!
