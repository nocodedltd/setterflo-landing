-- Add onboarding and business fields to users table

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS instagram_pipedream_account_id TEXT,
ADD COLUMN IF NOT EXISTS crm_connection JSONB,
ADD COLUMN IF NOT EXISTS calendar_connection JSONB;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed ON public.users(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_users_instagram_account_id ON public.users(instagram_account_id);

-- Update ai_settings table to add new fields
ALTER TABLE public.ai_settings
ADD COLUMN IF NOT EXISTS personality TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS response_style TEXT DEFAULT 'friendly';

-- Add comment to table
COMMENT ON COLUMN public.users.full_name IS 'User full name from sign up';
COMMENT ON COLUMN public.users.business_name IS 'Name of the user business';
COMMENT ON COLUMN public.users.business_type IS 'Type of business (coach, consultant, etc)';
COMMENT ON COLUMN public.users.target_audience IS 'Description of target audience';
COMMENT ON COLUMN public.users.onboarding_completed IS 'Whether user has completed onboarding flow';
COMMENT ON COLUMN public.users.instagram_pipedream_account_id IS 'Pipedream Connect account ID for Instagram OAuth';
COMMENT ON COLUMN public.users.crm_connection IS 'CRM connection details (provider, account_id, etc)';
COMMENT ON COLUMN public.users.calendar_connection IS 'Calendar connection details (provider, account_id, etc)';
