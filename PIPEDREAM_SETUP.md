# Pipedream + Instagram Integration Setup Guide

This guide walks through connecting your Next.js app with Pipedream for Instagram DM automation.

## 🏗️ Architecture Overview

```
Instagram DM Received
    ↓
Meta/Facebook Webhook
    ↓
Pipedream Workflow (Instagram DM Handler)
    ↓
Your Next.js API (/api/pipedream/instagram-dm)
    ↓
AI Processing (Vercel AI SDK)
    ↓
Return Action to Pipedream
    ↓
Pipedream Executes Action:
  - Send Instagram DM
  - Book Calendar
  - Create CRM Deal
```

## 📋 Prerequisites

- [ ] Meta Developer Account
- [ ] Instagram Business Account
- [ ] Facebook Page (connected to Instagram)
- [ ] Pipedream Account (Free tier is fine to start)
- [ ] Your Next.js app deployed to Vercel

---

## 🚀 Step 1: Configure Meta App for Instagram

### 1.1 Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as app type
4. Fill in app details:
   - **App Name**: SetterFlo Instagram Bot
   - **App Contact Email**: your-email@example.com
   - **Business Account**: Select or create one

### 1.2 Add Instagram Product

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram"** and click **"Set Up"**
3. In the left sidebar, go to **Instagram → Basic Display**
4. Add **Instagram Graph API** access

### 1.3 Configure Webhooks

1. In left sidebar: **Products → Webhooks**
2. Click **"Configure"** next to Instagram
3. Subscribe to webhook fields:
   - ✅ `messages`
   - ✅ `messaging_handovers`
   - ✅ `messaging_postbacks`
4. Add Callback URL:
   ```
   https://eo1dbmvfpv1tf1g.m.pipedream.net
   ```
   *(Use your actual Pipedream webhook URL from Step 2)*
5. Add Verify Token:
   ```
   setterflo_verify_token_2024
   ```
6. Click **"Verify and Save"**

### 1.4 Get Access Token

1. Go to **Instagram → Basic Display**
2. Click **"Generate Token"**
3. Select your Facebook Page
4. Grant permissions:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `pages_messaging`
   - `pages_read_engagement`
5. Copy the **Page Access Token** (save this securely!)

---

## 🔧 Step 2: Configure Pipedream Workflow

### 2.1 Update the Trigger

Your current workflow has an HTTP trigger. Here's what to do:

**Option A: Keep HTTP Trigger (Recommended)**
1. Your trigger URL is: `https://eo1dbmvfpv1tf1g.m.pipedream.net`
2. Use this URL in Meta Webhooks (already done above)
3. The trigger receives Instagram webhook payloads

**Option B: Use Instagram Trigger (If Available)**
1. Click on the `trigger` step
2. Search for "Instagram" in apps
3. Select **"Instagram Business"**
4. Choose trigger: **"New Direct Message"**
5. Connect your Instagram account via OAuth

### 2.2 Update the HTTP Request Step

1. Click on `custom_request` step
2. Update the **URL** to:
   ```
   https://setterflo-landing.vercel.app/api/pipedream/instagram-dm
   ```
