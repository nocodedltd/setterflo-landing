# 🚀 COMET TASK: Deploy SetterFlo OAuth to Vercel

## 📋 OBJECTIVE

Deploy the complete SetterFlo OAuth implementation to Vercel production, including:
1. Adding all environment variables to Vercel
2. Running Supabase database migration
3. Triggering production deployment
4. Testing all 4 OAuth flows in production

**Estimated Time:** 20-30 minutes

---

## 🎯 TASK BREAKDOWN

### **Task 1: Add Environment Variables to Vercel** (15 min)
### **Task 2: Run Supabase Database Migration** (5 min)
### **Task 3: Deploy and Test** (10 min)

---

## ✅ TASK 1: ADD ENVIRONMENT VARIABLES TO VERCEL

### **Step 1: Navigate to Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Find and click on the `setterflo-landing` project
3. Click on **Settings** (top navigation)
4. Click on **Environment Variables** (left sidebar)

---

### **Step 2: Add Each Environment Variable**

For **EACH** variable below, follow this process:
1. Click **"Add New"** button (top right)
2. Enter the **Key** (variable name)
3. Enter the **Value** (from the list below)
4. Select **ALL THREE** checkboxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

**⚠️ IMPORTANT:** Make sure to select ALL THREE environments for EVERY variable!

---

### **📋 ENVIRONMENT VARIABLES TO ADD:**

Copy these EXACTLY as shown (including the values):

#### **1. Supabase Configuration**

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://tvrhroxelqhhzwbjuzzg.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmhyb3hlbHFoaHp3Ymp1enpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NTc5OTEsImV4cCI6MjA3ODUzMzk5MX0.boQVaVNZwl2Q9smh_PlnM9s4UNylmmzU0IyinjU0gfs
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### **2. App Configuration**

```
Key: NEXT_PUBLIC_APP_URL
Value: https://setterflo-landing.vercel.app
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### **3. OAuth Encryption Key**

**⚠️ GENERATE THIS FIRST!**

Open your terminal and run:
```bash
openssl rand -hex 32
```

This will generate a 64-character random hex string like:
`a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

Then add it to Vercel:

```
Key: OAUTH_ENCRYPTION_KEY
Value: [paste the generated hex string here]
Environments: ✅ Production ✅ Preview ✅ Development
```

**💡 TIP:** Save this value somewhere safe! You'll need it if you ever migrate to a new Vercel project.

---

#### **4. Instagram OAuth Credentials**

```
Key: INSTAGRAM_APP_ID
Value: 25769682339323790
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: INSTAGRAM_APP_SECRET
Value: 9551b995f11f76f680695c088e3517f8
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: INSTAGRAM_WEBHOOK_URL
Value: https://eo1dbmvfpv1tf1g.m.pipedream.net
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: INSTAGRAM_VERIFY_TOKEN
Value: setterflo_verify_token_2024
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### **5. Calendly OAuth Credentials**

```
Key: CALENDLY_CLIENT_ID
Value: C_lxgG8QWiMGkh2QKsdkyLmm2TQUZmiiNKpJYwJa3sQg
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: CALENDLY_CLIENT_SECRET
Value: KwYe7EDeTbU4wxDOyKyF6QNq8owUWOscVGvU2M3MwrI
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### **6. HubSpot OAuth Credentials**

```
Key: HUBSPOT_CLIENT_ID
Value: c53a15a3-2f29-4500-9a04-31c831ee62e6
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: HUBSPOT_CLIENT_SECRET
Value: e4920c2f-43ca-4a85-8161-2bff5b73bcb9
Environments: ✅ Production ✅ Preview ✅ Development
```

---

#### **7. GoHighLevel OAuth Credentials**

