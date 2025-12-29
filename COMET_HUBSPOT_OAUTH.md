# Comet Instructions: HubSpot OAuth Setup

**Task:** Configure HubSpot OAuth integration for SetterFlo

**Project:** SetterFlo - Instagram DM Automation with CRM Integration  
**Environment:** Production  
**Purpose:** Let users connect their HubSpot accounts to automatically sync contacts, deals, and conversation history

---

## 🎯 OBJECTIVE

Set up a HubSpot OAuth application so SetterFlo users can:
1. Connect their HubSpot account via OAuth
2. Automatically create contacts when qualifying prospects
3. Create deals/opportunities in sales pipeline
4. Add notes and activities to contact timeline
5. Trigger HubSpot workflows and sequences

---

## 📋 TASK 1: Access HubSpot Developer Account

### Step 1.1: Create HubSpot Developer Account
1. Go to: https://developers.hubspot.com/
2. Click **"Get Started"** or **"Sign Up"**
3. If you have a HubSpot account, sign in
4. If not, create a new account (free tier available)

### Step 1.2: Create Developer Account
1. After logging in, go to: https://developers.hubspot.com/get-started
2. Complete developer profile if prompted:
   - **Name:** Your name or company name
   - **Email:** Your business email
   - **Company:** NoCoded (or your company)
3. Accept HubSpot Developer Terms

### Step 1.3: Access Developer Portal
1. Go to: https://developers.hubspot.com/
2. Click **"Manage apps"** button (top right)
3. Or navigate to: https://app.hubspot.com/ecosystem/your-account/apps

---

## 📋 TASK 2: Create Public App

### Step 2.1: Create New App
1. In Developer Portal, click **"Create app"** button
2. You'll see the app creation form

### Step 2.2: Basic App Information
Fill in these details:

**App Info Tab:**
- **App Name:** `SetterFlo`
- **Description:** `Instagram DM automation platform that qualifies leads, books calls, and syncs conversations to HubSpot automatically.`
- **App Logo:** Upload SetterFlo logo (optional, can add later)
- **Support Email:** `support@nocoded.ai`
- **Support URL:** `https://setterflo-landing.vercel.app/support`
- **Privacy Policy URL:** `https://setterflo-landing.vercel.app/privacy`
- **Terms of Service URL:** `https://setterflo-landing.vercel.app/terms`

### Step 2.3: Save Basic Info
- Click **"Create app"** or **"Save"** button
- Your app is now created in draft mode

---

## 📋 TASK 3: Configure OAuth Settings

### Step 3.1: Navigate to Auth Tab
1. In your app settings, click **"Auth"** tab
2. You should see OAuth configuration options

### Step 3.2: Configure Redirect URLs
Under **"Redirect URLs"** section, add these URLs:

```
https://setterflo-landing.vercel.app/api/auth/hubspot/callback
https://setterflo-landing.vercel.app/auth/hubspot/callback
http://localhost:3000/api/auth/hubspot/callback
```

**Click "Add" for each URL**

### Step 3.3: Get OAuth Credentials
You should now see:
- **Client ID:** (automatically generated)
- **Client Secret:** Click "Show" to reveal

**Copy these credentials:**
```env
HUBSPOT_CLIENT_ID=___________________
HUBSPOT_CLIENT_SECRET=___________________
```

### Step 3.4: Note OAuth Endpoints
HubSpot's OAuth endpoints (for reference):
- **Authorization URL:** `https://app.hubspot.com/oauth/authorize`
- **Token URL:** `https://api.hubapi.com/oauth/v1/token`
- **API Base URL:** `https://api.hubapi.com`

---

## 📋 TASK 4: Configure Scopes

### Step 4.1: Select Required Scopes
In the **"Scopes"** section of the Auth tab, select these permissions:

**Core Scopes (Required for MVP):**
- ✅ `crm.objects.contacts.read` - Read contacts
- ✅ `crm.objects.contacts.write` - Create and update contacts
- ✅ `crm.objects.deals.read` - Read deals
- ✅ `crm.objects.deals.write` - Create and update deals
- ✅ `crm.objects.companies.read` - Read companies (optional)

**Engagement Scopes (For Activity Tracking):**
- ✅ `crm.objects.companies.write` - Create/update companies
- ✅ `timeline` - Add timeline events
- ✅ `timeline.events.read` - Read timeline events

**Optional Scopes (Nice to Have):**
- ✅ `crm.schemas.contacts.read` - Read contact properties
- ✅ `crm.schemas.deals.read` - Read deal properties
- ✅ `crm.schemas.companies.read` - Read company properties
- ✅ `oauth` - Refresh tokens
- ✅ `forms` - Access forms (for lead capture)
- ✅ `files` - Upload attachments (if needed)

### Step 4.2: Minimum Viable Scopes
**For MVP, start with:**
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `oauth` (for token refresh)

**Can add more scopes later without re-review.**

---

## 📋 TASK 5: Test OAuth Flow

### Step 5.1: Test Installation Link
HubSpot provides a test installation URL:

