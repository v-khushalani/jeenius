Good, vite is running directly. The frontend is working fine. Now let me create a comprehensive plan document and then we can finish. Let me create one more important file - a script to initialize Supabase tables:
Action: file_editor create /app/FREEMIUM_SETUP.md --file-text "# Freemium Mode Setup Guide

## Overview
This document describes the freemium system implementation for the JEE Learning app.

## Freemium Limits (As Configured)
- **Free Chapters**: 5 chapters total across all subjects
- **Daily Questions**: 25 questions per day
- **AI Queries**: 0 (AI features disabled for free users)

## Database Tables Required in Supabase

### 1. `subscriptions` table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
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

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
```

### 2. `user_content_access` table
```sql
CREATE TABLE user_content_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_type TEXT NOT NULL, -- 'chapter', 'question', 'ai_query'
  content_identifier TEXT NOT NULL,
  subject TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_identifier, subject)
);

CREATE INDEX idx_user_content_access_user_id ON user_content_access(user_id);
CREATE INDEX idx_user_content_access_content_type ON user_content_access(content_type);
CREATE INDEX idx_user_content_access_accessed_at ON user_content_access(accessed_at);
```

### 3. `free_content_limits` table
```sql
CREATE TABLE free_content_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  limit_type TEXT UNIQUE NOT NULL, -- 'chapters', 'questions_per_day', 'ai_queries_per_day'
  limit_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default limits
INSERT INTO free_content_limits (limit_type, limit_value) VALUES
  ('chapters', 5),
  ('questions_per_day', 25),
  ('ai_queries_per_day', 0)
ON CONFLICT (limit_type) DO UPDATE SET limit_value = EXCLUDED.limit_value;
```

### 4. `payment_orders` table (MongoDB - for backend)
This is stored in MongoDB by the backend automatically when orders are created.

## How It Works

### Chapter Access Flow
1. User clicks on a chapter in StudyNowPage
2. System checks:
   - Does user have active subscription? → Allow access
   - Has user accessed this chapter before? → Allow access
   - Has user accessed < 5 chapters total? → Allow access + Track
   - Otherwise → Show paywall
3. When chapter is opened, it's tracked in `user_content_access` table

### Question Access Flow
1. User attempts to answer a question
2. System checks:
   - Does user have active subscription? → Allow
   - Has user attempted < 25 questions today? → Allow + Track
   - Otherwise → Show paywall
3. Each question attempt is tracked with timestamp

### AI Access Flow
1. User tries to open AI features
2. System checks:
   - Does user have active subscription? → Show AI button
   - Otherwise → Hide AI button completely (0 query limit)
3. Free users never see AI features

### Payment Flow (Mock)
1. User clicks \"Upgrade to Premium\" → Goes to /subscription-plans
2. User selects a plan → Calls `initializePayment()`
3. Frontend calls `/api/subscriptions/create-order` → Backend creates mock order
4. Mock payment is \"processed\" (1.5 second delay)
5. Frontend calls `/api/subscriptions/verify-payment` → Backend creates subscription
6. User is redirected to dashboard with active subscription

## Backend Endpoints

### POST `/api/subscriptions/create-order`
Creates a mock Razorpay order.

**Request:**
```json
{
  \"amount\": 299,
  \"plan_id\": \"monthly\",
  \"user_id\": \"user-uuid\"
}
```

**Response:**
```json
{
  \"order_id\": \"order_mock_xxxx\",
  \"amount\": 299,
  \"currency\": \"INR\"
}
```

### POST `/api/subscriptions/verify-payment`
Verifies mock payment and creates subscription.

**Request:**
```json
{
  \"razorpay_order_id\": \"order_mock_xxxx\",
  \"razorpay_payment_id\": \"pay_mock_xxxx\",
  \"razorpay_signature\": \"sig_mock_xxxx\",
  \"user_id\": \"user-uuid\",
  \"plan_id\": \"monthly\"
}
```

**Response:**
```json
{
  \"verified\": true,
  \"subscription_id\": \"subscription-uuid\",
  \"message\": \"Payment verified and subscription activated\"
}
```

## Frontend Components

### Key Files Modified
- `/frontend/src/utils/contentAccess.ts` - Content access logic
- `/frontend/src/pages/StudyNowPage.tsx` - Chapter locking
- `/frontend/src/components/FloatingAIButton.tsx` - AI access control
- `/frontend/src/utils/razorpay.ts` - Payment integration
- `/frontend/src/components/Header.tsx` - Upgrade link

### Content Access Functions
```typescript
import { canAccessChapter, canAttemptQuestion, canUseAI } from '@/utils/contentAccess';

// Check chapter access
const access = await canAccessChapter(userId, subject, chapterName);
if (!access.allowed) {
  // Show paywall with access.message
}

// Check question access
const questionAccess = await canAttemptQuestion(userId);
if (!questionAccess.allowed) {
  // Show paywall
}

// Check AI access
const aiAccess = await canUseAI(userId);
if (!aiAccess.allowed) {
  // Hide AI features
}
```

## Testing Checklist

### 1. Chapter Locking
- [ ] Free user can access first 5 chapters across all subjects
- [ ] 6th chapter shows lock icon and paywall
- [ ] Premium user can access all chapters
- [ ] Chapter access is tracked in database

### 2. Question Limits
- [ ] Free user can attempt 25 questions per day
- [ ] 26th question shows paywall
- [ ] Counter resets at midnight
- [ ] Premium user has unlimited questions

### 3. AI Features
- [ ] Free user does NOT see AI button
- [ ] Premium user sees AI button
- [ ] AI features are completely disabled for free users

### 4. Payment Flow
- [ ] Clicking \"Upgrade to Premium\" navigates to /subscription-plans
- [ ] Subscription plans page displays correctly
- [ ] Mock payment processing works
- [ ] Subscription is created after payment
- [ ] User gets premium access after subscription

### 5. Subscription Visibility
- [ ] \"Upgrade to Premium\" link visible in Header dropdown
- [ ] Paywall components link to subscription plans
- [ ] Locked chapters show upgrade button

## Configuration

### Changing Freemium Limits
To change limits, update the values in Supabase `free_content_limits` table:

```sql
UPDATE free_content_limits SET limit_value = 10 WHERE limit_type = 'chapters';
UPDATE free_content_limits SET limit_value = 50 WHERE limit_type = 'questions_per_day';
UPDATE free_content_limits SET limit_value = 5 WHERE limit_type = 'ai_queries_per_day';
```

Or update the fallback values in `/frontend/src/utils/contentAccess.ts`:
- `chaptersLimit: 5`
- `questionsDailyLimit: 25`
- `aiDailyLimit: 0`

## Switching from Mock to Real Razorpay

When Razorpay registration is complete:

1. Update `/frontend/.env`:
```env
VITE_RAZORPAY_KEY_ID=your_actual_key_id
```

2. Update `/backend/.env` (add):
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

3. Update `/frontend/src/utils/razorpay.ts`:
   - Remove mock payment logic
   - Add real Razorpay script loading
   - Implement actual Razorpay payment flow

4. Update `/backend/server.py`:
   - Add Razorpay SDK: `pip install razorpay`
   - Update create-order to call Razorpay API
   - Update verify-payment to verify signature with Razorpay secret

## Support

For issues or questions:
1. Check Supabase tables are created correctly
2. Verify environment variables are set
3. Check browser console for errors
4. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
5. Check frontend logs in browser DevTools
"
Observation: Create successful: /app/FREEMIUM_SETUP.md
