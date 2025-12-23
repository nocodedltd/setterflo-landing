-- Fix Migration: Properly rename users table and set up new structure
-- This handles the case where tables were created but users wasn't renamed

-- STEP 1: Check if ig_users is empty and users has data
DO $$
DECLARE
  ig_users_count INTEGER;
  users_count INTEGER;
  has_instagram_username BOOLEAN;
BEGIN
  -- Count rows in ig_users
  SELECT COUNT(*) INTO ig_users_count FROM ig_users;
  
  -- Count rows in users  
  SELECT COUNT(*) INTO users_count FROM users;
  
  -- Check if users table has instagram_username column
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'instagram_username'
  ) INTO has_instagram_username;
  
  RAISE NOTICE 'ig_users rows: %, users rows: %, has instagram_username: %', 
    ig_users_count, users_count, has_instagram_username;
  
  -- If users has instagram_username and ig_users is empty, we need to migrate
  IF has_instagram_username AND ig_users_count = 0 AND users_count > 0 THEN
    RAISE NOTICE 'Migrating data from users to ig_users...';
    
    -- Copy data from users to ig_users
    INSERT INTO ig_users 
    SELECT * FROM users;
    
    RAISE NOTICE 'Copied % rows to ig_users', users_count;
    
    -- Now drop the old users table
    DROP TABLE users CASCADE;
    
    RAISE NOTICE 'Dropped old users table';
    
    -- Create new users table for app authentication
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
    
    -- Create indexes
    CREATE INDEX idx_users_email ON public.users(email);
    CREATE INDEX idx_users_subscription ON public.users(subscription_tier, subscription_status);
    
    -- Enable RLS
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
    
    -- Add trigger
    CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE '✅ Migration complete! Old users → ig_users, new users table created';
    
  ELSIF NOT has_instagram_username THEN
    RAISE NOTICE '✅ Migration already complete - users table is the new structure';
  ELSE
    RAISE NOTICE 'ℹ️  No migration needed';
  END IF;
END $$;

-- STEP 2: Add app_user_id to ig_users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ig_users' AND column_name = 'app_user_id'
  ) THEN
    ALTER TABLE ig_users ADD COLUMN app_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
    CREATE INDEX idx_ig_users_app_user_id ON ig_users(app_user_id);
    RAISE NOTICE 'Added app_user_id column to ig_users';
  ELSE
    RAISE NOTICE 'app_user_id already exists in ig_users';
  END IF;
END $$;

-- STEP 3: Update RLS policies for ig_users to work with app_user_id
DROP POLICY IF EXISTS "Users can view own ig_users" ON ig_users;
DROP POLICY IF EXISTS "Users can manage own ig_users" ON ig_users;

CREATE POLICY "Users can view own ig_users" 
  ON ig_users FOR SELECT 
  USING (
    app_user_id = auth.uid() OR
    app_user_id IS NULL -- Allow viewing unlinked leads temporarily
  );

CREATE POLICY "Users can manage own ig_users" 
  ON ig_users FOR ALL 
  USING (
    app_user_id = auth.uid() OR
    app_user_id IS NULL -- Allow managing unlinked leads temporarily
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '  ✅ MIGRATION COMPLETE!';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create your first user account via Supabase Auth';
  RAISE NOTICE '2. Link ig_users to your account:';
  RAISE NOTICE '   UPDATE ig_users SET app_user_id = ''YOUR_USER_ID''';
  RAISE NOTICE '3. Create AI settings:';
  RAISE NOTICE '   INSERT INTO ai_settings (user_id) VALUES (''YOUR_USER_ID'')';
  RAISE NOTICE '';
END $$;
