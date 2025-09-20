
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Play, Clock, Star } from 'lucide-react';

const InteractivePathway = () => {
  const [selectedSubject, setSelectedSubject] = useState('Physics');

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  
  const pathwayData = {
    Physics: [
      { id: 1, title: 'Mechanics', status: 'completed', progress: 100, topics: 12, timeRequired: '2 weeks' },
      { id: 2, title: 'Thermodynamics', status: 'current', progress: 65, topics: 8, timeRequired: '1.5 weeks' },
      { id: 3, title: 'Waves & Oscillations', status: 'upcoming', progress: 0, topics: 10, timeRequired: '2 weeks' },
      { id: 4, title: 'Electromagnetism', status: 'locked', progress: 0, topics: 15, timeRequired: '3 weeks' },
      { id: 5, title: 'Modern Physics', status: 'locked', progress: 0, topics: 12, timeRequired: '2.5 weeks' }
    ],
    Chemistry: [
      { id: 1, title: 'Atomic Structure', status: 'completed', progress: 100, topics: 8, timeRequired: '1 week' },
      { id: 2, title: 'Chemical Bonding', status: 'current', progress: 45, topics: 12, timeRequired: '2 weeks' },
      { id: 3, title: 'Thermodynamics', status: 'upcoming', progress: 0, topics: 10, timeRequired: '1.5 weeks' },
      { id: 4, title: 'Organic Chemistry', status: 'locked', progress: 0, topics: 20, timeRequired: '4 weeks' }
    ],
    Mathematics: [
      { id: 1, title: 'Algebra', status: 'completed', progress: 100, topics: 15, timeRequired: '2 weeks' },
      { id: 2, title: 'Trigonometry', status: 'current', progress: 80, topics: 10, timeRequired: '1.5 weeks' },
      { id: 3, title: 'Calculus', status: 'upcoming', progress: 0, topics: 18, timeRequired: '3 weeks' },
      { id: 4, title: 'Coordinate Geometry', status: 'locked', progress: 0, topics: 12, timeRequired: '2 weeks' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Play className="w-6 h-6 text-primary" />;
      case 'upcoming':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Pathway</h2>
        <p className="text-gray-600">Track your progress and see what's coming next</p>
      </div>

      {/* Subject Selector */}
      <div className="flex space-x-2 justify-center">
        {subjects.map((subject) => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? 'default' : 'outline'}
            onClick={() => setSelectedSubject(subject)}
            className="px-6"
          >
            {subject}
          </Button>
        ))}
      </div>

      {/* Pathway Cards */}
      <div className="space-y-4">
        {pathwayData[selectedSubject as keyof typeof pathwayData].map((chapter, index) => (
          <Card key={chapter.id} className={`relative ${chapter.status === 'current' ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(chapter.status)}
                  <div>
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    <p className="text-sm text-gray-600">{chapter.topics} topics • {chapter.timeRequired}</p>
                  </div>
                </div>
                {chapter.status === 'current' && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Current</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chapter.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{chapter.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{width: `${chapter.progress}%`}}
                    ></div>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {chapter.status === 'completed' && 'Completed'}
                  {chapter.status === 'current' && 'In Progress'}
                  {chapter.status === 'upcoming' && 'Coming Next'}
                  {chapter.status === 'locked' && 'Unlock Previous Chapters First'}
                </div>
                <Button 
                  size="sm" 
                  disabled={chapter.status === 'locked'}
                  variant={chapter.status === 'current' ? 'default' : 'outline'}
                >
                  {chapter.status === 'completed' ? 'Review' : 
                   chapter.status === 'current' ? 'Continue' : 
                   chapter.status === 'upcoming' ? 'Preview' : 'Locked'}
                </Button>
              </div>
            </CardContent>
            
            {/* Connection Line */}
            {index < pathwayData[selectedSubject as keyof typeof pathwayData].length - 1 && (
              <div className="absolute left-6 -bottom-4 w-0.5 h-8 bg-gray-200"></div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InteractivePathway;
