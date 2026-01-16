# 🎯 Phase 3: Instagram DM Handler Foundation - COMPLETE

**Status:** ✅ **FOUNDATION BUILT**  
**Date:** December 11, 2024

---

## 📋 What Was Built

### **1. Database Schema** ✅

**Migration:** `supabase/migrations/20241211_instagram_conversations.sql`

#### **Tables Created:**

**`conversations`**
- Stores conversation threads between SetterFlo users and Instagram leads
- Links to `oauth_connections` to identify which user owns the Instagram account
- Tracks qualification state (new → qualifying → qualified → booked → closed)
- Includes AI control flags (enabled/paused)
- Auto-updates `last_message_at` and `unread_count` via triggers

**`messages`**
- Stores individual messages within conversations
- Tracks sender type: `lead`, `user`, or `ai`
- Supports multiple message types: text, image, video, voice, story_reply, etc.
- Stores AI metadata (model, confidence, tools used)
- Links to Instagram message IDs for deduplication

#### **Features:**
- ✅ Row-Level Security (RLS) policies for multi-tenant isolation
- ✅ Auto-updating timestamps
- ✅ Triggers to update conversation stats on new messages
- ✅ Helper functions for marking messages as read
- ✅ Indexes for performance

---

### **2. Helper Functions** ✅

**File:** `lib/instagram/conversations.ts`

#### **Core Functions:**

**`findUserByInstagramAccount(instagramAccountId)`**
- Identifies which SetterFlo user owns an Instagram account
- Looks up `oauth_connections` by Instagram Business Account ID
- Returns decrypted access token for API calls

**`getOrCreateConversation(...)`**
- Gets existing conversation or creates new one
- Ensures one conversation per user/account/lead combination
- Links to OAuth connection for easy access token retrieval

**`createMessage(...)`**
- Stores incoming or outgoing messages
- Handles media attachments
- Tracks AI-generated messages with metadata

**Additional Functions:**
- `getConversationMessages()` - Fetch messages for a conversation
- `getUserConversations()` - List all conversations for a user
- `updateConversationStatus()` - Archive/close conversations
- `updateConversationQualificationState()` - Update lead qualification
- `markConversationAsRead()` - Mark all messages as read

---

### **3. Instagram DM Webhook Handler** ✅

**File:** `app/api/pipedream/instagram-dm/route.ts`

#### **Flow:**

1. **Receive Webhook** from Pipedream
   - Expects formatted Instagram webhook data
   - Extracts sender ID, recipient ID, message content

2. **User Identification**
   - Uses `findUserByInstagramAccount()` to find SetterFlo user
   - Returns early if Instagram account not connected

3. **Conversation Management**
   - Gets or creates conversation for the lead
   - Links to OAuth connection for future API calls

4. **Message Storage**
   - Stores incoming message with metadata
   - Handles text, images, and other media types
   - Tracks Instagram message IDs for deduplication

5. **AI Processing** (Placeholder)
   - Currently uses simple state machine
   - Returns action instructions: `send_dm`, `book_calendar`, `create_deal`, `none`
   - TODO: Replace with multi-agent AI system

6. **Response**
   - Returns JSON with action, reply text, and metadata
   - Pipedream can use this to execute actions

#### **Response Format:**

```json
{
  "success": true,
  "action": "send_dm" | "book_calendar" | "create_deal" | "none",
  "reply": "Response text to send",
  "metadata": {
    "conversation_id": "uuid",
    "message_id": "uuid",
    "recipient_id": "instagram_user_id",
    "qualification_state": "qualifying",
    "should_book": false,
    "should_create_deal": true,
    "deal_data": { ... },
    "calendar_data": { ... }
  }
}
```

---

## 🔐 Security Features

- ✅ **Row-Level Security (RLS)** - Users can only access their own conversations
- ✅ **Encrypted Tokens** - OAuth tokens stored encrypted in database
- ✅ **User Isolation** - Multi-tenant architecture ensures data separation
- ✅ **Webhook Verification** - GET endpoint for Meta webhook verification

---

## 📊 Database Schema Overview

