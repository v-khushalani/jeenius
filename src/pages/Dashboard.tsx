import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Trophy, Zap, BookOpen, Target, Brain } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, profile, loading } = useUserData();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {displayName}! 🎯</h1>
            <p className="text-gray-600">Ready to continue your JEE journey?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-primary text-primary-foreground border-primary">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.totalPoints || 0}</div>
                <div className="text-xs opacity-90">Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-500 text-white">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.streak || 0}</div>
                <div className="text-xs opacity-90">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-500 text-white">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.totalQuestions || 0}</div>
                <div className="text-xs opacity-90">Questions</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-1" 
              onClick={() => navigate('/study-now')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Study Now</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-1"
              onClick={() => navigate('/tests')}
            >
              <Target className="w-6 h-6" />
              <span className="text-sm">Take Tests</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <Brain className="w-6 h-6" />
              <span className="text-sm">Ask Jeenie</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;