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
-- 1. CONVERSATIONS TABLE
-- ============================================================
-- Stores conversation threads between SetterFlo users and Instagram leads
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User identification (which SetterFlo user owns this conversation)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Instagram account identification (which Instagram account received the message)
  instagram_account_id TEXT NOT NULL, -- Instagram Business Account ID from oauth_connections
  oauth_connection_id UUID REFERENCES public.oauth_connections(id) ON DELETE SET NULL,
  
  -- Lead identification (the Instagram user messaging us)
  instagram_user_id TEXT NOT NULL, -- Instagram user ID of the lead
  instagram_username TEXT, -- @username if available
  instagram_name TEXT, -- Display name if available
  
  -- Conversation metadata
  instagram_thread_id TEXT, -- Instagram's thread ID (if available)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed', 'snoozed')),
  unread_count INTEGER NOT NULL DEFAULT 0,
  
  -- AI control
  ai_enabled BOOLEAN NOT NULL DEFAULT true,
  ai_paused_at TIMESTAMPTZ,
  ai_paused_reason TEXT,
  
  -- Lead qualification state (for AI agent system)
  qualification_state TEXT DEFAULT 'new' CHECK (qualification_state IN ('new', 'qualifying', 'qualified', 'not_interested', 'booked', 'closed')),
  
  -- Timestamps
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  first_contact_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one conversation per user/account/lead combination
  UNIQUE(user_id, instagram_account_id, instagram_user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_instagram_account_id ON public.conversations(instagram_account_id);
CREATE INDEX IF NOT EXISTS idx_conversations_instagram_user_id ON public.conversations(instagram_user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_oauth_connection_id ON public.conversations(oauth_connection_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_qualification_state ON public.conversations(qualification_state);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_conversations_user_status ON public.conversations(user_id, status);

-- ============================================================
-- 2. MESSAGES TABLE
-- ============================================================
-- Stores individual messages within conversations
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Conversation reference
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  
  -- Message content
  text TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('lead', 'user', 'ai')),
  -- 'lead' = message from Instagram user
  -- 'user' = message sent by SetterFlo user (manual)
  -- 'ai' = message sent by AI agent
  
  -- Message type
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'voice', 'story_reply', 'story_mention', 'reaction')),
  
  -- Instagram metadata
  instagram_message_id TEXT UNIQUE, -- Instagram's message ID
  instagram_timestamp TIMESTAMPTZ, -- When Instagram says the message was sent
  
  -- Read status
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- AI metadata (for AI-generated messages)
  generated_by_ai BOOLEAN NOT NULL DEFAULT false,
  ai_model TEXT, -- e.g., 'gpt-4', 'claude-3'
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  ai_prompt TEXT, -- The prompt used to generate this message (for debugging)
  ai_tools_used JSONB, -- Tools the AI used (e.g., ["send_dm", "create_deal"])
  
  -- Media attachments
  media_url TEXT,
  media_type TEXT, -- 'image', 'video', 'audio'
  media_thumbnail_url TEXT,
  
  -- Error tracking (if message failed to send)
  send_error TEXT,
  send_retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_instagram_message_id ON public.messages(instagram_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON public.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_generated_by_ai ON public.messages(generated_by_ai);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = false;

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

-- Trigger for conversations
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
COMMENT ON COLUMN public.conversations.instagram_account_id IS 'Instagram Business Account ID from oauth_connections.platform_user_id';
COMMENT ON COLUMN public.conversations.qualification_state IS 'Current state in the lead qualification flow';
COMMENT ON COLUMN public.messages.sender IS 'lead = from Instagram user, user = manual from SetterFlo user, ai = AI-generated';
COMMENT ON COLUMN public.messages.ai_tools_used IS 'JSON array of tools the AI agent used to generate this message';
