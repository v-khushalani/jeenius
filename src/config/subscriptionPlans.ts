// src/config/subscriptionPlans.ts

export const SUBSCRIPTION_PLANS = {
  monthly: {
    name: 'Monthly Plan',
    price: 49,
    displayDuration: 'per month',
    duration: 30, // days
    popular: false,
    bestValue: false,
    savings: 0,
    originalPrice: null,
    features: [
      '✅ Unlimited Chapters Access',
      '✅ Unlimited Questions Daily',
      '✅ AI-Powered Doubt Solver',
      '✅ Personalized Study Plans',
      '✅ Advanced Analytics',
      '✅ Mock Tests & Battle Mode',
      '✅ Priority Support'
    ]
  },
  quarterly: {
    name: 'Quarterly Plan',
    price: 129,
    displayDuration: 'for 3 months',
    duration: 90, // days
    popular: true,
    bestValue: false,
    savings: 98,
    originalPrice: 897, // 299 * 3
    features: [
      '✅ All Monthly Features',
      '✅ Save ₹98 (11% OFF)',
      '✅ Unlimited Chapters Access',
      '✅ Unlimited Questions Daily',
      '✅ AI-Powered Doubt Solver',
      '✅ Advanced Analytics',
      '✅ Mock Tests & Battle Mode'
    ]
  },
  yearly: {
    name: 'Yearly Plan',
    price: 499,
    displayDuration: 'for 12 months',
    duration: 365, // days
    popular: false,
    bestValue: true,
    savings: 1089,
    originalPrice: 3588, // 299 * 12
    features: [
      '✅ All Quarterly Features',
      '✅ Save ₹1089 (30% OFF)',
      '✅ Unlimited Everything',
      '✅ Lifetime Access to Updates',
      '✅ VIP Support Channel',
      '✅ Early Access to New Features',
      '🎁 Free JEE Strategy E-Book'
    ]
  }
};

// Freemium Limits
export const FREE_LIMITS = {
  chapters: 5,
  dailyQuestions: 15,
  aiQueries: 0
};

// Check if user is premium
export const checkIsPremium = (subscriptionEndDate: string | null): boolean => {
  if (!subscriptionEndDate) return false;
  return new Date(subscriptionEndDate) > new Date();
};
