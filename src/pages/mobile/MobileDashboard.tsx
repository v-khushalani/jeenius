
import React from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, BookOpen, Target, ArrowRight } from 'lucide-react';

const MobileDashboard = () => {
  return (
    <MobileLayout title="Dashboard">
      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary text-white">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xl font-bold">2547</div>
              <div className="text-xs opacity-90">JEEnius Points</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500 text-white">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xl font-bold">12</div>
              <div className="text-xs opacity-90">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Focus */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Today's Focus</h3>
              <span className="text-sm text-primary">Chemistry</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Organic Chemistry - Reactions</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-3/5"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>3/5 topics completed</span>
                <span>60%</span>
              </div>
            </div>
            <Button size="sm" className="w-full mt-3">
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm">Practice</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Target className="w-6 h-6" />
            <span className="text-sm">Mock Test</span>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { subject: 'Physics', topic: 'Mechanics', points: 25, time: '2h ago' },
                { subject: 'Chemistry', topic: 'Bonding', points: 30, time: '4h ago' },
                { subject: 'Math', topic: 'Calculus', points: 20, time: '1d ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{activity.subject}</div>
                    <div className="text-xs text-gray-600">{activity.topic} • {activity.time}</div>
                  </div>
                  <div className="text-primary font-semibold text-sm">+{activity.points} JP</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default MobileDashboard;
