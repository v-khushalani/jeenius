import { supabase } from '@/integrations/supabase/client';

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
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
    // 1. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // 2. Get plan details
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // 3. Create order on backend (Supabase Edge Function)
    const { data: orderData, error: orderError } = await supabase.functions.invoke(
      'create-razorpay-order',
      {
        body: {
          amount: plan.price,
          plan_id: planId,
          user_id: userId
        }
      }
    );

    if (orderError || !orderData) {
      throw new Error('Failed to create order');
    }

    // 4. Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: plan.price * 100, // Convert to paise
      currency: 'INR',
      name: 'JEEnius',
      description: `${plan.name} Subscription`,
      image: '/logo.png', // Your logo
      order_id: orderData.orderId,
      handler: async function (response: any) {
        // 5. Payment successful - verify on backend
        await verifyPayment(response, userId, planId);
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: '' // Optional: add phone number if available
      },
      notes: {
        plan_id: planId,
        user_id: userId
      },
      theme: {
        color: '#10b981' // Your primary color
      },
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled by user');
        }
      }
    };

    // 6. Open Razorpay checkout
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

    razorpay.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
    });

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
    // Call backend to verify payment signature
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        user_id: userId,
        plan_id: planId
      }
    });

    if (error || !data.verified) {
      throw new Error('Payment verification failed');
    }

    // Success!
    alert('🎉 Payment successful! Your subscription is now active.');
    window.location.href = '/dashboard';

  } catch (error) {
    console.error('Payment verification error:', error);
    alert('Payment verification failed. Please contact support.');
  }
};
