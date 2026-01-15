# 🎯 COMET TASK: Setup OAuth for 4 Additional CRMs

## 📋 OBJECTIVE

Create OAuth applications for 4 additional CRM platforms to complete SetterFlo's integration suite:
1. **Pipedrive** - Sales CRM
2. **ActiveCampaign** - Marketing automation & CRM
3. **Salesforce** - Enterprise CRM
4. **Monday.com** - Work OS & CRM

**Estimated Time:** 60-90 minutes (15-20 min per CRM)

**These can be done in parallel if you open multiple tabs!**

---

## 🎯 OVERVIEW

For each CRM, you'll:
1. Create an OAuth application
2. Configure redirect URIs
3. Select required scopes/permissions
4. Collect Client ID and Secret
5. Test OAuth flow

**All redirect URIs use the pattern:**
```
https://setterflo.io/api/auth/{platform}/callback
```

---

# 📊 TASK 1: PIPEDRIVE OAUTH SETUP

## ✅ STEP 1: ACCESS PIPEDRIVE DEVELOPER HUB

1. Go to https://developers.pipedrive.com/
2. Click **"Sign in"** (top right)
3. Log in with your Pipedrive account
4. Navigate to **"My Apps"** or **"Create an App"**

---

## ✅ STEP 2: CREATE OAUTH APP

### **Basic Information**

1. Click **"Create new app"** or **"New App"**

**App Name:**
```
SetterFlo
```

**App Description:**
```
Instagram DM automation that qualifies leads, books calls, and syncs conversations to Pipedrive deals automatically.
```

**App URL:** (Homepage)
```
https://setterflo.io
```

---

### **OAuth Settings**

**Callback URL / Redirect URI:**
```
https://setterflo.io/api/auth/pipedrive/callback
http://localhost:3000/api/auth/pipedrive/callback
```

**⚠️ IMPORTANT:** Some Pipedrive setups may only accept one redirect URI. If so, use the production URL first, add localhost later for testing.

---

### **Required Scopes**

Select these permissions:

- ✅ **deals** - Read and write deals
- ✅ **contacts** - Read and write contacts (persons/organizations)
- ✅ **activities** - Read and write activities (calls, emails, notes)
- ✅ **notes** - Read and write notes
- ✅ **users** - Read user information

**💡 If there's an option for "All" or "Full access", you can select that instead.**

---

## ✅ STEP 3: COLLECT CREDENTIALS

After creating the app, you'll see:

**Client ID:**
```
Copy and save this
```

**Client Secret:**
```
Click "Show" or "Generate Secret"
Copy and save immediately (shown only once!)
```

---

## ✅ STEP 4: VERIFY CONFIGURATION

**OAuth Endpoints:**
- Authorization URL: `https://oauth.pipedrive.com/oauth/authorize`
- Token URL: `https://oauth.pipedrive.com/oauth/token`
- API Base URL: `https://api.pipedrive.com/v1/`

---

## 📝 CREDENTIALS COLLECTION

```env
# Pipedrive OAuth Credentials
PIPEDRIVE_CLIENT_ID=<paste-client-id-here>
PIPEDRIVE_CLIENT_SECRET=<paste-client-secret-here>
```

---

# 📧 TASK 2: ACTIVECAMPAIGN OAUTH SETUP

## ✅ STEP 1: ACCESS ACTIVECAMPAIGN DEVELOPER

1. Go to https://developers.activecampaign.com/
2. Click **"Sign in"** or **"Get Started"**
3. Log in with your ActiveCampaign account
4. Navigate to **"Apps"** → **"Create an App"**

---

## ✅ STEP 2: CREATE OAUTH APP

### **Basic Information**

**App Name:**
```
SetterFlo
```

**App Description:**
```
Instagram DM automation platform that qualifies leads, schedules appointments, and syncs conversations to ActiveCampaign contacts and deals.
```

**Website URL:**
```
https://setterflo.io
```

**Company Name:**
```
SetterFlo
```

---

### **OAuth Configuration**

**Redirect URI:**
```
https://setterflo.io/api/auth/activecampaign/callback
```

**Additional Redirect URI (for local testing):**
```
http://localhost:3000/api/auth/activecampaign/callback
```

**OAuth Grant Type:**
- Select: **Authorization Code**

---

### **Required Scopes**

ActiveCampaign typically uses broad scopes. Request these:

