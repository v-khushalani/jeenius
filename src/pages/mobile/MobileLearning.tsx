
import React from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import InteractivePathway from '@/components/InteractivePathway';

const MobileLearning = () => {
  return (
    <MobileLayout title="Learning Path" showBack={true}>
      <div className="p-4">
        <InteractivePathway />
      </div>
    </MobileLayout>
  );
};

export default MobileLearning;
