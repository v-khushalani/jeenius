First, let me create a SQL setup file for the Supabase tables:
Action: file_editor create /app/frontend/supabase_freemium_setup.sql --file-text "-- ================================================
-- JEEnius Freemium System - Supabase Setup
-- ================================================
-- This file sets up all tables needed for the freemium subscription system
-- Run this in your Supabase SQL editor

-- ================================================
-- Table 1: subscriptions
-- ================================================
-- Tracks user subscription status and details
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  amount DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'cancelled'))
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- ================================================
-- Table 2: user_content_access
-- ================================================
-- Tracks what content each user has accessed (chapters, questions, AI queries)
CREATE TABLE IF NOT EXISTS user_content_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_identifier TEXT NOT NULL,
  subject TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_content_type CHECK (content_type IN ('chapter', 'question', 'ai_query'))
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_content_access_user_id ON user_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_content_type ON user_content_access(content_type);
CREATE INDEX IF NOT EXISTS idx_user_content_access_accessed_at ON user_content_access(accessed_at);

-- Add unique constraint to prevent duplicate chapter access tracking
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_chapter_access 
  ON user_content_access(user_id, content_type, content_identifier, subject)
  WHERE content_type = 'chapter';

-- ================================================
-- Table 3: free_content_limits
-- ================================================
-- Configures limits for free tier users
CREATE TABLE IF NOT EXISTS free_content_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  limit_type TEXT NOT NULL UNIQUE,
  limit_value INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- Seed Default Free Tier Limits
-- ================================================
INSERT INTO free_content_limits (limit_type, limit_value, description) VALUES
  ('chapters', 5, 'Total chapters accessible across all subjects for free users'),
  ('questions_per_day', 25, 'Daily question attempt limit for free users'),
  ('ai_queries_per_day', 0, 'Daily AI query limit for free users (0 = disabled)')
ON CONFLICT (limit_type) DO UPDATE SET
  limit_value = EXCLUDED.limit_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ================================================
-- Enable Row Level Security (RLS)
-- ================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_content_limits ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS Policies for subscriptions
-- ================================================
-- Users can view their own subscriptions
CREATE POLICY \"Users can view own subscriptions\" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions (via backend)
CREATE POLICY \"Users can insert own subscriptions\" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY \"Service role full access\" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- ================================================
-- RLS Policies for user_content_access
-- ================================================
-- Users can view their own content access
CREATE POLICY \"Users can view own access\" ON user_content_access
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own access records
CREATE POLICY \"Users can insert own access\" ON user_content_access
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role full access
CREATE POLICY \"Service role full access on access\" ON user_content_access
  FOR ALL USING (auth.role() = 'service_role');

-- ================================================
-- RLS Policies for free_content_limits
-- ================================================
-- Everyone can read limits (but only admins can modify)
CREATE POLICY \"Anyone can view limits\" ON free_content_limits
  FOR SELECT USING (true);

-- Only service role can modify
CREATE POLICY \"Service role can modify limits\" ON free_content_limits
  FOR ALL USING (auth.role() = 'service_role');

-- ================================================
-- Helper Functions
-- ================================================

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_uuid
      AND status = 'active'
      AND end_date >= NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's remaining free chapters
CREATE OR REPLACE FUNCTION get_remaining_free_chapters(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_limit INTEGER;
  chapters_used INTEGER;
BEGIN
  -- Get the limit
  SELECT limit_value INTO total_limit
  FROM free_content_limits
  WHERE limit_type = 'chapters';
  
  -- Count unique chapters accessed
  SELECT COUNT(DISTINCT content_identifier || '-' || COALESCE(subject, ''))
  INTO chapters_used
  FROM user_content_access
  WHERE user_id = user_uuid
    AND content_type = 'chapter';
  
  RETURN GREATEST(0, total_limit - chapters_used);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Success Message
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Freemium system tables created successfully!';
  RAISE NOTICE '📊 Free tier limits configured:';
  RAISE NOTICE '   - Chapters: 5 total across all subjects';
  RAISE NOTICE '   - Questions: 25 per day';
  RAISE NOTICE '   - AI Queries: 0 per day (disabled for free users)';
END $$;
"
Observation: Create successful: /app/frontend/supabase_freemium_setup.sql
