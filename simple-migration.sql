-- Simple Migration: Create ig_users and migrate data
-- This handles the actual current state of your database

-- STEP 1: Create ig_users table first (copy of current users structure)
CREATE TABLE IF NOT EXISTS public.ig_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_username TEXT,
  instagram_user_id TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  bio_text TEXT,
  profile_scraped_at TIMESTAMP WITH TIME ZONE,
  current_stage TEXT,
  stage_updated_at TIMESTAMP WITH TIME ZONE,
  call_date_time TIMESTAMP WITH TIME ZONE,
  calendar_event_id TEXT,
  closer_assigned TEXT,
  reminder_sent_day_before BOOLEAN DEFAULT false,
  reminder_sent_day_of BOOLEAN DEFAULT false,
  ai_shutoff_date TIMESTAMP WITH TIME ZONE,
  first_message_date TIMESTAMP WITH TIME ZONE,
  last_message_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true,
  app_user_id UUID -- Will link to new users table
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ig_users_instagram_username ON public.ig_users(instagram_username);
CREATE INDEX IF NOT EXISTS idx_ig_users_current_stage ON public.ig_users(current_stage);
CREATE INDEX IF NOT EXISTS idx_ig_users_app_user_id ON public.ig_users(app_user_id);

-- STEP 2: Copy data from users to ig_users
INSERT INTO public.ig_users (
  user_id,
  instagram_username,
  instagram_user_id,
  full_name,
  email,
  phone,
  company_name,
  bio_text,
  profile_scraped_at,
  current_stage,
  stage_updated_at,
  call_date_time,
  calendar_event_id,
  closer_assigned,
  reminder_sent_day_before,
  reminder_sent_day_of,
  ai_shutoff_date,
  first_message_date,
  last_message_date,
  created_at,
  updated_at,
  active
)
SELECT 
  user_id,
  instagram_username,
  instagram_user_id,
  full_name,
  email,
  phone,
  company_name,
  bio_text,
  profile_scraped_at,
  current_stage,
  stage_updated_at,
  call_date_time,
  calendar_event_id,
  closer_assigned,
  reminder_sent_day_before,
  reminder_sent_day_of,
  ai_shutoff_date,
  first_message_date,
  last_message_date,
  created_at,
  updated_at,
  active
FROM public.users
ON CONFLICT (user_id) DO NOTHING;

-- STEP 3: Drop the old users table
DROP TABLE IF EXISTS public.users CASCADE;

