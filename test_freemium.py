Ab main ek comprehensive testing guide aur example user flow bana deta hoon:
Action: file_editor create /app/test_freemium.py --file-text "\"\"\"
Testing Script for Freemium Mode
This script helps you test the freemium functionality
\"\"\"

import requests
import json

# Backend URL
BACKEND_URL = \"https://component-connect-1.preview.emergentagent.com\"

print(\"\"\"
╔════════════════════════════════════════════════════════════════╗
║         Freemium Mode Testing Guide & Test Scripts            ║
╚════════════════════════════════════════════════════════════════╝
\"\"\")

print(\"\n\" + \"=\"*70)
print(\"TEST 1: Backend Payment Endpoints\")
print(\"=\"*70)

# Test 1: Create Order
print(\"\n1️⃣ Testing Create Order Endpoint...\")
create_order_data = {
    \"amount\": 299,
    \"plan_id\": \"monthly\",
    \"user_id\": \"test-user-123\"
}

try:
    response = requests.post(
        f\"{BACKEND_URL}/api/subscriptions/create-order\",
        json=create_order_data,
        headers={\"Content-Type\": \"application/json\"}
    )
    
    if response.status_code == 200:
        order_data = response.json()
        print(f\"✅ Create Order Success!\")
        print(f\"   Order ID: {order_data['order_id']}\")
        print(f\"   Amount: ₹{order_data['amount']}\")
        print(f\"   Currency: {order_data['currency']}\")
        
        # Test 2: Verify Payment
        print(\"\n2️⃣ Testing Verify Payment Endpoint...\")
        verify_data = {
            \"razorpay_order_id\": order_data['order_id'],
            \"razorpay_payment_id\": f\"pay_mock_{order_data['order_id']}\",
            \"razorpay_signature\": f\"sig_mock_{order_data['order_id']}\",
            \"user_id\": \"test-user-123\",
            \"plan_id\": \"monthly\"
        }
        
        verify_response = requests.post(
            f\"{BACKEND_URL}/api/subscriptions/verify-payment\",
            json=verify_data,
            headers={\"Content-Type\": \"application/json\"}
        )
        
        if verify_response.status_code == 200:
            verify_result = verify_response.json()
            print(f\"✅ Payment Verification Success!\")
            print(f\"   Verified: {verify_result['verified']}\")
            print(f\"   Subscription ID: {verify_result.get('subscription_id', 'N/A')}\")
            print(f\"   Message: {verify_result['message']}\")
        else:
            print(f\"❌ Payment Verification Failed: {verify_response.status_code}\")
            print(f\"   Response: {verify_response.text}\")
    else:
        print(f\"❌ Create Order Failed: {response.status_code}\")
        print(f\"   Response: {response.text}\")
        
except Exception as e:
    print(f\"❌ Error testing endpoints: {str(e)}\")

print(\"\n\" + \"=\"*70)
print(\"FRONTEND TESTING CHECKLIST\")
print(\"=\"*70)

checklist = \"\"\"
📋 Manual Testing Steps:

1. CHAPTER LOCKING TEST (Free User)
   ✅ Steps:
      a. Login as a free user
      b. Go to Study Now → Select any subject
      c. Open first 5 chapters → Should work
      d. Try to open 6th chapter → Should show lock icon
      e. Click locked chapter → Should show paywall
   
   Expected Result:
      - First 5 chapters accessible across ALL subjects
      - 6th+ chapters show lock icon and paywall
      - \"Upgrade to Premium\" button visible

2. SUBSCRIPTION PLANS VISIBILITY TEST
   ✅ Steps:
      a. Click on user dropdown in Header
      b. Check for \"Upgrade to Premium\" option
      c. Click it → Should navigate to /subscription-plans
      d. Verify all 3 plans displayed (Monthly, Quarterly, Yearly)
   
   Expected Result:
      - /subscription-plans page loads correctly
      - All plans show pricing and features
      - \"Get Started\" buttons visible

3. MOCK PAYMENT FLOW TEST
   ✅ Steps:
      a. On subscription plans page, click \"Get Started\" on any plan
      b. Should see \"Processing mock payment...\" message
      c. Wait ~1.5 seconds
      d. Should see success message
      e. Check if subscription is created
   
   Expected Result:
      - Mock payment processes without errors
      - Success alert shown
      - User redirected to dashboard
      - Subscription created in database

4. PREMIUM USER TEST
   ✅ Steps:
      a. After successful payment, go to Study Now
      b. Try accessing any chapter
      c. All chapters should be unlocked
   
   Expected Result:
      - No lock icons on any chapter
      - Can access all chapters freely
      - No paywall shown

5. AI FEATURES TEST (Free User)
   ✅ Steps:
      a. Logout and login as a NEW free user
      b. Go to any page (Dashboard, Study Now, etc.)
      c. Look for floating AI button (bottom-right)
   
   Expected Result:
      - AI button should NOT be visible
      - No AI features accessible for free users

6. AI FEATURES TEST (Premium User)
   ✅ Steps:
      a. Login with account that has subscription
      b. Check for floating AI button
   
   Expected Result:
      - AI button visible (purple/pink button)
      - Can click and use AI features

7. QUESTION LIMITS TEST (Advanced)
   ✅ Steps:
      a. As free user, attempt 25 questions
      b. Try 26th question
   
   Expected Result:
      - First 25 questions work
      - 26th question shows paywall
      - Counter resets next day

8. USAGE TRACKING TEST
   ✅ Steps:
      a. Open browser DevTools → Network tab
      b. Access a chapter
      c. Check for Supabase insert to 'user_content_access'
   
   Expected Result:
      - Chapter access tracked in database
      - Can see insert request in Network tab
\"\"\"

print(checklist)

print(\"\n\" + \"=\"*70)
print(\"COMMON ISSUES & SOLUTIONS\")
print(\"=\"*70)

issues = \"\"\"
⚠️  Issue 1: Chapters not locking
   Solution: 
   - Check if 'user_content_access' table exists in Supabase
   - Verify 'free_content_limits' has correct values
   - Check browser console for errors

⚠️  Issue 2: Payment fails silently
   Solution:
   - Check backend logs: tail -f /var/log/supervisor/backend.err.log
   - Verify backend endpoints are responding
   - Check Network tab in browser DevTools

⚠️  Issue 3: AI button still visible for free users
   Solution:
   - Hard refresh browser (Ctrl + Shift + R)
   - Clear cache and cookies
   - Check if 'ai_queries_per_day' is set to 0 in database

⚠️  Issue 4: Subscription plans page not found
   Solution:
   - Check route is defined in App.tsx
   - Verify path is '/subscription-plans' (with hyphen)
   - Check for any React errors in console

⚠️  Issue 5: Supabase tables don't exist
   Solution:
   - Go to Supabase Dashboard → SQL Editor
   - Run the script from 'supabase_setup.sql' file
   - Verify tables created using: SELECT * FROM information_schema.tables;
\"\"\"

print(issues)

print(\"\n\" + \"=\"*70)
print(\"QUICK DEBUG COMMANDS\")
print(\"=\"*70)

commands = \"\"\"
# Check backend logs
tail -f /var/log/supervisor/backend.err.log

# Check frontend in browser
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors

# Test backend endpoint manually
curl -X POST https://component-connect-1.preview.emergentagent.com/api/subscriptions/create-order \\
  -H \"Content-Type: application/json\" \\
  -d '{\"amount\": 299, \"plan_id\": \"monthly\", \"user_id\": \"test-123\"}'

# Check if services are running
sudo supervisorctl status

# Restart services if needed
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
\"\"\"

print(commands)

print(\"\n\" + \"=\"*70)
print(\"DATABASE VERIFICATION QUERIES (Run in Supabase SQL Editor)\")
print(\"=\"*70)

queries = \"\"\"
-- Check if free_content_limits are set correctly
SELECT * FROM free_content_limits ORDER BY limit_type;

-- Check user's accessed chapters
SELECT * FROM user_content_access 
WHERE user_id = 'YOUR_USER_ID' 
  AND content_type = 'chapter';

-- Check active subscriptions
SELECT * FROM subscriptions 
WHERE status = 'active' 
  AND end_date > NOW();

-- Count chapters accessed by a user
SELECT COUNT(DISTINCT content_identifier) as chapters_accessed
FROM user_content_access 
WHERE user_id = 'YOUR_USER_ID' 
  AND content_type = 'chapter';
\"\"\"

print(queries)

print(\"\"\"
╔════════════════════════════════════════════════════════════════╗
║                     Testing Guide Complete                     ║
║                                                                ║
║  Follow the checklist above to test all freemium features     ║
║  If you encounter issues, check the solutions section          ║
╚════════════════════════════════════════════════════════════════╝
\"\"\")
"
Observation: Create successful: /app/test_freemium.py
