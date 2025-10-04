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
      
      // Fetch profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
      }
      
      setProfile(profileData);
      
      // Fetch real question attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('question_attempts')
        .select('*, questions(subject, chapter, topic)')
        .eq('user_id', user?.id);

      if (attemptsError) {
        console.error('Attempts fetch error:', attemptsError);
      }

      // Calculate real stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAttempts = attempts?.filter(a => 
        new Date(a.created_at) >= today
      ) || [];
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAttempts = attempts?.filter(a => 
        new Date(a.created_at) >= weekAgo
      ) || [];

      const correctAnswers = attempts?.filter(a => a.is_correct).length || 0;
      const totalQuestions = attempts?.length || 0;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      // Calculate streak
      let streak = 0;
      const sortedAttempts = [...(attempts || [])].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const hasActivity = sortedAttempts.some(a => {
          const attemptDate = new Date(a.created_at);
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === currentDate.getTime();
        });
        
        if (hasActivity) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (i === 0) {
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Find weakest and strongest topics
      const topicStats: any = {};
      attempts?.forEach((attempt: any) => {
        const topic = attempt.questions?.topic;
        if (topic) {
          if (!topicStats[topic]) {
            topicStats[topic] = { correct: 0, total: 0 };
          }
          topicStats[topic].total++;
          if (attempt.is_correct) topicStats[topic].correct++;
        }
      });

      let weakestTopic = "Not enough data";
      let strongestTopic = "Not enough data";
      let lowestAccuracy = 100;
      let highestAccuracy = 0;

      Object.entries(topicStats).forEach(([topic, stats]: [string, any]) => {
        if (stats.total >= 5) {
          const acc = (stats.correct / stats.total) * 100;
          if (acc < lowestAccuracy) {
            lowestAccuracy = acc;
            weakestTopic = topic;
          }
          if (acc > highestAccuracy) {
            highestAccuracy = acc;
            strongestTopic = topic;
          }
        }
      });

      setStats({
        totalQuestions,
        questionsToday: todayAttempts.length,
        questionsWeek: weekAttempts.length,
        questionsMonth: attempts?.length || 0,
        correctAnswers,
        accuracy,
        accuracyChange: 2, // TODO: Calculate from historical data
        streak,
        weeklyMinutes: Math.round(weekAttempts.length * 1.5), // Estimate 1.5 min per question
        rank: 15, // TODO: Calculate from leaderboard
        rankChange: -3,
        percentile: 94.5, // TODO: Calculate from leaderboard
        todayGoal: 30,
        todayProgress: todayAttempts.length,
        weakestTopic,
        strongestTopic,
        avgQuestionsPerDay: totalQuestions > 0 ? Math.round(totalQuestions / Math.max(1, streak || 1)) : 0,
        topRankersAvg: 48, // TODO: Calculate from top rankers
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

  const notification = stats ? getSmartNotification() : null;

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
        {showBanner && notification && (
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

          <Card className={`bg-gradient-to-br ${getAccuracyBgColor(stats?.accuracy || 0)} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 mb-0.5">Accuracy</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${getAccuracyColor(stats?.accuracy || 0)}`}>
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
                    <Progress value={(stats?.todayProgress / stats?.todayGoal) * 100 || 0} className="h-1.5 flex-1" />
                    <span className="text-xs text-orange-600 font-semibold">{Math.round((stats?.todayProgress / stats?.todayGoal) * 100 || 0)}%</span>
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
                      📉 Your <strong>{stats?.weakestTopic}</strong> needs attention. Practice recommended!
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs" onClick={() => navigate('/study-now')}>
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
                      💡 Solve {stats?.topRankersAvg - stats?.avgQuestionsPerDay} more questions daily to match top rankers!
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
                        <p className="text-xs text-slate-600">12 chapters • Real progress tracked</p>
                      </div>
                      <span className="text-sm font-bold text-green-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-green-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Keep practicing daily!</span>
                      <button onClick={() => navigate('/study-now')} className="text-blue-600 hover:text-blue-700 font-semibold">Practice →</button>
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
                        <p className="text-xs text-slate-600">9 chapters • Improve weak topics</p>
                      </div>
                      <span className="text-sm font-bold text-yellow-700">72%</span>
                    </div>
                    <Progress value={72} className="h-2 bg-yellow-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Work on weak areas</span>
                      <button onClick={() => navigate('/study-now')} className="text-orange-600 hover:text-orange-700 font-semibold">Improve →</button>
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
                        <p className="text-xs text-slate-600">15 chapters • Outstanding performance</p>
                      </div>
                      <span className="text-sm font-bold text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2 bg-purple-100" />
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-600">All topics mastered! ✨</span>
                      <button onClick={() => navigate('/study-now')} className="text-purple-600 hover:text-purple-700 font-semibold">Challenge →</button>
                    </div>
                  </div>
                </div>

                {/* Performance Comparison - NEW */}
                <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Compare with Top Rankers
                  </h4>
                  <div