-- STEP 4: Create new users table for app authentication
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  business_name TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 5: Add foreign key to ig_users now that users table exists
ALTER TABLE public.ig_users 
ADD CONSTRAINT ig_users_app_user_id_fkey 
FOREIGN KEY (app_user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- STEP 6: Create other tables if they don't exist

-- Instagram Accounts
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  handle TEXT NOT NULL,
  instagram_user_id TEXT UNIQUE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error', 'rate_limited')),
  is_listening BOOLEAN DEFAULT true,
  follower_count INTEGER,
  following_count INTEGER,
  profile_picture_url TEXT,
  bio TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  target_description TEXT,
  target_audience_size TEXT,
  sent INTEGER DEFAULT 0,
  total_target INTEGER NOT NULL,
  responses INTEGER DEFAULT 0,
  qualified INTEGER DEFAULT 0,
  booked INTEGER DEFAULT 0,
  daily_limit INTEGER DEFAULT 20,
  message_template TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  instagram_thread_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed', 'snoozed')),
  unread_count INTEGER DEFAULT 0,
  ai_enabled BOOLEAN DEFAULT true,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('ai', 'user', 'lead')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'voice', 'story_reply')),
  instagram_message_id TEXT UNIQUE,
  is_read BOOLEAN DEFAULT false,
  generated_by_ai BOOLEAN DEFAULT false,
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  media_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  calendar_provider TEXT CHECK (calendar_provider IN ('google', 'outlook', 'calendly', 'cal.com')),
  calendar_event_id TEXT,
  calendar_link TEXT,
  meeting_link TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('discovery_call', 'consultation', 'demo', 'follow_up')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound', 'booking', 'enrichment', 'notification')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disabled')),
  n8n_workflow_id TEXT,
  n8n_webhook_url TEXT,
  last_run_at TIMESTAMP WITH TIME ZONE,
  executions_today INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'qualification', 'campaign', 'system', 'ai_action')),
  action TEXT NOT NULL,
  description TEXT,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Settings
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'friendly', 'enthusiastic')),
  formality_level INTEGER DEFAULT 50 CHECK (formality_level >= 0 AND formality_level <= 100),
  emoji_usage BOOLEAN DEFAULT true,
  turn_off_after_booking BOOLEAN DEFAULT false,
  send_calendar_reminders BOOLEAN DEFAULT true,
  response_delay_min INTEGER DEFAULT 2,
  response_delay_max INTEGER DEFAULT 8,
  batch_messages BOOLEAN DEFAULT true,
  handle_too_expensive BOOLEAN DEFAULT true,
  handle_need_to_think BOOLEAN DEFAULT true,
  handle_already_have_coach BOOLEAN DEFAULT true,
  handle_send_info BOOLEAN DEFAULT true,
  custom_rules JSONB DEFAULT '[]'::jsonb,
  blacklisted_usernames TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gohighlevel', 'airtable', 'calendly', 'cal.com', 'zapier', 'n8n')),
  type TEXT NOT NULL CHECK (type IN ('crm', 'database', 'calendar', 'automation', 'notification')),
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  credentials JSONB,
  settings JSONB DEFAULT '{}'::jsonb,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- STEP 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON public.instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_ig_user_id ON public.conversations(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- STEP 8: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ig_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- STEP 9: Create RLS policies

-- Users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- IG Users
DROP POLICY IF EXISTS "Users can view own ig_users" ON public.ig_users;
DROP POLICY IF EXISTS "Users can manage own ig_users" ON public.ig_users;

CREATE POLICY "Users can view own ig_users" ON public.ig_users FOR SELECT 
  USING (app_user_id = auth.uid() OR app_user_id IS NULL);

CREATE POLICY "Users can manage own ig_users" ON public.ig_users FOR ALL 
  USING (app_user_id = auth.uid() OR app_user_id IS NULL);

-- Instagram Accounts
DROP POLICY IF EXISTS "Users can view own instagram accounts" ON public.instagram_accounts;
DROP POLICY IF EXISTS "Users can manage own instagram accounts" ON public.instagram_accounts;

CREATE POLICY "Users can view own instagram accounts" ON public.instagram_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own instagram accounts" ON public.instagram_accounts FOR ALL USING (auth.uid() = user_id);

-- Campaigns
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can manage own campaigns" ON public.campaigns;

CREATE POLICY "Users can view own campaigns" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = user_id);

-- Conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.conversations;

CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);

-- Messages
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;

CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));

CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = conversation_id AND conversations.user_id = auth.uid()));

-- Apply policies for other tables
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workflows" ON public.workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workflows" ON public.workflows FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI settings" ON public.ai_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI settings" ON public.ai_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own integrations" ON public.integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own integrations" ON public.integrations FOR ALL USING (auth.uid() = user_id);

-- STEP 10: Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_ig_users_updated_at ON public.ig_users;
DROP TRIGGER IF EXISTS update_instagram_accounts_updated_at ON public.instagram_accounts;
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
DROP TRIGGER IF EXISTS update_ai_settings_updated_at ON public.ai_settings;
DROP TRIGGER IF EXISTS update_integrations_updated_at ON public.integrations;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ig_users_updated_at BEFORE UPDATE ON public.ig_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instagram_accounts_updated_at BEFORE UPDATE ON public.instagram_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON public.ai_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success!
DO $$
DECLARE
  ig_users_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO ig_users_count FROM ig_users;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '  ✅ MIGRATION COMPLETE!';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Your data has been migrated:';
  RAISE NOTICE '  • % Instagram leads moved to ig_users', ig_users_count;
  RAISE NOTICE '  • New users table created for authentication';
  RAISE NOTICE '  • All 11 tables created successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Create your user account via Supabase Auth';
  RAISE NOTICE '  2. Link ig_users: UPDATE ig_users SET app_user_id = ''your-id''';
  RAISE NOTICE '';
END $$;
