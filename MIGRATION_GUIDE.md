# Database Migration Guide 🚀

## What This Migration Does

This migration restructures your database to properly separate concerns:

### **Before:**
```
users (monolithic table)
  ├── Auth info
  ├── Instagram info
  ├── Lead tracking
  ├── Bookings
  └── AI settings
```

### **After:**
```
users (App Users - Auth & Onboarding)
  └── links to →

ig_users (Instagram Leads/Contacts)
  ├── conversations
  │   └── messages
  ├── bookings
  └── campaigns

+ instagram_accounts (Your IG accounts)
+ workflows (n8n automation)
+ activity_logs (Activity feed)
+ ai_settings (AI config)
+ integrations (3rd party apps)
```

---

## Changes Summary

### ✅ **What's Renamed:**
- `users` → `ig_users` (your existing Instagram leads data is preserved!)

### ✅ **What's Created:**
- `users` - New table for app users (authentication & onboarding)
- `instagram_accounts` - Your connected Instagram accounts
- `campaigns` - Outbound campaigns
- `conversations` - DM threads
- `messages` - Individual messages
- `bookings` - Calendar bookings
- `workflows` - n8n workflows
- `activity_logs` - Activity feed
- `ai_settings` - AI configuration
- `integrations` - Third-party integrations

### ✅ **What's Added:**
- `app_user_id` column in `ig_users` (links Instagram leads to app users)

---

## Running the Migration

### **Method 1: Supabase Dashboard (Recommended)**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/tvrhroxelqhhzwbjuzzg)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open `migration_rename_and_add_tables.sql` from this project
5. Copy the entire SQL content
6. Paste into the query editor
7. Click **Run** (green play button)
8. Wait for "Success" message

### **Method 2: Using Supabase CLI**

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref tvrhroxelqhhzwbjuzzg

# Run the migration
supabase db push --file migration_rename_and_add_tables.sql

# Or execute directly
supabase db execute -f migration_rename_and_add_tables.sql
```

---

## Post-Migration Steps

### 1. **Update Environment Variables**

Your `.env.local` should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tvrhroxelqhhzwbjuzzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. **Link Existing Instagram Leads to Your User**

After creating your first user account, run this SQL to link existing leads:

```sql
-- Replace 'YOUR_USER_ID' with your actual auth.users id
UPDATE ig_users 
SET app_user_id = 'YOUR_USER_ID'
WHERE app_user_id IS NULL;
```

Or use this safer version that shows what will be updated:

```sql
-- First, check how many leads will be linked
SELECT COUNT(*) as leads_to_link 
FROM ig_users 
WHERE app_user_id IS NULL;

-- Then link them
UPDATE ig_users 
SET app_user_id = (
  SELECT id FROM users 
  WHERE email = 'your-email@example.com' 
  LIMIT 1
)
WHERE app_user_id IS NULL;
```

### 3. **Initialize AI Settings**

Create default AI settings for your user:

```sql
INSERT INTO ai_settings (user_id)
VALUES ('YOUR_USER_ID')
ON CONFLICT (user_id) DO NOTHING;
```

### 4. **Create Your First Instagram Account**

```sql
INSERT INTO instagram_accounts (user_id, handle, status)
VALUES ('YOUR_USER_ID', '@nocoded.ai', 'active');
```

---

## Verification

After migration, verify everything worked:

### Check Tables Exist:
```bash
cd /path/to/project
node check-db.js
```

Or in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- ✅ users
- ✅ ig_users
- ✅ instagram_accounts
- ✅ campaigns
- ✅ conversations
- ✅ messages
- ✅ bookings
- ✅ workflows
- ✅ activity_logs
- ✅ ai_settings
- ✅ integrations

### Check Data Preserved:
```sql
-- Your existing Instagram leads should still be there
SELECT COUNT(*) as total_ig_users FROM ig_users;

-- Should show your existing data
SELECT 
  instagram_username, 
  full_name, 
  current_stage 
FROM ig_users 
LIMIT 10;
```

---

## New Schema Structure

### **`users`** (App Users)
```typescript
{
  id: UUID (auth.users.id)
  full_name: string
  email: string
  business_name: string
  onboarding_completed: boolean
  subscription_tier: 'free' | 'starter' | 'pro'
  created_at: timestamp
}
```

### **`ig_users`** (Instagram Leads - your existing data!)
```typescript
{
  user_id: UUID (primary key)
  app_user_id: UUID (links to users table)
  instagram_username: string
  instagram_user_id: string
  full_name: string
  email: string
  current_stage: string
  // ... all your existing fields
}
```

### **`instagram_accounts`** (Your Instagram Accounts)
```typescript
{
  id: UUID
  user_id: UUID
  handle: string
  access_token: string
  status: 'active' | 'disconnected'
  is_listening: boolean
}
```

---

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Rename ig_users back to users
ALTER TABLE ig_users RENAME TO users;

-- Drop the new tables
DROP TABLE IF EXISTS 
  public.users,
  public.instagram_accounts,
  public.campaigns,
  public.conversations,
  public.messages,
  public.bookings,
  public.workflows,
  public.activity_logs,
  public.ai_settings,
  public.integrations
CASCADE;
```

⚠️ **Warning:** Only do this if you haven't created any new data yet!

---

## Common Issues & Solutions

### **Issue: "relation 'users' already exists"**
**Solution:** The new `users` table wasn't created because the name conflicts. Check if the old table was renamed properly.

```sql
-- Check if old table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('users', 'ig_users');
```

### **Issue: "foreign key constraint violation"**
**Solution:** Make sure to create the parent table (`users`) before child tables.

### **Issue: "RLS policy prevents access"**
**Solution:** Make sure you're authenticated when querying:

```typescript
const { data: { user } } = await supabase.auth.getUser()
// Now queries will work with RLS
```

---

## Next Steps

After successful migration:

1. ✅ Update your application code to use new table names
2. ✅ Set up authentication flow
3. ✅ Create onboarding flow
4. ✅ Connect Instagram accounts
5. ✅ Start building dashboard features

---

## Need Help?

- Check the Supabase logs in the dashboard
- Run `node check-db.js` to verify table structure
- Review RLS policies if you can't access data
- Check that you're authenticated when querying

---

## Files Created

- `migration_rename_and_add_tables.sql` - The main migration file
- `MIGRATION_GUIDE.md` - This guide
- `check-db.js` - Verification script
- Updated TypeScript types coming next...



