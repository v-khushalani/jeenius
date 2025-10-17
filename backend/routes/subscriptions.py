Now let me create the backend subscription endpoints:
Action: file_editor create /app/backend/routes/subscriptions.py --file-text "from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
import uuid
import hashlib
import hmac
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix=\"/api/subscriptions\", tags=[\"subscriptions\"])

# MongoDB connection (for backup/logging)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Pydantic Models
class CreateOrderRequest(BaseModel):
    amount: float
    plan_id: str
    user_id: str

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: float
    currency: str = \"INR\"

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    user_id: str
    plan_id: str

class VerifyPaymentResponse(BaseModel):
    verified: bool
    subscription_id: Optional[str] = None
    message: str

# Plan configurations (matching frontend)
PLANS = {
    \"monthly\": {\"duration_days\": 30, \"name\": \"Monthly Plan\"},
    \"quarterly\": {\"duration_days\": 90, \"name\": \"Quarterly Plan\"},
    \"yearly\": {\"duration_days\": 365, \"name\": \"Yearly Plan\"}
}

@router.post(\"/create-order\", response_model=CreateOrderResponse)
async def create_subscription_order(request: CreateOrderRequest):
    \"\"\"
    Create a mock payment order
    This is a simplified version for the freemium MVP
    In production, this would integrate with actual Razorpay
    \"\"\"
    try:
        # Validate plan
        if request.plan_id not in PLANS:
            raise HTTPException(status_code=400, detail=\"Invalid plan_id\")
        
        # Generate mock order ID
        order_id = f\"order_mock_{uuid.uuid4().hex[:16]}\"
        
        # Store order in MongoDB for tracking
        order_doc = {
            \"order_id\": order_id,
            \"user_id\": request.user_id,
            \"plan_id\": request.plan_id,
            \"amount\": request.amount,
            \"currency\": \"INR\",
            \"status\": \"created\",
            \"created_at\": datetime.utcnow().isoformat(),
        }
        
        await db.payment_orders.insert_one(order_doc)
        
        return CreateOrderResponse(
            order_id=order_id,
            amount=request.amount,
            currency=\"INR\"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f\"Error creating order: {e}\")
        raise HTTPException(status_code=500, detail=\"Failed to create order\")


@router.post(\"/verify-payment\", response_model=VerifyPaymentResponse)
async def verify_subscription_payment(request: VerifyPaymentRequest):
    \"\"\"
    Verify mock payment and create subscription
    This is a simplified version for the freemium MVP
    In production, this would verify actual Razorpay signature
    \"\"\"
    try:
        # Validate plan
        if request.plan_id not in PLANS:
            raise HTTPException(status_code=400, detail=\"Invalid plan_id\")
        
        plan_config = PLANS[request.plan_id]
        
        # Mock verification - in production, verify signature properly
        # For now, we accept all mock payments
        is_verified = True
        
        if not is_verified:
            return VerifyPaymentResponse(
                verified=False,
                message=\"Payment verification failed\"
            )
        
        # Calculate subscription dates
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=plan_config[\"duration_days\"])
        
        # Generate subscription ID
        subscription_id = str(uuid.uuid4())
        
        # Get order details from MongoDB
        order = await db.payment_orders.find_one(
            {\"order_id\": request.razorpay_order_id}
        )
        
        if not order:
            raise HTTPException(status_code=404, detail=\"Order not found\")
        
        # Create subscription record in MongoDB (backup)
        subscription_doc = {
            \"subscription_id\": subscription_id,
            \"user_id\": request.user_id,
            \"plan_id\": request.plan_id,
            \"plan_name\": plan_config[\"name\"],
            \"status\": \"active\",
            \"amount\": order[\"amount\"],
            \"start_date\": start_date.isoformat(),
            \"end_date\": end_date.isoformat(),
            \"razorpay_order_id\": request.razorpay_order_id,
            \"razorpay_payment_id\": request.razorpay_payment_id,
            \"razorpay_signature\": request.razorpay_signature,
            \"created_at\": datetime.utcnow().isoformat(),
        }
        
        await db.subscriptions.insert_one(subscription_doc)
        
        # Update order status
        await db.payment_orders.update_one(
            {\"order_id\": request.razorpay_order_id},
            {\"$set\": {\"status\": \"completed\", \"payment_id\": request.razorpay_payment_id}}
        )
        
        # NOTE: The frontend should also create a record in Supabase subscriptions table
        # This MongoDB record is just for backup/logging
        
        return VerifyPaymentResponse(
            verified=True,
            subscription_id=subscription_id,
            message=\"Payment verified successfully. Subscription activated!\"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f\"Error verifying payment: {e}\")
        raise HTTPException(status_code=500, detail=\"Failed to verify payment\")


@router.get(\"/user/{user_id}\")
async def get_user_subscriptions(user_id: str):
    \"\"\"
    Get all subscriptions for a user (from MongoDB backup)
    \"\"\"
    try:
        subscriptions = await db.subscriptions.find(
            {\"user_id\": user_id}
        ).sort(\"created_at\", -1).to_list(100)
        
        # Remove MongoDB _id field for JSON serialization
        for sub in subscriptions:
            sub.pop('_id', None)
        
        return {
            \"user_id\": user_id,
            \"subscriptions\": subscriptions
        }
    
    except Exception as e:
        print(f\"Error fetching subscriptions: {e}\")
        raise HTTPException(status_code=500, detail=\"Failed to fetch subscriptions\")


@router.get(\"/check/{user_id}\")
async def check_subscription_status(user_id: str):
    \"\"\"
    Check if user has active subscription
    \"\"\"
    try:
        # Find active subscription
        active_sub = await db.subscriptions.find_one({
            \"user_id\": user_id,
            \"status\": \"active\",
            \"end_date\": {\"$gte\": datetime.utcnow().isoformat()}
        })
        
        if active_sub:
            active_sub.pop('_id', None)
            return {
                \"has_active_subscription\": True,
                \"subscription\": active_sub
            }
        else:
            return {
                \"has_active_subscription\": False,
                \"subscription\": None
            }
    
    except Exception as e:
        print(f\"Error checking subscription: {e}\")
        raise HTTPException(status_code=500, detail=\"Failed to check subscription\")
"
Observation: Create successful: /app/backend/routes/subscriptions.py
