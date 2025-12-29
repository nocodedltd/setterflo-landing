# Comet Instructions: GoHighLevel OAuth Setup

**Task:** Configure GoHighLevel OAuth integration for SetterFlo

**Project:** SetterFlo - Instagram DM Automation with CRM Integration  
**Environment:** Production  
**Purpose:** Let users connect their GoHighLevel (GHL) accounts to sync leads, opportunities, and conversations automatically

---

## 🎯 OBJECTIVE

Set up a GoHighLevel OAuth application so SetterFlo users can:
1. Connect their GHL account via OAuth
2. Automatically create contacts/leads when qualifying prospects
3. Sync conversation history to GHL
4. Create opportunities/deals
5. Trigger GHL workflows and automations

---

## 📋 TASK 1: Access GoHighLevel App Marketplace

### Step 1.1: Log into GoHighLevel
1. Go to: https://app.gohighlevel.com/
2. Log in with your GHL account credentials
3. If you don't have a GHL account, you'll need to sign up (note: GHL requires agency plan for OAuth apps)

### Step 1.2: Navigate to Marketplace
1. In GHL dashboard, click **"Marketplace"** in left sidebar
2. Or go directly to: https://marketplace.gohighlevel.com/
3. Click on your profile icon (top right)
4. Select **"My Apps"** or **"Developer"**

### Step 1.3: Access Developer Settings
1. Go to: https://marketplace.gohighlevel.com/apps
2. Or navigate via: Profile → Developer Settings
3. You should see **"Create App"** button

**Note:** If you don't see developer options, your account may need to be upgraded to Agency+ plan for OAuth app development.

---

## 📋 TASK 2: Create OAuth Application

### Step 2.1: Create New App
1. Click **"Create App"** button
2. Choose **"Private App"** (for your agency) or **"Public App"** (for marketplace)
3. For SetterFlo, choose **"Public App"** (so any GHL user can connect)

### Step 2.2: Basic App Information
Fill in these details:

**App Details:**
- **App Name:** `SetterFlo`
- **App Description:** `Instagram DM automation that qualifies leads and syncs them to your GoHighLevel CRM automatically. Automate conversations, book calls, and create deals without manual work.`
- **App Category:** Select **"CRM & Marketing"** or **"Automation"**
- **App Icon:** Upload SetterFlo logo (optional, can add later)
- **Developer/Company Name:** `NoCoded`
- **Support Email:** `support@nocoded.ai`
- **Website URL:** `https://setterflo-landing.vercel.app`
- **Privacy Policy URL:** `https://setterflo-landing.vercel.app/privacy`
- **Terms of Service URL:** `https://setterflo-landing.vercel.app/terms`

### Step 2.3: OAuth Configuration

**Redirect URIs** (Add ALL of these):
```
https://setterflo-landing.vercel.app/api/auth/gohighlevel/callback
https://setterflo-landing.vercel.app/auth/gohighlevel/callback
http://localhost:3000/api/auth/gohighlevel/callback
```

**Allowed Domains:**
```
setterflo-landing.vercel.app
localhost
```

---

## 📋 TASK 3: Configure Scopes & Permissions

### Step 3.1: Select Required Scopes
GHL uses granular permissions. Select these scopes:

**Core Permissions (Required):**
- ✅ `contacts.readonly` - Read contact information
- ✅ `contacts.write` - Create and update contacts
- ✅ `opportunities.readonly` - Read opportunities/deals
- ✅ `opportunities.write` - Create and update opportunities
- ✅ `users.readonly` - Read user information
- ✅ `locations.readonly` - Read location/account details

**Optional Permissions (Nice to Have):**
- ✅ `conversations.readonly` - Read conversations
- ✅ `conversations.write` - Create conversation messages
- ✅ `conversations/message.readonly` - Read messages
- ✅ `conversations/message.write` - Send messages
- ✅ `calendars.readonly` - Read calendars
- ✅ `calendars/events.readonly` - Read calendar events
- ✅ `calendars/events.write` - Create calendar events
- ✅ `workflows.readonly` - Read workflows
- ✅ `campaigns.readonly` - Read campaigns

**Advanced (Can Add Later):**
- `pipelines.readonly` - Read pipeline configuration
- `tags.readonly` - Read tags
- `tags.write` - Create and assign tags
- `custom_fields.readonly` - Read custom fields
- `custom_fields.write` - Update custom fields

### Step 3.2: Scope Selection Strategy
**For MVP, start with minimum required:**
- `contacts.readonly`
- `contacts.write`
- `opportunities.readonly`
- `opportunities.write`
- `locations.readonly`

**Can add more scopes later via app update.**

---

## 📋 TASK 4: Get OAuth Credentials

