import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import { Brain, Target, TrendingUp, Users, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhyUsPage = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Rahul Sharma",
      rank: "AIR 147",
      quote: "JEEnius helped me crack JEE with systematic preparation and AI guidance."
    },
    {
      name: "Priya Patel", 
      rank: "AIR 89",
      quote: "The mock tests were incredibly helpful for exam preparation."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* How It Works */}
          <HowItWorks />

          {/* Success Stories */}
          <div className="my-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-primary">{testimonial.rank}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUsPage;