1. In your app dashboard, find **"Test Installation URL"** or **"Install URL"**
2. Copy this URL (or click "Test your app")
3. Open the URL in a browser

### Step 5.2: Authorize Test Installation
1. Should show HubSpot OAuth consent screen
2. Select a HubSpot account to connect (your test account)
3. Review requested permissions
4. Click **"Connect app"** or **"Grant access"**
5. Should redirect to your callback URL (may error if backend not ready - that's fine)

**Expected Consent Screen:**
- Shows "SetterFlo" app name
- Lists all requested scopes
- Shows which HubSpot account is being connected

### Step 5.3: Verify in HubSpot
1. Log into your HubSpot account
2. Go to Settings → Integrations → Connected Apps
3. Should see "SetterFlo" listed (if OAuth succeeded)

---

## 📋 TASK 6: Configure Webhooks (Optional)

### Step 6.1: Navigate to Webhooks Tab
1. In your app settings, click **"Webhooks"** tab
2. Enable webhooks if you want real-time sync

### Step 6.2: Add Webhook URL
**Target URL:** `https://setterflo-landing.vercel.app/api/webhooks/hubspot`

### Step 6.3: Subscribe to Events
Select these webhook events:
- ✅ `contact.creation` - New contact created
- ✅ `contact.propertyChange` - Contact updated
- ✅ `contact.deletion` - Contact deleted
- ✅ `deal.creation` - New deal created
- ✅ `deal.propertyChange` - Deal updated
- ✅ `deal.deletion` - Deal deleted

**For MVP, webhooks are optional. Can use polling instead.**

---

## 📋 TASK 7: Get API Key (For Testing - Optional)

### Step 7.1: Create Private App (For Testing)
If you want to test API calls immediately without OAuth:

1. In HubSpot account, go to: Settings → Integrations → Private Apps
2. Click **"Create private app"**
3. Name: `SetterFlo Development Test`
4. Select same scopes as OAuth app
5. Click **"Create app"**
6. Copy the **Access Token**

**Test Token (temporary, for development only):**
```env
HUBSPOT_TEST_ACCESS_TOKEN=___________________
```

### Step 7.2: Test API Call
Test with curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.hubapi.com/crm/v3/objects/contacts
```

Expected: JSON response with contacts (or empty array if none)

**Note:** Private app tokens are for testing only. Production uses OAuth.

---

## 📋 TASK 8: Configure App Settings

### Step 8.1: App Listing Details
If you want app to be publicly available in HubSpot Marketplace:

1. Click **"Listing"** tab in app settings
2. Fill in:
   - **Short Description:** 1-2 sentence summary
   - **Full Description:** Detailed explanation with benefits
   - **Categories:** Select "Marketing" and "Sales"
   - **Screenshots:** Upload app screenshots (optional)
   - **Demo Video:** Link to demo (optional)
   - **Pricing:** Free (or your pricing model)
   - **Target Audience:** Small Business / Enterprise / All

### Step 8.2: Submit for Review (Optional)
**For Private Use:** Skip marketplace submission  
**For Public Marketplace:**
1. Complete all listing details
2. Click **"Submit for review"**
3. HubSpot reviews within 5-10 business days
4. You'll receive email with approval or feedback

**For testing, keep as "Draft" or "Private" mode.**

---

## 📋 TASK 9: Understand HubSpot Portal Structure

### Step 9.1: Portal/Account Concept
- **Portal ID:** Unique ID for each HubSpot account
- Users may have multiple HubSpot portals
- OAuth token is scoped to one portal at a time
- Users can connect multiple portals separately

### Step 9.2: Token Scope
When user authorizes:
- Token is tied to ONE HubSpot portal
- Portal ID is included in OAuth response
- Store portal ID with access token

---

## 📋 TASK 10: Review HubSpot API Documentation

### Step 10.1: Key API Endpoints We'll Use

**Create Contact:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts
```

**Get Contact:**
```
GET https://api.hubapi.com/crm/v3/objects/contacts/{contactId}
```

**Search Contacts:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts/search
```

**Create Deal:**
```
POST https://api.hubapi.com/crm/v3/objects/deals
```

**Update Deal:**
```
PATCH https://api.hubapi.com/crm/v3/objects/deals/{dealId}
```

**Associate Contact with Deal:**
```
PUT https://api.hubapi.com/crm/v3/objects/deals/{dealId}/associations/contacts/{contactId}/{associationType}
```

### Step 10.2: API Documentation Links
- **Developer Docs:** https://developers.hubspot.com/docs/api/overview
- **CRM API:** https://developers.hubspot.com/docs/api/crm/understanding-the-crm
- **OAuth Guide:** https://developers.hubspot.com/docs/api/oauth-quickstart-guide
- **API Postman Collection:** Available in HubSpot docs

---

## 📋 TASK 11: Note Rate Limits

### Step 11.1: Rate Limits by Plan
- **Free/Starter:** 100 requests per 10 seconds
- **Professional:** 150 requests per 10 seconds
- **Enterprise:** 200 requests per 10 seconds
- **Daily Limit:** 500,000 requests per day (across all users)

### Step 11.2: Best Practices
- Implement rate limit error handling (429 responses)
- Use exponential backoff on retries
- Cache contact/deal data when possible
- Batch operations where supported
- Use search API for deduplication

---

## 📋 TASK 12: Document Everything

### Step 12.1: Provide All Details

```env
# HubSpot OAuth Credentials
HUBSPOT_CLIENT_ID=___________________
HUBSPOT_CLIENT_SECRET=___________________

# Optional: Test Token (for development only)
HUBSPOT_TEST_ACCESS_TOKEN=___________________

# App Information
APP_ID=___________________
APP_STATUS=Draft / In Review / Published
INSTALL_URL=___________________

# Approved Scopes (list what was selected)
APPROVED_SCOPES=crm.objects.contacts.read,crm.objects.contacts.write,crm.objects.deals.read,crm.objects.deals.write,oauth

# Test HubSpot Account (for testing)
TEST_PORTAL_ID=___________________
TEST_PORTAL_NAME=___________________
```

### Step 12.2: Screenshots
Take screenshots of:
1. **App Settings → Auth Tab** (showing Client ID and redirect URIs)
2. **Scopes Tab** (showing approved scopes)
3. **OAuth Consent Screen** (during test installation)
4. **Connected Apps** (in HubSpot Settings showing SetterFlo)

---

## 🎯 EXPECTED OUTCOME

After completing these tasks, you should have:

✅ **HubSpot App:** "SetterFlo" created  
✅ **OAuth Credentials:** Client ID and Client Secret obtained  
✅ **Redirect URIs:** Configured for production and local dev  
✅ **Scopes:** Minimum required permissions selected  
✅ **Test Installation:** OAuth flow tested successfully  
✅ **Webhooks:** (Optional) Configured for real-time sync  
✅ **Test Token:** (Optional) Private app token for testing  
✅ **Documentation:** All credentials and settings documented  

---

## ⚠️ IMPORTANT NOTES

### Public vs Private Apps
- **Private App:** Token-based, no OAuth (for internal use)
- **Public App:** OAuth-based (what we need for SetterFlo)
- Use Private App tokens for testing only

### Token Expiration
- **Access Token:** Expires in 6 hours
- **Refresh Token:** Long-lived (until revoked)
- Must implement token refresh logic
- Store refresh tokens securely

### Scopes & Permissions
- Only request scopes you need
- Can add more scopes later without resubmission
- More scopes = more friction for users

### Portal ID
- Each HubSpot account has unique Portal ID
- Store Portal ID with access token
- Display portal name in UI
- Users can connect multiple portals

---

## 🐛 TROUBLESHOOTING

### "Invalid Client ID"
- Check Client ID is copied correctly
- Ensure no extra spaces or characters
- Verify app is not deleted

### "Redirect URI Mismatch"
- Must exactly match configured URI
- Check for typos or trailing slashes
- HTTPS required for production

### "Scope Not Authorized"
- User may need admin permissions in HubSpot
- Some scopes require certain HubSpot plan tier
- Ask user to reconnect with proper permissions

### "Rate Limited (429)"
- Implement exponential backoff
- Check your plan's rate limits
- Cache data to reduce API calls
- Spread requests over time

### "Contact Already Exists"
- Use search API to check before creating
- Use email as unique identifier
- Handle duplicate errors gracefully
- Consider updating instead of creating

---

## 🚀 NEXT STEPS

Once you provide the credentials:
1. I'll add them to Vercel environment variables
2. Build the OAuth flow in Next.js
3. Create callback handler
4. Store tokens in Supabase (encrypted)
5. Build contact creation/search logic
6. Build deal creation/update logic
7. Add association logic (link contacts to deals)
8. Update UI to show connection status
9. Test end-to-end lead sync

---

## ✅ COMPLETION CHECKLIST

Before marking this task complete:
- [ ] HubSpot app created in Developer Portal
- [ ] Client ID and Client Secret copied
- [ ] All 3 redirect URIs saved
- [ ] Required scopes selected (minimum 5 scopes)
- [ ] Test installation completed successfully
- [ ] OAuth consent screen tested
- [ ] (Optional) Private app token for testing
- [ ] (Optional) Webhooks configured
- [ ] Screenshots taken of key pages
- [ ] All fields in TASK 12 filled out

---

## 📚 ADDITIONAL RESOURCES

- **HubSpot Developer Portal:** https://developers.hubspot.com/
- **App Management:** https://app.hubspot.com/ecosystem/
- **OAuth Guide:** https://developers.hubspot.com/docs/api/oauth-quickstart-guide
- **CRM API Docs:** https://developers.hubspot.com/docs/api/crm/understanding-the-crm
- **Developer Community:** https://community.hubspot.com/t5/APIs-Integrations/ct-p/apis
- **API Status:** https://status.hubspot.com/

---

**Once complete, paste all credentials and confirmations here, and I'll build the HubSpot CRM integration! 📊🚀**
