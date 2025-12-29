# Instagram Integration - Quick Start Checklist

Your Pipedream workflow is deployed! Follow these steps to complete the integration.

---

## ✅ COMPLETED:

- [x] Pipedream workflow created and deployed (v39 active)
- [x] Next.js API endpoint created (`/api/pipedream/instagram-dm`)
- [x] Code pushed to GitHub
- [x] Vercel deployment in progress

---

## 📋 TODO: Complete These Steps

### **Step 1: Wait for Vercel Deployment** (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check your `setterflo-landing` project
3. Wait for the latest deployment to finish
4. Verify the API endpoint is live:
   ```
   https://setterflo-landing.vercel.app/api/pipedream/instagram-dm
   ```

**Test it:**
```bash
curl https://setterflo-landing.vercel.app/api/pipedream/instagram-dm
```
Expected: Should return 403 or 405 (means it's working, just needs POST data)

---

### **Step 2: Add Environment Variables to Vercel** (2 minutes)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```env
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024
INSTAGRAM_PAGE_ACCESS_TOKEN=EAAQc8ZBqGDp0BO7qMZBvJkFJ22bm5sTbnE1oU5WFlhxRwY5EYDe4iXEvTGq3QhWyKoRvUC9j0zVRrNi5H8JmK6IVlVJn8Pv5lKW4nNxW1y9C2EBykFdqWBZAZCpV9Wqxj5Xr0G9dWaOYOu1QZCuH7Lx9eqOo3U6EuXZCdZAZAmQ1BPnxDjTsMU3DP7Gr3ZAuNGsZBJPxCXZCMQDMx3FxZAmrLxZBWxsmZAZCy
```

3. Click **Save**
4. Redeploy (Vercel will prompt you, or do it manually)

---

### **Step 3: Create Meta (Facebook) Developer App** (10 minutes)

Follow the detailed guide in `PIPEDREAM_SETUP.md` Section 1, or quick steps:

1. Go to [Meta for Developers](https://developers.facebook.com/apps)
2. Click **"Create App"** → Choose **"Business"**
3. Name: `SetterFlo Instagram Bot`
4. Add **Instagram Product**
5. Add **Webhooks Product**

---

### **Step 4: Configure Instagram Webhooks** (5 minutes)

In your Meta App:

1. Go to **Products → Webhooks**
2. Click **"Configure"** next to Instagram
3. **Callback URL**: 
   ```
   https://eo1dbmvfp1tf1g.m.pipedream.net
   ```
4. **Verify Token**: 
   ```
   setterflo_verify_token_2024
   ```
5. Click **"Verify and Save"**
6. Subscribe to fields:
   - [x] messages
   - [x] messaging_handovers
   - [x] messaging_postbacks

---

### **Step 5: Connect Your Instagram Business Account** (5 minutes)

1. In Meta App Dashboard → **Instagram → Basic Display**
2. Click **"Create New App"**
3. Connect your **Facebook Page** (must be linked to Instagram Business)
4. Click **"Generate Token"**
5. Grant permissions:
   - instagram_basic
   - instagram_manage_messages
   - pages_messaging
   - pages_read_engagement
6. **Copy the Page Access Token** (save it!)

---

### **Step 6: Update Pipedream with Real Access Token** (2 minutes)

1. Go to your [Pipedream workflow](https://pipedream.com/@nocoded/projects/proj_36sGR0n/instagram-dm-handler-p_13CMmnO/inspect)
2. Click on the **HTTP Request step** in the `case_v2wn` branch
3. Find the **Authorization header**
4. Replace the token with your **real Page Access Token** from Step 5
5. Click **"Deploy"**

---

### **Step 7: Test the Integration** (5 minutes)

#### Test 1: Verify Webhook
1. Send a test Instagram DM to your connected account
2. Check Pipedream Event History
3. Should see the webhook payload

#### Test 2: Check API Call
1. In Pipedream Event History, click the execution
2. Check the `custom_request` step
3. Verify it called your Vercel API

#### Test 3: Test AI Response
1. Send a DM: "Hi, I'm interested"
2. Should receive an automated response
3. Check Supabase to see if lead was created

---

## 🔍 **Troubleshooting**

### Webhook Not Receiving
- ✅ Check Meta App webhook is subscribed
- ✅ Verify callback URL matches Pipedream exactly
- ✅ Check Facebook Page is connected to Instagram Business
- ✅ Ensure Instagram messages are enabled

### API Not Responding
- ✅ Check Vercel deployment succeeded
- ✅ Verify environment variables are set
- ✅ Check Vercel logs for errors
- ✅ Test API endpoint directly with curl

### Messages Not Sending
- ✅ Verify Page Access Token is valid
- ✅ Check token has `pages_messaging` permission
- ✅ Ensure recipient ID is correct
- ✅ Review Instagram API rate limits

---

## 📊 **Monitor & Debug**

### Pipedream Logs
- URL: https://pipedream.com/@nocoded/projects/proj_36sGR0n/instagram-dm-handler-p_13CMmnO/inspect
- View: Event History tab
- Shows: All webhook events and step outputs

### Vercel Logs
- URL: https://vercel.com/dashboard
- Go to: Project → Logs
- Filter: `/api/pipedream/instagram-dm`

### Supabase Logs
- Check `ig_users` table for new leads
- Check conversation states
- Verify user associations

---

## 🎯 **Success Criteria**

Your integration is working when:
- ✅ Instagram DMs trigger Pipedream workflow
- ✅ Pipedream calls your Vercel API
- ✅ AI processes the message
- ✅ Response is sent back to Instagram
- ✅ Lead is created in Supabase

---

## 🚀 **Next Phase: Multi-User Setup**

After basic testing works, implement:
1. **User OAuth flow** - Let users connect their own Instagram accounts
2. **Account routing** - Map Instagram account to app user
3. **Calendar integrations** - Add Calendly/Cal.com actions
4. **CRM integrations** - Add HubSpot/Pipedrive actions
5. **AI improvement** - Replace placeholder logic with real AI

See `PIPEDREAM_SETUP.md` for detailed multi-user setup.

---

## 📚 **Reference Documents**

- `PIPEDREAM_SETUP.md` - Complete setup guide
- `COMET_PIPEDREAM_INSTRUCTIONS.md` - Workflow configuration
- `app/api/pipedream/instagram-dm/route.ts` - API endpoint code

---

## ⏱️ **Time Estimate**

- Total setup time: ~30-45 minutes
- Basic testing: ~10 minutes
- Multi-user setup: ~2-3 hours (Phase 2)

---

**You're almost there! Complete Steps 1-7 and you'll have a working Instagram DM automation! 🎉**
