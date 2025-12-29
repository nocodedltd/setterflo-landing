# Phase 2 Backend Implementation Plan

**Status:** Ready to start while Comet configures OAuth apps  
**Timeline:** Can start immediately, will complete in 6-8 hours  
**Goal:** Build complete OAuth infrastructure before Comet finishes

---

## 🎯 PARALLEL WORK STRATEGY

**While Comet is working (1 hour):**
- You: Run 4 Comet tabs for OAuth app setup
- Me: Build database schema + OAuth handlers

**After Comet completes:**
- You: Provide credentials
- Me: Add to Vercel, test end-to-end
- Together: Verify each integration works

**Total Timeline:** 1-2 days for complete OAuth infrastructure

---

## 📋 WHAT I'LL BUILD (My Side)

### **Part 1: Database Schema (30 minutes)**

#### **1.1: OAuth Connections Table**
Create Supabase table to store user OAuth tokens:

```sql
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'instagram', 'calendly', 'gohighlevel', 'hubspot'
  platform_user_id TEXT, -- Their user ID on the platform
  platform_account_name TEXT, -- Display name (e.g., '@nocoded.ai', 'john@company.com')
  
  -- OAuth Tokens (encrypted)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Platform-specific metadata
  metadata JSONB DEFAULT '{}', -- Store platform-specific data
  scopes TEXT[], -- Approved scopes
  
  -- Status tracking
  status TEXT DEFAULT 'connected', -- 'connected', 'disconnected', 'error', 'expired'
  last_synced_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one connection per user per platform (unless multi-account)
  UNIQUE(user_id, platform, platform_user_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_oauth_connections_user_id ON oauth_connections(user_id);
CREATE INDEX idx_oauth_connections_platform ON oauth_connections(platform);
CREATE INDEX idx_oauth_connections_status ON oauth_connections(status);

-- RLS Policies
ALTER TABLE oauth_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections"
  ON oauth_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections"
  ON oauth_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
  ON oauth_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
  ON oauth_connections FOR DELETE
  USING (auth.uid() = user_id);
```

#### **1.2: Integration Settings Table**
Store user preferences for each integration:

```sql
CREATE TABLE integration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  
  -- Settings (platform-specific)
  settings JSONB DEFAULT '{}',
  -- Example for Calendly: {"default_event_type_id": "xxx", "auto_share": true}
  -- Example for GHL: {"default_pipeline_id": "xxx", "default_stage_id": "xxx"}
  
  is_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, platform)
);

CREATE INDEX idx_integration_settings_user_id ON integration_settings(user_id);

ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
  ON integration_settings FOR ALL
  USING (auth.uid() = user_id);
```

---

### **Part 2: OAuth API Routes (2-3 hours)**

#### **2.1: Instagram OAuth**

**File:** `app/api/auth/instagram/connect/route.ts`
```typescript
// Initiate OAuth flow
export async function GET(request: Request) {
  // 1. Get current user
  // 2. Build authorization URL with state parameter (CSRF protection)
  // 3. Redirect to Meta OAuth consent screen
}
```

**File:** `app/api/auth/instagram/callback/route.ts`
```typescript
// Handle OAuth callback
export async function GET(request: Request) {
  // 1. Verify state parameter (CSRF)
  // 2. Exchange code for access_token
  // 3. Get user's Instagram account info
  // 4. Store tokens in Supabase (encrypted)
  // 5. Redirect to settings page with success message
}
```

**File:** `app/api/auth/instagram/disconnect/route.ts`
```typescript
// Disconnect Instagram
export async function POST(request: Request) {
  // 1. Get current user
  // 2. Delete connection from database
  // 3. (Optional) Revoke token with Meta
  // 4. Return success
}
```

#### **2.2: Calendly OAuth** (Same pattern)
- `app/api/auth/calendly/connect/route.ts`
- `app/api/auth/calendly/callback/route.ts`
- `app/api/auth/calendly/disconnect/route.ts`

#### **2.3: GoHighLevel OAuth** (Same pattern)
- `app/api/auth/gohighlevel/connect/route.ts`
- `app/api/auth/gohighlevel/callback/route.ts`
- `app/api/auth/gohighlevel/disconnect/route.ts`