```
Key: GOHIGHLEVEL_CLIENT_ID
Value: 6952ea0abe59f009bafd819b-mjrn7c76
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: GOHIGHLEVEL_CLIENT_SECRET
Value: 57ffee58-9ed5-43bd-adac-e1efdb98471c
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Key: GOHIGHLEVEL_SSO_KEY
Value: 46dd4d4f-9e98-4506-ae03-65dc01c0011e
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### **Step 3: Verify All Variables Were Added**

After adding all variables, scroll through the list and verify you see:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NEXT_PUBLIC_APP_URL
- ✅ OAUTH_ENCRYPTION_KEY
- ✅ INSTAGRAM_APP_ID
- ✅ INSTAGRAM_APP_SECRET
- ✅ INSTAGRAM_WEBHOOK_URL
- ✅ INSTAGRAM_VERIFY_TOKEN
- ✅ CALENDLY_CLIENT_ID
- ✅ CALENDLY_CLIENT_SECRET
- ✅ HUBSPOT_CLIENT_ID
- ✅ HUBSPOT_CLIENT_SECRET
- ✅ GOHIGHLEVEL_CLIENT_ID
- ✅ GOHIGHLEVEL_CLIENT_SECRET
- ✅ GOHIGHLEVEL_SSO_KEY

**Total: 15 environment variables**

Each should show "3 environments" in the list.

---

## ✅ TASK 2: RUN SUPABASE DATABASE MIGRATION

### **Step 1: Navigate to Supabase Dashboard**

1. Go to https://supabase.com/dashboard
2. Select your project: `tvrhroxelqhhzwbjuzzg`
3. Click on **SQL Editor** (left sidebar)

---

### **Step 2: Create New Query**

1. Click **"New query"** button (top left)
2. Name it: `OAuth Connections Migration`

---

### **Step 3: Paste Migration SQL**

**IMPORTANT:** Go to your GitHub repository or local files and find:
```
supabase/migrations/20241211_oauth_connections.sql
```

Copy the ENTIRE contents of that file and paste it into the SQL Editor.

**OR** if you don't have access to the file, here's the direct GitHub link:
```
https://github.com/nocodedltd/setterflo-landing/blob/main/supabase/migrations/20241211_oauth_connections.sql
```

Navigate to that URL, click "Raw", and copy all the SQL.

---

### **Step 4: Execute Migration**

1. Review the SQL to ensure it's complete
2. Click **"Run"** button (bottom right, or Cmd/Ctrl + Enter)
3. Wait for execution to complete

---

### **Step 5: Verify Tables Were Created**

1. Go to **Table Editor** (left sidebar)
2. You should see two new tables:
   - ✅ `oauth_connections`
   - ✅ `integration_settings`

3. Click on `oauth_connections` and verify these columns exist:
   - id (uuid)
   - user_id (uuid)
   - platform (text)
   - platform_user_id (text)
   - platform_account_name (text)
   - platform_account_email (text)
   - access_token (text)
   - refresh_token (text)
   - token_expires_at (timestamptz)
   - metadata (jsonb)
   - scopes (text[])
   - status (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

---

### **Step 6: Verify RLS Policies**

1. While viewing `oauth_connections` table
2. Click on **"Policies"** tab
3. You should see 4 policies:
   - ✅ "Users can view their own connections"
   - ✅ "Users can insert their own connections"
   - ✅ "Users can update their own connections"
   - ✅ "Users can delete their own connections"

---

## ✅ TASK 3: DEPLOY AND TEST

### **Step 1: Trigger Vercel Redeploy**

**Option A: Via Vercel Dashboard**
1. Go to Vercel dashboard → `setterflo-landing`
2. Click on **Deployments** (top navigation)
3. Click on the most recent deployment
4. Click **"Redeploy"** button (top right)
5. **UNCHECK** "Use existing Build Cache" (important!)
6. Click **"Redeploy"**
7. Wait for deployment to complete (~2-3 minutes)

**Option B: Via Git Push**
The deployment should auto-trigger since the code was already pushed, but if not:
```bash
# In your local terminal
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

---

### **Step 2: Wait for Deployment**

