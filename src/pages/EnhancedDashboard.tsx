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
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-blue-800/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Welcome back, {displayName}! 🎯
                    </h1>
                  </div>
                  <p className="text-slate-300 mb-6 text-lg">
                    Ready to dominate {profile?.target_exam || 'your exams'} today? Your rank is climbing!
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => navigate('/study-now')} 
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                    >
                      📚 Start Studying
                    </button>
                    <button 
                      onClick={() => navigate('/battle')} 
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                    >
                      ⚔️ Battle Friends
                    </button>
                    <button 
                      onClick={() => navigate('/test')} 
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                    >
                      🧪 Take Test
                    </button>
                  </div>
                </div>
                
                {/* Rank Display */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 backdrop-blur-xl border border-yellow-400/30">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      <span className="text-4xl font-bold text-yellow-300">#{stats?.rank || 0}</span>
                    </div>
                    <p className="text-sm text-yellow-200 font-medium">Your Rank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 mb-1">Questions Solved</p>
                  <p className="text-4xl font-bold text-blue-900">{stats?.totalQuestions || 0}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-green-600 font-semibold">+12 today</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm border border-green-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 mb-1">Accuracy</p>
                  <p className="text-4xl font-bold text-green-900">{stats?.accuracy || 0}%</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-green-600 font-semibold">↑ 2% this week</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm border border-orange-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-700 mb-1">Today's Goal</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-orange-900">15</p>
                    <span className="text-xl text-orange-600 font-semibold">/30</span>
                  </div>
                  <Progress value={50} className="mt-3 h-2" />
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview - Enhanced */}
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl hover:shadow-3xl transition-all">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-slate-800">Physics</span>
                      <span className="text-lg font-bold text-blue-600">85%</span>
                    </div>
                    <Progress value={85} className="h-3 bg-blue-100" />
                    <p className="text-xs text-slate-600 mt-2">12 chapters completed</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-slate-800">Chemistry</span>
                      <span className="text-lg font-bold text-green-600">72%</span>
                    </div>
                    <Progress value={72} className="h-3 bg-green-100" />
                    <p className="text-xs text-slate-600 mt-2">9 chapters completed</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-slate-800">Mathematics</span>
                      <span className="text-lg font-bold text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-3 bg-purple-100" />
                    <p className="text-xs text-slate-600 mt-2">15 chapters completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day Streak Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-2">Day Streak</p>
                    <div className="flex items-center gap-3">
                      <Flame className="h-12 w-12 text-yellow-300" />
                      <span className="text-6xl font-bold">{stats?.streak || 0}</span>
                    </div>
                    <p className="text-orange-100 mt-3 text-sm">Keep the fire burning! 🔥</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl">🔥</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leaderboard Preview - Enhanced */}
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl hover:shadow-3xl transition-all">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl shadow-md border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        1
                      </div>
                      <span className="text-sm font-semibold">Rahul S.</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-700">2,450 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl shadow-md border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        2
                      </div>
                      <span className="text-sm font-semibold">Priya M.</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">2,380 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg border-2 border-blue-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        15
                      </div>
                      <span className="text-sm font-bold text-blue-900">You</span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">1,850 pts</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold"
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
