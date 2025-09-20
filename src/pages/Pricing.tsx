
import React from 'react';
import Header from '@/components/Header';
import { Check, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingPage = () => {
  const plans = [
    {
      name: 'JEEnius Free',
      price: '₹0',
      duration: 'Forever Free',
      description: 'World-class JEE preparation at zero cost',
      features: [
        'Unlimited AI-powered learning',
        'Complete doubt solving with AI',
        'Gamified points & achievements',
        'Community learning platform',
        'Advanced performance analytics',
        'Mobile app access',
        'Study streaks & badges',
        'Personalized AI study plans',
        'Full mock test series',
        'Parent dashboard access',
        'College prediction tools',
        'All premium features included'
      ],
      popular: true,
      buttonText: 'Start Learning Free',
      buttonVariant: 'default' as const,
      highlight: 'Always Free',
      comparison: 'No cost, No ads, No limits!'
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              World-class JEE preparation,
              <span className="text-green-600 block">completely FREE! 🎉</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              No subscriptions, no hidden costs, no ads. Quality education should be accessible to every student.
            </p>
            
            {/* Free Forever Highlight */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-8 h-8 fill-current" />
              <span className="text-3xl font-bold">FREE FOR NOW</span>
              <Star className="w-8 h-8 fill-current" />
            </div>
            <p className="text-xl opacity-95 mb-4">
              Every feature, every tool, every question - completely free
            </p>
            <p className="text-lg opacity-90">
              No credit card required • No time limits • No premium versions
            </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pricing Card */}
            <div className="flex justify-center mb-12">
              <div className="max-w-lg w-full">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    plan.popular
                      ? 'ring-2 ring-primary scale-105 lg:scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Crown className="w-4 h-4" />
                        <span>Start Here</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">{plan.duration}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-green-600 font-semibold text-sm">
                        {plan.comparison}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4">{plan.description}</p>
                    <div className="text-xs text-primary font-medium mt-2 bg-primary/10 px-3 py-1 rounded-full">
                      {plan.highlight}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full text-lg py-6 ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
