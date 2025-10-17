import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionPlans';

// Load Razorpay script
const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || '';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
      resolve(true);
  });
};

// Initialize Razorpay Payment
export const initializePayment = async (
  planId: string,
  userId: string,
  userEmail: string,
  userName: string
) => {
  try {
    // 1. Get plan details
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }
  // 2. Create order on backend (mocked)
    const orderResponse = await fetch(`${BACKEND_URL}/api/subscriptions/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          amount: plan.price,
          plan_id: planId,
          user_id: userId
           })
    });
    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

  const orderData = await orderResponse.json();

    // 3. Mock payment flow - show success immediately
    const mockPaymentId = `pay_mock_${Date.now()}`;
    const mockSignature = `sig_mock_${Date.now()}`;

    // Show loading message
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    loadingToast.textContent = '🔄 Processing mock payment...';
    document.body.appendChild(loadingToast);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 4. Verify payment on backend
    await verifyPayment(
      {
        razorpay_order_id: orderData.order_id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature
      },
      userId,
      planId
    );

    // Remove loading toast
    document.body.removeChild(loadingToast);

  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

// Verify payment and create subscription
const verifyPayment = async (
  paymentResponse: any,
  userId: string,
  planId: string
) => {
  try {
// Call backend to verify payment (mock verification)
    const response = await fetch(`${BACKEND_URL}/api/subscriptions/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        user_id: userId,
        plan_id: planId
      })
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();

    if (!data.verified) {
      throw new Error('Payment verification failed');
    }

    // Create subscription in Supabase
    const plan = SUBSCRIPTION_PLANS[planId];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const { error: supabaseError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        amount: plan.price,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      });

    if (supabaseError) {
      console.error('Supabase subscription error:', supabaseError);
      // Don't fail the whole flow, MongoDB backup exists
    }

    // Success!
    alert('🎉 Payment successful! Your subscription is now active.');
    window.location.href = '/dashboard';

  } catch (error) {
    console.error('Payment verification error:', error);
    alert('Payment verification failed. Please contact support.');
  }
};