#### **2.4: HubSpot OAuth** (Same pattern)
- `app/api/auth/hubspot/connect/route.ts`
- `app/api/auth/hubspot/callback/route.ts`
- `app/api/auth/hubspot/disconnect/route.ts`

---

### **Part 3: Token Management (1 hour)**

#### **3.1: Token Encryption Helper**
**File:** `lib/oauth/encryption.ts`
```typescript
// Encrypt tokens before storing
export function encryptToken(token: string): string {
  // Use crypto to encrypt with SECRET_KEY
}

// Decrypt tokens when retrieving
export function decryptToken(encryptedToken: string): string {
  // Decrypt with SECRET_KEY
}
```

#### **3.2: Token Refresh Logic**
**File:** `lib/oauth/refresh.ts`
```typescript
// Automatically refresh expired tokens
export async function refreshOAuthToken(
  platform: 'instagram' | 'calendly' | 'gohighlevel' | 'hubspot',
  connectionId: string
): Promise<void> {
  // 1. Get connection from database
  // 2. Check if token is expired or expiring soon
  // 3. Call platform's token refresh endpoint
  // 4. Update database with new tokens
  // 5. Handle errors (token revoked, refresh failed, etc.)
}
```

---

### **Part 4: Connection Management (1 hour)**

#### **4.1: Get User Connections**
**File:** `lib/oauth/connections.ts`
```typescript
export async function getUserConnections(userId: string) {
  // Query oauth_connections table
  // Return list of connected platforms with status
}

export async function getConnectionByPlatform(
  userId: string,
  platform: string
) {
  // Get specific platform connection
  // Decrypt tokens
  // Check if expired
  // Return connection object
}
```

#### **4.2: Update Connection Status**
```typescript
export async function updateConnectionStatus(
  connectionId: string,
  status: 'connected' | 'error' | 'expired',
  errorMessage?: string
) {
  // Update status in database
  // Log error if provided
}
```

---

### **Part 5: UI Updates (1-2 hours)**

#### **5.1: Update IntegrationCard Logic**
**File:** `app/dashboard/settings/page.tsx`

Update each IntegrationCard to:
```typescript
// Before (hardcoded)
<IntegrationCard
  status="disconnected"
  onConnect={() => console.log("Connect")}
/>

// After (dynamic)
<IntegrationCard
  status={connections.instagram?.status || "disconnected"}
  connectedAccount={connections.instagram?.platform_account_name}
  onConnect={async () => {
    // Redirect to OAuth flow
    window.location.href = '/api/auth/instagram/connect';
  }}
  onDisconnect={async () => {
    await disconnectIntegration('instagram');
    refreshConnections();
  }}
/>
```

#### **5.2: Add Connection Loading States**
```typescript
const [isConnecting, setIsConnecting] = useState<string | null>(null);

const handleConnect = async (platform: string) => {
  setIsConnecting(platform);
  window.location.href = `/api/auth/${platform}/connect`;
  // Loading state persists until redirect
};
```

#### **5.3: Add Success/Error Toast Messages**
```typescript
// After OAuth callback redirects to settings
const searchParams = useSearchParams();
const success = searchParams.get('oauth_success');
const error = searchParams.get('oauth_error');

useEffect(() => {
  if (success) {
    toast.success(`Connected to ${success}!`);
  }
  if (error) {
    toast.error(`Failed to connect: ${error}`);
  }
}, [success, error]);
```

---

### **Part 6: Environment Variables (5 minutes)**

#### **6.1: Required Env Vars**
Add these to `.env.local` and Vercel:

```env
# Encryption
OAUTH_ENCRYPTION_KEY=<generate-random-32-byte-key>

# Instagram
INSTAGRAM_APP_ID=<from-comet>
INSTAGRAM_APP_SECRET=<from-comet>

# Calendly
CALENDLY_CLIENT_ID=<from-comet>
CALENDLY_CLIENT_SECRET=<from-comet>

# GoHighLevel
GOHIGHLEVEL_CLIENT_ID=<from-comet>
GOHIGHLEVEL_CLIENT_SECRET=<from-comet>

# HubSpot
HUBSPOT_CLIENT_ID=<from-comet>
HUBSPOT_CLIENT_SECRET=<from-comet>

# OAuth Callback URLs
NEXT_PUBLIC_APP_URL=https://setterflo-landing.vercel.app
```

