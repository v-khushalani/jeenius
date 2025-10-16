export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 299,
    duration: 30, // days
    displayDuration: '1 Month',
    features: [
      'Unlimited Chapters Access',
      'Unlimited Practice Questions',
      'AI-Powered Doubt Solving',
      'Personalized Study Planner',
      'Progress Analytics',
      'Mobile App Access'
    ],
    popular: false,
    savings: 0
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: 799,
    duration: 90, // days
    displayDuration: '3 Months',
    features: [
      'Everything in Monthly',
      'Save ₹100',
      'Priority Support',
      'Advanced Analytics',
      'Video Solutions',
      'Live Doubt Sessions'
    ],
    popular: true,
    savings: 100,
    originalPrice: 899
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 2499,
    duration: 365, // days
    displayDuration: '12 Months',
    features: [
      'Everything in Quarterly',
      'Save ₹1089',
      'Personal Mentor',
      'Exclusive Study Material',
      'JEE Strategy Sessions',
      'Guaranteed Rank Improvement'
    ],
    popular: false,
    savings: 1089,
    originalPrice: 3588,
    bestValue: true
  }
};
