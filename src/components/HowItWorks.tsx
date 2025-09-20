
import React from 'react';
import { UserPlus, Target, BookOpen, ArrowRight, Smartphone, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  const reasons = [
    {
      icon: Target,
      title: 'AI-Powered Personalization',
      description: 'Advanced AI creates custom study plans based on your learning style and progress.',
      features: ['Adaptive difficulty levels', 'Real-time progress tracking', 'Smart weakness detection'],
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Proven Success Rate',
      description: 'Over 85% of our students improve their mock test scores within 30 days.',
      features: ['IIT alumni mentors', 'Updated question banks', 'Performance analytics'],
      color: 'bg-green-500'
    },
    {
      icon: UserPlus,
      title: 'Made for India',
      description: 'Built specifically for Indian students with regional language support and affordability.',
      features: ['12+ regional languages', 'Offline study mode', 'Parent progress tracking'],
      color: 'bg-primary'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose
            <span className="text-primary"> JEEnius?</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover what makes JEEnius the smartest choice for JEE preparation in India
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 ${reason.color} rounded-xl flex items-center justify-center mb-6`}>
                  <reason.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600 mb-6">{reason.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {reason.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow */}
              {index < reasons.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* India-Specific Features */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Built for India, By Indians
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile-First Design</h4>
              <p className="text-gray-600 text-sm">
                Optimized for budget smartphones with data-saving features and offline capabilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Regional Languages</h4>
              <p className="text-gray-600 text-sm">
                Support for Hindi, Tamil, Telugu, Bengali and 8+ other regional languages
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Family Dashboard</h4>
              <p className="text-gray-600 text-sm">
                Parents can track progress and receive updates in their preferred language
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your JEE Journey?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of students already using JEEnius AI
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
