
import React, { useState } from 'react';
import { Brain, Target, MessageCircle, ArrowRight, Play, Settings, Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'Dynamic Lessons',
      description: 'AI creates personalized lesson plans that adapt to your learning speed and style in real-time.',
      demo: {
        title: 'Lesson Builder Demo',
        content: 'Watch as AI adjusts difficulty based on your performance',
        interactive: true
      },
      gradient: 'from-primary to-blue-600',
    },
    {
      icon: Target,
      title: 'JEEnius Points System', 
      description: 'Earn JEEnius Points for every correct answer and unlock exclusive rewards, badges, and achievements.',
      demo: {
        title: 'JEEnius Points System',
        content: 'Complete challenges and climb the JEE Warrior leaderboard',
        interactive: true
      },
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: MessageCircle,
      title: 'JEEnius AI Tutor',
      description: 'Your personal AI tutor available 24/7 to answer doubts and provide step-by-step explanations.',
      demo: {
        title: 'AI Chat Demo',
        content: 'Experience intelligent tutoring conversations',
        interactive: true
      },
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile App Promotion */}
        <div className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Smartphone className="w-8 h-8" />
              <div>
                <div className="text-xl font-bold">Experience All Features in Our Android App!</div>
                <div className="text-sm opacity-90">Offline mode, voice input, advanced analytics & personalized learning paths</div>
              </div>
            </div>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600">
              <Download className="w-5 h-5 mr-2" />
              Download Free
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Features That Make
            <span className="text-primary"> Learning Addictive</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our AI-powered features are designed specifically for Indian JEE aspirants, 
            combining gamification with personalized learning.
          </p>
        </div>

        {/* Interactive Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-500 ${
                activeFeature === index ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Interactive Demo Button */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white group"
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Try {feature.demo.title}
                  </Button>
                  
                  {activeFeature === index && (
                    <div className="animate-fade-in-up bg-primary/5 rounded-lg p-4">
                      <p className="text-sm text-primary font-medium">
                        {feature.demo.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Lesson Builder Demo */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dynamic Lesson Builder in Action
              </h3>
              <p className="text-gray-600 mb-6">
                Watch how our AI adapts lesson difficulty and content based on your performance and learning style.
              </p>
              
              {/* Feedback Mode Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Feedback Mode</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Instant
                    </Button>
                    <Button size="sm" className="bg-primary text-xs">
                      Delayed
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">JEE Warrior Level</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-3/4 transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Current Topic: Quadratic Equations</span>
                  <span className="text-sm bg-primary text-white px-2 py-1 rounded">JEE Warrior</span>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Question:</strong> Solve: x² - 5x + 6 = 0
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 text-sm border rounded hover:bg-primary hover:text-white transition-colors">
                      x = 2, 3
                    </button>
                    <button className="p-2 text-sm border rounded hover:bg-primary hover:text-white transition-colors">
                      x = 1, 6
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-sm text-primary">
                    <Settings className="w-4 h-4 animate-spin" />
                    <span>AI is adapting next question...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
