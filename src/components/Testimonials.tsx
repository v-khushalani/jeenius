
import React from 'react';
import { Star, Quote, Award, TrendingUp } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Arjun Sharma',
      role: 'JEE Advanced Rank 47',
      image: '/placeholder.svg',
      content: 'JEEnius AI transformed my preparation. The AI-powered weakness detection helped me focus on areas I was struggling with. Within 3 months, my Physics scores improved by 40%!',
      rating: 5,
      improvement: '40% increase in Physics'
    },
    {
      name: 'Priya Patel',
      role: 'JEE Main 99.8 percentile',
      image: '/placeholder.svg',
      content: 'The personalized question bank was a game-changer. Instead of solving random questions, I got exactly what I needed to improve. The parent dashboard kept my mom updated too!',
      rating: 5,
      improvement: '99.8 percentile achieved'
    },
    {
      name: 'Rajesh Kumar (Parent)',
      role: 'Parent of JEE Aspirant',
      image: '/placeholder.svg',
      content: 'As a parent, the dashboard gave me complete visibility into my son\'s progress. The weekly reports and AI insights helped us make informed decisions about his study plan.',
      rating: 5,
      improvement: 'Better parent engagement'
    },
    {
      name: 'Sneha Reddy',
      role: 'JEE Advanced Rank 156',
      image: '/placeholder.svg',
      content: 'The streak system kept me motivated throughout my preparation. The AI adapted to my learning style and gradually increased difficulty. Highly recommend for serious JEE aspirants!',
      rating: 5,
      improvement: '7-month study streak'
    }
  ];

  const stats = [
    { label: 'Students Qualified', value: '15,000+', icon: Award },
    { label: 'Average Improvement', value: '35%', icon: TrendingUp },
    { label: 'Success Rate', value: '95%', icon: Star },
    { label: 'Parent Satisfaction', value: '4.9/5', icon: Quote }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Success Stories from
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}JEE Toppers
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover how JEEnius AI has helped thousands of students achieve their IIT dreams 
            and empowered parents to support their child's journey effectively.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-purple-600" />
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Profile */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {testimonial.improvement}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Join the Success Stories?
            </h3>
            <p className="text-gray-600 mb-6">
              Start your personalized JEE preparation journey today and experience the power of AI-driven learning.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
