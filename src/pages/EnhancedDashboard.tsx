return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      {/* Header would be here - removed for artifact */}
      <div className="pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Welcome back, {displayName}! 🎯
                  </h1>
                  <p className="text-blue-100 mb-4">
                    Ready to dominate {profile?.target_exam || 'your exams'} today? Your streak is on fire!
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
                      ⚔️ Battle Arena
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => navigate('/admin')} 
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all flex items-center"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/settings')} 
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </button>
                    <button 
                      onClick={handleSignOut} 
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg text-sm font-medium transition-all flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
                
                {/* Rank Display */}
                <div className="text-right bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-200">Current Rank</div>
                  <div className="text-3xl font-bold">#{stats?.currentRank || 'N/A'}</div>
                  <div className="text-sm text-blue-200 mb-2">{stats?.rankCategory || 'Unranked'}</div>
                  {stats?.percentile && (
                    <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      Top {100 - stats.percentile}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <div className="p-6 text-center">
                <Trophy className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{animatedPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90 mb-2">JEEnius Points</div>
                <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  Total earned
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Flame className="w-10 h-10 drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats?.streak || 0}</div>
                <div className="text-sm opacity-90 mb-2">Day Streak</div>
                <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {stats?.streak > 0 ? "Keep it up!" : "Start today!"}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <div className="p-6 text-center">
                <BookOpen className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{stats?.totalQuestions?.toLocaleString() || 0}</div>
                <div className="text-sm opacity-90 mb-2">Questions Solved</div>
                <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {stats?.accuracy || 0}% accuracy
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
              <div className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{stats?.accuracy || 0}%</div>
                <div className="text-sm opacity-90 mb-2">Overall Accuracy</div>
                <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  Above average
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Left Column - Subject Performance & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className={`h-auto p-4 bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all group rounded-lg`}
                      >
                        <div className="text-center">
                          <action.icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <div className="font-semibold text-sm">{action.title}</div>
                          <div className="text-xs opacity-90 mt-1">{action.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-purple-500" />
                      Subject Performance
                    </h3>
                    <div className="border border-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
                      This Week
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {subjects.map((subject, index) => (
                    <div key={subject.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${subject.color} rounded-full`}></div>
                          <span className="font-medium">{subject.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            {subject.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              subject.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {subject.change}
                            </span>
                          </div>
                          <span className="font-bold text-lg">{subject.accuracy}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${subject.color}`} 
                          style={{width: `${subject.accuracy}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Weak areas need focus</span>
                        <span>{subject.accuracy >= 80 ? 'Excellent' : subject.accuracy >= 60 ? 'Good' : 'Needs improvement'}</span>
                      </div>
                    </div>
                  ))}

                  {/* AI Suggestion */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {(() => {
                        const weakestSubject = subjects.reduce((prev, current) => 
                          (prev.accuracy < current.accuracy) ? prev : current
                        );
                        return `Focus on ${weakestSubject.name} - practice more problems in your weakest topics to improve your ${weakestSubject.accuracy}% accuracy.`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Leaderboard & Achievements */}
            <div className="space-y-6">
              
              {/* Leaderboard */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Leaderboard
                    </h3>
                    <div className="border border-green-600 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Live
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-0">
                    {leaderboardData.map((user, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-4 p-4 border-b last:border-b-0 transition-colors ${
                          user.isCurrentUser ? "bg-gradient-to-r from-blue-50 to-indigo-50 font-medium" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                          user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500" :
                          user.rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-800" :
                          user.isCurrentUser ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                          "bg-gray-400"
                        }`}>
                          {user.rank <= 3 ? (
                            user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : "🥉"
                          ) : user.rank}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <div className="text-2xl">{user.avatar}</div>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium text-sm ${user.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                              {user.name}
                              {user.isCurrentUser && " (You)"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.points.toLocaleString()} points
                            </div>
                          </div>
                        </div>

                        {/* Streak */}
                        {user.streak > 0 && (
                          <div className="text-center">
                            <div className="text-sm font-bold text-orange-600 flex items-center">
                              <Flame className="w-4 h-4 mr-1" />
                              {user.streak}
                            </div>
                            <div className="text-xs text-gray-500">streak</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* View Full Leaderboard Button */}
                  <div className="p-4 border-t bg-gray-50">
                    <button 
                      className="w-full text-sm hover:bg-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => navigate('/leaderboard')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Leaderboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-500" />
                      Achievements
                    </h3>
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                      onClick={() => navigate('/achievements')}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className={`flex items-center space-x-3 p-3 ${achievement.bgColor} rounded-lg border border-opacity-20`}>
                      <div className={`w-10 h-10 ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${achievement.textColor}`}>{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.time}</p>
                      </div>
                      <div className={`${achievement.badgeColor} font-medium text-xs px-2 py-1 rounded-full`}>
                        {achievement.xp}
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-2">
                    <button 
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-xs flex items-center mx-auto"
                      onClick={() => navigate('/achievements')}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      View All {achievements.length} Achievements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Schedule */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Today's Study Schedule
                </h3>
                <button 
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm flex items-center"
                  onClick={() => navigate('/schedule')}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Customize
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-800">Physics Practice</h3>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">30 min</div>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">Mechanics & Motion Laws</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Start Now
                  </button>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800">Chemistry Quiz</h3>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">20 min</div>
                  </div>
                  <p className="text-sm text-green-600 mb-3">Organic Reactions</p>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    Take Quiz
                  </button>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-800">Math Challenge</h3>
                    <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">25 min</div>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">Calculus Problems</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    Solve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Trophy,
  Zap,
  BookOpen,
  Target,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  MessageSquare,
  Flame,
  Users,
  PlayCircle,
  CheckCircle,
  Timer,
  BarChart,
  Medal,
  Sparkles,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  Activity,
  TrendingDown,
  Eye,
  FileText,
  Lightbulb
} from "lucide-react";

const EnhancedDashboard = () => {
  const [animatedPoints, setAnimatedPoints] = useState(0);
  
  // Mock navigation function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In real app, use: navigate(path)
  };
  
  // Mock data - replace with real data from your hooks
  const stats = {
    totalPoints: 15680,
    streak: 15,
    totalQuestions: 2847,
    accuracy: 85,
    currentRank: 42,
    rankCategory: "Intermediate",
    percentile: 75,
    totalUsers: 50000
  };

  const profile = {
    full_name: "Arjun Kumar",
    target_exam: "JEE",
    grade: 12
  };

  const user = {
    user_metadata: {
      full_name: "Arjun Kumar"
    }
  };

  const isAdmin = false;

  useEffect(() => {
    if (stats?.totalPoints) {
      const timer = setInterval(() => {
        setAnimatedPoints((prev) => {
          if (prev < stats.totalPoints) {
            return Math.min(prev + 50, stats.totalPoints);
          }
          return stats.totalPoints;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [stats?.totalPoints]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Student";

  const getSubjects = () => {
    if (profile?.target_exam === 'NEET') {
      return [
        { name: 'Physics', color: 'bg-blue-500', accuracy: 78, trend: 'up', change: '+5%' },
        { name: 'Chemistry', color: 'bg-green-500', accuracy: 85, trend: 'up', change: '+3%' },
        { name: 'Biology', color: 'bg-red-500', accuracy: 92, trend: 'up', change: '+7%' }
      ];
    } else if (profile?.target_exam === 'JEE') {
      return [
        { name: 'Physics', color: 'bg-blue-500', accuracy: 87, trend: 'up', change: '+5%' },
        { name: 'Chemistry', color: 'bg-green-500', accuracy: 74, trend: 'down', change: '-2%' },
        { name: 'Mathematics', color: 'bg-purple-500', accuracy: 91, trend: 'up', change: '+8%' }
      ];
    } else {
      return [
        { name: 'Mathematics', color: 'bg-purple-500', accuracy: 82, trend: 'up', change: '+4%' },
        { name: 'Science', color: 'bg-blue-500', accuracy: 76, trend: 'down', change: '-1%' },
        { name: 'English', color: 'bg-green-500', accuracy: 89, trend: 'up', change: '+6%' }
      ];
    }
  };

  const subjects = getSubjects();
  
  const leaderboardData = [
    { rank: 1, name: "Arjun K.", points: 18420, streak: 45, avatar: "👨‍🎓", isOnline: true },
    { rank: 2, name: "Priya S.", points: 17890, streak: 38, avatar: "👩‍🎓", isOnline: true },
    { rank: 3, name: "Rohit M.", points: 16250, streak: 42, avatar: "👨‍🎓", isOnline: false },
    { rank: 4, name: "You", points: animatedPoints, streak: stats?.streak || 0, avatar: "🎯", isCurrentUser: true, isOnline: true },
    { rank: 5, name: "Sneha P.", points: 14980, streak: 35, avatar: "👩‍🎓", isOnline: true }
  ];

  const achievements = [
    {
      id: 1,
      title: "Century Club!",
      description: "Solved 100 questions in Physics",
      icon: Trophy,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      badgeColor: "bg-green-100 text-green-800",
      xp: "+50 XP",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Streak Master",
      description: "15-day study streak achieved",
      icon: Flame,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      badgeColor: "bg-red-100 text-red-800",
      xp: "+100 XP",
      time: "1 day ago"
    },
    {
      id: 3,
      title: "Speed Demon",
      description: "Solved 20 questions in under 10 mins",
      icon: Zap,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      badgeColor: "bg-yellow-100 text-yellow-800",
      xp: "+75 XP",
      time: "3 days ago"
    },
    {
      id: 4,
      title: "Perfect Score",
      description: "100% accuracy in Chemistry test",
      icon: Star,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      badgeColor: "bg-purple-100 text-purple-800",
      xp: "+150 XP",
      time: "1 week ago"
    }
  ];

  const quickActions = [
    {
      title: "Start Practice",
      description: "Continue your learning journey",
      icon: PlayCircle,
      color: "from-blue-500 to-blue-600",
      path: "/study-now"
    },
    {
      title: "Take Test",
      description: "Challenge yourself with mock tests",
      icon: FileText,
      color: "from-green-500 to-green-600",
      path: "/test-series"
    },
    {
      title: "Battle Arena",
      description: "Compete with other students",
      icon: Trophy,
      color: "from-purple-500 to-purple-600",
      path: "/battle"
    },
    {
      title: "Doubt Forum",
      description: "Get help from community",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      path: "/doubts"
    }
  ];

  const handleSignOut = () => {
    // Add sign out logic here
    console.log("Signing out...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Welcome Section */}
          <Card className="mb-8 overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Welcome back, {displayName}! 🎯
                  </h1>
                  <p className="text-blue-100 mb-4">
                    Ready to dominate {profile?.target_exam || 'your exams'} today? Your streak is on fire!
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => navigate('/study-now')} 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      📚 Start Studying
                    </Button>
                    <Button 
                      onClick={() => navigate('/battle')} 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      ⚔️ Battle Arena
                    </Button>
                    {isAdmin && (
                      <Button 
                        onClick={() => navigate('/admin')} 
                        size="sm" 
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    )}
                    <Button 
                      onClick={() => navigate('/settings')} 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button 
                      onClick={handleSignOut} 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </div>
                
                {/* Rank Display */}
                <div className="text-right bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-sm text-blue-200">Current Rank</div>
                  <div className="text-3xl font-bold">#{stats?.currentRank || 'N/A'}</div>
                  <div className="text-sm text-blue-200 mb-2">{stats?.rankCategory || 'Unranked'}</div>
                  {stats?.percentile && (
                    <Badge className="bg-white/20 text-white text-xs">
                      Top {100 - stats.percentile}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Trophy className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{animatedPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90 mb-2">JEEnius Points</div>
                <Badge className="bg-white/20 text-white text-xs">
                  Total earned
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-400 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Flame className="w-10 h-10 drop-shadow-lg" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats?.streak || 0}</div>
                <div className="text-sm opacity-90 mb-2">Day Streak</div>
                <Badge className="bg-white/20 text-white text-xs">
                  {stats?.streak > 0 ? "Keep it up!" : "Start today!"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{stats?.totalQuestions?.toLocaleString() || 0}</div>
                <div className="text-sm opacity-90 mb-2">Questions Solved</div>
                <Badge className="bg-white/20 text-white text-xs">
                  {stats?.accuracy || 0}% accuracy
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold mb-1">{stats?.accuracy || 0}%</div>
                <div className="text-sm opacity-90 mb-2">Overall Accuracy</div>
                <Badge className="bg-white/20 text-white text-xs">
                  Above average
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            
            {/* Left Column - Subject Performance & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className={`h-auto p-4 bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all group`}
                      >
                        <div className="text-center">
                          <action.icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <div className="font-semibold text-sm">{action.title}</div>
                          <div className="text-xs opacity-90 mt-1">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-purple-500" />
                      Subject Performance
                    </div>
                    <Badge variant="outline">This Week</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {subjects.map((subject, index) => (
                    <div key={subject.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${subject.color} rounded-full`}></div>
                          <span className="font-medium">{subject.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            {subject.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              subject.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {subject.change}
                            </span>
                          </div>
                          <span className="font-bold text-lg">{subject.accuracy}%</span>
                        </div>
                      </div>
                      <Progress value={subject.accuracy} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Weak areas need focus</span>
                        <span>{subject.accuracy >= 80 ? 'Excellent' : subject.accuracy >= 60 ? 'Good' : 'Needs improvement'}</span>
                      </div>
                    </div>
                  ))}

                  {/* AI Suggestion */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {(() => {
                        const weakestSubject = subjects.reduce((prev, current) => 
                          (prev.accuracy < current.accuracy) ? prev : current
                        );
                        return `Focus on ${weakestSubject.name} - practice more problems in your weakest topics to improve your ${weakestSubject.accuracy}% accuracy.`;
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Leaderboard & Achievements */}
            <div className="space-y-6">
              
              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Leaderboard
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {leaderboardData.map((user, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-4 p-4 border-b last:border-b-0 transition-colors ${
                          user.isCurrentUser ? "bg-gradient-to-r from-blue-50 to-indigo-50 font-medium" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                          user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500" :
                          user.rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-800" :
                          user.isCurrentUser ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                          "bg-gray-400"
                        }`}>
                          {user.rank <= 3 ? (
                            user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : "🥉"
                          ) : user.rank}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <div className="text-2xl">{user.avatar}</div>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium text-sm ${user.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                              {user.name}
                              {user.isCurrentUser && " (You)"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.points.toLocaleString()} points
                            </div>
                          </div>
                        </div>

                        {/* Streak */}
                        {user.streak > 0 && (
                          <div className="text-center">
                            <div className="text-sm font-bold text-orange-600 flex items-center">
                              <Flame className="w-4 h-4 mr-1" />
                              {user.streak}
                            </div>
                            <div className="text-xs text-gray-500">streak</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* View Full Leaderboard Button */}
                  <div className="p-4 border-t bg-gray-50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-sm hover:bg-white"
                      onClick={() => navigate('/leaderboard')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Leaderboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-500" />
                      Achievements
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/achievements')}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className={`flex items-center space-x-3 p-3 ${achievement.bgColor} rounded-lg border border-opacity-20`}>
                      <div className={`w-10 h-10 ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <achievement.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${achievement.textColor}`}>{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.time}</p>
                      </div>
                      <Badge className={`${achievement.badgeColor} font-medium`}>
                        {achievement.xp}
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="text-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => navigate('/achievements')}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      View All {achievements.length} Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Study Schedule */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Today's Study Schedule
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
                  <Settings className="w-4 h-4 mr-1" />
                  Customize
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-800">Physics Practice</h3>
                    <Badge className="bg-blue-100 text-blue-800">30 min</Badge>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">Mechanics & Motion Laws</p>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Start Now
                  </Button>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800">Chemistry Quiz</h3>
                    <Badge className="bg-green-100 text-green-800">20 min</Badge>
                  </div>
                  <p className="text-sm text-green-600 mb-3">Organic Reactions</p>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    <Timer className="w-4 h-4 mr-1" />
                    Take Quiz
                  </Button>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-purple-800">Math Challenge</h3>
                    <Badge className="bg-purple-100 text-purple-800">25 min</Badge>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">Calculus Problems</p>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Brain className="w-4 h-4 mr-1" />
                    Solve Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
