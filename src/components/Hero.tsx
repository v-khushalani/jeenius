
import React from 'react';
import { ArrowRight, Play, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/signup');
  };

  const handleDownloadApp = () => {
    // Redirect to Play Store - replace with actual Play Store URL
    window.open('https://play.google.com/store/apps/details?id=com.jeenius.app', '_blank');
  };

  return (
    <section className="relative pt-24 pb-20 min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-blue-50 to-white"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200/50 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
                AI-Powered JEE Preparation
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Where{' '}
                <span className="text-primary">AI</span>{' '}
                Learns{' '}
                <span className="text-primary">You</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                India's first truly personalized JEE learning platform that adapts to your unique learning style and pace.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
                onClick={handleStartLearning}
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-4 text-lg"
                onClick={handleDownloadApp}
              >
                <Play className="w-5 h-5 mr-2" />
                Download Free
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>✓ DPDP Compliant</span>
              <span>✓ Offline Mode</span>
              <span>✓ 12 Languages</span>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="relative animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* AI Tutor Chat Demo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">JEEnius AI Tutor</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="space-y-3 h-64 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-800">Hi! I noticed you're struggling with quadratic equations. Let me help you with a personalized approach.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-white">Yes, I find it confusing!</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-primary/10 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-800">Perfect! Based on your learning style, I'll use visual diagrams. Here's your first question...</p>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    disabled
                  />
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-float">
              <span className="text-primary font-bold">AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
