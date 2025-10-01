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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <Header />
      
      {/* Optimized spacing for non-scrollable view */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl pt-20 pb-4">
        {/* Welcome Section - Compact */}
        <div className="mb-4">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-800/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 flex items-start gap-3">
                  {/* Logo */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                      Welcome back, {displayName}! 🎯
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base mb-3">
                      Ready to dominate {profile?.target_exam || 'your exams'}?
                    </p>
                    
                    {/* Action Buttons - Compact */}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => navigate('/study-now')} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-105"
                      >
                        📚 Study
                      </button>
                      <button 
                        onClick={() => navigate('/battle')} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-105"
                      >
                        ⚔️ Battle
                      </button>
                      <button 
                        onClick={() => navigate('/test')} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg hover:scale-105"
                      >
                        🧪 Test
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Rank Display - Medal Style */}
                <div className="text-center shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300">
                      <div className="text-center">
                        <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-white mx-auto mb-0.5" />
                        <span className="text-xl sm:text-2xl font-black text-white">#{stats?.rank || 0}</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">↑</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - 4 Cards Including Streak */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-700 mb-0.5">Questions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats?.totalQuestions || 0}</p>
                  <span className="text-xs text-green-600 font-semibold">+12 today</span>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-700 mb-0.5">Accuracy</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats?.accuracy || 0}%</p>
                  <span className="text-xs text-green-600 font-semibold">↑ 2% week</span>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-orange-700 mb-0.5">Today's Goal</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900">15</p>
                    <span className="text-lg text-orange-600 font-semibold">/30</span>
                  </div>
                  <Progress value={50} className="mt-1 h-1.5" />
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-700 mb-0.5">Day Streak</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-900">{stats?.streak || 0}</p>
                  <span className="text-xs text-amber-600 font-semibold">🔥 On fire!</span>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Compact */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Left Column - Progress */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-100 p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">Physics</span>
                      <span className="text-sm font-bold text-blue-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-blue-100" />
                    <p className="text-xs text-slate-600 mt-1">12 chapters</p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">Chemistry</span>
                      <span className="text-sm font-bold text-green-600">72%</span>
                    </div>
                    <Progress value={72} className="h-2 bg-green-100" />
                    <p className="text-xs text-slate-600 mt-1">9 chapters</p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-800">Mathematics</span>
                      <span className="text-sm font-bold text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2 bg-purple-100" />
                    <p className="text-xs text-slate-600 mt-1">15 chapters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-100 p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 rounded-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg shadow-md border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        1
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">Rahul S.</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-yellow-700">2,450</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        2
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">Priya M.</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">2,380</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-lg border-2 border-blue-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        15
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-blue-900">You</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-blue-700">1,850</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold text-xs sm:text-sm py-1.5"
                  onClick={() => navigate('/leaderboard')}
                >
                  View Full Leaderboard
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
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
