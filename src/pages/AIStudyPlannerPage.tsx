import React from 'react';
import Header from '@/components/Header';
import AIStudyPlanner from '@/components/AIStudyPlanner';

const AIStudyPlannerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-30 pb-12">
        <AIStudyPlanner />
      </div>
    </div>
  );
};

export default AIStudyPlannerPage;
