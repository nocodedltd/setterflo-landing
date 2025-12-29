# Comet Instructions: Instagram/Meta OAuth Setup

**Task:** Configure Instagram OAuth integration for SetterFlo in Meta Developer Console

**Project:** SetterFlo - Instagram DM Automation Platform  
**Environment:** Production  
**Supabase Project:** `tvrhroxelqhhzwbjuzzg`

---

## 🎯 OBJECTIVE

Set up a Meta Developer App with Instagram OAuth so users can connect their Instagram Business accounts to SetterFlo and automate DM responses.

---

## 📋 TASK 1: Create Meta Developer App

### Step 1.1: Navigate to Meta for Developers
1. Go to: https://developers.facebook.com/apps
2. Click **"Create App"** button (green button, top right)

### Step 1.2: Choose App Type
1. Select **"Business"** as the app type
2. Click **"Next"**

### Step 1.3: App Details
Fill in the following information:
- **App Name:** `SetterFlo Instagram Bot`
- **App Contact Email:** `support@nocoded.ai` (or your business email)
- **Business Account:** Select your business account (or create one if needed)
- Click **"Create App"**

### Step 1.4: Verify Your Identity
- Complete any security verification Meta requires (may ask for password, 2FA, etc.)

---

## 📋 TASK 2: Add Instagram Product

### Step 2.1: Add Product
1. In your new app dashboard, scroll to **"Add products to your app"** section
2. Find **"Instagram"** product
3. Click **"Set Up"** button

### Step 2.2: Configure Instagram Basic Display
1. Click **"Basic Display"** in the left sidebar under Instagram
2. Click **"Create New App"** button
3. Accept the terms
4. Your Instagram app is now created

---

## 📋 TASK 3: Configure OAuth Settings

