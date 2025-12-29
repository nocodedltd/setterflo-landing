# 🌐 COMET TASK: Migrate SetterFlo to Custom Domain

## 📋 OBJECTIVE

Migrate SetterFlo from `setterflo-landing.vercel.app` to your custom domain purchased on Spaceship. This includes:
1. Setting up domain on Vercel
2. Updating OAuth callback URLs (5 platforms)
3. Updating environment variables
4. Testing all OAuth flows
5. Creating Privacy Policy & Terms of Service (for Meta app review)

**Estimated Time:** 45-60 minutes

**⚠️ CRITICAL:** This will affect ALL OAuth integrations. We must update redirect URIs everywhere.

---

## 🎯 PLATFORMS REQUIRING URL UPDATES

| Platform | OAuth Settings Location | URLs to Update |
|----------|------------------------|----------------|
| **Instagram** | Meta Developer Console | Redirect URI, App Domains |
| **Calendly** | Calendly Developer Portal | Redirect URI |
| **Cal.com** | Cal.com OAuth Settings | Redirect URI |
| **HubSpot** | HubSpot App Settings | Redirect URI |
| **GoHighLevel** | GHL App Settings | Redirect URI |
| **Vercel** | Vercel Project Settings | Domain, Env Vars |

---

## 📝 PREREQUISITES

**Before starting, you need:**
- [ ] Custom domain purchased on Spaceship
- [ ] Domain name ready (e.g., `setterflo.com` or `app.setterflo.com`)
- [ ] Access to Spaceship DNS settings
- [ ] Access to all OAuth platform developer consoles

**❓ What is your custom domain?**
```
Domain: _______________________
```

**💡 For this guide, I'll use `setterflo.com` as example. Replace with your actual domain!**

---

## ✅ STEP 1: CONFIGURE DOMAIN ON VERCEL

### **1.1: Navigate to Vercel Project Settings**

1. Go to https://vercel.com/dashboard
2. Click on **`setterflo-landing`** project
3. Click **"Settings"** (top navigation)
4. Click **"Domains"** (left sidebar)

---

### **1.2: Add Custom Domain**

1. In the "Domains" section, find the "Add" input field
2. Enter your domain: `setterflo.com` (or `app.setterflo.com`)
3. Click **"Add"**

**💡 Tip:** 
- Use root domain (`setterflo.com`) for main app
- OR use subdomain (`app.setterflo.com`) if you want separate landing page
- Recommend: `setterflo.com` for simplicity

---

### **1.3: Configure DNS Records**

After adding the domain, Vercel will show required DNS records:

**For Root Domain (`setterflo.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**OR**

**For Subdomain (`app.setterflo.com`):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Copy these DNS records** - you'll need them in Step 2!

---

## ✅ STEP 2: UPDATE DNS ON SPACESHIP

### **2.1: Navigate to Spaceship DNS Settings**

1. Go to https://www.spaceship.com/
2. Log in to your account
3. Click **"Domains"** (top menu)
4. Find your domain (e.g., `setterflo.com`)
5. Click **"Manage"** or the domain name
6. Click **"DNS"** or **"DNS Settings"**

---

### **2.2: Add DNS Records from Vercel**

**For Root Domain (`setterflo.com`):**

1. Click **"Add Record"**
2. **Type:** Select **"A"**
3. **Name:** Enter **"@"** (or leave blank)
4. **Value:** Enter **"76.76.21.21"** (from Vercel)
5. **TTL:** 3600 (or Auto)
6. Click **"Save"** or **"Add Record"**

**For Subdomain (`app.setterflo.com`):**

1. Click **"Add Record"**
2. **Type:** Select **"CNAME"**
3. **Name:** Enter **"app"**
4. **Value:** Enter **"cname.vercel-dns.com"** (from Vercel)
5. **TTL:** 3600 (or Auto)
6. Click **"Save"** or **"Add Record"**

---

### **2.3: Wait for DNS Propagation**

1. DNS changes can take 5 minutes to 48 hours (usually 10-30 minutes)
2. Go back to Vercel → Settings → Domains
3. Wait for the domain to show **"Valid Configuration"** ✅
4. You may see "Invalid Configuration" initially - this is normal!

**💡 Check DNS propagation:**
- Use: https://dnschecker.org
- Enter your domain
- Wait until A or CNAME records show globally

---

## ✅ STEP 3: UPDATE ENVIRONMENT VARIABLES IN VERCEL

Once domain is verified, update environment variables:

### **3.1: Navigate to Environment Variables**

1. Still in Vercel project settings
2. Click **"Environment Variables"** (left sidebar)

---

### **3.2: Update NEXT_PUBLIC_APP_URL**

1. Find **`NEXT_PUBLIC_APP_URL`** in the list
2. Click the **"⋮"** (three dots) next to it
3. Click **"Edit"**
4. Change value to: `https://setterflo.com` (or your domain)
5. Make sure it's set for **Production**, **Preview**, and **Development**
6. Click **"Save"**

**⚠️ IMPORTANT:**
- Include `https://`
- NO trailing slash
- Use your actual domain

---

### **3.3: Trigger Redeploy**

1. Go to **"Deployments"** tab
2. Click on the most recent deployment
3. Click **"⋮"** (three dots)
4. Click **"Redeploy"**
5. **UNCHECK** "Use existing Build Cache"
6. Click **"Redeploy"**

Wait for deployment to complete (~2-3 minutes)

---

## ✅ STEP 4: UPDATE INSTAGRAM (META DEVELOPER)

### **4.1: Navigate to Meta Developer Console**

1. Go to https://developers.facebook.com/apps
2. Click on **"SetterFlo"** app (App ID: 25769682339323790)

---

### **4.2: Update App Domains**

1. Click **"Settings"** → **"Basic"** (left sidebar)
2. Find **"App Domains"** field
3. **Replace** `setterflo-landing.vercel.app` with your domain
4. Enter: `setterflo.com` (your domain, NO `https://`, NO `/`)
5. Press Enter to add it
6. **Scroll to bottom** and click **"Save Changes"**

---

### **4.3: Update OAuth Redirect URIs**

1. Click **"Facebook Login"** (left sidebar, under Products)
2. Click **"Settings"**
3. Find **"Valid OAuth Redirect URIs"** field
4. You should see:
   ```
   https://setterflo-landing.vercel.app/api/auth/instagram/callback
   http://localhost:3000/api/auth/instagram/callback
   ```

5. **Add** your new domain redirect URI:
   ```
   https://setterflo.com/api/auth/instagram/callback
   ```

6. Keep the localhost one for testing
7. **Keep or remove** the Vercel one (I recommend keeping both during transition)
8. Final list should be:
   ```
   https://setterflo.com/api/auth/instagram/callback
   https://setterflo-landing.vercel.app/api/auth/instagram/callback
   http://localhost:3000/api/auth/instagram/callback
   ```

9. Click **"Save Changes"**

---

## ✅ STEP 5: UPDATE CALENDLY OAUTH

### **5.1: Navigate to Calendly Developer Portal**

1. Go to https://developer.calendly.com
2. Log in with your Calendly account
3. Navigate to **"My Apps"** or **"Applications"**
4. Find **"SetterFlo"** app
5. Click on it to edit

---

### **5.2: Update Redirect URI**

1. Find **"Redirect URIs"** or **"OAuth Redirect URIs"** section
2. You should see: `https://setterflo-landing.vercel.app/api/auth/calendly/callback`
3. **Add** your new domain redirect URI:
   ```
   https://setterflo.com/api/auth/calendly/callback
   ```

4. Final list should include:
   ```
   https://setterflo.com/api/auth/calendly/callback
   https://setterflo-landing.vercel.app/api/auth/calendly/callback (optional, for transition)
   http://localhost:3000/api/auth/calendly/callback
   ```

5. Click **"Save"** or **"Update Application"**

---

## ✅ STEP 6: UPDATE CAL.COM OAUTH

### **6.1: Navigate to Cal.com OAuth Settings**

1. Go to https://app.cal.com (or your self-hosted instance)
2. Log in to your account
3. Go to **Settings** → **Developer** → **OAuth Clients**
4. Find **"SetterFlo"** OAuth app
5. Click **"Edit"** or click on the app name

---

### **6.2: Update Redirect URI**

1. Find **"Redirect URIs"** field
2. You should see: `https://setterflo-landing.vercel.app/api/auth/calcom/callback`
3. **Add** your new domain redirect URI:
   ```
   https://setterflo.com/api/auth/calcom/callback
   ```

4. Final list should include:
   ```
   https://setterflo.com/api/auth/calcom/callback
   https://setterflo-landing.vercel.app/api/auth/calcom/callback (optional)
   http://localhost:3000/api/auth/calcom/callback
   ```

5. Click **"Save"** or **"Update"**

---

## ✅ STEP 7: UPDATE HUBSPOT OAUTH

### **7.1: Navigate to HubSpot Developer Portal**

1. Go to https://app-eu1.hubspot.com/developer/147502988 (your portal)
2. Or go to https://developers.hubspot.com/
3. Log in
4. Find **"SetterFlo"** app (App ID: 27414494)
5. Click on it to edit

---

### **7.2: Update Redirect URI**

1. Find **"Auth"** or **"Redirect URLs"** section
2. You should see: `https://setterflo-landing.vercel.app/api/auth/hubspot/callback`
3. **Add** your new domain redirect URI:
   ```
   https://setterflo.com/api/auth/hubspot/callback
   ```

4. Final list should include:
   ```
   https://setterflo.com/api/auth/hubspot/callback
   https://setterflo-landing.vercel.app/api/auth/hubspot/callback (optional)
   http://localhost:3000/api/auth/hubspot/callback
   ```

5. Click **"Save"** or **"Update"**

---

## ✅ STEP 8: UPDATE GOHIGHLEVEL OAUTH

### **8.1: Navigate to GoHighLevel Marketplace**

1. Go to https://marketplace.gohighlevel.com/
2. Log in to your account
3. Navigate to **"My Apps"** or **"App Management"**
4. Find **"SetterFlo"** app (App ID: 6952ea0abe59f009bafd819b)
5. Click **"Edit"** or click on the app

---

### **8.2: Update Redirect URI**

1. Find **"Redirect URIs"** or **"OAuth Settings"** section
2. You should see: `https://setterflo-landing.vercel.app/api/auth/crm/callback`
3. **Add** your new domain redirect URI:
   ```
   https://setterflo.com/api/auth/crm/callback
   ```

**⚠️ REMEMBER:** GoHighLevel uses `/crm/callback` (not `/gohighlevel/callback`) for white-label compliance!

4. Final list should include:
   ```
   https://setterflo.com/api/auth/crm/callback
   https://setterflo-landing.vercel.app/api/auth/crm/callback (optional)
   http://localhost:3000/api/auth/crm/callback
   ```

5. Click **"Save"** or **"Update App"**

---

## ✅ STEP 9: CREATE PRIVACY POLICY & TERMS OF SERVICE

**Required for Meta App Review** (to go Live with Instagram OAuth)

### **9.1: Create Privacy Policy Page**

**Option A: Use Generator (Quick)**

1. Go to https://www.termsfeed.com/privacy-policy-generator/
2. Or https://www.freeprivacypolicy.com/free-privacy-policy-generator/
3. Fill in:
   - Company: NoCoded / SetterFlo
   - Website: `https://setterflo.com`
   - App Name: SetterFlo
   - Type: Web Application + Mobile App
4. Answer questions about:
   - What data you collect (Instagram messages, contact info, calendar data)
   - How you use it (lead qualification, scheduling)
   - Third parties (Meta, Calendly, Cal.com, HubSpot, GoHighLevel)
5. Generate and download

---

**Option B: Create Manual Page**

Create a page at `https://setterflo.com/privacy` with these sections:

```markdown
# Privacy Policy for SetterFlo

Last updated: [DATE]

## Information We Collect
- Instagram messages and DM conversations
- Contact information (name, email, phone)
- Calendar availability and booking data
- CRM data synced from your platforms

## How We Use Information
- Automate Instagram DM responses
- Qualify leads
- Schedule appointments
- Sync data to your CRM

## Third-Party Services
- Meta/Facebook (Instagram integration)
- Calendly/Cal.com (scheduling)
- HubSpot/GoHighLevel (CRM)
- OpenAI (AI processing)

## Data Security
- All OAuth tokens encrypted at rest
- AES-256-GCM encryption
- Row-level security in database

## Your Rights
- Access your data
- Delete your data
- Export your data

## Contact
- Email: support@setterflo.com
```

---

### **9.2: Create Terms of Service Page**

Create a page at `https://setterflo.com/terms` with:

```markdown
# Terms of Service for SetterFlo

Last updated: [DATE]

## Acceptance of Terms
By using SetterFlo, you agree to these terms.

## Service Description
SetterFlo automates Instagram DM responses, qualifies leads, and syncs with your calendar and CRM.

## User Obligations
- You must own the Instagram Business Account
- You must have rights to use connected platforms
- You must comply with Instagram, Calendly, and CRM terms

## Limitation of Liability
SetterFlo is provided "as is" without warranties.

## Termination
We may terminate service for violations.

## Changes to Terms
We may update terms with notice.

## Contact
- Email: support@setterflo.com
```

---

### **9.3: Add Privacy & Terms Links to Meta App**

1. Go back to Meta Developer Console
2. **Settings** → **Basic**
3. Find **"Privacy Policy URL"** field
4. Enter: `https://setterflo.com/privacy`
5. Find **"Terms of Service URL"** field (optional but recommended)
6. Enter: `https://setterflo.com/terms`
7. **Scroll to bottom** and click **"Save Changes"**

---

## ✅ STEP 10: TEST ALL OAUTH FLOWS

**After domain is live and all updates are complete:**

### **10.1: Test Instagram OAuth**

1. Go to `https://setterflo.com/dashboard/settings` (your new domain!)
2. If already connected, disconnect first
3. Click **"Connect Instagram"**
4. Should redirect to Meta OAuth
5. Authorize
6. Should redirect back to `https://setterflo.com/dashboard/settings?oauth_success=...`
7. Verify "Connected" status appears

---

### **10.2: Test Calendly OAuth**

1. In Settings, find Calendly card
2. Click **"Connect Calendly"**
3. Authorize on Calendly
4. Should redirect back to your domain
5. Verify "Connected" status

---

### **10.3: Test Cal.com OAuth**

1. Find Cal.com card
2. Click **"Connect Cal.com"**
3. Authorize on Cal.com
4. Should redirect back successfully
5. Verify "Connected" status

---

### **10.4: Test HubSpot OAuth**

1. Find HubSpot card in CRMs section
2. Click **"Connect HubSpot"**
3. Select HubSpot portal
4. Authorize
5. Should redirect back successfully
6. Verify "Connected" status

---

### **10.5: Test GoHighLevel OAuth**

1. Find GoHighLevel card
2. Click **"Connect GoHighLevel"**
3. Select location
4. Authorize
5. Should redirect back successfully
6. Verify "Connected" status

---

## ✅ STEP 11: SUBMIT META APP FOR REVIEW (Optional)

**If you want to go Live with Instagram OAuth:**

1. Go to Meta Developer Console → **App Review**
2. Click **"Permissions and Features"**
3. For each required permission, click **"Request"**:
   - instagram_basic
   - instagram_manage_messages
   - pages_messaging
   - pages_read_engagement
   - pages_manage_metadata

4. Fill out questionnaire for each:
   - Explain how you use the permission
   - Provide video demo or screenshots
   - Show the feature in action

5. Submit for review
6. Wait 1-7 days for approval

**💡 For now, you can test in Development mode with your own account!**

---

## 📋 MIGRATION CHECKLIST

After completing all steps:

**Domain Setup:**
- [ ] Custom domain added to Vercel
- [ ] DNS records configured on Spaceship
- [ ] DNS propagated and verified (✅ in Vercel)
- [ ] Domain is live and accessible

**Environment Variables:**
- [ ] `NEXT_PUBLIC_APP_URL` updated to new domain
- [ ] Vercel redeployed with new env vars

**OAuth Redirect URIs Updated:**
- [ ] Instagram - App Domains updated
- [ ] Instagram - Facebook Login redirect URI added
- [ ] Calendly - Redirect URI added
- [ ] Cal.com - Redirect URI added (if setup)
- [ ] HubSpot - Redirect URI added
- [ ] GoHighLevel - Redirect URI added

**Legal Pages:**
- [ ] Privacy Policy created at `/privacy`
- [ ] Terms of Service created at `/terms`
- [ ] Privacy Policy URL added to Meta app
- [ ] Terms of Service URL added to Meta app (optional)

**Testing:**
- [ ] Instagram OAuth tested ✅
- [ ] Calendly OAuth tested ✅
- [ ] Cal.com OAuth tested ✅ (if setup)
- [ ] HubSpot OAuth tested ✅
- [ ] GoHighLevel OAuth tested ✅
- [ ] All connections show "Connected" status

**Optional:**
- [ ] Meta App Review submitted (for Live mode)
- [ ] Old Vercel domain redirect configured (if needed)

---

## 🎯 COMPLETION REPORT

Once everything is complete, provide this summary:

```
✅ DOMAIN MIGRATION COMPLETE

New Domain: setterflo.com
Status: ✅ Live and working

DNS Configuration:
- DNS Provider: Spaceship
- Records Added: [A / CNAME]
- Propagation: ✅ Complete
- Time taken: [___ minutes]

OAuth Redirect URIs Updated:
- Instagram: ✅ Updated
- Calendly: ✅ Updated
- Cal.com: [✅ Updated / ⚠️ Not setup yet]
- HubSpot: ✅ Updated
- GoHighLevel: ✅ Updated

Testing Results:
- Instagram OAuth: [✅ Working / ❌ Issue: ___]
- Calendly OAuth: [✅ Working / ❌ Issue: ___]
- Cal.com OAuth: [✅ Working / ⚠️ Not setup / ❌ Issue: ___]
- HubSpot OAuth: [✅ Working / ❌ Issue: ___]
- GoHighLevel OAuth: [✅ Working / ❌ Issue: ___]

Legal Pages:
- Privacy Policy: [✅ Created at /privacy / ⚠️ Pending]
- Terms of Service: [✅ Created at /terms / ⚠️ Pending]

Meta App Status:
- App Mode: [Development / ⚠️ Submitted for review / ✅ Live]

Issues Encountered: [None / List any issues]

Migration Complete: [✅ Yes / ⚠️ Partial / ❌ Issues]
```

---

## 🚨 TROUBLESHOOTING

### **Issue: Domain not verifying on Vercel**

**Fix:**
- Wait longer (DNS propagation can take 48 hours)
- Check DNS records are correct
- Try removing and re-adding domain
- Check if domain is already used elsewhere

---

### **Issue: "Redirect URI Mismatch" after OAuth**

**Fix:**
- Ensure redirect URI in OAuth platform matches EXACTLY
- Check for typos
- Verify `https://` vs `http://`
- No trailing slashes
- Check path is correct (`/api/auth/{platform}/callback`)

---

### **Issue: Environment variable not updating**

**Fix:**
- Clear Vercel build cache
- Redeploy without cache
- Wait 5 minutes after env var update
- Check env var is set for correct environment (Production)

---

### **Issue: Old domain still being used**

**Fix:**
- Hard refresh browser (Cmd/Ctrl + Shift + R)
- Clear browser cache
- Check `NEXT_PUBLIC_APP_URL` in Vercel
- Verify deployment used new env var

---

## 🎉 SUCCESS!

**When migration is complete:**
- ✅ Custom domain is live
- ✅ All OAuth flows work on new domain
- ✅ Privacy & Terms pages created
- ✅ Ready for Meta app review
- ✅ Ready for Phase 3 development

---

**Estimated total time: 45-60 minutes**

**After completion, SetterFlo will be fully migrated to your custom domain and ready for production!** 🚀

---

## 📝 NOTES FOR DEVELOPER

**After Comet completes this:**
- Run Supabase migration if not already done
- Test all OAuth flows thoroughly
- Monitor for any errors
- Consider keeping old Vercel domain as redirect (optional)
- Update any documentation with new domain
