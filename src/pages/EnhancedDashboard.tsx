import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Trophy,
  Zap,
  Target,
  Book,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Play,
  Flame,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
      }
      
      setProfile(profileData);
      
      // Mock stats for now
      setStats({
        totalQuestions: 245,
        correctAnswers: 189,
        accuracy: 77,
        streak: 7,
        weeklyMinutes: 180,
        rank: 15
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          {/* Jeenius Logo */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">JEENIUS</h1>
          </div>
          
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Preparing your genius dashboard...</h2>
          <p className="text-gray-600">🚀 Great minds are loading amazing things!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Added proper spacing to avoid navbar overlap */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  Welcome back, {displayName}! 🎯
                </h1>
                <p className="text-blue-100 mb-4">
                  Ready to dominate {profile?.target_exam || 'your exams'} today? Your rank is climbing!
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => navigate('/study-now')} 
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all"
                  >
                    📚 Start Studying
                  </button>
                  <button 
                    onClick={() => navigate('/battle')} 
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all"
                  >
                    ⚔️ Battle Friends
                  </button>
                  <button 
                    onClick={() => navigate('/test')} 
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all"
                  >
                    🧪 Take Test
                  </button>
                </div>
              </div>
              
              {/* Rank Display - Changed from Streak */}
              <div className="text-center">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="h-6 w-6 text-yellow-300" />
                    <span className="text-2xl font-bold">#{stats?.rank || 0}</span>
                  </div>
                  <p className="text-xs text-blue-100">Your Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Swapped Streak and Rank positions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalQuestions || 0}</p>
                  <p className="text-sm text-gray-600">Questions Solved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.accuracy || 0}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.weeklyMinutes || 0}m</p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changed from Rank to Streak */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Removed Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Physics</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Chemistry</span>
                      <span className="text-sm text-gray-600">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Mathematics</span>
                      <span className="text-sm text-gray-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Achievement Highlights */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">7-Day Streak!</p>
                      <p className="text-xs text-gray-600">Keep it up!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Chapter Master</p>
                      <p className="text-xs text-gray-600">Completed Mechanics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Accuracy Pro</p>
                      <p className="text-xs text-gray-600">85%+ for 3 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Goal */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Today's Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">15/30</div>
                    <p className="text-sm text-gray-600">Questions completed</p>
                  </div>
                  <Progress value={50} className="mb-3" />
                  <p className="text-xs text-gray-600">50% of daily goal achieved</p>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">1.</span>
                      <span className="text-sm">Rahul S.</span>
                    </div>
                    <span className="text-sm font-medium">2,450 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">2.</span>
                      <span className="text-sm">Priya M.</span>
                    </div>
                    <span className="text-sm font-medium">2,380 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">15.</span>
                      <span className="text-sm font-medium">You</span>
                    </div>
                    <span className="text-sm font-medium">1,850 pts</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-blue-600"
                  onClick={() => navigate('/leaderboard')}
                >
                  View Full Leaderboard
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