- ✅ **contacts** - Read and write contacts
- ✅ **deals** - Read and write deals
- ✅ **notes** - Read and write notes
- ✅ **tags** - Read and write tags
- ✅ **account** - Read account information

**💡 Note:** ActiveCampaign may grant full API access by default. If there's no granular scope selection, that's normal.

---

## ✅ STEP 3: COLLECT CREDENTIALS

After app creation:

**Client ID:**
```
Copy and save this
```

**Client Secret:**
```
Copy and save immediately
```

**Account URL:**
```
Your ActiveCampaign account URL (e.g., yourcompany.activehosted.com)
This is important - save it!
```

---

## ✅ STEP 4: VERIFY CONFIGURATION

**OAuth Endpoints:**
- Authorization URL: `https://{account}.activehosted.com/oauth/authorize`
- Token URL: `https://{account}.activehosted.com/oauth/token`
- API Base URL: `https://{account}.api-us1.com/api/3/`

**⚠️ The `{account}` part varies per user!**

---

## 📝 CREDENTIALS COLLECTION

```env
# ActiveCampaign OAuth Credentials
ACTIVECAMPAIGN_CLIENT_ID=<paste-client-id-here>
ACTIVECAMPAIGN_CLIENT_SECRET=<paste-client-secret-here>
ACTIVECAMPAIGN_ACCOUNT_URL=<your-account>.activehosted.com
```

---

# 🏢 TASK 3: SALESFORCE OAUTH SETUP

## ✅ STEP 1: ACCESS SALESFORCE SETUP

1. Log in to your Salesforce account
2. Click the **gear icon** (⚙️) in the top right
3. Select **"Setup"**
4. In the Quick Find box (left sidebar), search for: **"App Manager"**
5. Click **"App Manager"**

---

## ✅ STEP 2: CREATE CONNECTED APP

1. Click **"New Connected App"** (top right)

### **Basic Information**

**Connected App Name:**
```
SetterFlo
```

**API Name:** (auto-fills)
```
SetterFlo
```

**Contact Email:**
```
your-email@example.com
```

**Description:** (optional)
```
Instagram DM automation that qualifies leads and syncs to Salesforce.
```

---

### **API (Enable OAuth Settings)**

1. Check the box: ✅ **"Enable OAuth Settings"**

**Callback URL:**
```
https://setterflo.io/api/auth/salesforce/callback
http://localhost:3000/api/auth/salesforce/callback
```

**⚠️ IMPORTANT:** Add both URLs on separate lines

**Selected OAuth Scopes:**

Move these from "Available OAuth Scopes" to "Selected OAuth Scopes":

- ✅ **Full access (full)** - OR select individual scopes below:
- ✅ **Access and manage your data (api)**
- ✅ **Perform requests on your behalf at any time (refresh_token, offline_access)**
- ✅ **Access your basic information (id, profile, email, address, phone)**

**💡 Recommendation:** Use "Full access (full)" for simplicity, or select the individual scopes above.

**Require Secret for Web Server Flow:**
- ✅ Check this box

**Require Secret for Refresh Token Flow:**
- ✅ Check this box

---

## ✅ STEP 3: SAVE AND RETRIEVE CREDENTIALS

1. Click **"Save"** at the bottom
2. Click **"Continue"** on the warning popup
3. You'll be taken to the Connected App detail page

**Wait 2-10 minutes for the app to be activated!**

### **Get Consumer Key (Client ID)**

1. On the Connected App detail page, find **"Consumer Key"**
2. Click **"Click to reveal"** or copy the visible key
3. Save this as your **Client ID**

### **Get Consumer Secret (Client Secret)**

1. Find **"Consumer Secret"**
2. Click **"Click to reveal"**
3. You may need to verify your identity (email code)
4. Copy and save immediately

---

## ✅ STEP 4: ENABLE API ACCESS (if needed)

If you see errors about API not enabled:

1. Go to **Setup** → **Company Settings** → **Company Information**
2. Note your **Instance URL** (e.g., `https://yourcompany.salesforce.com`)
3. Ensure API calls are enabled in your Salesforce plan

---

## ✅ STEP 5: VERIFY CONFIGURATION

**OAuth Endpoints:**
- Authorization URL: `https://login.salesforce.com/services/oauth2/authorize`
- Token URL: `https://login.salesforce.com/services/oauth2/token`
- API Base URL: `https://yourinstance.salesforce.com/services/data/v59.0/`

