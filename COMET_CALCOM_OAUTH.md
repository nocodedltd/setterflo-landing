# 🗓️ COMET TASK: Setup Cal.com OAuth for SetterFlo

## 📋 OBJECTIVE

Create and configure a Cal.com OAuth application to allow SetterFlo to:
- Access user's Cal.com calendar availability
- Share booking links with Instagram DM leads
- Fetch event types and scheduling URLs
- Integrate with open-source self-hosted Cal.com or Cal.com cloud

**Estimated Time:** 15-20 minutes

---

## 🎯 TASK BREAKDOWN

1. Create OAuth Application in Cal.com
2. Configure Redirect URIs
3. Collect Credentials (Client ID & Secret)
4. Test OAuth Configuration

---

## ✅ STEP 1: ACCESS CAL.COM DEVELOPER SETTINGS

### **Navigate to Cal.com Settings**

1. Go to https://app.cal.com (or your self-hosted Cal.com instance)
2. Log in to your Cal.com account
3. Click your **profile icon** (top right)
4. Click **"Settings"** from dropdown

---

## ✅ STEP 2: CREATE OAUTH APPLICATION

### **Navigate to OAuth Apps**

1. In Settings sidebar, look for **"Developer"** or **"API & Integrations"** section
2. Click on **"OAuth Clients"** or **"OAuth Applications"**
3. Click **"New OAuth Client"** or **"Create OAuth App"** button

---

### **Fill in Application Details**

**Application Name:**
```
SetterFlo
```

**Application Description:**
```
Instagram DM automation platform that qualifies leads, books calls, and syncs conversations to your calendar automatically.
```

**Homepage URL:** (optional)
```
https://setterflo-landing.vercel.app
```

---

### **Configure Redirect URIs**

Add these **THREE** redirect URIs (one per line):

```
https://setterflo-landing.vercel.app/api/auth/calcom/callback
http://localhost:3000/api/auth/calcom/callback
```

**⚠️ IMPORTANT:**
- Must be **exact** URLs (including `https://` or `http://`)
- Path must be `/api/auth/calcom/callback`
- No trailing slashes
- Production URL first, localhost second

---

### **Required Scopes/Permissions**

Cal.com typically requires these permissions (select if shown):

- ✅ **Read user profile** - Get user info (name, email, username)
- ✅ **Read event types** - Access user's available event types
- ✅ **Read bookings** - View scheduled bookings
- ✅ **Read availability** - Check calendar availability

**💡 Note:** Cal.com OAuth may grant all necessary scopes by default. Just ensure basic profile and event access is included.

---

### **OAuth Flow Type**

If asked, select:
- ✅ **Authorization Code Flow** (standard OAuth 2.0)
- ❌ NOT "Client Credentials" or "Implicit Flow"

---

## ✅ STEP 3: COLLECT OAUTH CREDENTIALS

After creating the OAuth app, you'll see:

### **Client ID**
- Copy the Client ID
- It will look like: `cal_XXXXXXXXXXXXXXXXXXXXXXXX` (example format)
- Save this securely

### **Client Secret**
- Click **"Generate Secret"** or **"Show Secret"**
- Copy the Client Secret immediately
- **⚠️ CRITICAL:** Client Secret is shown ONCE. Copy it now!
- Save this in a secure location

**⚠️ IF YOU LOSE THE SECRET:**
- You can generate a new one
- But this will invalidate the old secret
- You'll need to update your environment variables

---

## ✅ STEP 4: VERIFY CONFIGURATION

### **Confirm Settings**

Before completing, verify:

**Application Name:**
- [ ] Set to: `SetterFlo`

**Redirect URIs:**
- [ ] Production: `https://setterflo-landing.vercel.app/api/auth/calcom/callback`
- [ ] Local: `http://localhost:3000/api/auth/calcom/callback`

**Status:**
- [ ] Application is **Active** or **Enabled**

**Scopes:**
- [ ] Has user profile access
- [ ] Has event types access

---

## ✅ STEP 5: TEST OAUTH ENDPOINTS (Optional)

Cal.com OAuth endpoints for reference:

**Authorization URL:**
```
https://app.cal.com/oauth/authorize
```

**Token URL:**
```
https://app.cal.com/api/v2/oauth/token
```

**API Base URL:**
```
https://app.cal.com/api/v2
```

**User Profile Endpoint:**
```
https://app.cal.com/api/v2/me
```

---

## 📝 CREDENTIALS COLLECTION

Once you've created the OAuth app, fill this in:

```env
# Cal.com OAuth Credentials for SetterFlo

CALCOM_CLIENT_ID=<paste-client-id-here>
CALCOM_CLIENT_SECRET=<paste-client-secret-here>

# Application Details
APP_NAME=SetterFlo
APP_STATUS=Active
REDIRECT_URI_PRODUCTION=https://setterflo-landing.vercel.app/api/auth/calcom/callback
REDIRECT_URI_LOCAL=http://localhost:3000/api/auth/calcom/callback
```

**Replace `<paste-client-id-here>` and `<paste-client-secret-here>` with your actual credentials!**

---

## 📸 SCREENSHOT REQUEST

Please provide screenshots of:

1. **OAuth Application Details page** - Showing app name, redirect URIs, and status
2. **Client ID visible** - Showing the generated Client ID
3. **Client Secret created** - Confirmation that secret was generated (don't share the actual secret in screenshot)

---

## 🔧 TROUBLESHOOTING

### **Issue: Can't find OAuth Settings**

**Cal.com Cloud (app.cal.com):**
- Settings → API & Integrations → OAuth Clients

**Self-hosted Cal.com:**
- Settings → Developer → OAuth Applications
- Or check `/settings/developer/oauth-clients`

**If not available:**
- Your Cal.com plan may not support OAuth
- Upgrade to a plan with OAuth support
- Or use API Keys as alternative

---

### **Issue: "Redirect URI Mismatch"**

**Fix:**
- Ensure redirect URI matches EXACTLY
- Include `https://` or `http://`
- No trailing slashes
- Check for typos
- Path must be `/api/auth/calcom/callback`

---

### **Issue: Self-hosted Cal.com Setup**

If using self-hosted Cal.com:

1. Replace `https://app.cal.com` with your domain
2. Example: `https://cal.yourdomain.com`
3. Update all URLs in the credentials
4. Ensure your Cal.com instance has OAuth enabled

---

## ✅ COMPLETION CHECKLIST

After completing all steps, verify:

**OAuth Application:**
- [ ] Application created with name "SetterFlo"
- [ ] Description added
- [ ] Status is Active/Enabled

**Redirect URIs:**
- [ ] Production URI added: `https://setterflo-landing.vercel.app/api/auth/calcom/callback`
- [ ] Local URI added: `http://localhost:3000/api/auth/calcom/callback`

**Credentials:**
- [ ] Client ID copied and saved
- [ ] Client Secret copied and saved
- [ ] Credentials stored securely

**Permissions:**
- [ ] User profile access granted
- [ ] Event types access granted

---

## 📦 FINAL DELIVERABLE

Provide this information in your completion report:

```
✅ CAL.COM OAUTH SETUP COMPLETE

OAuth Application:
- App Name: SetterFlo
- Status: Active
- Created: [Date]

Credentials:
- Client ID: cal_XXXXXXXX... (first 12 characters)
- Client Secret: ✅ Generated and saved securely
- Redirect URIs: ✅ 2 URIs configured

Scopes/Permissions:
- User profile: ✅ Granted
- Event types: ✅ Granted
- Bookings: [✅ Granted / ⚠️ Not needed / ❌ Not available]

Cal.com Instance:
- Using: [Cloud (app.cal.com) / Self-hosted: ________]
- Region: [Global / US / EU / Custom]

Ready for Integration: ✅ Yes

Environment Variables:
CALCOM_CLIENT_ID=[paste here]
CALCOM_CLIENT_SECRET=[paste here]
```

---

## 🎯 SUCCESS CRITERIA

**OAuth setup is complete when:**
- ✅ OAuth application created in Cal.com
- ✅ Application status is Active
- ✅ Both redirect URIs configured correctly
- ✅ Client ID and Secret obtained
- ✅ Credentials saved securely
- ✅ Basic permissions/scopes granted

---

## 🚀 NEXT STEPS AFTER COMPLETION

Once you provide the credentials:

1. Add to Vercel environment variables
2. Test Cal.com OAuth flow
3. Verify booking link sharing works
4. Integrate with Instagram DM automation

---

## 💡 CAL.COM NOTES

**Cal.com Benefits:**
- ✅ Open-source (can self-host)
- ✅ Full control over data
- ✅ Customizable booking pages
- ✅ No per-seat pricing (self-hosted)
- ✅ Advanced features (routing, round-robin)

**OAuth Differences from Calendly:**
- Cal.com OAuth uses V2 API endpoints
- More granular permission control
- Self-hosted option available
- May require different token refresh logic

---

**Estimated completion time: 15-20 minutes**

**When complete, SetterFlo will be able to access your Cal.com scheduling links and integrate them into Instagram DM automation!** 📅
