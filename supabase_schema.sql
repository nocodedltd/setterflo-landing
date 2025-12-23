-- SetterFlo Database Schema for Supabase
-- Generated: 2025-12-11
-- Description: Complete database schema for Instagram AI automation dashboard

-- ============================================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  business_name TEXT,
  website TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 2. INSTAGRAM ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  handle TEXT NOT NULL,
  instagram_user_id TEXT UNIQUE,
  access_token TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error')),
  is_listening BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON public.instagram_accounts(user_id);

-- ============================================================
-- 3. CAMPAIGNS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  
  -- Campaign Info
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  target TEXT,
  target_count TEXT,
  
  -- Metrics
  sent INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  responses INTEGER DEFAULT 0,
  qualified INTEGER DEFAULT 0,
  booked INTEGER DEFAULT 0,
  
  -- Settings
  daily_limit INTEGER DEFAULT 20,
  message_template TEXT,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- ============================================================
-- 4. LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  
  -- Lead Info
  name TEXT,
  handle TEXT NOT NULL,
  instagram_user_id TEXT,
  avatar_url TEXT,
  location TEXT,
  role TEXT,
  bio TEXT,
  follower_count INTEGER,
  
  -- Status & Stage
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'qualified', 'booked', 'closed')),
  stage TEXT DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'booked', 'closed')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  
  -- Metadata
  source TEXT,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  first_contact_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);

-- ============================================================
-- 5. CONVERSATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE SET NULL,
  
  -- Conversation Info
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  unread_count INTEGER DEFAULT 0,
  ai_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- ============================================================
-- 6. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  
  -- Message Content
  text TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('ai', 'user', 'lead')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'story_reply')),
  
  -- Instagram Metadata
  instagram_message_id TEXT UNIQUE,
  is_read BOOLEAN DEFAULT false,
  
  -- AI Metadata
  generated_by_ai BOOLEAN DEFAULT false,
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON public.messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);

-- ============================================================
-- 7. WORKFLOWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Workflow Info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inbound', 'booking', 'campaign', 'enrichment')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  
  -- n8n Integration
  n8n_workflow_id TEXT,
  n8n_webhook_url TEXT,
  
  -- Monitoring
  last_run_at TIMESTAMP WITH TIME ZONE,
  executions_today INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);

-- ============================================================
-- 8. ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Info
  type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'qualification', 'campaign', 'system')),
  content TEXT NOT NULL,
  target TEXT,
  
  -- References
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(type);

-- ============================================================
-- 9. AI SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Tone & Voice
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'casual', 'friendly')),
  formality_level INTEGER DEFAULT 50 CHECK (formality_level >= 0 AND formality_level <= 100),
  emoji_usage BOOLEAN DEFAULT true,
  
  -- Behavior
  turn_off_after_booking BOOLEAN DEFAULT false,
  send_calendar_reminders BOOLEAN DEFAULT true,
  response_delay_min INTEGER DEFAULT 2,
  response_delay_max INTEGER DEFAULT 8,
  batch_messages BOOLEAN DEFAULT true,
  
  -- Objection Handling
  handle_too_expensive BOOLEAN DEFAULT true,
  handle_need_to_think BOOLEAN DEFAULT true,
  handle_already_have_coach BOOLEAN DEFAULT true,
  handle_send_info BOOLEAN DEFAULT true,
  
  -- Custom Rules
  custom_rules JSONB DEFAULT '[]'::jsonb,
  blacklisted_usernames TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 10. BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  
  -- Booking Info
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  
  -- Calendar Integration
  calendar_event_id TEXT,
  calendar_link TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('discovery_call', 'consultation', 'demo')),
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON public.bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);

-- ============================================================
-- 11. INTEGRATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Integration Info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('crm', 'database', 'calendar', 'automation')),
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  
  -- Credentials (should be encrypted at app level)
  credentials JSONB,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb,
  
  connected_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON public.integrations(user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_accounts_updated_at 
  BEFORE UPDATE ON public.instagram_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at 
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_settings_updated_at 
  BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at 
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Instagram Accounts policies
CREATE POLICY "Users can view own instagram accounts" 
  ON public.instagram_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own instagram accounts" 
  ON public.instagram_accounts FOR ALL 
  USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can view own leads" 
  ON public.leads FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own leads" 
  ON public.leads FOR ALL 
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

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" 
  ON public.campaigns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaigns" 
  ON public.campaigns FOR ALL 
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

-- Bookings policies
CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookings" 
  ON public.bookings FOR ALL 
  USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can view own integrations" 
  ON public.integrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" 
  ON public.integrations FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================
-- HELPER VIEWS (Optional but useful)
-- ============================================================

-- View for lead pipeline counts
CREATE OR REPLACE VIEW public.pipeline_stats AS
SELECT 
  user_id,
  stage,
  COUNT(*) as count
FROM public.leads
WHERE status = 'active'
GROUP BY user_id, stage;

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
-- SEED DATA (Optional - for testing)
-- ============================================================

-- You can uncomment this to insert test data after creating a user
-- Make sure to replace 'YOUR_USER_UUID' with actual auth.uid()

/*
-- Insert AI settings for user
INSERT INTO public.ai_settings (user_id) 
VALUES ('YOUR_USER_UUID')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample workflow
INSERT INTO public.workflows (user_id, name, type, status)
VALUES 
  ('YOUR_USER_UUID', 'Instagram Inbound Handler', 'inbound', 'active'),
  ('YOUR_USER_UUID', 'Calendar Booking System', 'booking', 'active')
ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- END OF SCHEMA
-- ============================================================