---

## 🔍 WHAT YOU'LL SEE AFTER I'M DONE

### **In Supabase:**
- ✅ `oauth_connections` table created
- ✅ `integration_settings` table created
- ✅ RLS policies enabled
- ✅ Indexes for performance

### **In Codebase:**
- ✅ 12 new API routes (3 per platform × 4 platforms)
- ✅ Token encryption/decryption helpers
- ✅ Token refresh logic
- ✅ Connection management helpers
- ✅ Updated UI with dynamic connections
- ✅ Loading states and error handling
- ✅ Toast notifications for success/error

### **In UI:**
- ✅ Connect buttons actually work (redirect to OAuth)
- ✅ Connection status shows real data from database
- ✅ Connected account names displayed
- ✅ Disconnect button functionality
- ✅ Loading states during connection
- ✅ Success/error messages after OAuth

---

## 🧪 TESTING PLAN (After Integration)

### **Test 1: Instagram OAuth**
1. Click "Connect" on Instagram card
2. Redirects to Meta consent screen
3. Authorize app
4. Redirects back to settings
5. Shows "Connected" with account name
6. Token stored in Supabase (encrypted)

### **Test 2: Calendly OAuth**
1. Click "Connect" on Calendly card
2. Redirects to Calendly OAuth
3. Authorize app
4. Redirects back
5. Shows "Connected" with email
6. Token stored and working

### **Test 3: Token Refresh**
1. Manually expire a token (set expires_at to past)
2. Trigger refresh logic
3. New token fetched automatically
4. Connection status remains "connected"

### **Test 4: Disconnect**
1. Click "Disconnect" on connected integration
2. Confirmation dialog
3. Token removed from database
4. UI updates to "disconnected"
5. Can reconnect successfully

### **Test 5: Error Handling**
1. Try connecting with invalid credentials
2. Should show error message
3. Status should be "error"
4. Can retry connection

---

## 📊 PROGRESS TRACKING

As I build each part, I'll update this list:

**Database:**
- [ ] oauth_connections table created
- [ ] integration_settings table created
- [ ] RLS policies configured
- [ ] Tested with sample data

**Instagram:**
- [ ] /connect route
- [ ] /callback route
- [ ] /disconnect route
- [ ] Tested OAuth flow

**Calendly:**
- [ ] /connect route
- [ ] /callback route
- [ ] /disconnect route
- [ ] Tested OAuth flow

**GoHighLevel:**
- [ ] /connect route
- [ ] /callback route
- [ ] /disconnect route
- [ ] Tested OAuth flow

**HubSpot:**
- [ ] /connect route
- [ ] /callback route
- [ ] /disconnect route
- [ ] Tested OAuth flow

**Utilities:**
- [ ] Token encryption
- [ ] Token refresh
- [ ] Connection management
- [ ] Error handling

**UI Updates:**
- [ ] Dynamic connection status
- [ ] Connect button handlers
- [ ] Disconnect functionality
- [ ] Loading states
- [ ] Toast notifications

---

## 🎯 DELIVERY TIMELINE

**Hour 1:** Database schema + encryption setup  
**Hour 2-3:** Instagram OAuth (complete flow)  
**Hour 4:** Calendly OAuth  
**Hour 5:** GoHighLevel OAuth  
**Hour 6:** HubSpot OAuth  
**Hour 7:** UI updates + testing  
**Hour 8:** Documentation + polish

**Total: 6-8 hours of focused development**

---

## ✅ SUCCESS CRITERIA

Backend implementation is complete when:
- ✅ All 4 platforms have complete OAuth flows
- ✅ Tokens stored encrypted in Supabase
- ✅ UI dynamically shows connection status
- ✅ Connect/disconnect buttons functional
- ✅ Token refresh logic working
- ✅ Error handling comprehensive
- ✅ All tests passing
- ✅ Deployed to Vercel

---

## 🚀 WHAT COMES NEXT

**After OAuth Infrastructure:**
1. API client implementations (call platform APIs)
2. Webhook handlers (real-time sync)
3. Core actions (create contact, send message, etc.)
4. Rate limiting & error handling
5. Monitoring & logging

**But first:** Let Comet finish OAuth app setup! 🎉

---

**Ready for you to start Comet while I build the backend! 🚀**
