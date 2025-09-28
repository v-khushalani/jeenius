import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Target, Zap, Users, Trophy, Star, ArrowRight, Sparkles, BookOpen, MessageCircle, Award } from 'lucide-react';

const About = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Smart algorithms that adapt to your learning style and pace",
      color: "from-primary/10 to-blue-50",
      iconBg: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: Heart,
      title: "Human-First Approach", 
      description: "Technology that understands emotions, not just equations",
      color: "from-red-50 to-pink-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Every feature designed to get you closer to your JEE dreams",
      color: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100", 
      iconColor: "text-green-600"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Real-time corrections and personalized improvement suggestions",
      color: "from-yellow-50 to-orange-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Students", icon: Users },
    { number: "95%", label: "Success Rate", icon: Trophy },
    { number: "24/7", label: "AI Support", icon: MessageCircle },
    { number: "1000+", label: "Practice Tests", icon: BookOpen }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const FloatingElements = () => (
    <>
      {/* Floating mathematical symbols */}
      <div className="absolute top-20 left-10 text-primary/10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>∫</div>
      <div className="absolute top-40 right-20 text-blue-400/10 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>π</div>
      <div className="absolute bottom-32 left-16 text-green-400/10 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>Σ</div>
      <div className="absolute bottom-20 right-32 text-primary/10 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>√</div>
      <div className="absolute top-1/2 left-1/4 text-yellow-400/10 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>∆</div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 h-screen bg-gradient-to-br from-primary/5 to-blue-50 overflow-hidden relative">
        <FloatingElements />
        
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center p-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center h-full">
            
            {/* Left Side - Hero Content */}
            <div className="text-gray-900 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  <span className="text-primary font-semibold">From Kota Survivor to Your AI Mentor</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black leading-tight text-gray-900">
                  We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Different</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Because we've been where you are. The sleepless nights, the pressure, the doubt. 
                  <span className="text-gray-900 font-semibold"> That's why JEEnius exists.</span>
                </p>
              </div>

              {/* Animated Feature Display */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-full ${features[currentFeature].iconBg}`}>
                      {React.createElement(features[currentFeature].icon, { 
                        className: `w-8 h-8 ${features[currentFeature].iconColor}` 
                      })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{features[currentFeature].title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{features[currentFeature].description}</p>
                </div>
                
                {/* Feature dots indicator */}
                <div className="flex space-x-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentFeature === index ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-primary/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 rounded-full group transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Right Side - Interactive Cards */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-lg border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mission Card */}
              <Card className="bg-gradient-to-r from-primary/5 to-blue-50 backdrop-blur-lg border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To transform the way Indian students prepare for competitive exams. 
                        No more cramming, no more fear. Just smart, personalized learning that actually works.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promise Card */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-lg border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Promise</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Every student deserves a learning experience that builds confidence, not anxiety. 
                        JEEnius makes you fall in love with learning, one concept at a time. ❤️
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default About;
