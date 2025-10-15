import React from 'react';
import Header from '@/components/Header';
import AIStudyPlanner from '@/components/AIStudyPlanner';

const AIStudyPlannerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Study Planner</h1>
          <p className="text-slate-600">Your personalized, adaptive learning companion</p>
        </div>
        <AIStudyPlanner />
      </div>
    </div>
  );
};

export default AIStudyPlannerPage;
