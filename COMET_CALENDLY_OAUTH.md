# Comet Instructions: Calendly OAuth Setup

**Task:** Configure Calendly OAuth integration for SetterFlo

**Project:** SetterFlo - Instagram DM Automation with Calendar Booking  
**Environment:** Production  
**Purpose:** Let users connect their Calendly accounts to automatically share booking links in Instagram DMs

---

## 🎯 OBJECTIVE

Set up a Calendly OAuth application so SetterFlo users can:
1. Connect their Calendly account via OAuth
2. Allow SetterFlo to fetch their event types
3. Automatically share Calendly booking links in Instagram DMs
4. Track scheduled events (optional)

---

## 📋 TASK 1: Access Calendly Developer Portal

### Step 1.1: Log into Calendly
1. Go to: https://calendly.com/
2. Log in with your Calendly account credentials
3. If you don't have a Calendly account, sign up (free plan works)

### Step 1.2: Navigate to Developer Section
1. Click your **profile icon** (top right)
2. Go to **Account Settings**
3. Or directly visit: https://calendly.com/integrations/api_webhooks

### Step 1.3: Access Developer Center
1. Look for **"Integrations"** or **"Developer"** section in left sidebar
2. Or go directly to: https://developer.calendly.com/
3. Click **"Get Your API Key"** or **"Create an OAuth Application"**

---

## 📋 TASK 2: Create OAuth Application

### Step 2.1: Create New Application
1. In Calendly Developer portal, find **"OAuth Applications"** or **"My Apps"**
2. Click **"Create Application"** or **"New App"** button
3. If you see "API Keys" instead, look for **"OAuth"** tab

### Step 2.2: Application Details
Fill in these details:

**Application Information:**
- **Application Name:** `SetterFlo`
- **Description:** `Instagram DM automation platform that helps users qualify leads and book calls automatically through Instagram DMs`
- **Company/Organization:** `NoCoded` (or your business name)
- **Website URL:** `https://setterflo-landing.vercel.app`
- **Support Email:** `support@nocoded.ai` (or your support email)

### Step 2.3: OAuth Configuration

**Redirect URIs** (Add ALL of these):
```
https://setterflo-landing.vercel.app/api/auth/calendly/callback
https://setterflo-landing.vercel.app/auth/calendly/callback
http://localhost:3000/api/auth/calendly/callback
```

**Requested Scopes** (Select these permissions):
- ✅ `default` - Basic account access
- ✅ `event_types:read` - Read user's event types (required)
- ✅ `scheduled_events:read` - Read scheduled events (optional, for analytics)
- ✅ `webhooks:read` - Subscribe to webhooks (optional, for notifications)
- ✅ `webhooks:write` - Create webhooks (optional, for notifications)

**Note:** Only select the scopes you see available. Some may require approval.

### Step 2.4: Terms & Conditions
- ✅ Accept Calendly's API Terms of Service
- ✅ Accept Privacy Policy
- Click **"Create"** or **"Submit"**

---

## 📋 TASK 3: Get OAuth Credentials

### Step 3.1: Copy Client Credentials
After creating the app, you should see:

**Copy these values:**
- **Client ID:** `[Copy this]`
- **Client Secret:** Click "Show" or "Reveal" and copy

**Paste credentials here:**
```env
CALENDLY_CLIENT_ID=___________________
CALENDLY_CLIENT_SECRET=___________________
```

### Step 3.2: Note OAuth Endpoints
Calendly's OAuth endpoints (for reference):
- **Authorization URL:** `https://auth.calendly.com/oauth/authorize`
- **Token URL:** `https://auth.calendly.com/oauth/token`
- **API Base URL:** `https://api.calendly.com`

**Note:** These are standard and don't need configuration, but keep them for reference.

---

## 📋 TASK 4: Test OAuth Flow (Optional)

### Step 4.1: Get Authorization URL
You can test the OAuth flow manually:

1. Construct this URL (replace `YOUR_CLIENT_ID` with actual Client ID):
```
https://auth.calendly.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://setterflo-landing.vercel.app/api/auth/calendly/callback
```

