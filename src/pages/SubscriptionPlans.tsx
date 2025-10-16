import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/subscriptionPlans';
import { initializePayment } from '@/utils/razorpay';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/login?redirect=/subscription-plans');
      return;
    }

    try {
      setLoading(planId);

      await initializePayment(
        planId,
        user.id,
        user.email || '',
        user.user_metadata?.name || 'Student'
      );

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-primary">Learning Journey</span>
          </h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited access to premium content and AI-powered features
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`relative rounded-2xl p-8 border-2 transition-all ${
                plan.popular
                  ? 'border-primary shadow-2xl scale-105 bg-white'
                  : 'border-gray-200 bg-white hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Best Value Badge */}
              {plan.bestValue && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Best Value</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-primary">₹{plan.price}</span>
                </div>
                <p className="text-gray-600">{plan.displayDuration}</p>

                {/* Savings */}
                {plan.savings > 0 && (
                  <div className="mt-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save ₹{plan.savings}
                    </span>
                    {plan.originalPrice && (
                      <p className="text-gray-500 line-through text-sm mt-1">
                        ₹{plan.originalPrice}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(key)}
                disabled={loading === key}
                className={`w-full py-6 text-lg font-bold rounded-xl ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                    : 'bg-primary hover:bg-primary/90'
                } text-white`}
              >
                {loading === key ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2 inline" />
                    Get Started
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            🛡️ <strong>7-Day Money Back Guarantee</strong> - Not satisfied? Get a full refund, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