3. Method: **POST**
4. Body: Leave as is (it's already configured correctly)

### 2.3 Add Action to `send_dm` Branch

1. Click the **+** button under `case_v2wn` (send_dm)
2. Search for **"HTTP Request"** or **"Instagram Business"**
3. Configure:
   - **Method**: POST
   - **URL**: `https://graph.facebook.com/v18.0/me/messages`
   - **Headers**:
     ```json
     {
       "Authorization": "Bearer YOUR_PAGE_ACCESS_TOKEN"
     }
     ```
   - **Body**:
     ```json
     {
       "recipient": {
         "id": "{{steps.custom_request.$return_value.metadata.recipient_id}}"
       },
       "message": {
         "text": "{{steps.custom_request.$return_value.reply}}"
       }
     }
     ```

### 2.4 Add Action to `book_calendar` Branch

1. Click the **+** button under `case_z8mc` (book_calendar)
2. Search for your calendar app:
   - **Calendly**: Add "Calendly" app → "Create Invitee"
   - **Cal.com**: Add "HTTP Request" → POST to Cal.com API
   - **Google Calendar**: Add "Google Calendar" → "Create Event"

**Example for Calendly:**
```javascript
// Calendly Action Configuration
{
  "event_type_uuid": "YOUR_EVENT_TYPE_UUID",
  "email": "{{steps.custom_request.$return_value.metadata.calendar_data.email}}",
  "name": "{{steps.custom_request.$return_value.metadata.calendar_data.name}}"
}
```

### 2.5 Add Action to `create_deal` Branch

1. Click the **+** button under `case_r0JS` (create_deal)
2. Search for your CRM:
   - **HubSpot**: Add "HubSpot" → "Create Deal"
   - **Pipedrive**: Add "Pipedrive" → "Create Deal"
   - **ActiveCampaign**: Add "ActiveCampaign" → "Create Deal"

**Example for HubSpot:**
```javascript
// HubSpot Action Configuration
{
  "properties": {
    "dealname": "{{steps.custom_request.$return_value.metadata.deal_data.name}}",
    "dealstage": "appointmentscheduled",
    "amount": "5000",
    "pipeline": "default"
  }
}
```

---

## 🔐 Step 3: Add Environment Variables

Add to your `.env.local`:

```bash
# Instagram Webhook Verification
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024

# Instagram API
INSTAGRAM_PAGE_ACCESS_TOKEN=your_page_access_token_here

# Pipedream
PIPEDREAM_WEBHOOK_URL=https://eo1dbmvfpv1tf1g.m.pipedream.net
```

---

## 🧪 Step 4: Test the Integration

### 4.1 Test Webhook Connection

1. In Pipedream, click **"Test"** button
2. Send a test Instagram DM to your connected account
3. Check the Pipedream logs to see the payload

### 4.2 Test AI Response

1. Send a DM: "Hi, I'm interested in learning more"
2. Check Pipedream logs for the HTTP request to your Next.js API
3. Verify the response is sent back to Instagram

### 4.3 Test Calendar Booking

1. Send a DM: "I'd like to book a call"
2. Provide email when asked
3. Check if calendar invite is sent

---

## 📊 Monitoring & Debugging

### View Logs in Pipedream

1. Go to your workflow
2. Click **"Event History"**
3. Click on any execution to see:
   - Input data
   - Each step's output
   - Any errors

### View Logs in Vercel

1. Go to Vercel Dashboard
2. Click on your project → **Logs**
3. Filter by `/api/pipedream/instagram-dm`

---

## 🔄 Multi-User Setup

For each user who connects Instagram:

1. **User OAuth Flow**:
   ```typescript
   // Redirect user to Pipedream OAuth
   https://api.pipedream.com/v1/connect/instagram?user_id={userId}
   ```

2. **Store Connection**:
   ```sql
   UPDATE users 
   SET instagram_account_id = 'instagram_user_id',
       instagram_connected_at = NOW()
   WHERE id = 'user_id';
   ```

3. **Route Webhooks**:
   - Pipedream receives webhook
   - Calls your API with Instagram account ID
   - Your API looks up which user owns this account
   - Process message with that user's AI settings

---

## 💡 Next Steps

- [ ] Deploy Next.js API to Vercel
- [ ] Add Instagram verify token to environment variables
- [ ] Complete Pipedream workflow actions
- [ ] Test with real Instagram DMs
- [ ] Add user onboarding flow for Instagram connection
- [ ] Implement AI conversation logic (currently placeholder)
- [ ] Add calendar and CRM integrations
- [ ] Set up monitoring and error alerts

---

## 🆘 Troubleshooting

### Webhook Not Receiving Messages

1. Check Meta App webhook subscription is active
2. Verify callback URL matches Pipedream trigger URL
3. Check Instagram account has messages enabled
4. Ensure Facebook Page is connected to Instagram Business account

### AI Not Responding

1. Check Pipedream logs for HTTP request errors
2. Verify Next.js API URL is correct
3. Check Vercel logs for your API endpoint
4. Test API endpoint directly with curl/Postman

### Messages Not Sending

1. Check Page Access Token is valid and not expired
2. Verify token has `pages_messaging` permission
3. Check recipient ID is correct in API call
4. Review Instagram API rate limits

---

## 📚 Resources

- [Meta Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Pipedream Documentation](https://pipedream.com/docs)
- [Instagram Messaging Guide](https://developers.facebook.com/docs/messenger-platform/instagram)
- [Webhook Setup Guide](https://developers.facebook.com/docs/graph-api/webhooks)

