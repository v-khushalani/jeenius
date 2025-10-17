from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import hmac

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Supabase connection
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix=\"/api\")

# Import subscription routes
from routes.subscriptions import router as subscriptions_router


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Subscription Models
class SubscriptionOrderCreate(BaseModel):
    amount: int
    plan_id: str
    user_id: str

class SubscriptionOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str = \"INR\"

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    user_id: str
    plan_id: str

class PaymentVerificationResponse(BaseModel):
    verified: bool
    subscription_id: Optional[str] = None
    message: str
    
class SubscriptionStatusResponse(BaseModel):
    is_premium: bool
    plan_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None

class CheckAccessRequest(BaseModel):
    user_id: str
    content_type: str  # 'chapter', 'question', 'ai_query'
    content_identifier: Optional[str] = None
    subject: Optional[str] = None

class CheckAccessResponse(BaseModel):
    allowed: bool
    reason: str
    message: Optional[str] = None
    remaining: Optional[int] = None

class TrackUsageRequest(BaseModel):
    user_id: str
    content_type: str
    content_identifier: str
    subject: Optional[str] = None


# Original routes
@api_router.get(\"/\")
async def root():
    return {\"message\": \"Hello World\"}

@api_router.post(\"/status\", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get(\"/status\", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Subscription and Payment Routes (Mock Implementation)
@api_router.post(\"/subscriptions/create-order\", response_model=SubscriptionOrderResponse)
async def create_subscription_order(order_data: SubscriptionOrderCreate):
    \"\"\"
    Create a mock Razorpay order for subscription payment
    In production, this would call Razorpay API
    \"\"\"
    try:
        # Generate mock order ID
        order_id = f\"order_mock_{uuid.uuid4().hex[:12]}\"
        
        logger.info(f\"Creating mock order: {order_id} for user {order_data.user_id}\")
        
        # Store order in database for verification later
        order_record = {
            \"order_id\": order_id,
            \"user_id\": order_data.user_id,
            \"plan_id\": order_data.plan_id,
            \"amount\": order_data.amount,
            \"currency\": \"INR\",
            \"status\": \"created\",
            \"created_at\": datetime.utcnow().isoformat()
        }
        
        await db.payment_orders.insert_one(order_record)
        
        return SubscriptionOrderResponse(
            order_id=order_id,
            amount=order_data.amount,
            currency=\"INR\"
        )
    except Exception as e:
        logger.error(f\"Error creating order: {str(e)}\")
        raise HTTPException(status_code=500, detail=\"Failed to create order\")

@api_router.post(\"/subscriptions/verify-payment\", response_model=PaymentVerificationResponse)
async def verify_subscription_payment(payment_data: PaymentVerification):
    \"\"\"
    Verify mock payment and create subscription
    In production, this would verify Razorpay signature
    \"\"\"
    try:
        logger.info(f\"Verifying payment for user {payment_data.user_id}\")
        
        # Get order from database
        order = await db.payment_orders.find_one({\"order_id\": payment_data.razorpay_order_id})
        
        if not order:
            return PaymentVerificationResponse(
                verified=False,
                message=\"Order not found\"
            )
        
        # Mock verification - In production, verify signature with Razorpay secret
        # For now, we accept all payments as valid
        
        # Calculate subscription duration based on plan
        plan_durations = {
            \"monthly\": 30,
            \"quarterly\": 90,
            \"yearly\": 365
        }
        
        duration_days = plan_durations.get(payment_data.plan_id, 30)
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=duration_days)
        
        # Create subscription record (this would be in Supabase in production)
        subscription_id = str(uuid.uuid4())
        subscription_record = {
            \"id\": subscription_id,
            \"user_id\": payment_data.user_id,
            \"plan_id\": payment_data.plan_id,
            \"status\": \"active\",
            \"start_date\": start_date.isoformat(),
            \"end_date\": end_date.isoformat(),
            \"payment_id\": payment_data.razorpay_payment_id,
            \"order_id\": payment_data.razorpay_order_id,
            \"amount\": order.get(\"amount\", 0),
            \"created_at\": datetime.utcnow().isoformat()
        }
        
        await db.subscriptions.insert_one(subscription_record)
        
        # Update order status
        await db.payment_orders.update_one(
            {\"order_id\": payment_data.razorpay_order_id},
            {\"$set\": {\"status\": \"completed\", \"payment_id\": payment_data.razorpay_payment_id}}
        )
        
        logger.info(f\"Subscription created: {subscription_id} for user {payment_data.user_id}\")
        
        return PaymentVerificationResponse(
            verified=True,
            subscription_id=subscription_id,
            message=\"Payment verified and subscription activated\"
        )
        
    except Exception as e:
        logger.error(f\"Error verifying payment: {str(e)}\")
        raise HTTPException(status_code=500, detail=\"Payment verification failed\")


@api_router.get(\"/subscriptions/status/{user_id}\", response_model=SubscriptionStatusResponse)
async def get_subscription_status(user_id: str):
    \"\"\"Get user's current subscription status\"\"\"
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail=\"Supabase not configured\")
        
        # Get active subscription
        result = supabase.table('subscriptions').select('*').eq('user_id', user_id).eq('status', 'active').gte('end_date', datetime.utcnow().isoformat()).order('end_date', desc=True).limit(1).execute()
        
        if result.data and len(result.data) > 0:
            subscription = result.data[0]
            return SubscriptionStatusResponse(
                is_premium=True,
                plan_id=subscription['plan_id'],
                start_date=subscription['start_date'],
                end_date=subscription['end_date'],
                status=subscription['status']
            )
        
        return SubscriptionStatusResponse(
            is_premium=False,
            status='none'
        )
        
    except Exception as e:
        logger.error(f\"Error fetching subscription status: {e}\")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post(\"/subscriptions/check-access\", response_model=CheckAccessResponse)
async def check_access(request: CheckAccessRequest):
    \"\"\"Check if user can access specific content\"\"\"
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail=\"Supabase not configured\")
        
        # Check if user has active subscription
        sub_result = supabase.table('subscriptions').select('*').eq('user_id', request.user_id).eq('status', 'active').gte('end_date', datetime.utcnow().isoformat()).execute()
        
        if sub_result.data and len(sub_result.data) > 0:
            return CheckAccessResponse(
                allowed=True,
                reason='premium_subscriber'
            )
        
        # Free user - check limits
        if request.content_type == 'chapter':
            # Get chapter limit
            limit_result = supabase.table('free_content_limits').select('limit_value').eq('limit_type', 'chapters').execute()
            limit_value = limit_result.data[0]['limit_value'] if limit_result.data else 5
            
            # Get accessed chapters
            access_result = supabase.table('user_content_access').select('content_identifier, subject').eq('user_id', request.user_id).eq('content_type', 'chapter').execute()
            
            unique_chapters = set()
            for item in (access_result.data or []):
                unique_chapters.add(f\"{item['subject']}-{item['content_identifier']}\")
            
            # Check if this specific chapter is already accessed
            if request.content_identifier and request.subject:
                chapter_key = f\"{request.subject}-{request.content_identifier}\"
                already_accessed = chapter_key in unique_chapters
                
                if already_accessed or len(unique_chapters) < limit_value:
                    remaining = max(0, limit_value - len(unique_chapters) - (0 if already_accessed else 1))
                    return CheckAccessResponse(
                        allowed=True,
                        reason='free_tier',
                        remaining=remaining
                    )
            
            return CheckAccessResponse(
                allowed=False,
                reason='limit_exceeded',
                message=f\"You've used all {limit_value} free chapters. Upgrade to Premium for unlimited access! 🚀\"
            )
        
        elif request.content_type == 'question':
            # Daily question limit
            limit_result = supabase.table('free_content_limits').select('limit_value').eq('limit_type', 'questions_per_day').execute()
            daily_limit = limit_result.data[0]['limit_value'] if limit_result.data else 50
            
            # Get today's attempts
            today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            access_result = supabase.table('user_content_access').select('id').eq('user_id', request.user_id).eq('content_type', 'question').gte('accessed_at', today.isoformat()).execute()
            
            questions_today = len(access_result.data or [])
            
            if questions_today < daily_limit:
                return CheckAccessResponse(
                    allowed=True,
                    reason='within_limit',
                    remaining=daily_limit - questions_today
                )
            
            return CheckAccessResponse(
                allowed=False,
                reason='daily_limit_exceeded',
                message=f\"Daily limit of {daily_limit} questions reached! Upgrade to Premium for unlimited practice. 📚\"
            )
        
        elif request.content_type == 'ai_query':
            # Daily AI query limit
            limit_result = supabase.table('free_content_limits').select('limit_value').eq('limit_type', 'ai_queries_per_day').execute()
            daily_limit = limit_result.data[0]['limit_value'] if limit_result.data else 20
            
            # Get today's queries
            today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            access_result = supabase.table('user_content_access').select('id').eq('user_id', request.user_id).eq('content_type', 'ai_query').gte('accessed_at', today.isoformat()).execute()
            
            queries_today = len(access_result.data or [])
            
            if queries_today < daily_limit:
                return CheckAccessResponse(
                    allowed=True,
                    reason='within_limit',
                    remaining=daily_limit - queries_today
                )
            
            return CheckAccessResponse(
                allowed=False,
                reason='daily_limit_exceeded',
                message=f\"Daily AI limit of {daily_limit} queries reached! Upgrade for unlimited AI assistance. 🤖\"
            )
        
        return CheckAccessResponse(
            allowed=False,
            reason='unknown_content_type',
            message='Invalid content type'
        )
        
    except Exception as e:
        logger.error(f\"Error checking access: {e}\")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post(\"/subscriptions/track-usage\")
async def track_usage(request: TrackUsageRequest):
    \"\"\"Track content usage for free users\"\"\"
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail=\"Supabase not configured\")
        
        usage_data = {
            'id': str(uuid.uuid4()),
            'user_id': request.user_id,
            'content_type': request.content_type,
            'content_identifier': request.content_identifier,
            'accessed_at': datetime.utcnow().isoformat()
        }
        
        if request.subject:
            usage_data['subject'] = request.subject
        
        supabase.table('user_content_access').insert(usage_data).execute()
        
        return {\"success\": True, \"message\": \"Usage tracked\"}
        
    except Exception as e:
        logger.error(f\"Error tracking usage: {e}\")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

# Include subscription routes (these already have /api prefix)
app.include_router(subscriptions_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event(\"shutdown\")
async def shutdown_db_client():
    client.close()