```
oauth_connections (existing)
  ├── platform: 'instagram'
  ├── platform_user_id: Instagram Business Account ID
  └── access_token: Encrypted token

conversations (NEW)
  ├── user_id → auth.users
  ├── instagram_account_id → oauth_connections.platform_user_id
  ├── instagram_user_id: Lead's Instagram ID
  ├── qualification_state: Lead qualification flow
  └── ai_enabled: AI control flag

messages (NEW)
  ├── conversation_id → conversations
  ├── sender: 'lead' | 'user' | 'ai'
  ├── instagram_message_id: Deduplication
  └── ai_tools_used: JSON array of tools used
```

---

## 🚀 Next Steps

### **Immediate (Phase 3.1):**
1. ✅ Database schema - **DONE**
2. ✅ Helper functions - **DONE**
3. ✅ Webhook handler - **DONE**
4. ⏳ **Test webhook handler** with sample data
5. ⏳ **Apply migration** to Supabase

### **Phase 3.2: Multi-Agent AI System**
1. ⏳ Build AI agent orchestrator
2. ⏳ Implement conversation agent (message analysis)
3. ⏳ Implement data agent (CRM lookups)
4. ⏳ Implement operations agent (CRM updates, calendar booking)
5. ⏳ Add dynamic tool building based on user's connected integrations

### **Phase 3.3: Pipedream Integration**
1. ⏳ Configure Pipedream workflow to forward to Next.js API
2. ⏳ Test end-to-end webhook flow
3. ⏳ Handle webhook retries and errors

### **Phase 4: CRM & Calendar Actions**
1. ⏳ Build CRM integration functions (HubSpot, GHL, Pipedrive, etc.)
2. ⏳ Build calendar integration functions (Calendly, Cal.com)
3. ⏳ Implement deal/contact creation
4. ⏳ Implement calendar link sharing

---

## 🧪 Testing

### **Test Webhook Handler:**

```bash
# Test with sample webhook data
curl -X POST http://localhost:3000/api/pipedream/instagram-dm \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_data": {
      "entry": [{
        "messaging": [{
          "sender": {"id": "123456789"},
          "recipient": {"id": "YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID"},
          "message": {
            "text": "Hello, I'm interested in your services",
            "mid": "msg_123"
          },
          "timestamp": 1702310400
        }]
      }]
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "action": "send_dm",
  "reply": "Hi! Thanks for reaching out...",
  "metadata": {
    "conversation_id": "...",
    "message_id": "...",
    ...
  }
}
```

---

## 📝 Migration Instructions

1. **Apply migration to Supabase:**
   ```bash
   # Using Supabase CLI
   supabase migration up
   
   # Or apply manually in Supabase Dashboard
   # Copy contents of: supabase/migrations/20241211_instagram_conversations.sql
   ```

2. **Verify tables created:**
   - Check `conversations` table exists
   - Check `messages` table exists
   - Verify RLS policies are enabled
   - Test helper functions

3. **Test user identification:**
   - Ensure at least one Instagram OAuth connection exists
   - Test `findUserByInstagramAccount()` with a real Instagram Business Account ID

---

## 🎯 Architecture Decisions

### **Why This Structure?**

1. **Multi-Tenant First**
   - Every query scoped by `user_id`
   - RLS ensures data isolation
   - OAuth connections linked to conversations

2. **Conversation-Centric**
   - One conversation per lead
   - Easy to track qualification state
   - Simple to fetch message history

3. **AI-Ready**
   - Qualification state tracking
   - AI metadata on messages
   - Tool usage tracking for debugging

4. **Scalable**
   - Indexes on all lookup columns
   - Triggers for auto-updates
   - Efficient queries with proper joins

---

## ✅ Completion Checklist

- [x] Database migration created
- [x] Helper functions implemented
- [x] Webhook handler updated
- [x] User identification logic
- [x] Message storage logic
- [x] Conversation management
- [x] RLS policies
- [x] TypeScript types
- [ ] Migration applied to Supabase
- [ ] Webhook handler tested
- [ ] End-to-end flow verified

---

**Foundation is ready! Next: Build the AI agent system.** 🚀