**For Sandbox:**
- Replace `login.salesforce.com` with `test.salesforce.com`

---

## 📝 CREDENTIALS COLLECTION

```env
# Salesforce OAuth Credentials
SALESFORCE_CLIENT_ID=<paste-consumer-key-here>
SALESFORCE_CLIENT_SECRET=<paste-consumer-secret-here>
SALESFORCE_INSTANCE_URL=https://yourcompany.salesforce.com
```

---

# 📅 TASK 4: MONDAY.COM OAUTH SETUP

## ✅ STEP 1: ACCESS MONDAY DEVELOPER PLATFORM

1. Go to https://monday.com/developers/apps
2. Or: In Monday.com, click profile → **"Developers"** → **"My Apps"**
3. Click **"Create App"** or **"New App"**

---

## ✅ STEP 2: CREATE OAUTH APP

### **Basic Information**

**App Name:**
```
SetterFlo
```

**App Description:**
```
Instagram DM automation that qualifies leads, books appointments, and syncs conversations to Monday.com boards and deals.
```

**App Icon:** (optional)
- Upload an icon if you have one

**App URL:**
```
https://setterflo.io
```

---

### **OAuth Settings**

**Redirect URLs:**

Add these redirect URIs (click "Add" for each):

```
https://setterflo.io/api/auth/monday/callback
http://localhost:3000/api/auth/monday/callback
```

---

### **Required Scopes**

Select these permissions:

- ✅ **boards:read** - Read boards
- ✅ **boards:write** - Create and update boards/items
- ✅ **users:read** - Read user information
- ✅ **workspaces:read** - Read workspace information
- ✅ **account:read** - Read account information

**💡 Monday.com uses GraphQL API - scopes are board-level, not object-level.**

---

## ✅ STEP 3: PUBLISH APP (Development Mode)

1. You may need to click **"Publish"** or set to **"Development"** mode
2. Development mode allows testing without full app review
3. Keep it in development mode for now

---

## ✅ STEP 4: COLLECT CREDENTIALS

After creating the app:

**Client ID:**
```
Copy from the app settings page
```

**Client Secret:**
```
Click "Show" or "Generate Secret"
Copy and save immediately
```

**Signing Secret:** (if shown)
```
Copy this too - may be needed for webhook verification
```

---

## ✅ STEP 5: VERIFY CONFIGURATION

**OAuth Endpoints:**
- Authorization URL: `https://auth.monday.com/oauth2/authorize`
- Token URL: `https://auth.monday.com/oauth2/token`
- API Base URL: `https://api.monday.com/v2/`

**API Type:** GraphQL (not REST)

---

## 📝 CREDENTIALS COLLECTION

```env
# Monday.com OAuth Credentials
MONDAY_CLIENT_ID=<paste-client-id-here>
MONDAY_CLIENT_SECRET=<paste-client-secret-here>
MONDAY_SIGNING_SECRET=<paste-signing-secret-if-shown>
```

---

# 📋 MASTER CREDENTIALS SHEET

After completing all 4 CRM setups, compile here:

```env
# ===================================
# ADDITIONAL CRM OAUTH CREDENTIALS
# ===================================

# Pipedrive
PIPEDRIVE_CLIENT_ID=
PIPEDRIVE_CLIENT_SECRET=

# ActiveCampaign
ACTIVECAMPAIGN_CLIENT_ID=
ACTIVECAMPAIGN_CLIENT_SECRET=
ACTIVECAMPAIGN_ACCOUNT_URL=

# Salesforce
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_INSTANCE_URL=

# Monday.com
MONDAY_CLIENT_ID=
MONDAY_CLIENT_SECRET=
MONDAY_SIGNING_SECRET=
```

---

# ✅ COMPLETION CHECKLIST

After completing all tasks:

## **Pipedrive:**
- [ ] OAuth app created
- [ ] Redirect URI configured
- [ ] Scopes selected (deals, contacts, activities, notes, users)
- [ ] Client ID collected
- [ ] Client Secret collected

## **ActiveCampaign:**
- [ ] OAuth app created
- [ ] Redirect URIs configured (production + localhost)
- [ ] Scopes selected
- [ ] Client ID collected
- [ ] Client Secret collected
- [ ] Account URL noted

