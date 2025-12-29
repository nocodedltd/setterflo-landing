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

**From Comet Setup (when complete):**

```env
CALENDLY_CLIENT_ID=<from-comet>
CALENDLY_CLIENT_SECRET=<from-comet>
```

---

## 🏢 GoHighLevel OAuth

**From Comet Setup (when complete):**

```env
GOHIGHLEVEL_CLIENT_ID=<from-comet>
GOHIGHLEVEL_CLIENT_SECRET=<from-comet>
```

---

## 📊 HubSpot OAuth

**From Comet Setup (when complete):**

```env
HUBSPOT_CLIENT_ID=<from-comet>
HUBSPOT_CLIENT_SECRET=<from-comet>
```

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

# Calendly (add after Comet completes)
CALENDLY_CLIENT_ID=
CALENDLY_CLIENT_SECRET=

# GoHighLevel (add after Comet completes)
GOHIGHLEVEL_CLIENT_ID=
GOHIGHLEVEL_CLIENT_SECRET=

# HubSpot (add after Comet completes)
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
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
