# 🔍 COMET TASK: Verify Meta Developer Instagram OAuth Setup

## 📋 OBJECTIVE

Verify that the Meta/Facebook Developer app for Instagram OAuth is **100% configured correctly** and ready for production use. This checklist ensures nothing is missing that would prevent the OAuth flow from working.

**Estimated Time:** 10-15 minutes

---

## 🎯 WHAT WE'RE CHECKING

1. ✅ App is in correct mode (Live/Development)
2. ✅ Redirect URIs are configured correctly
3. ✅ App domains are set
4. ✅ Required products are added (Facebook Login)
5. ✅ Required permissions are approved
6. ✅ Business verification status
7. ✅ Instagram integration settings
8. ✅ OAuth redirect URI format
9. ✅ Privacy Policy URL
10. ✅ Terms of Service URL

---

## ✅ STEP 1: ACCESS META DEVELOPER DASHBOARD

### **Navigate to App**

1. Go to https://developers.facebook.com/apps
2. Find and click on **"SetterFlo"** app
   - App ID: `25769682339323790`
3. You should see the app dashboard

---

## ✅ STEP 2: VERIFY APP MODE & STATUS

### **Check App Mode**

1. Look at the top of the dashboard page
2. You should see a toggle switch that says either:
   - **"Development"** (orange/red indicator)
   - **"Live"** (green indicator)

**❓ Question 1:** What mode is the app currently in?
- [ ] Development
- [ ] Live

**⚠️ IMPORTANT:** 
- For **TESTING**: App should be in "Development" mode
- For **PRODUCTION**: App should be in "Live" mode

**💡 For now, keep it in Development mode for testing. We'll switch to Live after testing is complete.**

---

### **Check App Review Status**

1. Look for a banner or notification about app review
2. Check if there are any warnings or required actions

**❓ Question 2:** Are there any warnings or required actions?
- [ ] No warnings
- [ ] Yes, warnings: ________________________

---

## ✅ STEP 3: VERIFY BASIC SETTINGS

### **Navigate to Basic Settings**

1. In the left sidebar, click **"Settings"**
2. Click **"Basic"**

---

### **Verify App Information**

Check that these fields are filled:

**Display Name:**
- [ ] Set to: `SetterFlo`

**App Domains:**
- [ ] Contains: `setterflo-landing.vercel.app`

**⚠️ CRITICAL:** If App Domains is empty or wrong:
1. Click in the "App Domains" field
2. Enter: `setterflo-landing.vercel.app`
3. Click "Save Changes" at the bottom

---

### **Verify Privacy Policy URL**

**❓ Question 3:** Is there a Privacy Policy URL set?
- [ ] Yes, URL: ________________________
- [ ] No

**⚠️ REQUIRED FOR LIVE MODE:** You MUST have a privacy policy URL before going Live.

**Temporary Solution (if needed):**
- You can use: `https://setterflo-landing.vercel.app/privacy` (create this page later)
- Or generate one at: https://www.freeprivacypolicy.com/

---

### **Verify Terms of Service URL**

**❓ Question 4:** Is there a Terms of Service URL set?
- [ ] Yes, URL: ________________________
- [ ] No (this is optional but recommended)

---

### **Verify App Icon/Logo**

**❓ Question 5:** Is there an app icon/logo uploaded?
- [ ] Yes
- [ ] No (not required, but recommended)

---

## ✅ STEP 4: VERIFY FACEBOOK LOGIN PRODUCT

### **Check Facebook Login is Added**

1. In the left sidebar, look for **"Products"** section
2. Under Products, you should see **"Facebook Login"**

**❓ Question 6:** Is "Facebook Login" listed in Products?
- [ ] Yes
- [ ] No

**⚠️ If NO:** 
1. Scroll down on the left sidebar
2. Click **"+ Add Products"**
3. Find "Facebook Login"
4. Click **"Set Up"**

---

### **Verify Facebook Login Settings**

1. Click **"Facebook Login"** in the left sidebar
2. Click **"Settings"** under Facebook Login

---

### **Verify OAuth Redirect URIs**

This is **CRITICAL**. Check that these URIs are listed:

**Valid OAuth Redirect URIs:**
- [ ] `https://setterflo-landing.vercel.app/api/auth/instagram/callback`
- [ ] `http://localhost:3000/api/auth/instagram/callback` (for local testing)

**⚠️ CRITICAL - If missing or wrong:**

1. Find the "Valid OAuth Redirect URIs" field
2. Click in the field
3. Add each URI on a separate line:
   ```
   https://setterflo-landing.vercel.app/api/auth/instagram/callback
   http://localhost:3000/api/auth/instagram/callback
   ```
4. Click **"Save Changes"** at the bottom

**💡 Important Notes:**
- URIs must match EXACTLY (including `https://` vs `http://`)
- No trailing slashes
- No wildcards
- Path must be `/api/auth/instagram/callback`

---

### **Verify Client OAuth Settings**

Still on the Facebook Login Settings page, check:

**Client OAuth Login:**
- [ ] **ON** (toggle should be blue/enabled)

**Web OAuth Login:**
- [ ] **ON** (toggle should be blue/enabled)

**Use Strict Mode for Redirect URIs:**
- [ ] **ON** (recommended for security)

**⚠️ If any are OFF:** Toggle them ON and save.

---

## ✅ STEP 5: VERIFY INSTAGRAM PERMISSIONS

### **Check Required Permissions**

1. In the left sidebar, click **"App Review"**
2. Click **"Permissions and Features"**
3. Look for the Instagram/Pages section

---

### **Verify These Permissions:**

**Required permissions for SetterFlo:**

1. **instagram_basic**
   - [ ] Status: Approved / In Review / Not Requested

2. **instagram_manage_messages**
   - [ ] Status: Approved / In Review / Not Requested

3. **pages_messaging**
   - [ ] Status: Approved / In Review / Not Requested

4. **pages_read_engagement**
   - [ ] Status: Approved / In Review / Not Requested

5. **pages_manage_metadata**
   - [ ] Status: Approved / In Review / Not Requested

---

### **Understanding Permission Status:**

**✅ "Default Access" or "Approved":** Good! You can use this permission immediately.

**⏳ "In Review":** Your request is being reviewed by Meta. This can take 1-7 days.

**❌ "Not Requested":** You need to request this permission.

**⚠️ IMPORTANT:** For TESTING in Development mode, you don't need approved permissions IF:
- You're testing with the Facebook Page that owns the app
- You've added test users
- The Page admin is also an app admin/developer

---

### **If Permissions Need Requesting:**

**For Development/Testing:**
- You can test with default permissions
- Use the Facebook Page that owns the app
- Add yourself as a test user

**For Production (Live Mode):**
1. Click **"Request"** next to each permission
2. Fill out the questionnaire explaining how you'll use each permission
3. Submit video/screenshots showing the feature
4. Wait for Meta approval (1-7 days typically)

---

## ✅ STEP 6: VERIFY INSTAGRAM PRODUCT (if available)

### **Check Instagram Product Settings**

1. Look in the left sidebar for **"Instagram"** under Products
2. If it exists, click on it