### Step 4.1: Copy Client Credentials
After creating and saving the app, go to **"App Settings"** or **"Credentials"** tab:

**Copy these values:**
- **App ID / Client ID:** `[Copy this]`
- **App Secret / Client Secret:** Click "Show" or "Reveal" and copy
- **SSO Key:** (if shown, copy this too)

**Paste credentials here:**
```env
GOHIGHLEVEL_CLIENT_ID=___________________
GOHIGHLEVEL_CLIENT_SECRET=___________________
GOHIGHLEVEL_SSO_KEY=___________________
```

### Step 4.2: Note OAuth Endpoints
GoHighLevel's OAuth endpoints:
- **Authorization URL:** `https://marketplace.gohighlevel.com/oauth/chooselocation`
- **Token URL:** `https://services.leadconnectorhq.com/oauth/token`
- **API Base URL:** `https://services.leadconnectorhq.com`

**Note:** These are standard GHL endpoints.

---

## 📋 TASK 5: Configure Webhook Settings (Optional)

### Step 5.1: Webhook Configuration
If you want real-time notifications:

1. In your app settings, find **"Webhooks"** section
2. **Webhook URL:** `https://setterflo-landing.vercel.app/api/webhooks/gohighlevel`
3. **Events to Subscribe:**
   - ✅ `ContactCreate` - New contact created
   - ✅ `ContactUpdate` - Contact updated
   - ✅ `OpportunityCreate` - New opportunity created
   - ✅ `OpportunityStatusUpdate` - Opportunity status changed
   - ✅ `OpportunityDelete` - Opportunity deleted

**For MVP, webhooks are optional. Can add later.**

---

## 📋 TASK 6: Test OAuth Flow (Before Publishing)

### Step 6.1: Test Authorization Flow
GHL apps have a testing mode before going public:

1. In your app dashboard, look for **"Test Installation"** or **"Install"** button
2. Click it to test the OAuth flow
3. Should redirect to location selection screen
4. Choose your test GHL location/account
5. Should show consent screen with requested scopes
6. Click **"Allow"** or **"Authorize"**
7. Should redirect to your callback URL

