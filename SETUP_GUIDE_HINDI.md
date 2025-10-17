Perfect! Backend payment endpoints are working! Ab ek step-by-step guide Hindi me bana deta hoon:
Action: file_editor create /app/SETUP_GUIDE_HINDI.md --file-text "# 🚀 Freemium Mode Setup - Complete Guide (Hindi)

## ✅ Kya ho gaya hai (Already Done)

### 1. Backend Payment Integration
- ✅ Mock Razorpay payment endpoints ban gaye hain
- ✅ `/api/subscriptions/create-order` - Order create karta hai
- ✅ `/api/subscriptions/verify-payment` - Payment verify karke subscription banata hai
- ✅ Test kar liya - **WORKING PERFECTLY!** ✅

### 2. Frontend Code
- ✅ Chapter locking logic complete
- ✅ AI button free users ke liye hide ho jati hai
- ✅ Subscription plans page ready hai
- ✅ Payment flow backend se connect ho gaya
- ✅ Header me \"Upgrade to Premium\" button add ho gaya

### 3. Limits Configuration
- ✅ 5 chapters free (sabhi subjects me total)
- ✅ 25 questions per day
- ✅ 0 AI queries (AI completely disabled for free users)

## 🎯 Ab Kya Karna Hai (Next Steps)

### Step 1: Supabase Me Tables Banao

**Option A: SQL Script Run Karo (Recommended)**
1. Supabase dashboard me jao: https://supabase.com/dashboard
2. Apne project select karo
3. Left sidebar me \"SQL Editor\" pe click karo
4. Naya query banao (New Query button)
5. `/app/supabase_setup.sql` file ka content copy karo
6. Paste karo aur \"Run\" button pe click karo
7. Success message aayega ✅

**Option B: Python Script (Alternative)**
```bash
cd /app/backend
python setup_supabase_tables.py
```
(Note: Free content limits already set ho gaye hain ✅)

### Step 2: Test Karo App Ko

#### A. Chapter Locking Test
1. App ko browser me kholo
2. Login karo (ya signup karo)
3. \"Study Now\" pe jao
4. Koi bhi subject select karo
5. Dekho:
   - Pehle 5 chapters khul jayenge ✅
   - 6th chapter me lock icon dikhai dega 🔒
   - Lock pe click karo → \"Upgrade to Premium\" paywall aayega

#### B. Subscription Page Test
1. Header me apne user icon pe click karo (top-right)
2. Dropdown me \"Upgrade to Premium\" dikhega
3. Us pe click karo
4. Subscription plans page khul jayega with 3 plans

#### C. Payment Flow Test (Mock)
1. Subscription plans page pe koi plan select karo
2. \"Get Started\" button pe click karo
3. \"Processing mock payment...\" message dikhai dega
4. 1-2 seconds wait karo
5. Success message aayega ✅
6. Dashboard pe redirect ho jaoge

#### D. Premium Access Test
1. Payment ke baad Study Now pe jao
2. Ab SAARE chapters unlocked honge 🎉
3. Koi bhi chapter khol sakte ho

#### E. AI Button Test
**Free User:**
- AI button (purple/pink floating button) NAHI dikhni chahiye

**Premium User:**
- AI button visible hogi bottom-right corner me

### Step 3: Common Issues Aur Solutions

#### Issue 1: Chapters lock nahi ho rahe
**Solution:**
```sql
-- Supabase SQL Editor me ye run karo
SELECT * FROM free_content_limits;
-- Output me dikhna chahiye:
-- chapters: 5
-- questions_per_day: 25
-- ai_queries_per_day: 0
```

#### Issue 2: Payment fail ho rahi hai
**Check Backend Logs:**
```bash
tail -f /var/log/supervisor/backend.err.log
```
**Check if Backend Running:**
```bash
sudo supervisorctl status backend
# Should show: RUNNING
```

#### Issue 3: AI button abhi bhi dikh rahi hai (free user ko)
**Solutions:**
1. Browser hard refresh karo: `Ctrl + Shift + R`
2. Cache clear karo
3. DevTools Console me errors check karo (F12)

