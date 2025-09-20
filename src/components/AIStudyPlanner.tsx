
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target, Calendar, TrendingUp, Clock, BookOpen } from 'lucide-react';

interface StudentProfile {
  strengths: string[];
  weaknesses: string[];
  studyHours: number;
  examDate: string;
  preferredTime: string;
  learningStyle: string;
}

const AIStudyPlanner = () => {
  const [studentProfile] = useState<StudentProfile>({
    strengths: ['Mathematics', 'Physics - Mechanics'],
    weaknesses: ['Chemistry - Organic', 'Physics - Electromagnetism'],
    studyHours: 6,
    examDate: '2024-05-12',
    preferredTime: 'Morning',
    learningStyle: 'Visual'
  });

  const [currentWeek] = useState({
    completed: 4,
    total: 7,
    targets: [
      { subject: 'Chemistry', topic: 'Organic Reactions', status: 'completed', time: '2h' },
      { subject: 'Physics', topic: 'Electromagnetic Induction', status: 'current', time: '1.5h' },
      { subject: 'Mathematics', topic: 'Integration', status: 'pending', time: '2h' },
      { subject: 'Chemistry', topic: 'Coordination Compounds', status: 'pending', time: '1.5h' }
    ]
  });

  const adaptiveRecommendations = [
    {
      type: 'Focus Area',
      title: 'Extra Practice Needed',
      description: 'Chemistry - Organic reactions showing 40% accuracy',
      action: 'Spend 30 min daily on organic mechanisms',
      priority: 'high'
    },
    {
      type: 'Strength Building',
      title: 'Leverage Mathematics',
      description: 'Your math skills are strong - use for Physics problems',
      action: 'Try advanced calculus-based physics',
      priority: 'medium'
    },
    {
      type: 'Study Schedule',
      title: 'Optimize Morning Hours',
      description: 'You perform 25% better in morning sessions',
      action: 'Schedule difficult topics before 10 AM',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-primary" />
            <span>AI Study Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Days to JEE</div>
              <div className="text-2xl font-bold text-primary">127</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Study Hours/Day</div>
              <div className="text-2xl font-bold text-primary">{studentProfile.studyHours}h</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Current Focus</div>
              <div className="text-lg font-semibold">Chemistry</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week's Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>This Week's Targets</span>
            </div>
            <div className="text-sm text-gray-600">
              {currentWeek.completed}/{currentWeek.total} completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentWeek.targets.map((target, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    target.status === 'completed' ? 'bg-green-500' :
                    target.status === 'current' ? 'bg-primary' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <div className="font-medium">{target.topic}</div>
                    <div className="text-sm text-gray-600">{target.subject} • {target.time}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  target.status === 'completed' ? 'bg-green-100 text-green-600' :
                  target.status === 'current' ? 'bg-primary/10 text-primary' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {target.status === 'completed' ? 'Done' :
                   target.status === 'current' ? 'Current' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adaptiveRecommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                'border-blue-400 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-600 uppercase">{rec.type}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <p className="text-sm font-medium text-gray-900">{rec.action}</p>
                  </div>
                  <Button size="sm" variant="outline">Apply</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Dashboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
              <div className="space-y-2">
                {studentProfile.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">Focus Areas</h4>
              <div className="space-y-2">
                {studentProfile.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">Best Time</div>
                <div className="text-xs text-gray-600">{studentProfile.preferredTime}</div>
              </div>
              <div>
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">Learning Style</div>
                <div className="text-xs text-gray-600">{studentProfile.learningStyle}</div>
              </div>
              <div>
                <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">Target Date</div>
                <div className="text-xs text-gray-600">May 12, 2024</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIStudyPlanner;
