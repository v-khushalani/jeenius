import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
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
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useTestSeries } from "@/hooks/useTestSeries";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAuth();
  const { stats, profile, subjectProgress, loading } = useUserData();
  const { tests, userAttempts } = useTestSeries();
  const [animatedPoints, setAnimatedPoints] = useState(0);

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

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="JEEnius" 
            className="w-20 h-20 mx-auto animate-pulse mb-4 rounded-lg"
          />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
const displayName = (() => {
// Priority 1: Check profile first
if (profile?.full_name && profile.full_name.trim()) {
  return profile.full_name;
}

// Priority 2: Check auth user metadata
if (user?.user_metadata?.full_name) {
  return user.user_metadata.full_name;
}

// Priority 3: Check user metadata
if (user?.user_metadata?.full_name) {
  return user.user_metadata.full_name;
}

// Fallback
return "Student";
})();

  const currentRank = stats?.currentRank ?? Math.floor(Math.random() * 1000) + 1;
    const getNextRankCategory = (currentCategory) => {
      const categories = {
        "Beginner": "Developing",
        "Developing": "Intermediate", 
        "Intermediate": "Advanced",
        "Advanced": "Elite JEEnius",
        "Elite JEEnius": "Legend"
      };
      return categories[currentCategory] || "Next Level";
    };
    
    const getRankProgress = (stats) => {
      if (!stats) return 0;
      const { accuracy = 0, totalQuestions = 0 } = stats;
      
      // Simple progress calculation based on questions and accuracy
      const progress = Math.min((totalQuestions * accuracy) / 100, 100);
      return Math.round(progress);
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  Welcome back, {displayName}! 🎯
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Ready to dominate JEE today? Your streak is on fire!
                </p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => navigate('/battle')} size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      ⚔️ Battle Arena
                    </Button>
                    {isAdmin && (
                      <Button onClick={() => navigate('/admin')} size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Button>
                    )}
                    <Button onClick={() => navigate('/settings')} size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button onClick={signOut} size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs sm:text-sm text-blue-200">Current Rank</div>
                <div className="text-xl sm:text-2xl font-bold">#{stats?.currentRank || 'N/A'}</div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {stats?.rankCategory || 'Unranked'}
                </div>
                {stats?.percentile && (
                  <div className="text-xs text-blue-100 mt-1">
                    Top {100 - stats.percentile}% • {stats.totalUsers?.toLocaleString()} users
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 text-center">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 drop-shadow-lg" />
                <div className="text-xl sm:text-2xl font-bold">{animatedPoints || 0}</div>
                <div className="text-xs sm:text-sm opacity-90">JEEnius Points</div>
                <div className="text-xs bg-white/20 rounded-full px-2 py-1 mt-1">
                  Total earned
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-400 to-green-500 text-white border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-lg" />
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </div>
                <div className="text-xl sm:text-2xl font-bold">{stats?.streak || 0}</div>
                <div className="text-xs sm:text-sm opacity-90">Day Streak</div>
                <div className="text-xs bg-white/20 rounded-full px-2 py-1 mt-1">
                  {stats?.streak > 0 ? "Keep it up!" : "Start today!"}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 drop-shadow-lg" />
                <div className="text-2xl font-bold">
                  {stats?.totalQuestions || 0}
                </div>
                <div className="text-sm opacity-90">Questions Attempted</div> {/* CHANGED */}
                <div className="text-xs bg-white/20 rounded-full px-2 py-1 mt-1">
                  {stats?.accuracy || 0}% accuracy
                </div>
              </CardContent>
            </Card>
          </div>
                                {/* Leaderboard - Right Column */}
<Card>
  <CardHeader>
    <CardTitle className="h-full flex items-center justify-between">
      <div className="flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Leaderboard
      </div>
      <Badge variant="outline">Live</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="space-y-0">
      {[
        { rank: 1, name: "Arjun K.", points: 15420, streak: 45, avatar: "👨‍🎓" },
        { rank: 2, name: "Priya S.", points: 14890, streak: 38, avatar: "👩‍🎓" },
        { rank: 3, name: "You", points: animatedPoints, streak: stats?.streak || 0, avatar: "🎯" },
        { rank: 4, name: "Rohit S.", points: 14250, streak: 42, avatar: "👨‍🎓" },
        { rank: 5, name: "Sneha P.", points: 13980, streak: 35, avatar: "👩‍🎓" }
      ].map((user, index) => (
        <div key={index} className={`flex items-center gap-3 p-3 border-b last:border-b-0 ${
          user.name === "You" ? "bg-blue-50 font-medium" : ""
        }`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
            user.rank === 1 ? "bg-yellow-500" :
            user.rank === 2 ? "bg-gray-400" :
            user.rank === 3 ? "bg-orange-500" : "bg-gray-300"
          }`}>
            {user.rank <= 3 ? (
              user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : "🥉"
            ) : user.rank}
          </div>
          <div className="text-lg">{user.avatar}</div>
          <div className="flex-1">
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs text-gray-500">
              {user.points.toLocaleString()} pts
            </div>
          </div>
          {user.streak > 0 && (
            <div className="text-xs text-red-500 font-medium">
              🔥{user.streak}
            </div>
          )}
        </div>
      ))}
    </div>
    
    {/* View Full Leaderboard Button */}
    <div className="p-3 border-t bg-gray-50">
      <Button variant="ghost" size="sm" className="w-full text-xs">
        View Full Leaderboard
      </Button>
    </div>
  </CardContent>
</Card>

          {/* Performance Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="h-full flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Subject Performance
                  </div>
                  <Badge variant="outline">This Week</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  // Get user's goal from localStorage or profile
                  const userGoals = JSON.parse(localStorage.getItem('userGoals') || '{}');
                  const targetExam = profile?.target_exam || userGoals.goal || 'JEE';
                  
                  // Define subjects based on goal
                  const getSubjects = () => {
                    if (targetExam === 'NEET') {
                      return [
                        { name: 'Physics', color: 'bg-blue-500' },
                        { name: 'Chemistry', color: 'bg-green-500' },
                        { name: 'Biology', color: 'bg-red-500' }
                      ];
                    } else if (targetExam === 'JEE') {
                      return [
                        { name: 'Physics', color: 'bg-blue-500' },
                        { name: 'Chemistry', color: 'bg-green-500' },
                        { name: 'Mathematics', color: 'bg-purple-500' }
                      ];
                    } else {
                      // Foundation subjects
                      return [
                        { name: 'Mathematics', color: 'bg-purple-500' },
                        { name: 'Science', color: 'bg-blue-500' },
                        { name: 'English', color: 'bg-green-500' }
                      ];
                    }
                  };
              
                  const subjects = getSubjects();
                  
                  return subjects.map((subject, index) => (
                    <div key={subject.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                          <span>{subject.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            index % 2 === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {index % 2 === 0 ? '↑5%' : '↓3%'}
                          </span>
                          <span className="font-bold">
                            {subjectProgress.find((s) => s.subject === subject.name)?.accuracy || Math.floor(Math.random() * 40) + 60}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={subjectProgress.find((s) => s.subject === subject.name)?.accuracy || Math.floor(Math.random() * 40) + 60}
                        className="h-2"
                      />
                    </div>
                  ));
                })()}
              
                <div className="bg-yellow-50 rounded-lg p-3 mt-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">AI Suggestion</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    {(() => {
                      const userGoals = JSON.parse(localStorage.getItem('userGoals') || '{}');
                      const targetExam = profile?.target_exam || userGoals.goal || 'JEE';
                      
                      if (targetExam === 'NEET') {
                        return 'Focus on Human Physiology - your weakest area in Biology';
                      } else if (targetExam === 'JEE') {
                        return 'Focus on Calculus - your weakest area in Math';
                      } else {
                        return 'Practice more word problems in Mathematics';
                      }
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="h-full flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Achievements
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Century Club!</p>
                    <p className="text-xs text-gray-600">
                      Solved 100 questions in Physics
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+50 XP</Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Streak Master</p>
                    <p className="text-xs text-gray-600">
                      10-day study streak achieved
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">+100 XP</Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Quick Solver</p>
                    <p className="text-xs text-gray-600">
                      Solved 20 questions in under 10 mins
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    +25 XP
                  </Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Helper Hero</p>
                    <p className="text-xs text-gray-600">
                      Helped 5 students with doubts
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    +75 XP
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
