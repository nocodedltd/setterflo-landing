# Supabase Setup Guide for SetterFlo

## Database Schema Overview

Your database includes **11 tables** to power the entire SetterFlo dashboard:

### Core Tables:
1. **`profiles`** - User profiles (extends Supabase Auth)
2. **`instagram_accounts`** - Connected Instagram accounts
3. **`leads`** - Lead management & CRM
4. **`conversations`** - Instagram DM conversations
5. **`messages`** - Individual messages in conversations
6. **`campaigns`** - Outbound campaign management
7. **`workflows`** - n8n workflow monitoring
8. **`activity_logs`** - System activity feed
9. **`ai_settings`** - AI configuration per user
10. **`bookings`** - Calendar bookings
11. **`integrations`** - Third-party integrations

---

## Quick Setup Options

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Project](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy the contents of `supabase_schema.sql`
5. Paste and click **"Run"**

### Option 2: Using Supabase CLI

```bash
# Start local Supabase (requires Docker)
supabase start

# Apply the schema
supabase db push

# Or run the SQL file directly
supabase db execute -f supabase_schema.sql
```

### Option 3: Link to Cloud Project and Push

```bash
# Link to your cloud project
supabase link --project-ref your-project-ref

# Push the local schema to cloud
supabase db push
```

---

## Key Features Included

### ✅ Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Secure by default

### ✅ Automatic Timestamps
- `created_at` and `updated_at` on all tables
- Triggers automatically update timestamps

### ✅ Data Validation
- CHECK constraints on status fields
- Foreign key relationships
- Unique constraints where needed

### ✅ Performance Optimizations
- Strategic indexes on foreign keys
- Indexes on commonly queried fields
- Optimized for dashboard queries

### ✅ Useful Views
- `pipeline_stats` - Lead pipeline metrics
- `campaign_performance` - Campaign analytics with calculated rates

---

## Next Steps

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Set Up Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Supabase Client

Create `lib/supabase/client.ts`:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => createClientComponentClient<Database>()
```

### 4. Generate TypeScript Types

```bash
# Generate types from your database
supabase gen types typescript --project-id your-project-ref > types/supabase.ts
```

---

## Database Relationships

```
profiles (user)
  ├── instagram_accounts
  │   └── conversations
  │       └── messages
  ├── leads
  │   ├── conversations
  │   ├── messages
  │   └── bookings
  ├── campaigns
  │   └── leads (via campaign_id)
  ├── workflows
  ├── activity_logs
  ├── ai_settings
  ├── bookings
  └── integrations
```

---

## Sample Queries

### Get user's leads by stage
```sql
SELECT stage, COUNT(*) 
FROM leads 
WHERE user_id = auth.uid() 
GROUP BY stage;
```

### Get recent conversations with unread count
```sql
SELECT 
  c.*,
  l.name,
  l.handle,
  c.unread_count
FROM conversations c
JOIN leads l ON l.id = c.lead_id
WHERE c.user_id = auth.uid()
ORDER BY c.last_message_at DESC
LIMIT 20;
```

### Get campaign performance
```sql
SELECT * 
FROM campaign_performance
WHERE user_id = auth.uid()
ORDER BY response_rate DESC;
```

---

## Seed Data (Optional)

After creating your first user, you can seed some test data:

```sql
-- Replace 'your-user-id' with actual auth.uid()
INSERT INTO ai_settings (user_id) VALUES ('your-user-id');

INSERT INTO workflows (user_id, name, type, status) VALUES
  ('your-user-id', 'Instagram Inbound Handler', 'inbound', 'active'),
  ('your-user-id', 'Calendar Booking System', 'booking', 'active');
```

---

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** - already configured for you
3. **Encrypt sensitive data** in the `integrations.credentials` field
4. **Use Supabase Auth** for user management
5. **Set up database backups** in your Supabase project settings

---

## Troubleshooting

### "Table already exists" error
If you get this error, tables might already exist. Either:
- Drop existing tables first (⚠️ this will delete data!)
- Or modify the SQL to use `CREATE TABLE IF NOT EXISTS`

### RLS preventing data access
Make sure you're authenticated and using `auth.uid()` in queries.

### Foreign key violations
Ensure referenced records exist before inserting. Order matters:
1. profiles
2. instagram_accounts
3. campaigns
4. leads
5. conversations
6. messages

---

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
