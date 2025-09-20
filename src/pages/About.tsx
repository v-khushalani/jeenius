import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                We're on a mission to make
                <span className="text-primary block">learning joyful for every student 🎯</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                JEEnius AI is more than just an EdTech platform. We're building a community where 
                artificial intelligence meets human connection to create the most effective and 
                affordable learning experience for Indian students.
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  From Kota to JEEnius.
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Card className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
                    <CardContent className="text-center">
                      <div className="text-6xl mb-4">👤</div>
                      <p className="text-gray-600">Founder Photo</p>
                      <p className="text-sm text-gray-500">Coming Soon</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    I lived the Kota grind: endless tests, pressure, and burnout. That's why I built JEEnius. To be the guide I wish I had—a mentor who's smart, kind, and remembers that you're human.
                  </p>
                  
                  <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-6">
                    <p className="text-primary font-semibold mb-2">Our Promise</p>
                    <p className="text-gray-700">
                      Every student deserves a learning experience that builds confidence, not anxiety. 
                      JEEnius is designed to make you fall in love with learning, one concept at a time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;