#### Issue 4: Subscription plans page nahi khul raha
**Check:**
1. Browser console me errors dekho (F12)
2. Network tab me 404 errors check karo
3. URL correct hai: `/subscription-plans` (hyphen ke saath)

## 📊 Database Check Kaise Kare

### Supabase Dashboard Me:
1. \"Table Editor\" pe jao
2. Ye tables dikhni chahiye:
   - ✅ subscriptions
   - ✅ user_content_access
   - ✅ free_content_limits

### SQL Queries (SQL Editor me run karo):

**1. Limits check karo:**
```sql
SELECT * FROM free_content_limits ORDER BY limit_type;
```

**2. Apne accessed chapters dekho:**
```sql
SELECT * FROM user_content_access 
WHERE user_id = 'YOUR_USER_ID' 
  AND content_type = 'chapter';
```
(Replace 'YOUR_USER_ID' with actual user ID)

**3. Active subscriptions dekho:**
```sql
SELECT * FROM subscriptions 
WHERE status = 'active' 
  AND end_date > NOW();
```

## 🔧 Quick Commands

### Services Restart Karo:
```bash
sudo supervisorctl restart all
```

### Backend Test Karo:
```bash
curl -X POST https://component-connect-1.preview.emergentagent.com/api/subscriptions/create-order \
  -H \"Content-Type: application/json\" \
  -d '{\"amount\": 299, \"plan_id\": \"monthly\", \"user_id\": \"test-123\"}'
```

### Logs Check Karo:
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log

# Frontend logs (browser me F12 → Console)
```

## 🎨 UI Elements Jo Dikhai Denge

### Free User:
- 🔒 Lock icons on 6th+ chapters
- 🚫 No AI floating button
- ⚡ \"Upgrade to Premium\" buttons/links
- 📊 Paywall popups when accessing locked content

### Premium User:
- ✅ All chapters unlocked
- 🤖 AI button visible
- 👑 No paywalls
- ∞ Unlimited access

## 📝 Testing Checklist

Copy paste this and check off as you test:

```
□ Login kar sakte ho
□ Study Now page load ho raha hai
□ Subjects dikh rahe hain
□ First chapter open ho raha hai
□ 5 chapters access kar sakte ho
□ 6th chapter me lock icon hai
□ Lock pe click karke paywall aata hai
□ Header dropdown me \"Upgrade to Premium\" hai
□ Subscription plans page khul raha hai
□ 3 plans dikh rahe hain (Monthly, Quarterly, Yearly)
□ Mock payment kaam kar raha hai
□ Payment ke baad dashboard pe redirect hota hai
□ Payment ke baad saare chapters unlock ho jate hain
□ Free user ko AI button nahi dikh raha
□ Premium user ko AI button dikh raha hai
```

## 🚨 Important Notes

1. **Mock Payment Hai:** Real Razorpay keys milne tak mock mode me hai
2. **Supabase Tables:** Zaruri hai tables banana, warna kuch kaam nahi karega
3. **Browser Cache:** Issues aaye to cache clear karo
4. **Logs Check Karo:** Koi bhi issue ho to logs zaroor dekho

## 🎯 Next Steps for Production

Jab Razorpay registration complete ho jaye:

1. Real Razorpay keys add karo `.env` files me
2. `razorpay.ts` me real payment flow implement karo
3. Backend me Razorpay SDK add karo
4. Signature verification add karo
5. Proper error handling add karo

## 📞 Help Chahiye?

Agar koi issue aaye to:
1. Browser console check karo (F12)
2. Backend logs check karo
3. Supabase tables verify karo
4. Test script run karo: `python /app/test_freemium.py`

---

## ✅ Summary

**Backend:** ✅ Ready and Tested  
**Frontend:** ✅ Ready  
**Database:** ⚠️ Tables banana hai (SQL script ready hai)  
**Payment:** ✅ Mock payment working  
**Testing:** 📋 Testing guide ready  

**Bas ab Supabase me tables banao aur test kar lo! 🚀**
"
Observation: Create successful: /app/SETUP_GUIDE_HINDI.md
