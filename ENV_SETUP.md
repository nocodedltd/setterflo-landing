# Environment Variables Setup

## 🔐 Required Environment Variables

Add these to your `.env.local` file locally and to Vercel for production.

---

## 📦 Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=https://tvrhroxelqhhzwbjuzzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmhyb3hlbHFoaHp3Ymp1enpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NTc5OTEsImV4cCI6MjA3ODUzMzk5MX0.boQVaVNZwl2Q9smh_PlnM9s4UNylmmzU0IyinjU0gfs
```

---

## 🌐 App Configuration

```env
NEXT_PUBLIC_APP_URL=https://setterflo-landing.vercel.app
```

**Local Development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔒 OAuth Encryption Key

**Generate a secure 32-byte key:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add it:
```env
OAUTH_ENCRYPTION_KEY=<your-generated-key-here>
```

⚠️ **Important:** This key encrypts OAuth tokens in the database. Keep it secret and don't lose it!

---

## 📸 Instagram / Meta OAuth

**From Comet Setup:**

```env
INSTAGRAM_APP_ID=25769682339323790
INSTAGRAM_APP_SECRET=9551b995f11f76f680695c088e3517f8
```

**Webhook Configuration (already set in Pipedream):**
```env
INSTAGRAM_WEBHOOK_URL=https://eo1dbmvfpv1tf1g.m.pipedream.net
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024
```

---

## 📅 Calendly OAuth

**From Comet Setup:**

```env
CALENDLY_CLIENT_ID=C_lxgG8QWiMGkh2QKsdkyLmm2TQUZmiiNKpJYwJa3sQg
CALENDLY_CLIENT_SECRET=KwYe7EDeTbU4wxDOyKyF6QNq8owUWOscVGvU2M3MwrI
```

---

## 🏢 GoHighLevel OAuth

**From Comet Setup:**

```env
GOHIGHLEVEL_CLIENT_ID=6952ea0abe59f009bafd819b-mjrn7c76
GOHIGHLEVEL_CLIENT_SECRET=57ffee58-9ed5-43bd-adac-e1efdb98471c
GOHIGHLEVEL_SSO_KEY=46dd4d4f-9e98-4506-ae03-65dc01c0011e
```

**⚠️ Important:** GoHighLevel OAuth uses `/api/auth/crm/callback` instead of `/gohighlevel/callback` due to white-label policy.

---

## 📊 HubSpot OAuth

**From Comet Setup:**

```env
HUBSPOT_CLIENT_ID=c53a15a3-2f29-4500-9a04-31c831ee62e6
HUBSPOT_CLIENT_SECRET=e4920c2f-43ca-4a85-8161-2bff5b73bcb9
```

**Note:** HubSpot region is EU (app-eu1.hubspot.com)

---

## 🚀 Adding to Vercel

### Option A: Via CLI

```bash
# Add single variable
vercel env add OAUTH_ENCRYPTION_KEY production

# Or use vercel env pull to sync
vercel env pull .env.local
```

### Option B: Via Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project: `setterflo-landing`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable for **Production**, **Preview**, and **Development**

---

## 📋 Complete Environment Variable List

For easy copy-paste into Vercel or `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tvrhroxelqhhzwbjuzzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cmhyb3hlbHFoaHp3Ymp1enpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NTc5OTEsImV4cCI6MjA3ODUzMzk5MX0.boQVaVNZwl2Q9smh_PlnM9s4UNylmmzU0IyinjU0gfs

# App
NEXT_PUBLIC_APP_URL=https://setterflo-landing.vercel.app

# Encryption
OAUTH_ENCRYPTION_KEY=<generate-with-command-above>

# Instagram
INSTAGRAM_APP_ID=25769682339323790
INSTAGRAM_APP_SECRET=9551b995f11f76f680695c088e3517f8
INSTAGRAM_WEBHOOK_URL=https://eo1dbmvfpv1tf1g.m.pipedream.net
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024

# Calendly
CALENDLY_CLIENT_ID=C_lxgG8QWiMGkh2QKsdkyLmm2TQUZmiiNKpJYwJa3sQg
CALENDLY_CLIENT_SECRET=KwYe7EDeTbU4wxDOyKyF6QNq8owUWOscVGvU2M3MwrI

# GoHighLevel (⚠️ uses /crm/callback due to white-label policy)
GOHIGHLEVEL_CLIENT_ID=6952ea0abe59f009bafd819b-mjrn7c76
GOHIGHLEVEL_CLIENT_SECRET=57ffee58-9ed5-43bd-adac-e1efdb98471c
GOHIGHLEVEL_SSO_KEY=46dd4d4f-9e98-4506-ae03-65dc01c0011e

# HubSpot (EU region)
HUBSPOT_CLIENT_ID=c53a15a3-2f29-4500-9a04-31c831ee62e6
HUBSPOT_CLIENT_SECRET=e4920c2f-43ca-4a85-8161-2bff5b73bcb9
```

---

## ✅ Verification Checklist

Before deploying, ensure:

- [ ] All Supabase variables set
- [ ] `OAUTH_ENCRYPTION_KEY` generated and added
- [ ] Instagram App ID and Secret added
- [ ] `NEXT_PUBLIC_APP_URL` matches your domain
- [ ] All variables added to Vercel (Production + Preview)
- [ ] Deployment triggered after adding variables

---

## 🧪 Testing Environment Variables

Run this to verify encryption works:

```typescript
// In a test script or API route
import { generateEncryptionKey, testEncryption } from '@/lib/oauth/encryption';

// Generate key (do this once)
console.log('New key:', generateEncryptionKey());

// Test encryption/decryption
testEncryption(); // Should log "✅ Encryption test passed"
```

---

## 🔄 Updating Variables

When you update OAuth credentials:

1. Update `.env.local` locally
2. Update Vercel via dashboard or CLI
3. Redeploy: `vercel --prod --force`

---

## 📝 Notes

- **Never commit `.env.local`** to Git (already in `.gitignore`)
- **Generate a unique encryption key** - don't use the example one
- **Store encryption key safely** - losing it means you can't decrypt existing tokens
- **Rotate credentials regularly** for security

---

**Status: Instagram credentials ready, waiting for Calendly, GoHighLevel, and HubSpot from Comet** ✅