2. Open this URL in your browser
3. You should see Calendly's OAuth consent screen
4. Click **"Authorize"**
5. Should redirect to your callback URL (will show error if backend not ready - that's expected)

### Step 4.2: Verify Scopes
On the consent screen, verify it's requesting:
- Access to your Calendly account
- Read your event types
- View scheduled events (if selected)

**If the consent screen shows, you're good!**

---

## 📋 TASK 5: Configure Webhooks (Optional)

**Note:** Webhooks are optional for MVP. We can add later for real-time notifications.

### Step 5.1: Create Webhook Subscription (Skip for now)
If you want to set up webhooks now:
1. In Calendly Developer portal, go to **"Webhooks"** section
2. Click **"Create Webhook"**
3. **Webhook URL:** `https://setterflo-landing.vercel.app/api/webhooks/calendly`
4. **Events to Subscribe:**
   - ✅ `invitee.created` - New booking
   - ✅ `invitee.canceled` - Booking canceled
5. Click **"Create"**

**For MVP, we'll poll the API instead. Webhooks can be added later.**

---

## 📋 TASK 6: Document Rate Limits

### Step 6.1: Note Rate Limits
Calendly's API rate limits (as of 2024):
- **Free Plan:** 1,000 requests/day
- **Essentials Plan:** 10,000 requests/day
- **Professional Plan:** 50,000 requests/day
- **Teams Plan:** 100,000 requests/day

**For SetterFlo users:** Rate limits apply per connected Calendly account.

### Step 6.2: Best Practices
- Cache event types (they rarely change)
- Don't fetch on every message
- Fetch once when user connects, cache in Supabase

---

## 📋 TASK 7: Test API Access (Optional)

### Step 7.1: Get Personal Access Token (For Testing)
If you want to test API calls immediately:

1. In Calendly Developer portal, go to **"API Keys"** or **"Personal Access Tokens"**
2. Click **"Generate New Token"**
3. Copy the token

**Test Token (for immediate development testing only):**
```
CALENDLY_TEST_ACCESS_TOKEN=___________________
```

### Step 7.2: Test API Call
You can test with curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.calendly.com/users/me
```

Expected response: JSON with your user details

**Note:** Personal access tokens are for testing only. Production will use OAuth tokens.

---

## 📋 TASK 8: Review Calendly Event Types

### Step 8.1: Check Your Event Types
1. Go to: https://calendly.com/event_types
2. Note your event types (e.g., "30 Minute Meeting", "Discovery Call")
3. Each has a unique URL like: `https://calendly.com/your-username/30min`

**Why this matters:**
- SetterFlo will fetch these event types via API
- Users can choose which event type to share in Instagram DMs
- We'll display them in the UI for selection

---

## 📋 TASK 9: Verify Configuration

### Step 9.1: Configuration Checklist
Before completing, verify:

- [ ] OAuth application created with name "SetterFlo"
- [ ] Client ID and Client Secret copied
- [ ] All 3 redirect URIs added and saved
- [ ] Scopes include at least `event_types:read`
- [ ] Application status is "Active" or "Approved"
- [ ] (Optional) Test OAuth flow shows consent screen
- [ ] (Optional) Personal access token generated for testing

### Step 9.2: Screenshot Key Pages
Take screenshots of:
1. **OAuth Application Details** (showing Client ID, redirect URIs)
2. **Scopes/Permissions** (showing approved scopes)
3. **Your Event Types** (from calendly.com/event_types)

---

## 📋 TASK 10: Document Everything

### Step 10.1: Provide All Details
Please fill out these details:

```env
# Calendly OAuth Credentials
CALENDLY_CLIENT_ID=___________________
CALENDLY_CLIENT_SECRET=___________________

# Optional: Test Token (for development only)
CALENDLY_TEST_ACCESS_TOKEN=___________________

# Your Calendly Event Types (for reference)
# Example: "30 Minute Meeting" -> https://calendly.com/nocoded/30min
EVENT_TYPE_1_NAME=___________________
EVENT_TYPE_1_URL=___________________

EVENT_TYPE_2_NAME=___________________
EVENT_TYPE_2_URL=___________________
```

### Step 10.2: Additional Information
**Your Calendly Username:** `___________________`  
**Number of Event Types:** `___________________`  
**Calendly Plan:** Free / Essentials / Professional / Teams  

---

## 🎯 EXPECTED OUTCOME

After completing these tasks, you should have:

✅ **Calendly OAuth App:** "SetterFlo" created  
✅ **OAuth Credentials:** Client ID and Secret obtained  
✅ **Redirect URIs:** Configured for production and local dev  
✅ **Scopes:** Minimum `event_types:read` permission granted  
✅ **Test Token:** (Optional) Personal access token for testing  
✅ **Documentation:** All credentials and event types documented  

---

## 📚 API DOCUMENTATION

### Useful Calendly API Endpoints
Once OAuth is complete, SetterFlo will use:

**Get Current User:**
```
GET https://api.calendly.com/users/me
```

**Get Event Types:**
```
GET https://api.calendly.com/event_types?user={user_uri}
```

**Get Scheduled Events:**
```
GET https://api.calendly.com/scheduled_events?user={user_uri}
```

**Full API Docs:** https://developer.calendly.com/api-docs

---

## ⚠️ IMPORTANT NOTES

### OAuth vs API Keys
- **API Keys (Personal Access Tokens):** Tied to YOUR account only
- **OAuth:** Users connect THEIR accounts (what we need for production)
- Use API keys for testing, OAuth for production

### Scopes & Permissions
- Only request scopes you actually need
- More scopes = more friction for users
- For MVP, `event_types:read` is sufficient

### Rate Limits
- Rate limits apply per user (per connected Calendly account)
- Cache event types to minimize API calls
- Don't fetch on every Instagram DM

### Security
- **Never expose Client Secret** in frontend code
- Only use in backend API routes
- Store securely in environment variables

---

## 🐛 TROUBLESHOOTING

### "Invalid Redirect URI"
- Check spelling and protocol (`https://` not `http://`)
- No trailing slashes
- Must exactly match what's configured in Calendly app

### "Scope Not Available"
- Some scopes may require account verification
- Start with basic scopes first
- Can add more later via app review

### "Application Pending Review"
- Some integrations require Calendly review before going live
- Can still test in development mode
- Review typically takes 1-3 business days

### "Rate Limit Exceeded"
- Check your Calendly plan limits
- Implement caching in backend
- Reduce unnecessary API calls

---

## 🚀 NEXT STEPS

Once you provide the credentials:
1. I'll add them to Vercel environment variables
2. Build the OAuth flow in Next.js
3. Create callback handler
4. Store tokens in Supabase
5. Update UI to show connection status
6. Test end-to-end flow

---

## ✅ COMPLETION CHECKLIST

Before marking this task complete:
- [ ] OAuth application created and approved
- [ ] Client ID and Client Secret copied
- [ ] All redirect URIs saved
- [ ] Scopes approved (minimum: event_types:read)
- [ ] Event types documented
- [ ] Screenshots taken
- [ ] All fields in TASK 10 filled out
- [ ] (Optional) Test OAuth flow attempted

---

**Once complete, paste all credentials and details here, and I'll build the Calendly integration! 📅🚀**
