# Supabase Quick Start 🚀

## ✅ What's Been Set Up

### Installed Packages
- ✅ `@supabase/supabase-js` - Supabase JavaScript client
- ✅ `@supabase/ssr` - Server-side rendering support for Next.js

### Files Created
- ✅ `supabase_schema.sql` - Complete database schema (11 tables!)
- ✅ `SUPABASE_SETUP.md` - Detailed setup instructions
- ✅ `.env.local.example` - Environment variables template
- ✅ `lib/supabase/client.ts` - Client-side Supabase client
- ✅ `lib/supabase/server.ts` - Server-side Supabase client
- ✅ `lib/supabase/middleware.ts` - Auth middleware
- ✅ `lib/types/database.ts` - TypeScript types for your database
- ✅ `middleware.ts` - Next.js middleware for protected routes

---

## 🎯 Next Steps (5 minutes)

### 1. Create Your Supabase Project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) and:
1. Click "New Project"
2. Choose your organization
3. Set project name: "setterflo" (or whatever you prefer)
4. Set a database password (save this!)
5. Choose a region close to you
6. Click "Create new project"

### 2. Get Your API Keys

Once your project is created:
1. Go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL`
   - `anon` `public` key
   - `service_role` `secret` key ⚠️ (keep this safe!)

### 3. Create Your `.env.local` File

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and paste your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run the Database Schema

Go to your Supabase project:
1. Click **SQL Editor** in the sidebar
2. Click **New Query**
3. Open `supabase_schema.sql` from this project
4. Copy all the SQL
5. Paste into the query editor
6. Click **Run** (green play button)

You should see "Success. No rows returned" - that's perfect! ✨

### 5. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 📊 Your Database Tables

You now have these tables ready to use:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends Supabase Auth) |
| `instagram_accounts` | Connected Instagram accounts |
| `leads` | Lead/contact management |
| `conversations` | DM conversations |
| `messages` | Individual messages |
| `campaigns` | Outbound campaigns |
| `workflows` | n8n workflow monitoring |
| `activity_logs` | Activity feed |
| `ai_settings` | AI configuration |
| `bookings` | Calendar bookings |
| `integrations` | Third-party integrations |

Plus 2 useful views:
- `pipeline_stats` - Lead counts by stage
- `campaign_performance` - Campaign metrics with rates

---

## 🔒 Security Built-In

✅ Row Level Security (RLS) enabled on all tables
✅ Users can only access their own data
✅ Automatic authentication checks
✅ Protected dashboard routes (requires login)

---

## 💻 Using Supabase in Your Code

### Client Component Example
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LeadsPage() {
  const supabase = createClient()
  
  async function getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    return data
  }
  
  // ... rest of your component
}
```

### Server Component Example
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user?.id)
  
  return <div>...</div>
}
```

### API Route Example
```typescript
// app/api/leads/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ leads })
}
```

---

## 🧪 Test Your Setup

Create a test page at `app/test-db/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function TestDB() {
  const supabase = await createClient()
  
  // Test connection
  const { data, error } = await supabase.from('profiles').select('count')
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      {error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <div className="text-green-500">✅ Database connected!</div>
      )}
    </div>
  )
}
```

Visit `http://localhost:3000/test-db` to test!

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase JS Reference](https://supabase.com/docs/reference/javascript)
- [Your Schema File](./supabase_schema.sql)
- [Detailed Setup Guide](./SUPABASE_SETUP.md)

---

## 🆘 Troubleshooting

### "Cannot find module '@/lib/supabase/client'"
Make sure you restarted your dev server after creating the files.

### "Missing environment variable"
Check that `.env.local` exists and has all three variables set.

### "Row Level Security policy violation"
Make sure you're authenticated. The dashboard routes require login.

### "Failed to connect to Supabase"
Double-check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.

---

## 🎉 You're All Set!

Your Supabase database is ready to power your SetterFlo dashboard!

Next steps:
1. Build authentication pages (login/signup)
2. Start fetching real data in your dashboard
3. Create API routes for data mutations
4. Connect to Instagram API
5. Build out the AI features

Need help? Check `SUPABASE_SETUP.md` for more details!



