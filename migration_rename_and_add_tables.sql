-- Migration: Rename users to ig_users and create proper schema
-- Date: 2025-12-11
-- Description: Restructures database to separate app users from Instagram leads

-- ============================================================
-- STEP 1: RENAME EXISTING TABLE
-- ============================================================

-- Rename the existing users table to ig_users (Instagram users/leads)
ALTER TABLE IF EXISTS public.users RENAME TO ig_users;

-- Update the primary key constraint name
ALTER TABLE public.ig_users RENAME CONSTRAINT users_pkey TO ig_users_pkey;

-- Rename any indexes
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_user_id_idx') THEN
        ALTER INDEX users_user_id_idx RENAME TO ig_users_user_id_idx;
    END IF;
END $$;

-- ============================================================
-- STEP 2: CREATE NEW USERS TABLE (App Users - Auth & Onboarding)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  
  -- Profile Info
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Business Info
  business_name TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Subscription/Plan (for future use)
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON public.users(subscription_tier, subscription_status);

-- ============================================================
-- STEP 3: ADD USER_ID TO IG_USERS (Link to App User)
-- ============================================================

-- Add user_id column to ig_users table to link to the app user
ALTER TABLE public.ig_users 
ADD COLUMN IF NOT EXISTS app_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ig_users_app_user_id ON public.ig_users(app_user_id);

-- ============================================================
-- STEP 4: CREATE INSTAGRAM ACCOUNTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Instagram Info
  handle TEXT NOT NULL,
  instagram_user_id TEXT UNIQUE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error', 'rate_limited')),
  is_listening BOOLEAN DEFAULT true,
  
  -- Metadata
  follower_count INTEGER,
  following_count INTEGER,
  profile_picture_url TEXT,
  bio TEXT,
  
  -- Sync Info
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON public.instagram_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_status ON public.instagram_accounts(status);

-- ============================================================
-- STEP 5: CREATE CAMPAIGNS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  
  -- Campaign Info
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  
  -- Targeting
  target_description TEXT,
  target_audience_size TEXT,
  target_filters JSONB DEFAULT '{}'::jsonb,
  
  -- Metrics
  sent INTEGER DEFAULT 0,
  total_target INTEGER NOT NULL,
  responses INTEGER DEFAULT 0,
  qualified INTEGER DEFAULT 0,
  booked INTEGER DEFAULT 0,
  
  -- Settings
  daily_limit INTEGER DEFAULT 20,
  message_template TEXT,
  auto_follow BOOLEAN DEFAULT false,
  
  -- Schedule
  start_date DATE,
  end_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_instagram_account ON public.campaigns(instagram_account_id);

-- ============================================================
-- STEP 6: CREATE CONVERSATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  
  -- Conversation Info
  instagram_thread_id TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed', 'snoozed')),
  unread_count INTEGER DEFAULT 0,
  
  -- AI Control
  ai_enabled BOOLEAN DEFAULT true,
  ai_paused_at TIMESTAMP WITH TIME ZONE,
  ai_paused_reason TEXT,
  
  -- Timestamps
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_ig_user_id ON public.conversations(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);

-- ============================================================
-- STEP 7: CREATE MESSAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  
  -- Message Content
  text TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('ai', 'user', 'lead')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'voice', 'story_reply', 'story_mention')),
  
  -- Instagram Metadata
  instagram_message_id TEXT UNIQUE,
  instagram_timestamp TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  
  -- AI Metadata
  generated_by_ai BOOLEAN DEFAULT false,
  ai_model TEXT,
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  ai_prompt TEXT,
  
  -- Media
  media_url TEXT,
  media_type TEXT,
  
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_ig_user_id ON public.messages(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender);

-- ============================================================
-- STEP 8: CREATE BOOKINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  
  -- Booking Info
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')),
  
  -- Calendar Integration
  calendar_provider TEXT CHECK (calendar_provider IN ('google', 'outlook', 'calendly', 'cal.com')),
  calendar_event_id TEXT,
  calendar_link TEXT,
  meeting_link TEXT,
  
  -- Meeting Details
  meeting_type TEXT CHECK (meeting_type IN ('discovery_call', 'consultation', 'demo', 'follow_up')),
  closer_assigned TEXT,
  
  -- Reminders
  reminder_sent_24h BOOLEAN DEFAULT false,
  reminder_sent_1h BOOLEAN DEFAULT false,
  reminder_24h_at TIMESTAMP WITH TIME ZONE,
  reminder_1h_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ig_user_id ON public.bookings(ig_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============================================================
-- STEP 9: CREATE WORKFLOWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Workflow Info
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound', 'booking', 'enrichment', 'notification', 'integration')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'disabled')),
  
  -- n8n Integration
  n8n_workflow_id TEXT,
  n8n_webhook_url TEXT,
  n8n_api_key TEXT,
  
  -- Configuration
  config JSONB DEFAULT '{}'::jsonb,
  
  -- Monitoring
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_success_at TIMESTAMP WITH TIME ZONE,
  last_error_at TIMESTAMP WITH TIME ZONE,
  last_error_message TEXT,
  
  executions_today INTEGER DEFAULT 0,
  executions_total INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON public.workflows(type);

-- ============================================================
-- STEP 10: CREATE ACTIVITY LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Info
  type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'qualification', 'campaign', 'system', 'ai_action', 'user_action')),
  action TEXT NOT NULL,
  description TEXT,
  
  -- References
  ig_user_id UUID REFERENCES public.ig_users(user_id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_ig_user_id ON public.activity_logs(ig_user_id);

-- ============================================================
-- STEP 11: CREATE AI SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Tone & Voice
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'friendly', 'enthusiastic')),
  formality_level INTEGER DEFAULT 50 CHECK (formality_level >= 0 AND formality_level <= 100),
  emoji_usage BOOLEAN DEFAULT true,
  voice_characteristics JSONB DEFAULT '{}'::jsonb,
  
  -- Behavior
  turn_off_after_booking BOOLEAN DEFAULT false,
  send_calendar_reminders BOOLEAN DEFAULT true,
  response_delay_min INTEGER DEFAULT 2,
  response_delay_max INTEGER DEFAULT 8,
  batch_messages BOOLEAN DEFAULT true,
  max_messages_per_hour INTEGER DEFAULT 30,
  
  -- Qualification
  auto_qualify BOOLEAN DEFAULT true,
  qualification_criteria JSONB DEFAULT '{}'::jsonb,
  
  -- Objection Handling
  handle_too_expensive BOOLEAN DEFAULT true,
  handle_need_to_think BOOLEAN DEFAULT true,
  handle_already_have_coach BOOLEAN DEFAULT true,
  handle_send_info BOOLEAN DEFAULT true,
  custom_objections JSONB DEFAULT '[]'::jsonb,
  
  -- Custom Rules
  custom_rules JSONB DEFAULT '[]'::jsonb,
  blacklisted_usernames TEXT[] DEFAULT '{}',
  whitelisted_usernames TEXT[] DEFAULT '{}',
  
  -- AI Model Config
  ai_provider TEXT DEFAULT 'openai' CHECK (ai_provider IN ('openai', 'anthropic', 'custom')),
  ai_model TEXT DEFAULT 'gpt-4',
  temperature FLOAT DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_settings_user_id ON public.ai_settings(user_id);

