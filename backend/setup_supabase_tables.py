
Action: file_editor create /app/backend/setup_supabase_tables.py --file-text "\"\"\"
Script to setup Supabase tables for freemium mode
Run this script to create all required tables and initialize data
\"\"\"

import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase connection details from frontend .env
SUPABASE_URL = \"https://mcmfmuiyycuozulrxyam.supabase.co\"
SUPABASE_KEY = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbWZtdWl5eWN1b3p1bHJ4eWFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzMjUzMywiZXhwIjoyMDc0MDA4NTMzfQ.PZPOE4v3V1tUAyUMJofsZZErPpNkJyXM_xjJvDFpCXg\"

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQL for creating tables
CREATE_SUBSCRIPTIONS_TABLE = \"\"\"
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  payment_id TEXT,
  order_id TEXT,
  amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
\"\"\"

CREATE_USER_CONTENT_ACCESS_TABLE = \"\"\"
CREATE TABLE IF NOT EXISTS user_content_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_identifier TEXT NOT NULL,
  subject TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_identifier, subject)
);

CREATE INDEX IF NOT EXISTS idx_user_content_access_user_id ON user_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_content_type ON user_content_access(content_type);
CREATE INDEX IF NOT EXISTS idx_user_content_access_accessed_at ON user_content_access(accessed_at);
\"\"\"

CREATE_FREE_CONTENT_LIMITS_TABLE = \"\"\"
CREATE TABLE IF NOT EXISTS free_content_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  limit_type TEXT UNIQUE NOT NULL,
  limit_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\"\"\"

def setup_tables():
    \"\"\"Create all required tables\"\"\"
    print(\"🚀 Starting Supabase table setup...\")
    
    try:
        # Create subscriptions table
        print(\"\n1️⃣ Creating subscriptions table...\")
        result = supabase.rpc('exec_sql', {'sql': CREATE_SUBSCRIPTIONS_TABLE}).execute()
        print(\"✅ Subscriptions table created/verified\")
        
        # Create user_content_access table
        print(\"\n2️⃣ Creating user_content_access table...\")
        result = supabase.rpc('exec_sql', {'sql': CREATE_USER_CONTENT_ACCESS_TABLE}).execute()
        print(\"✅ User content access table created/verified\")
        
        # Create free_content_limits table
        print(\"\n3️⃣ Creating free_content_limits table...\")
        result = supabase.rpc('exec_sql', {'sql': CREATE_FREE_CONTENT_LIMITS_TABLE}).execute()
        print(\"✅ Free content limits table created/verified\")
        
    except Exception as e:
        print(f\"⚠️  Note: Could not create tables via RPC. Error: {str(e)}\")
        print(\"\n📝 Please run these SQL scripts manually in Supabase SQL Editor:\")
        print(\"\n\" + \"=\"*80)
        print(\"\n-- SCRIPT 1: Subscriptions Table\")
        print(CREATE_SUBSCRIPTIONS_TABLE)
        print(\"\n\" + \"=\"*80)
        print(\"\n-- SCRIPT 2: User Content Access Table\")
        print(CREATE_USER_CONTENT_ACCESS_TABLE)
        print(\"\n\" + \"=\"*80)
        print(\"\n-- SCRIPT 3: Free Content Limits Table\")
        print(CREATE_FREE_CONTENT_LIMITS_TABLE)
        print(\"\n\" + \"=\"*80)

def initialize_limits():
    \"\"\"Initialize free content limits\"\"\"
    print(\"\n4️⃣ Initializing free content limits...\")
    
    limits = [
        {\"limit_type\": \"chapters\", \"limit_value\": 5},
        {\"limit_type\": \"questions_per_day\", \"limit_value\": 25},
        {\"limit_type\": \"ai_queries_per_day\", \"limit_value\": 0}
    ]
    
    try:
        for limit in limits:
            # Try to insert, if exists, update
            try:
                result = supabase.table('free_content_limits').insert(limit).execute()
                print(f\"  ✅ Inserted {limit['limit_type']}: {limit['limit_value']}\")
            except Exception as insert_error:
                # If insert fails, try update
                try:
                    result = supabase.table('free_content_limits')\
                        .update({\"limit_value\": limit['limit_value']})\
                        .eq('limit_type', limit['limit_type'])\
                        .execute()
                    print(f\"  ✅ Updated {limit['limit_type']}: {limit['limit_value']}\")
                except Exception as update_error:
                    print(f\"  ⚠️  Could not insert/update {limit['limit_type']}: {str(update_error)}\")
        
        print(\"\n✅ Free content limits initialized!\")
        
    except Exception as e:
        print(f\"⚠️  Error initializing limits: {str(e)}\")
        print(\"\n📝 Please run this SQL manually in Supabase:\")
        print(\"\"\"
INSERT INTO free_content_limits (limit_type, limit_value) VALUES
  ('chapters', 5),
  ('questions_per_day', 25),
  ('ai_queries_per_day', 0)
ON CONFLICT (limit_type) DO UPDATE SET limit_value = EXCLUDED.limit_value;
        \"\"\")

def verify_setup():
    \"\"\"Verify tables exist and have data\"\"\"
    print(\"\n5️⃣ Verifying setup...\")
    
    try:
        # Check free_content_limits
        result = supabase.table('free_content_limits').select('*').execute()
        if result.data:
            print(f\"  ✅ Found {len(result.data)} limit configurations:\")
            for limit in result.data:
                print(f\"     - {limit['limit_type']}: {limit['limit_value']}\")
        else:
            print(\"  ⚠️  No limits found in database\")
            
    except Exception as e:
        print(f\"  ⚠️  Error verifying setup: {str(e)}\")

if __name__ == \"__main__\":
    print(\"\"\"
╔════════════════════════════════════════════════════════════════╗
║            Supabase Freemium Tables Setup Script              ║
╚════════════════════════════════════════════════════════════════╝
\"\"\")
    
    setup_tables()
    initialize_limits()
    verify_setup()
    
    print(\"\"\"
╔════════════════════════════════════════════════════════════════╗
║                        Setup Complete!                         ║
║                                                                ║
║  Next Steps:                                                   ║
║  1. If tables weren't created automatically, run the SQL       ║
║     scripts shown above in Supabase SQL Editor                 ║
║  2. Test the freemium mode in your app                         ║
║  3. Check chapter locking works correctly                      ║
║  4. Test mock payment flow                                     ║
╚════════════════════════════════════════════════════════════════╝
\"\"\")
"
Observation: Create successful: /app/backend/setup_supabase_tables.py
