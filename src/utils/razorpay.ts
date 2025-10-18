// src/utils/razorpay.ts
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create order in backend
export const createOrder = async (planId: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { planId, userId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
};

// Verify payment after success
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string,
  userId: string,
  planId: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        orderId,
        paymentId,
        signature,
        userId,
        planId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Initialize payment flow
export const initializePayment = async (
  planId: string,
  userId: string,
  email: string,
  name: string
) => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create order
    const orderData = await createOrder(planId, userId);

    // Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: orderData.amount,
      currency: 'INR',
      name: 'PrepGenius',
      description: `${orderData.planName} Subscription`,
      order_id: orderData.orderId,
      prefill: {
        name,
        email,
      },
      theme: {
        color: '#3B82F6'
      },
      handler: async function (response: any) {
        try {
          // Verify payment
          await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            userId,
            planId
          );

          // Show success message
          alert('🎉 Payment Successful! Welcome to Premium!');
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
        }
      }
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};
