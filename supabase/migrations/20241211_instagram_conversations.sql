-- ============================================================
-- INSTAGRAM CONVERSATIONS & MESSAGES SCHEMA
-- ============================================================
-- This migration creates tables for storing Instagram DM
-- conversations and messages in a multi-tenant architecture.
-- 
-- Architecture:
-- - Conversations: One per Instagram user (lead) that messages a SetterFlo user
-- - Messages: Individual messages within conversations
-- - User identification: Via oauth_connections (platform = 'instagram')
-- ============================================================

-- ============================================================
-- 1. ALTER EXISTING CONVERSATIONS TABLE
-- ============================================================
-- The conversations table already exists with:
-- - ig_user_id (UUID) → instagram_profiles.id
-- - instagram_account_id (UUID) → nullable
--
-- We'll ADD new columns for our multi-tenant architecture:
-- - instagram_account_id_text (TEXT) - Instagram Business Account ID from oauth_connections
-- - instagram_user_id (TEXT) - Instagram user ID string of the lead
-- - oauth_connection_id - Link to oauth_connections
-- - qualification_state - Lead qualification tracking

-- Add new columns (if they don't exist)
DO $$ 
BEGIN
  -- Instagram Business Account ID as TEXT (from oauth_connections)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'instagram_account_id_text'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN instagram_account_id_text TEXT;
  END IF;

  -- OAuth connection reference
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'oauth_connection_id'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN oauth_connection_id UUID REFERENCES public.oauth_connections(id) ON DELETE SET NULL;
  END IF;

  -- Instagram user ID as TEXT (the lead's Instagram ID string)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'instagram_user_id'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN instagram_user_id TEXT;
  END IF;

  -- Instagram username
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'instagram_username'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN instagram_username TEXT;
  END IF;

  -- Instagram display name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'instagram_name'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN instagram_name TEXT;
  END IF;

  -- AI control fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'ai_paused_at'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN ai_paused_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'ai_paused_reason'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN ai_paused_reason TEXT;
  END IF;

  -- Lead qualification state
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'qualification_state'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN qualification_state TEXT DEFAULT 'new' 
    CHECK (qualification_state IN ('new', 'qualifying', 'qualified', 'not_interested', 'booked', 'closed'));
  END IF;

  -- First contact timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'first_contact_at'
  ) THEN
    ALTER TABLE public.conversations 
    ADD COLUMN first_contact_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Indexes for performance (only create if they don't exist)
CREATE INDEX IF NOT EXISTS idx_conversations_instagram_account_id_text ON public.conversations(instagram_account_id_text);
CREATE INDEX IF NOT EXISTS idx_conversations_instagram_user_id_text ON public.conversations(instagram_user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_oauth_connection_id ON public.conversations(oauth_connection_id);
CREATE INDEX IF NOT EXISTS idx_conversations_qualification_state ON public.conversations(qualification_state);

-- ============================================================
-- 2. ALTER EXISTING MESSAGES TABLE
-- ============================================================
-- The messages table already exists with:
-- - ig_user_id (UUID) → instagram_profiles.id
-- - conversation_id (UUID) → conversations.id
--
-- We'll ADD new columns for AI metadata and enhanced tracking

-- Add new columns to messages (if they don't exist)
DO $$ 
BEGIN
  -- Instagram timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'instagram_timestamp'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN instagram_timestamp TIMESTAMPTZ;
  END IF;

  -- Read tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'read_at'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN read_at TIMESTAMPTZ;
  END IF;

  -- AI metadata
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'ai_model'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN ai_model TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'ai_prompt'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN ai_prompt TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'ai_tools_used'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN ai_tools_used JSONB;
  END IF;

  -- Media metadata
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'media_type'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN media_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'media_thumbnail_url'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN media_thumbnail_url TEXT;
  END IF;

  -- Error tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'send_error'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN send_error TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'send_retry_count'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN send_retry_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_instagram_timestamp ON public.messages(instagram_timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON public.messages(read_at) WHERE read_at IS NULL;

-- ============================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for conversations (drop if exists first)
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update conversation's last_message_at when new message is inserted
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.sent_at,
    last_message_preview = LEFT(NEW.text, 100),
    unread_count = CASE 
      WHEN NEW.sender = 'lead' THEN unread_count + 1
      ELSE unread_count
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS update_conversation_on_new_message ON public.messages;
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can only access their own conversations
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;

CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.conversations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: Users can only access messages in their own conversations
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view messages in their own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages in their own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages in their own conversations" ON public.messages;

CREATE POLICY "Users can view messages in their own conversations"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their own conversations"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their own conversations"
  ON public.messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages in their own conversations"
  ON public.messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- ============================================================
-- 5. HELPER FUNCTIONS
-- ============================================================

-- Function to mark conversation messages as read
CREATE OR REPLACE FUNCTION mark_conversation_messages_read(p_conversation_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.messages
  SET is_read = true, read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND is_read = false
    AND sender = 'lead';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Reset unread count
  UPDATE public.conversations
  SET unread_count = 0
  WHERE id = p_conversation_id;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversation with message count
CREATE OR REPLACE FUNCTION get_conversation_with_stats(p_conversation_id UUID)
RETURNS TABLE (
  conversation public.conversations,
  message_count BIGINT,
  unread_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.*,
    COUNT(m.id)::BIGINT as message_count,
    c.unread_count
  FROM public.conversations c
  LEFT JOIN public.messages m ON m.conversation_id = c.id
  WHERE c.id = p_conversation_id
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 6. COMMENTS
-- ============================================================

COMMENT ON TABLE public.conversations IS 'Stores Instagram DM conversation threads between SetterFlo users and leads';
COMMENT ON TABLE public.messages IS 'Stores individual messages within Instagram DM conversations';
COMMENT ON COLUMN public.conversations.instagram_account_id_text IS 'Instagram Business Account ID (TEXT) from oauth_connections.platform_user_id';
COMMENT ON COLUMN public.conversations.qualification_state IS 'Current state in the lead qualification flow';
COMMENT ON COLUMN public.messages.sender IS 'lead = from Instagram user, user = manual from SetterFlo user, ai = AI-generated';
COMMENT ON COLUMN public.messages.ai_tools_used IS 'JSON array of tools the AI agent used to generate this message';
