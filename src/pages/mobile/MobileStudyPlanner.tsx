
import React from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import AIStudyPlanner from '@/components/AIStudyPlanner';

const MobileStudyPlanner = () => {
  return (
    <MobileLayout title="Study Planner" showBack={true}>
      <div className="p-4">
        <AIStudyPlanner />
      </div>
    </MobileLayout>
  );
};

export default MobileStudyPlanner;