Monitor the deployment in Vercel dashboard:
1. Watch the build logs
2. Wait for "Deployment Complete" status
3. Note the production URL (should be https://setterflo-landing.vercel.app)

---

### **Step 3: Test OAuth Flows**

**For EACH platform, test the complete flow:**

#### **Test 1: Instagram OAuth**

1. Navigate to: https://setterflo-landing.vercel.app/dashboard/settings
2. Log in if needed
3. Scroll to the "Instagram" section (dedicated tab/card)
4. Click **"Connect Instagram"** button
5. You should be redirected to Meta/Facebook OAuth
6. Select your Facebook Page that's linked to Instagram
7. Click "Continue" / "Authorize"
8. You should be redirected back to Settings page
9. Verify:
   - ✅ Toast notification says "Instagram connected successfully!"
   - ✅ Instagram card shows "Connected" badge
   - ✅ Shows your Instagram username (e.g., "@nocoded.ai")
   - ✅ "Disconnect" button is visible

10. Click **"Disconnect"** button
11. Verify:
    - ✅ Status changes back to "Disconnected"
    - ✅ "Connect Instagram" button reappears

---

#### **Test 2: Calendly OAuth**

1. Scroll to "Calendars" section
2. Find the "Calendly" card
3. Click **"Connect Calendly"** button
4. You should be redirected to Calendly OAuth
5. Log in to your Calendly account
6. Click "Authorize" / "Allow"
7. You should be redirected back to Settings page
8. Verify:
   - ✅ Toast notification says "Calendly connected successfully!"
   - ✅ Calendly card shows "Connected" badge
   - ✅ Shows your Calendly account name
   - ✅ "Disconnect" button is visible

9. Click **"Disconnect"** button
10. Verify status changes back to "Disconnected"

---

#### **Test 3: HubSpot OAuth**

1. Scroll to "CRMs" section
2. Find the "HubSpot" card
3. Click **"Connect HubSpot"** button
4. You should be redirected to HubSpot EU OAuth (app-eu1.hubspot.com)
5. Select your HubSpot portal (if you have multiple)
6. Click "Connect app"
7. You should be redirected back to Settings page
8. Verify:
   - ✅ Toast notification says "HubSpot connected successfully!"
   - ✅ HubSpot card shows "Connected" badge
   - ✅ Shows your HubSpot hub domain/name
   - ✅ "Disconnect" button is visible

9. Click **"Disconnect"** button
10. Verify status changes back to "Disconnected"

---

#### **Test 4: GoHighLevel OAuth**

1. Still in "CRMs" section
2. Find the "GoHighLevel" card
3. Click **"Connect GoHighLevel"** button
4. You should be redirected to GoHighLevel location chooser
5. Select a location from your GHL account
6. Click "Authorize" / "Allow"
7. You should be redirected back to Settings page
8. Verify:
   - ✅ Toast notification says "GoHighLevel connected successfully!"
   - ✅ GoHighLevel card shows "Connected" badge
   - ✅ Shows your GHL location name
   - ✅ "Disconnect" button is visible

9. Click **"Disconnect"** button
10. Verify status changes back to "Disconnected"

---

### **Step 4: Check Browser Console**

Open browser Developer Tools (F12) and check Console:
- ✅ No red errors
- ✅ Look for green checkmark console logs like:
  - "✅ Access token obtained"
  - "✅ Connection saved"
  - etc.

---

### **Step 5: Verify Database Records**

Go back to Supabase dashboard:
1. Click **Table Editor** → `oauth_connections`
2. You should see records for each platform you connected
3. Verify each record has:
   - ✅ user_id (your user ID)
   - ✅ platform (instagram, calendly, hubspot, gohighlevel)
   - ✅ platform_account_name (your account name)
   - ✅ access_token (encrypted - looks like gibberish)
   - ✅ status = "connected"

**Note:** The access_token should NOT be readable - it should look encrypted!

---

## 📝 COMPLETION CHECKLIST

After completing all tasks, verify:

### **Environment Variables:**
- [ ] All 15 environment variables added to Vercel
- [ ] All variables have all 3 environments checked
- [ ] OAUTH_ENCRYPTION_KEY generated and added
- [ ] No typos in variable names or values

### **Database Migration:**
- [ ] Migration SQL executed successfully
- [ ] `oauth_connections` table exists with all columns
- [ ] `integration_settings` table exists
- [ ] RLS policies visible (4 policies for oauth_connections)
- [ ] No SQL errors in execution

### **Deployment:**
- [ ] Vercel deployment completed successfully
- [ ] No build errors in deployment logs
- [ ] Production URL is live (https://setterflo-landing.vercel.app)

### **OAuth Testing:**
- [ ] Instagram OAuth: Connect ✅ → Disconnect ✅
- [ ] Calendly OAuth: Connect ✅ → Disconnect ✅
- [ ] HubSpot OAuth: Connect ✅ → Disconnect ✅
- [ ] GoHighLevel OAuth: Connect ✅ → Disconnect ✅
- [ ] All 4 platforms show correct account names when connected
- [ ] Toast notifications appear for all success/error cases
- [ ] No console errors in browser

### **Database Verification:**
- [ ] Records created in `oauth_connections` table
- [ ] Tokens are encrypted (not readable in database)
- [ ] Status field shows "connected"
- [ ] After disconnect, records deleted or status changed

---

## 🎯 SUCCESS CRITERIA

**The deployment is successful when:**

1. ✅ All environment variables are in Vercel
2. ✅ Database migration completed without errors
3. ✅ Production deployment is live
4. ✅ All 4 OAuth flows work end-to-end
5. ✅ Connections appear in Supabase database
6. ✅ Tokens are encrypted in database
7. ✅ Disconnect removes connections
8. ✅ No errors in browser console
9. ✅ Toast notifications work

---

## 🚨 TROUBLESHOOTING

### **Issue: "OAuth app not configured" error**

**Solution:** Check that environment variables are set correctly:
- Go to Vercel → Settings → Environment Variables
- Verify the CLIENT_ID and CLIENT_SECRET for that platform
- Make sure they're set for "Production" environment
- Redeploy if needed

---

### **Issue: "Security check failed" error**

**Possible causes:**
1. OAUTH_ENCRYPTION_KEY not set or different between environments
2. Cookie not being set (browser blocking cookies)
3. State parameter mismatch (rare)

**Solution:**
- Verify OAUTH_ENCRYPTION_KEY is set in Vercel
- Try in incognito/private browsing mode
- Clear cookies and try again

---

### **Issue: Database error "relation does not exist"**

**Solution:** The migration didn't run properly:
1. Go to Supabase SQL Editor
2. Re-run the migration SQL
3. Check for any error messages
4. Verify tables appear in Table Editor

---

### **Issue: "Unauthorized" or 401 errors**

**Solution:**
1. Make sure you're logged in to SetterFlo
2. Verify Supabase credentials in Vercel env vars
3. Check that RLS policies were created
4. Try logging out and back in

---

## 📸 DOCUMENTATION

**After successful testing, capture these screenshots:**

1. **Vercel Environment Variables page** - showing all 15 variables
2. **Supabase Table Editor** - showing `oauth_connections` table schema
3. **Supabase Table Editor** - showing a connected record in `oauth_connections`
4. **Settings page** - All 4 integrations showing "Connected" status
5. **Browser console** - Showing successful OAuth logs (if any)

Save these screenshots for reference and documentation.

---

## ✅ COMPLETION REPORT

Once you've completed everything, provide a summary:

```
✅ DEPLOYMENT COMPLETE

Environment Variables: [X/15] added to Vercel
Database Migration: [Success/Failed]
Deployment Status: [Live/Failed]

OAuth Testing Results:
- Instagram: [✅ Working / ❌ Failed - reason]
- Calendly: [✅ Working / ❌ Failed - reason]
- HubSpot: [✅ Working / ❌ Failed - reason]
- GoHighLevel: [✅ Working / ❌ Failed - reason]

Database Records: [X] connections created

Issues Encountered: [None / List any issues]

Production URL: https://setterflo-landing.vercel.app

All 4 OAuth platforms are [✅ fully operational / ⚠️ partially working / ❌ not working]
```

---

**Estimated total time: 20-30 minutes**

**When complete, SetterFlo OAuth will be fully deployed and functional in production!** 🚀
