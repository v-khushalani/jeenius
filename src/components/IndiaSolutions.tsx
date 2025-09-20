
import React from 'react';
import { Wifi, School, Globe, Smartphone, MapPin, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IndiaSolutions = () => {
  const solutions = [
    {
      icon: Wifi,
      title: 'Offline Mode',
      description: 'Download lessons and practice offline. Perfect for areas with poor internet connectivity.',
      features: ['Smart sync when online', 'Compressed content', 'Minimal data usage'],
      stats: '90% less data usage',
      color: 'bg-blue-500'
    },
    {
      icon: School,
      title: 'School Partnerships',
      description: 'Integrated with 500+ schools across India for seamless classroom-to-home learning.',
      features: ['Teacher dashboards', 'Homework integration', 'Progress sharing'],
      stats: '500+ partner schools',
      color: 'bg-green-500'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Learn in your comfort language with support for 12+ regional Indian languages.',
      features: ['Voice instructions', 'Regional examples', 'Cultural context'],
      stats: '12+ languages',
      color: 'bg-purple-500'
    }
  ];

  const challenges = [
    {
      challenge: 'Poor Internet Connectivity',
      solution: 'Smart Offline Mode',
      description: 'Download up to 50 lessons at once. Practice offline and sync when connected.',
      icon: Wifi
    },
    {
      challenge: 'Language Barriers',
      solution: 'Regional Language AI',
      description: 'AI tutor speaks and explains concepts in Hindi, Tamil, Telugu, and more.',
      icon: Globe
    },
    {
      challenge: 'Budget Constraints',
      solution: '12-Month Free Tier',
      description: 'Complete JEE preparation absolutely free for the first year.',
      icon: Shield
    },
    {
      challenge: 'Remote Areas Access',
      solution: 'SMS & Call Support',
      description: 'Get study reminders and doubt resolution via SMS and voice calls.',
      icon: MapPin
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Solutions for
            <span className="text-primary"> Real India</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We understand the unique challenges faced by Indian students and have built solutions accordingly
          </p>
        </div>

        {/* Main Solutions Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader>
                <div className={`w-16 h-16 ${solution.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
                <div className="text-2xl font-bold text-primary">{solution.stats}</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Challenges & Solutions */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Indian Challenges, Smart Solutions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-sm text-red-600 font-medium">Challenge: </span>
                      <span className="text-gray-800">{item.challenge}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-primary font-semibold">Solution: </span>
                      <span className="text-primary font-medium">{item.solution}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary mb-2">28</div>
            <div className="text-gray-600">States Covered</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Cities & Towns</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary mb-2">12+</div>
            <div className="text-gray-600">Languages</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-gray-600">Rural Students</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaSolutions;