## **Salesforce:**
- [ ] Connected App created
- [ ] OAuth enabled
- [ ] Callback URLs configured
- [ ] Scopes selected
- [ ] Consumer Key (Client ID) collected
- [ ] Consumer Secret (Client Secret) collected
- [ ] Instance URL noted
- [ ] Waited 2-10 minutes for activation

## **Monday.com:**
- [ ] App created
- [ ] Redirect URLs configured
- [ ] Scopes selected (boards, users, workspaces)
- [ ] App set to Development mode
- [ ] Client ID collected
- [ ] Client Secret collected
- [ ] Signing Secret collected (if applicable)

---

# 📊 COMPLETION REPORT

Once all 4 CRMs are configured, provide this summary:

```
✅ ADDITIONAL CRM OAUTH SETUP COMPLETE

Pipedrive:
- Status: [✅ Complete / ⚠️ Partial / ❌ Failed]
- Client ID: [First 12 chars]
- Scopes: deals, contacts, activities, notes, users
- Issues: [None / List any]

ActiveCampaign:
- Status: [✅ Complete / ⚠️ Partial / ❌ Failed]
- Client ID: [First 12 chars]
- Account URL: [your-account].activehosted.com
- Scopes: contacts, deals, notes, tags, account
- Issues: [None / List any]

Salesforce:
- Status: [✅ Complete / ⚠️ Partial / ❌ Failed]
- Consumer Key: [First 12 chars]
- Instance URL: https://[yourcompany].salesforce.com
- Scopes: Full access OR (api, refresh_token, id, profile)
- Activation Wait: [2-10 minutes completed]
- Issues: [None / List any]

Monday.com:
- Status: [✅ Complete / ⚠️ Partial / ❌ Failed]
- Client ID: [First 12 chars]
- App Mode: Development
- Scopes: boards:read, boards:write, users:read, workspaces:read
- Issues: [None / List any]

Total CRMs Configured: [X / 4]
Ready for Integration: [✅ Yes / ⚠️ Partial / ❌ No]

All credentials saved to environment variables: [Yes / No]
```

---

# 🚀 NEXT STEPS AFTER COMPLETION

Once you provide all credentials, the developer will:

1. **Add to Vercel Environment Variables**
2. **Update database schema** to support new platforms
3. **Build OAuth endpoints** for each CRM
4. **Create API integrations** for deal/contact management
5. **Update UI** with new integration cards
6. **Test OAuth flows** for all 4 platforms

---

# 🎯 PRIORITY ORDER

If you can only do one at a time, prioritize:

1. **Pipedrive** (15 min) - Most popular sales CRM
2. **Salesforce** (20-25 min) - Enterprise standard, longer setup
3. **ActiveCampaign** (15 min) - Marketing automation
4. **Monday.com** (15 min) - Work OS alternative

---

# 💡 TIPS & TROUBLESHOOTING

### **General Tips:**
- Open all 4 platforms in separate tabs to work in parallel
- Copy credentials immediately - secrets are often shown only once
- Save credentials to a secure note before pasting into template
- Test each OAuth flow after setup (we'll do this later)

### **Salesforce Specific:**
- **10-minute activation wait** is normal - don't worry!
- If you can't find "App Manager", search "Connected Apps" instead
- Consumer Key = Client ID, Consumer Secret = Client Secret
- Sandbox and Production use different OAuth URLs

### **ActiveCampaign Specific:**
- Your account URL is CRITICAL - save it!
- It's part of the OAuth endpoint (different per user)
- Format: `yourcompany.activehosted.com` or `yourcompany.api-us1.com`

### **Monday.com Specific:**
- Uses GraphQL, not REST (we'll handle this in code)
- "Development" mode is fine for testing
- Signing secret is for webhooks, not OAuth (save it anyway)

---

**Estimated completion time: 60-90 minutes for all 4**

**When complete, SetterFlo will support 9 CRM/Calendar platforms total!** 🎉

## 🎊 FINAL INTEGRATION COUNT

After this task:

**Calendar Integrations (2):**
- ✅ Calendly
- ✅ Cal.com

**CRM Integrations (7):**
- ✅ HubSpot
- ✅ GoHighLevel
- ✅ Pipedrive (NEW)
- ✅ ActiveCampaign (NEW)
- ✅ Salesforce (NEW)
- ✅ Monday.com (NEW)
- ⏳ (Can add more later)

**Social Media (1):**
- ✅ Instagram

**Total: 10 Platform Integrations!** 🚀
