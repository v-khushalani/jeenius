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
  AlertCircle,
  TrendingDown,
  X,
  Sparkles,
  MessageSquare,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import LoadingScreen from "@/components/ui/LoadingScreen";

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().getHours());

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
      }
      
      setProfile(profileData);
      
      // Enhanced mock stats with more details
      setStats({
        totalQuestions: 245,
        questionsToday: 12,
        questionsWeek: 87,
        questionsMonth: 312,
        correctAnswers: 189,
        accuracy: 77,
        accuracyChange: 2,
        streak: 7,
        weeklyMinutes: 180,
        rank: 15,
        rankChange: -3, // Negative means improved (went from 18 to 15)
        percentile: 94.5,
        todayGoal: 30,
        todayProgress: 15,
        weakestTopic: "Organic Chemistry",
        strongestTopic: "Calculus",
        avgQuestionsPerDay: 35,
        topRankersAvg: 48,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';

  // Time-based personalization
  const getTimeBasedMessage = () => {
    if (currentTime >= 6 && currentTime < 12) {
      return {
        greeting: "Good morning",
        message: "Start your day with 5 warm-up questions!",
        icon: "🌅",
        action: "Quick Warmup",
      };
    } else if (currentTime >= 12 && currentTime < 17) {
      return {
        greeting: "Good afternoon",
        message: "Perfect time for focused practice!",
        icon: "☀️",
        action: "Start Practice",
      };
    } else if (currentTime >= 17 && currentTime < 21) {
      return {
        greeting: "Good evening",
        message: "Golden study hours - make them count!",
        icon: "🌆",
        action: "Deep Focus",
      };
    } else {
      return {
        greeting: "Burning midnight oil",
        message: "Review your mistakes and revise key concepts.",
        icon: "🌙",
        action: "Quick Revision",
      };
    }
  };

  const timeMessage = getTimeBasedMessage();

  // Smart notification based on user data
  const getSmartNotification = () => {
    if (stats?.accuracy < 70) {
      return {
        type: "warning",
        icon: AlertCircle,
        color: "orange",
        message: `Your ${stats.weakestTopic} accuracy is low. Try 10 practice questions?`,
      };
    } else if (stats?.rankChange < 0) {
      return {
        type: "success",
        icon: TrendingUp,
        color: "green",
        message: `Amazing! Your rank jumped by ${Math.abs(stats.rankChange)} positions this week! 🚀`,
      };
    } else {
      return {
        type: "info",
        icon: Sparkles,
        color: "blue",
        message: "Physics Marathon: 50 questions in 60 mins - Starting in 2 hours! Join 234 students",
      };
    }
  };

  const notification = getSmartNotification();

  // Get accuracy color
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return "text-green-700";
    if (accuracy >= 70) return "text-yellow-700";
    return "text-red-700";
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 85) return "from-green-50 to-emerald-50 border-green-200/50";
    if (accuracy >= 70) return "from-yellow-50 to-amber-50 border-yellow-200/50";
    return "from-red-50 to-orange-50 border-red-200/50";
  };

  if (isLoading) {
    return <LoadingScreen message="Preparing your genius dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24">
        {/* Dismissible Smart Banner */}
        {showBanner && (
          <div className={`mb-4 bg-gradient-to-r ${
            notification.color === 'green' ? 'from-green-500 to-emerald-600' :
            notification.color === 'orange' ? 'from-orange-500 to-red-600' :
            'from-blue-500 to-indigo-600'
          } text-white rounded-2xl p-4 shadow-xl relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <notification.icon className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white/80 hover:text-white transition-colors p-1 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section - Enhanced */}
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
                      {timeMessage.greeting}, {displayName}! {timeMessage.icon}
                    </h1>
                  </div>
                  <p className="text-slate-300 mb-2 text-lg">
                    {timeMessage.message}
                  </p>
                  <p className="text-blue-300 mb-6 text-sm font-medium">
                    Rank #{stats?.rank || 0} • Top {stats?.percentile || 0}% • 
                    {stats?.rankChange < 0 && (
                      <span className="text-green-400"> ↑ {Math.abs(stats.rankChange)} positions this week! 🎉</span>
                    )}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => navigate('/study-now')} 
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                    >
                      📚 {timeMessage.action}
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
                
                {/* Enhanced Rank Display */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 backdrop-blur-xl border border-yellow-400/30">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                      <span className="text-4xl font-bold text-yellow-300">#{stats?.rank || 0}</span>
                    </div>
                    <p className="text-sm text-yellow-200 font-medium mb-1">Your Rank</p>
                    {stats?.rankChange < 0 && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{Math.abs(stats.rankChange)} this week
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Quick Stats - 4 Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-700 mb-0.5">Questions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats?.totalQuestions || 0}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold">+{stats?.questionsToday || 0} today</span>
                    <span className="text-xs text-slate-500">• {stats?.questionsWeek || 0}/week</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${getAccuracyBgColor(stats?.accuracy)} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 mb-0.5">Accuracy</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${getAccuracyColor(stats?.accuracy)}`}>
                    {stats?.accuracy || 0}%
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${stats?.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats?.accuracyChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.accuracyChange || 0)}% week
                    </span>
                    {stats?.accuracy < 70 && (
                      <Badge className="text-xs bg-orange-500 text-white">Focus!</Badge>
                    )}
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${
                  stats?.accuracy >= 85 ? 'from-green-500 to-emerald-600' :
                  stats?.accuracy >= 70 ? 'from-yellow-500 to-amber-600' :
                  'from-red-500 to-orange-600'
                } p-2 sm:p-3 rounded-xl shadow-lg shrink-0`}>
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
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900">{stats?.todayProgress || 0}</p>
                    <span className="text-lg text-orange-600 font-semibold">/{stats?.todayGoal || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={(stats?.todayProgress / stats?.todayGoal) * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-orange-600 font-semibold">{Math.round((stats?.todayProgress / stats?.todayGoal) * 100)}%</span>
                  </div>
                  {stats?.todayProgress < stats?.todayGoal && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">Just {stats?.todayGoal - stats?.todayProgress} more! 💪</p>
                  )}
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
                  <span className="text-xs text-amber-600 font-semibold">🔥 {stats?.streak >= 7 ? 'On fire!' : 'Keep going!'}</span>
                  {stats?.streak >= 30 && (
                    <Badge className="mt-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs">
                      🏆 Legend!
                    </Badge>
                  )}
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 sm:p-3 rounded-xl shadow-lg shrink-0">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Smart Recommendations - NEW */}
        <Card className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl shrink-0">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  <div className="bg-white/50 rounded-lg p-3 border border-purple-200">
                    <p className="text-sm text-slate-700 mb-2">
                      📉 Your <strong>{stats?.weakestTopic}</strong> accuracy is 58%. Practice recommended!
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                      Start 10 Questions
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 border border-green-200">
                    <p className="text-sm text-slate-700">
                      ✅ You're crushing <strong>{stats?.strongestTopic}</strong>! Try advanced problems to challenge yourself.
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm text-slate-700">
                      💡 You make calculation errors 60% of the time. Try slowing down and double-checking work!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Enhanced Progress Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-100 p-3 sm:p-4">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span>Your Progress</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">This Week</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Physics - Strong */}
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">Physics</span>
                          <Badge className="bg-green-500 text-white text-xs">Strong 💪</Badge>
                        </div>
                        <p className="text-xs text-slate-600">12 chapters • 340 questions solved</p>
                      </div>
                      <span className="text-sm font-bold text-green-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-green-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Weak topic: <strong>Optics (65%)</strong></span>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold">Practice →</button>
                    </div>
                  </div>

                  {/* Chemistry - Needs Focus */}
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">Chemistry</span>
                          <Badge className="bg-yellow-500 text-white text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Focus
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">9 chapters • 287 questions solved</p>
                      </div>
                      <span className="text-sm font-bold text-yellow-700">72%</span>
                    </div>
                    <Progress value={72} className="h-2 bg-yellow-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Weak topic: <strong>Organic Chem (58%)</strong></span>
                      <button className="text-orange-600 hover:text-orange-700 font-semibold">Improve →</button>
                    </div>
                  </div>

                  {/* Mathematics - Excellent */}
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">Mathematics</span>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs">Excellent! 🌟</Badge>
                        </div>
                        <p className="text-xs text-slate-600">15 chapters • 456 questions solved</p>
                      </div>
                      <span className="text-sm font-bold text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2 bg-purple-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Strong: <strong>All topics above 85%</strong> ✨</span>
                      <button className="text-purple-600 hover:text-purple-700 font-semibold">Challenge →</button>
                    </div>
                  </div>
                </div>

                {/* Performance Comparison - NEW */}
                <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Compare with Top Rankers
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-2 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Your avg/day</p>
                      <p className="text-lg font-bold text-blue-600">{stats?.avgQuestionsPerDay || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Top 10 avg/day</p>
                      <p className="text-lg font-bold text-purple-600">{stats?.topRankersAvg || 0}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    💡 Solve {stats?.topRankersAvg - stats?.avgQuestionsPerDay} more questions daily to match top rankers!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Leaderboard */}
          <div>
            <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl h-full">
              <CardHeader className="border-b border-slate-100 p-3 sm:p-4">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 rounded-lg">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span>Leaderboard</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">Global</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg shadow-md border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        1
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">Rahul S.</p>
                        <p className="text-xs text-slate-500">48 qs/day avg</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-yellow-700">2,450</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        2
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">Priya M.</p>
                        <p className="text-xs text-slate-500">45 qs/day avg</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">2,380</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-lg border-2 border-blue-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        15
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-blue-900">You</p>
                        <p className="text-xs text-blue-600">{stats?.avgQuestionsPerDay || 0} qs/day avg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-blue-700">1,850</p>
                      {stats?.rankChange < 0 && (
                        <p className="text-xs text-green-600 font-semibold">↑{Math.abs(stats?.rankChange)}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Leaderboard Insights - NEW */}
                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-900 mb-1">📊 What top rankers do differently:</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Study 3.5+ hours daily</li>
                    <li>• Focus on weak topics first</li>
                    <li>• Take full mocks weekly</li>
                  </ul>
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

        {/* Floating Quick Actions Button - NEW */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative group">
            <button className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </button>
            
            {/* Quick action menu - shows on hover */}
            <div className="absolute bottom-16 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 min-w-[180px]">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Play className="h-4 w-4 text-blue-600" />
                  Continue Last
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  Ask AI Doubt
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Users className="h-4 w-4 text-green-600" />
                  Join Live Session
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Star className="h-4 w-4 text-orange-600" />
                  Daily Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
