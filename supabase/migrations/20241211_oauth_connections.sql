-- Create oauth_connections table for storing user OAuth tokens
CREATE TABLE IF NOT EXISTS oauth_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Platform identification
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'calendly', 'calcom', 'gohighlevel', 'hubspot', 'pipedrive', 'activecampaign', 'salesforce', 'monday')),
  platform_user_id TEXT, -- Their user ID on the platform
  platform_account_name TEXT, -- Display name (e.g., '@nocoded.ai', 'john@company.com')
  platform_account_email TEXT, -- Email if available
  
  -- OAuth Tokens (encrypted at application level)
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Platform-specific metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}', 
  -- Examples:
  -- Instagram: {"instagram_business_account_id": "xxx", "page_id": "xxx"}
  -- Calendly: {"event_types": [{...}], "user_uri": "xxx"}
  -- GHL: {"location_id": "xxx", "location_name": "xxx"}
  -- HubSpot: {"portal_id": "xxx", "hub_domain": "xxx"}
  
  scopes TEXT[], -- Approved OAuth scopes
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error', 'expired')),
  last_synced_at TIMESTAMPTZ,
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON oauth_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_platform ON oauth_connections(platform);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_status ON oauth_connections(status);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_platform ON oauth_connections(user_id, platform);

-- Create composite unique index to allow multiple connections per platform (for multi-account support)
-- But prevent duplicate connections for the same platform account
CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_connections_unique 
  ON oauth_connections(user_id, platform, platform_user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_oauth_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER oauth_connections_updated_at
  BEFORE UPDATE ON oauth_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_oauth_connections_updated_at();

-- Enable Row Level Security
ALTER TABLE oauth_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own connections
CREATE POLICY "Users can view their own OAuth connections"
  ON oauth_connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OAuth connections"
  ON oauth_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OAuth connections"
  ON oauth_connections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OAuth connections"
  ON oauth_connections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create integration_settings table for user preferences
CREATE TABLE IF NOT EXISTS integration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'calendly', 'calcom', 'gohighlevel', 'hubspot', 'pipedrive', 'activecampaign', 'salesforce', 'monday')),
  
  -- User preferences (platform-specific)
  settings JSONB DEFAULT '{}',
  -- Examples:
  -- Instagram: {"auto_respond": true, "dm_triggers": ["interested", "pricing"]}
  -- Calendly: {"default_event_type_id": "xxx", "auto_share": true}
  -- GHL: {"default_pipeline_id": "xxx", "default_stage_id": "xxx", "auto_create_opportunity": true}
  -- HubSpot: {"default_pipeline": "xxx", "default_stage": "xxx"}
  
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, platform)
);

-- Indexes for integration_settings
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_platform ON integration_settings(platform);

-- Trigger for integration_settings updated_at
CREATE TRIGGER integration_settings_updated_at
  BEFORE UPDATE ON integration_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_oauth_connections_updated_at();

-- Enable RLS
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integration_settings
CREATE POLICY "Users can manage their own integration settings"
  ON integration_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE oauth_connections IS 'Stores OAuth tokens and connection status for third-party integrations';
COMMENT ON TABLE integration_settings IS 'Stores user preferences and settings for each integration';
COMMENT ON COLUMN oauth_connections.access_token IS 'Encrypted OAuth access token';
COMMENT ON COLUMN oauth_connections.refresh_token IS 'Encrypted OAuth refresh token';
COMMENT ON COLUMN oauth_connections.metadata IS 'Platform-specific data stored as JSON';