**❓ Question 7:** Is Instagram listed as a Product?
- [ ] Yes
- [ ] No (this is OK - we're using Instagram via Facebook Login)

**💡 Note:** Instagram as a standalone product is being phased out. Most Instagram OAuth now happens through Facebook Login, which is what we're using.

---

## ✅ STEP 7: VERIFY BUSINESS VERIFICATION (if applicable)

### **Check Business Verification Status**

1. In the left sidebar, look for **"Business Verification"**
2. Or check the banner at the top of the page

**❓ Question 8:** What is the business verification status?
- [ ] Not started
- [ ] In progress
- [ ] Verified
- [ ] Not required

**💡 Note:** Business verification is required for:
- Higher rate limits
- Going Live with advanced permissions
- Accessing certain Instagram features

**For Development/Testing:** Not required yet.

**For Production:** Required for higher rate limits and advanced features.

---

## ✅ STEP 8: VERIFY TEST USERS

### **Check Test Users (for Development Mode)**

1. Click **"Roles"** in the left sidebar
2. Click **"Test Users"** tab

**❓ Question 9:** How many test users are configured?
- [ ] 0
- [ ] 1+
- [ ] Count: _____

**💡 For Testing:** You should add yourself and any testers as test users.

---

### **Add Test User (if needed):**

1. Click **"Add"** button
2. Enter details for the test user
3. Click "Create Test User"

**OR** add existing Facebook accounts:
1. Go to **"Roles"** → **"Administrators"** or **"Developers"**
2. Add team members who need to test

---

## ✅ STEP 9: VERIFY INSTAGRAM BUSINESS ACCOUNT CONNECTION

### **This is CRITICAL - Very Important**

**❓ Question 10:** Do you have an Instagram Business Account?
- [ ] Yes
- [ ] No

**⚠️ REQUIRED:** You MUST have an Instagram Business Account (not just a regular Instagram account).

---

### **Verify Instagram Business Account:**

1. Open Instagram app or https://instagram.com
2. Go to your profile
3. Tap the hamburger menu (three lines)
4. Tap "Settings"
5. Tap "Account"
6. Check if you see "Switch to Professional Account" OR "Account type: Business"

**If you see "Switch to Professional Account":**
1. Tap it
2. Choose "Business"
3. Complete the setup

---

### **Verify Instagram is Connected to Facebook Page:**

1. Go to https://business.facebook.com
2. Click on your Business Manager
3. Go to "Instagram Accounts" in the left sidebar
4. Check if your Instagram account is listed and connected to a Facebook Page

**❓ Question 11:** Is your Instagram Business Account connected to a Facebook Page?
- [ ] Yes, Page: ________________________
- [ ] No

**⚠️ If NO:**
1. In Instagram app, go to Settings → Account
2. Tap "Linked Accounts"
3. Tap "Facebook"
4. Link your Facebook Page
5. Choose the correct Page
6. Grant permissions

---

## ✅ STEP 10: VERIFY APP SECRET & CREDENTIALS

### **Verify App Credentials Match**

1. Still in **Settings** → **Basic**
2. Scroll down to find:

**App ID:**
- [ ] Shows: `25769682339323790`
- [ ] ✅ Matches what we have
- [ ] ❌ Different: ________________________

**App Secret:**
1. Click "Show" next to App Secret
2. Compare with: `9551b995f11f76f680695c088e3517f8`
- [ ] ✅ Matches
- [ ] ❌ Different: ________________________

**⚠️ If different:** Update the environment variables in Vercel!

---

## ✅ STEP 11: VERIFY WEBHOOKS (OPTIONAL FOR NOW)

### **Check Webhooks Configuration**

1. In the left sidebar, click **"Products"** → **"Webhooks"**
2. OR look for "Messenger" → "Settings" → "Webhooks"

**❓ Question 12:** Are webhooks configured?
- [ ] Yes
- [ ] No

**Current Webhook URL (from Instagram setup):**
```
https://eo1dbmvfpv1tf1g.m.pipedream.net
```

**💡 Note:** Webhooks are for receiving Instagram DM notifications. Not critical for OAuth to work, but needed for production DM automation.

---

## ✅ STEP 12: VERIFY RATE LIMITS

### **Check Rate Limit Tier**

1. Look for information about API rate limits
2. Usually shown in the app dashboard or under "Analytics"

**❓ Question 13:** What is your rate limit tier?
- [ ] Standard (default)
- [ ] Advanced
- [ ] Unknown

**💡 For Testing:** Standard is fine.

**💡 For Production:** You may need to request higher limits or complete Business Verification.

---

## 🚨 COMMON ISSUES & FIXES

### **Issue 1: "URL Blocked: This redirect failed because the redirect URI is not whitelisted"**

**Fix:**
1. Go to Facebook Login → Settings
2. Add the exact redirect URI: `https://setterflo-landing.vercel.app/api/auth/instagram/callback`
3. Make sure there's no trailing slash
4. Save changes
5. Wait 5 minutes for changes to propagate

---

### **Issue 2: "App Not Set Up: This app is still in development mode"**

**Fix:**
- This is normal for testing
- To go Live: Complete app review (requires Privacy Policy, App Review, etc.)
- For testing: Add test users or use app admin accounts

---

### **Issue 3: "Error validating access token: Session has expired"**

**Fix:**
- This is a token issue, not a configuration issue
- The OAuth flow needs to refresh tokens
- Check that token expiration is being tracked

---

### **Issue 4: "The Instagram Business Account is not connected to a Page"**

**Fix:**
1. Go to Instagram app → Settings → Account → Linked Accounts
2. Connect to Facebook
3. Choose the correct Facebook Page
4. Grant all permissions

---

### **Issue 5: "Missing permissions: pages_messaging"**

**Fix:**
- For Development mode: Use the Page that owns the app
- For Live mode: Submit app review to request permissions

---

## 📋 COMPLETION CHECKLIST

After going through all steps, fill this out:

### **App Configuration:**
- [ ] App name: SetterFlo
- [ ] App ID: 25769682339323790
- [ ] App mode: Development / Live
- [ ] App domains: `setterflo-landing.vercel.app` ✅

### **Facebook Login Settings:**
- [ ] Facebook Login product added ✅
- [ ] OAuth Redirect URI (production): `https://setterflo-landing.vercel.app/api/auth/instagram/callback` ✅
- [ ] OAuth Redirect URI (local): `http://localhost:3000/api/auth/instagram/callback` ✅
- [ ] Client OAuth Login: ON ✅
- [ ] Web OAuth Login: ON ✅

### **Permissions:**
- [ ] instagram_basic: [Status: _____]
- [ ] instagram_manage_messages: [Status: _____]
- [ ] pages_messaging: [Status: _____]
- [ ] pages_read_engagement: [Status: _____]
- [ ] pages_manage_metadata: [Status: _____]

### **Business Account:**
- [ ] Instagram Business Account exists ✅
- [ ] Connected to Facebook Page ✅
- [ ] Facebook Page name: ________________________

### **Optional (for Production):**
- [ ] Privacy Policy URL set
- [ ] Business Verification status: ________________________
- [ ] Webhooks configured

---

## ✅ COMPLETION REPORT

Once you've verified everything, provide this summary:

```
✅ META DEVELOPER VERIFICATION COMPLETE

App Status:
- App Mode: [Development / Live]
- App ID: 25769682339323790
- App Domains: [✅ Correct / ❌ Missing]

OAuth Configuration:
- Redirect URIs: [✅ Correct / ❌ Missing/Wrong]
- Client OAuth: [✅ ON / ❌ OFF]
- Web OAuth: [✅ ON / ❌ OFF]

Permissions Status:
- instagram_basic: [Status]
- instagram_manage_messages: [Status]
- pages_messaging: [Status]
- pages_read_engagement: [Status]
- pages_manage_metadata: [Status]

Instagram Business Account:
- Exists: [Yes / No]
- Connected to Page: [Yes / No]
- Page Name: [___________]

Issues Found: [None / List any issues]

Ready for Testing: [✅ Yes / ❌ No - reason]
Ready for Production: [✅ Yes / ⚠️ Needs app review / ❌ No - reason]
```

---

## 🎯 WHAT'S READY FOR TESTING?

**After this verification, you should be able to test Instagram OAuth IF:**
- ✅ App is in Development mode
- ✅ OAuth redirect URIs are correct
- ✅ You're using the Page that owns the app OR
- ✅ You're added as an app admin/developer/tester
- ✅ Instagram Business Account is connected to a Facebook Page

**You can test even without approved permissions in Development mode!**

---

## 🚀 WHAT'S NEEDED FOR PRODUCTION?

**To go Live (Production mode), you'll need:**
- ✅ All OAuth settings verified (from this checklist)
- ✅ Privacy Policy URL
- ✅ App Review completed for advanced permissions
- ⚠️ Business Verification (for higher rate limits)
- ✅ Terms of Service URL (recommended)

**We can test everything in Development mode first, then handle app review later!**

---

**Estimated time: 10-15 minutes**

**When complete, you'll know exactly what (if anything) is missing from Meta Developer setup!** 🔍