**Expected behavior:**
- Shows location picker (GHL multi-location support)
- Shows list of requested permissions
- Redirects to callback URL (may show error if backend not ready - that's fine)

### Step 6.2: Verify Scopes
On consent screen, verify it shows:
- App name: "SetterFlo"
- Requested permissions (contacts, opportunities, etc.)
- Clear description of what data is accessed

---

## 📋 TASK 7: App Submission (For Public Use)

### Step 7.1: Complete App Listing
To make app available to all GHL users:

1. Go to **"App Listing"** or **"Marketplace Listing"** tab
2. Fill in:
   - **Short Description:** 1-2 sentences about SetterFlo
   - **Long Description:** Detailed explanation with benefits
   - **Screenshots:** Upload app screenshots (can add later)
   - **Demo Video:** Optional but recommended
   - **Pricing:** Free / Paid (if integrating billing)
   - **Support Resources:** Links to docs and support

### Step 7.2: Submit for Review
1. Review all information
2. Click **"Submit for Review"** button
3. GHL will review within 3-5 business days
4. You'll receive email with approval or feedback

**For testing, you can use "Private App" mode without review.**

---

## 📋 TASK 8: Understand GHL Multi-Location Structure

### Step 8.1: Location Concept
GHL has a unique structure:
- **Agency** - Top level (your account)
- **Locations** - Sub-accounts (your clients)
- **Users** - People within locations

### Step 8.2: OAuth Token Scope
When user authorizes:
- They select ONE location
- Token is scoped to that location only
- If they have multiple locations, they need to connect each one separately

**Important for SetterFlo:**
- Users may connect multiple GHL locations
- Store location ID with each connection
- Show connected location name in UI

---

## 📋 TASK 9: Review GHL API Documentation

### Step 9.1: Key API Endpoints We'll Use

**Create Contact:**
```
POST https://services.leadconnectorhq.com/contacts/
```

**Get Contact:**
```
GET https://services.leadconnectorhq.com/contacts/{contactId}
```

**Create Opportunity:**
```
POST https://services.leadconnectorhq.com/opportunities/
```

**Update Opportunity:**
```
PUT https://services.leadconnectorhq.com/opportunities/{opportunityId}
```

**Get Location Info:**
```
GET https://services.leadconnectorhq.com/locations/{locationId}
```

### Step 9.2: API Documentation Links
- **Main API Docs:** https://highlevel.stoplight.io/
- **OAuth Guide:** https://highlevel.stoplight.io/docs/integrations/docs/oauth/
- **Postman Collection:** Available in GHL docs

---

## 📋 TASK 10: Note Rate Limits & Best Practices

### Step 10.1: Rate Limits
- **Standard:** 100 requests per 10 seconds
- **Burst:** 1000 requests per minute
- **Daily:** Varies by endpoint

### Step 10.2: Best Practices
- Cache location data (rarely changes)
- Batch contact creation when possible
- Use webhooks for real-time sync (instead of polling)
- Handle rate limit errors gracefully (exponential backoff)

---

## 📋 TASK 11: Document Everything

### Step 11.1: Provide All Details

```env
# GoHighLevel OAuth Credentials
GOHIGHLEVEL_CLIENT_ID=___________________
GOHIGHLEVEL_CLIENT_SECRET=___________________
GOHIGHLEVEL_SSO_KEY=___________________

# App Information
APP_NAME=SetterFlo
APP_STATUS=Draft / In Review / Approved
APP_TYPE=Private / Public

# Approved Scopes (list what was approved)
APPROVED_SCOPES=contacts.readonly,contacts.write,opportunities.readonly,opportunities.write,locations.readonly

# Your GHL Account (for testing)
TEST_GHL_LOCATION_ID=___________________
TEST_GHL_LOCATION_NAME=___________________
```

### Step 11.2: Screenshots
Take screenshots of:
1. **App Details** (showing App ID and basic info)
2. **OAuth Configuration** (showing redirect URIs)
3. **Scopes & Permissions** (showing approved scopes)
4. **Test Installation** (showing consent screen)

---

## 🎯 EXPECTED OUTCOME

After completing these tasks, you should have:

✅ **GHL OAuth App:** "SetterFlo" created  
✅ **OAuth Credentials:** Client ID, Client Secret, and SSO Key obtained  
✅ **Redirect URIs:** Configured for production and local dev  
✅ **Scopes:** Minimum required permissions approved  
✅ **Webhooks:** (Optional) Configured for real-time sync  
✅ **Test Installation:** OAuth flow tested successfully  
✅ **Documentation:** All credentials and settings documented  

---

## ⚠️ IMPORTANT NOTES

### Private vs Public Apps
- **Private App:** Only your agency can install (fast approval)
- **Public App:** Available in marketplace (requires review)
- **Recommendation:** Start with Private for testing, then go Public

### Multi-Location Handling
- Users may have multiple GHL locations
- Each location needs separate OAuth connection
- Store location ID with each access token
- Display location name in UI

### Token Refresh
- GHL OAuth tokens expire
- Implement token refresh logic
- Store refresh tokens securely
- Handle refresh failures gracefully

### Security
- Never expose Client Secret in frontend
- Store tokens encrypted in Supabase
- Use HTTPS for all redirect URIs
- Implement CSRF protection

---

## 🐛 TROUBLESHOOTING

### "App Not Found" Error
- Check app is published/active
- Verify Client ID is correct
- Ensure user is logged into GHL

### "Invalid Redirect URI"
- Must exactly match configured URI
- Check for typos or extra slashes
- HTTPS required for production

### "Insufficient Permissions"
- Check approved scopes match your requests
- Some scopes require higher GHL plan
- Reauthorize if scopes changed

### "Location Not Found"
- User selected wrong location
- Location may be deleted/suspended
- Ask user to reconnect with correct location

### "Rate Limited"
- Implement exponential backoff
- Cache frequently accessed data
- Reduce API call frequency

---

## 🚀 NEXT STEPS

Once you provide the credentials:
1. I'll add them to Vercel environment variables
2. Build the OAuth flow in Next.js
3. Handle location selection
4. Create callback handler
5. Store tokens in Supabase
6. Build contact creation logic
7. Build opportunity creation logic
8. Update UI to show connection status
9. Test end-to-end lead sync

---

## ✅ COMPLETION CHECKLIST

Before marking this task complete:
- [ ] OAuth app created in GHL Marketplace
- [ ] Client ID, Client Secret, and SSO Key copied
- [ ] All redirect URIs saved
- [ ] Required scopes approved
- [ ] Test installation completed successfully
- [ ] Consent screen shows correct permissions
- [ ] Screenshots taken of key pages
- [ ] All fields in TASK 11 filled out
- [ ] (Optional) Webhook URL configured

---

## 📚 ADDITIONAL RESOURCES

- **GHL Marketplace:** https://marketplace.gohighlevel.com/
- **API Documentation:** https://highlevel.stoplight.io/
- **OAuth Guide:** https://highlevel.stoplight.io/docs/integrations/docs/oauth/
- **Developer Community:** https://www.facebook.com/groups/highlevelapi
- **Support:** support@gohighlevel.com

---

**Once complete, paste all credentials and confirmations here, and I'll build the GoHighLevel CRM integration! 🚀**