### Step 3.1: Get Your App Credentials
1. In left sidebar, go to **Settings → Basic**
2. **IMPORTANT:** Copy these values (we'll need them):
   - **App ID:** `[Copy this]`
   - **App Secret:** Click "Show" and copy
   
**Paste these values here when done:**
```
App ID: ___________________
App Secret: ___________________
```

### Step 3.2: Configure OAuth Redirect URIs
1. Still in **Settings → Basic**, scroll to **"App Domains"**
2. Add: `setterflo-landing.vercel.app`
3. Scroll down to **"Website URL"**
4. Add: `https://setterflo-landing.vercel.app`

### Step 3.3: Configure Instagram OAuth URIs
1. In left sidebar, go to **Instagram → Basic Display**
2. Find **"Valid OAuth Redirect URIs"** section
3. Click **"Add URI"** and add these THREE URIs:

```
https://setterflo-landing.vercel.app/api/auth/instagram/callback
https://setterflo-landing.vercel.app/auth/instagram/callback
http://localhost:3000/api/auth/instagram/callback
```

4. Click **"Save Changes"** button at the bottom

### Step 3.4: Deauthorize Callback URL
1. Still in **Instagram → Basic Display**
2. Find **"Deauthorize Callback URL"**
3. Add: `https://setterflo-landing.vercel.app/api/auth/instagram/deauthorize`
4. Find **"Data Deletion Request URL"**
5. Add: `https://setterflo-landing.vercel.app/api/auth/instagram/data-deletion`
6. Click **"Save Changes"**

---

## 📋 TASK 4: Configure Instagram Permissions

### Step 4.1: Add Instagram Graph API
1. Go to **Add Products** section (in main dashboard)
2. Find **"Instagram Graph API"**
3. Click **"Set Up"**

### Step 4.2: Request Permissions (App Review)
1. In left sidebar, go to **App Review → Permissions and Features**
2. Find and request these permissions:
   - ✅ **instagram_basic** (should be auto-approved)
   - ✅ **instagram_manage_messages** (click "Request Advanced Access")
   - ✅ **pages_messaging** (click "Request Advanced Access")
   - ✅ **pages_read_engagement** (click "Request Advanced Access")
   - ✅ **instagram_manage_insights** (optional, for analytics)

**Note:** Some permissions require "Advanced Access" which needs App Review. For testing, "Standard Access" is sufficient.

---

## 📋 TASK 5: Configure Webhooks

### Step 5.1: Add Webhooks Product
1. Go to **Add Products** section
2. Find **"Webhooks"**
3. Click **"Set Up"**

### Step 5.2: Configure Instagram Webhooks
1. In left sidebar, go to **Webhooks → Configuration**
2. Select **"Instagram"** from the dropdown
3. Click **"Edit Subscription"** or **"Subscribe to this object"**

### Step 5.3: Webhook Callback URL
**IMPORTANT:** We'll use Pipedream for webhooks (already set up)

Configure these settings:
- **Callback URL:** `https://eo1dbmvfpv1tf1g.m.pipedream.net`
- **Verify Token:** `setterflo_verify_token_2024`

### Step 5.4: Subscribe to Fields
Check these webhook fields:
- ✅ **messages** (Instagram DMs)
- ✅ **messaging_postbacks** (Quick reply buttons)
- ✅ **messaging_handovers** (Handover protocol)
- ✅ **message_echoes** (Optional, for sent messages)

Click **"Verify and Save"**

**Expected Result:** Should show "Verified" with a green checkmark

---

## 📋 TASK 6: Connect Instagram Business Account (For Testing)

### Step 6.1: Add Test Users
1. In left sidebar, go to **Roles → Roles**
2. Click **"Add Instagram Testers"**
3. Search for your Instagram Business account: `nocoded.ai`
4. Click **"Submit"**

### Step 6.2: Accept Tester Invitation
1. Log in to Instagram as `@nocoded.ai`
2. Go to Settings → Apps and Websites → Tester Invites
3. Accept the invitation from `SetterFlo Instagram Bot`

### Step 6.3: Generate Test Token (Optional, for immediate testing)
1. In Meta app, go to **Instagram → Basic Display**
2. Scroll to **"User Token Generator"**
3. Click **"Generate Token"** for your test account
4. Grant all requested permissions
5. **Copy the Access Token** (this is temporary, for testing only)

**Paste test token here:**
```
Test Access Token: ___________________
```

---

## 📋 TASK 7: Switch to Live Mode

### Step 7.1: App Mode
1. In top navigation, find the **"App Mode"** toggle
2. Currently should say "Development"
3. **DO NOT switch to Live Mode yet** - we'll do that after testing

### Step 7.2: Privacy Policy (Required for Live Mode)
When ready to go live, you'll need:
1. In left sidebar, go to **Settings → Basic**
2. Add **"Privacy Policy URL"**: `https://setterflo-landing.vercel.app/privacy`
3. Add **"Terms of Service URL"**: `https://setterflo-landing.vercel.app/terms`

**Note:** We'll create these pages before going live.

---

## 📋 TASK 8: Configure App Permissions (Final Step)

### Step 8.1: Business Verification (For Production)
**Note:** To get "Advanced Access" for certain permissions, you may need:
1. Business verification (provide business documents)
2. App Review submission (explain use case)

**For now, skip this** - Standard Access is sufficient for testing.

### Step 8.2: Verify Configuration
Before finishing, verify these items:

**Checklist:**
- [ ] App created with name "SetterFlo Instagram Bot"
- [ ] Instagram product added
- [ ] Instagram Graph API added
- [ ] OAuth Redirect URIs configured (all 3)
- [ ] Webhooks configured with Pipedream URL
- [ ] Webhook subscribed to "messages" field
- [ ] App ID and App Secret copied
- [ ] Test Instagram account connected
- [ ] Test access token generated (optional)

---

## 📋 TASK 9: Document Your Configuration

### Step 9.1: Copy All Credentials
Please provide these values:

```env
# Meta App Credentials
INSTAGRAM_APP_ID=___________________
INSTAGRAM_APP_SECRET=___________________

# Test Token (temporary, will be replaced with OAuth)
INSTAGRAM_TEST_ACCESS_TOKEN=___________________

# Webhook Config (already set)
INSTAGRAM_WEBHOOK_URL=https://eo1dbmvfpv1tf1g.m.pipedream.net
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024
```

### Step 9.2: Screenshot Key Pages
Take screenshots of:
1. **Settings → Basic** (showing App ID)
2. **Instagram → Basic Display** (showing OAuth redirect URIs)
3. **Webhooks → Configuration** (showing subscribed fields)

---

## 🎯 EXPECTED OUTCOME

After completing these tasks, you should have:

✅ **Meta Developer App:** "SetterFlo Instagram Bot" created  
✅ **Instagram Product:** Added and configured  
✅ **OAuth Settings:** Redirect URIs configured  
✅ **Webhooks:** Configured to send to Pipedream  
✅ **Permissions:** Basic permissions enabled  
✅ **Test Account:** Connected for testing  
✅ **Credentials:** App ID and App Secret obtained  

---

## ⚠️ IMPORTANT NOTES

### Testing vs Production
- **Development Mode:** Use test accounts only (like @nocoded.ai)
- **Live Mode:** Available to all Instagram Business accounts

### Token Expiration
- **Test Tokens:** Expire in 1-2 hours (for immediate testing only)
- **OAuth Tokens:** Long-lived (60 days), refreshable
- **Production:** Will use OAuth flow, not manual tokens

### Rate Limits
- **Development Mode:** 200 calls/hour per user
- **Live Mode:** Higher limits based on verification

---

## 🐛 TROUBLESHOOTING

### "Webhook Verification Failed"
- Check the verify token exactly matches: `setterflo_verify_token_2024`
- Ensure Pipedream URL is correct and accessible
- Try clicking "Verify" again

### "Invalid OAuth Redirect URI"
- Make sure URIs start with `https://` (not `http://` for production)
- Check for typos in domain name
- Ensure no trailing slashes

### "App Not Found" Error
- Make sure app is in Development Mode for testing
- Check that tester account has accepted invitation
- Verify Instagram account is Business or Creator type (not Personal)

### "Permission Denied"
- Some permissions require Advanced Access (needs App Review)
- Standard Access is enough for testing
- We'll submit for Advanced Access before production launch

---

## 📚 REFERENCE LINKS

- **Meta App Dashboard:** https://developers.facebook.com/apps
- **Instagram Platform Docs:** https://developers.facebook.com/docs/instagram-platform
- **Messenger Platform (similar):** https://developers.facebook.com/docs/messenger-platform
- **Webhooks Setup:** https://developers.facebook.com/docs/graph-api/webhooks

---

## ✅ COMPLETION CHECKLIST

Before marking this task complete, ensure:
- [ ] All credentials copied and pasted above
- [ ] Webhook showing "Verified" status
- [ ] OAuth redirect URIs saved successfully
- [ ] Test Instagram account connected
- [ ] Screenshots taken of key configuration pages
- [ ] All required fields in TASK 9 filled out

---

**Once complete, paste all the credentials and confirmation here, and I'll integrate them into the Next.js backend! 🚀**