-- ============================================================
-- STEP 12: CREATE INTEGRATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Integration Info
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gohighlevel', 'airtable', 'calendly', 'cal.com', 'zapier', 'make', 'n8n', 'slack', 'discord')),
  type TEXT NOT NULL CHECK (type IN ('crm', 'database', 'calendar', 'automation', 'notification', 'analytics')),
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
  
  -- Credentials (encrypt these at application level!)
  credentials JSONB,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  webhook_url TEXT,
  
  -- Sync Info
  connected_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_sync_status TEXT,
  last_error TEXT,
  sync_frequency TEXT DEFAULT 'realtime' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON public.integrations(status);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ig_users_updated_at 
  BEFORE UPDATE ON public.ig_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_accounts_updated_at 
  BEFORE UPDATE ON public.instagram_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at 
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at 
  BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at 
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
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

-- Users policies
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- IG Users policies
CREATE POLICY "Users can view own ig_users" 
  ON public.ig_users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = ig_users.app_user_id 
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own ig_users" 
  ON public.ig_users FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = ig_users.app_user_id 
      AND users.id = auth.uid()
    )
  );

-- Instagram Accounts policies
CREATE POLICY "Users can view own instagram accounts" 
  ON public.instagram_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own instagram accounts" 
  ON public.instagram_accounts FOR ALL 
  USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" 
  ON public.campaigns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaigns" 
  ON public.campaigns FOR ALL 
  USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" 
  ON public.conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversations" 
  ON public.conversations FOR ALL 
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in own conversations" 
  ON public.messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations" 
  ON public.messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookings" 
  ON public.bookings FOR ALL 
  USING (auth.uid() = user_id);

-- Workflows policies
CREATE POLICY "Users can view own workflows" 
  ON public.workflows FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workflows" 
  ON public.workflows FOR ALL 
  USING (auth.uid() = user_id);

-- Activity Logs policies
CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- AI Settings policies
CREATE POLICY "Users can view own AI settings" 
  ON public.ai_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own AI settings" 
  ON public.ai_settings FOR ALL 
  USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can view own integrations" 
  ON public.integrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" 
  ON public.integrations FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- View for lead pipeline stats
CREATE OR REPLACE VIEW public.pipeline_stats AS
SELECT 
  ig.app_user_id as user_id,
  ig.current_stage as stage,
  COUNT(*) as count
FROM public.ig_users ig
WHERE ig.active = true
GROUP BY ig.app_user_id, ig.current_stage;

-- View for campaign performance
CREATE OR REPLACE VIEW public.campaign_performance AS
SELECT 
  c.*,
  CASE 
    WHEN c.sent > 0 THEN ROUND((c.responses::numeric / c.sent::numeric) * 100, 2)
    ELSE 0 
  END as response_rate,
  CASE 
    WHEN c.responses > 0 THEN ROUND((c.qualified::numeric / c.responses::numeric) * 100, 2)
    ELSE 0 
  END as qualification_rate,
  CASE 
    WHEN c.qualified > 0 THEN ROUND((c.booked::numeric / c.qualified::numeric) * 100, 2)
    ELSE 0 
  END as booking_rate
FROM public.campaigns c;

-- ============================================================
-- COMPLETE!
-- ============================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  • users (renamed from old users)';
  RAISE NOTICE '  • ig_users (Instagram leads/contacts)';
  RAISE NOTICE '  • instagram_accounts';
  RAISE NOTICE '  • campaigns';
  RAISE NOTICE '  • conversations';
  RAISE NOTICE '  • messages';
  RAISE NOTICE '  • bookings';
  RAISE NOTICE '  • workflows';
  RAISE NOTICE '  • activity_logs';
  RAISE NOTICE '  • ai_settings';
  RAISE NOTICE '  • integrations';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Link existing ig_users to your app user';
END $$;



