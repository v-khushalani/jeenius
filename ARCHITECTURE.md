Ab ek visual diagram bhi bana deta hoon to understand kaise sab kuch connect hai:
Action: file_editor create /app/ARCHITECTURE.md --file-text "# System Architecture - Freemium Mode Flow

```
╔═══════════════════════════════════════════════════════════════════════╗
║                        FREEMIUM SYSTEM ARCHITECTURE                    ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│                         USER (FREE/PREMIUM)                          │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + Vite)                         │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Header     │  │  StudyNow    │  │  Subscription│             │
│  │              │  │    Page      │  │   Plans Page │             │
│  │ \"Upgrade to  │  │              │  │              │             │
│  │  Premium\"    │  │  Chapter     │  │  Payment     │             │
│  │   Button     │  │  Locking     │  │  Flow        │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │        Content Access Functions                       │          │
│  │  - canAccessChapter()                                 │          │
│  │  - canAttemptQuestion()                               │          │
│  │  - canUseAI()                                         │          │
│  └──────────────────────────────────────────────────────┘          │
│                         │                                            │
└─────────────────────────┼────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ↓                       ↓
    ┌──────────────────┐   ┌──────────────────┐
    │   SUPABASE DB    │   │  BACKEND (FastAPI)│
    │                  │   │                   │
    │ Tables:          │   │ Endpoints:        │
    │ • subscriptions  │   │ • create-order    │
    │ • user_content_  │   │ • verify-payment  │
    │   access         │   │                   │
    │ • free_content_  │   │ MongoDB:          │
    │   limits         │   │ • payment_orders  │
    └──────────────────┘   │ • subscriptions   │
                           └──────────────────┘

═══════════════════════════════════════════════════════════════════════

FLOW DIAGRAMS:

1. CHAPTER ACCESS FLOW (Free User)
═══════════════════════════════════

User clicks chapter
        ↓
Check subscription status (Supabase)
        ↓
    ┌───┴────┐
    │Premium?│
    └───┬────┘
    NO  │  YES
        ↓     └──→ Allow Access ✅
Check accessed chapters count
        ↓
    ┌────────────┐
    │ < 5 chapters?│
    └────┬───────┘
    YES  │  NO
         ↓   └──→ Show Lock 🔒 + Paywall
Track access in DB
         ↓
    Allow Access ✅


2. PAYMENT FLOW (Mock)
═══════════════════════

User selects plan
        ↓
Click \"Get Started\"
        ↓
Frontend: initializePayment()
        ↓
POST /api/subscriptions/create-order
        ↓
Backend creates mock order
        ↓
Returns order_id
        ↓
Show \"Processing payment...\"
        ↓
Wait 1.5 seconds (mock delay)
        ↓
POST /api/subscriptions/verify-payment
        ↓
Backend:
  • Verify payment
  • Calculate dates (30/90/365 days)
  • Create subscription in MongoDB
  • Return subscription_id
        ↓
Frontend:
  • Show success message ✅
  • Redirect to dashboard
        ↓
User now has Premium Access! 👑


3. AI ACCESS FLOW
══════════════════

User loads page
        ↓
FloatingAIButton checks canUseAI()
        ↓
    ┌───────────┐
    │ Premium?  │
    └─────┬─────┘
    YES   │   NO
          ↓    └──→ Hide AI Button 🚫
    ┌───────────┐
    │AI Limit>0?│
    └─────┬─────┘
    YES   │   NO
          ↓    └──→ Hide AI Button 🚫
    Show AI Button 🤖


4. QUESTION LIMIT FLOW
════════════════════════

User attempts question
        ↓
Check subscription status
        ↓
    ┌───────────┐
    │ Premium?  │
    └─────┬─────┘
    YES   │   NO
          ↓    └──→ Allow Unlimited ✅
Check today's attempts
        ↓
    ┌──────────────┐
    │ < 25 today?  │
    └──────┬───────┘
    YES    │   NO
           ↓    └──→ Show Paywall 🚫
Track attempt in DB
           ↓
    Allow Question ✅

═══════════════════════════════════════════════════════════════════════

KEY COMPONENTS & FILES:

📁 Backend:
  • /app/backend/server.py
    - create_subscription_order()
    - verify_subscription_payment()
  
📁 Frontend:
  • /app/frontend/src/utils/contentAccess.ts
    - All access checking logic
  
  • /app/frontend/src/pages/StudyNowPage.tsx
    - Chapter locking implementation
  
  • /app/frontend/src/components/FloatingAIButton.tsx
    - AI access control
  
  • /app/frontend/src/utils/razorpay.ts
    - Payment flow
  
  • /app/frontend/src/pages/SubscriptionPlans.tsx
    - Plans display & selection

📊 Database:
  • Supabase:
    - subscriptions (user subscriptions)
    - user_content_access (usage tracking)
    - free_content_limits (limit configurations)
  
  • MongoDB (via Backend):
    - payment_orders (order records)
    - subscriptions (backup/sync)

═══════════════════════════════════════════════════════════════════════

CONFIGURATION:

Free User Limits:
  • Chapters: 5 (across all subjects)
  • Questions: 25 per day
  • AI Queries: 0 (disabled)

Premium Plans:
  • Monthly:   ₹299 (30 days)
  • Quarterly: ₹799 (90 days, save ₹100)
  • Yearly:    ₹2499 (365 days, save ₹1089)

Payment Mode:
  • Current: MOCK (for testing)
  • Future: Real Razorpay (when keys available)

═══════════════════════════════════════════════════════════════════════
```
"
Observation: Create successful: /app/ARCHITECTURE.md
