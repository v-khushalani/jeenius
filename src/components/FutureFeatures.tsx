
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Gamepad2, 
  BookOpen, 
  Mic, 
  Video,
  Trophy,
  Sparkles,
  Eye,
  MessageSquare,
  Download
} from 'lucide-react';

const FutureFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const futureFeatures = [
    {
      icon: Brain,
      title: 'Neuro-Adaptive Learning',
      description: 'AI analyzes your brainwave patterns to optimize learning speed',
      demo: 'Personalized neural pathways create 3x faster retention',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'Eye-Tracking Focus',
      description: 'Track attention patterns to identify weak concepts',
      demo: 'Real-time gaze analysis improves concentration by 85%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'Voice-Based Learning',
      description: 'Learn through natural conversations with AI tutor',
      demo: 'Speak your doubts, get instant voice explanations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Video,
      title: 'Holographic Simulations',
      description: '3D molecular structures and physics experiments',
      demo: 'Interactive chemistry labs in your room',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Peer Mind Mapping',
      description: 'Collaborative problem-solving with AI-matched peers',
      demo: 'Real-time group study sessions with smart pairing',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Target,
      title: 'Predictive Success',
      description: 'AI predicts your JEE rank based on learning patterns',
      demo: 'Know your expected rank 6 months in advance',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Future of 
            <span className="text-primary"> Education is Here</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience next-generation learning technologies that adapt to your mind
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-4">
              {futureFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'ring-2 ring-primary shadow-xl scale-[1.02]' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                      {activeFeature === index && (
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo Display */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-2xl">
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${futureFeatures[activeFeature].color} flex items-center justify-center mb-4`}>
                    {React.createElement(futureFeatures[activeFeature].icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {futureFeatures[activeFeature].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <p className="text-lg text-gray-700">
                    {futureFeatures[activeFeature].demo}
                  </p>
                  
                  {/* Interactive Demo Elements */}
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">Live Demo</span>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="animate-pulse flex space-x-2">
                          <div className="h-2 bg-primary rounded flex-1"></div>
                          <div className="h-2 bg-blue-300 rounded flex-1"></div>
                          <div className="h-2 bg-green-300 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Try This Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready for the Future?</h3>
              <p className="text-lg mb-6 text-white/90">
                Be among the first 1000 students to experience next-gen learning
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.jeenius.app', '_blank')}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Beta App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FutureFeatures;
