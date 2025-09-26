import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Brain, Target, BookOpen, Clock, Calendar, CheckCircle, TrendingUp, Users, Zap,
  PlayCircle, Star, Search, Filter, ArrowRight, Flame, Trophy, AlertCircle, ChevronRight,
  Play, Pause, RotateCcw, Beaker, Calculator, Award, MessageSquare, ChevronDown,
  ChevronUp, FileText, PenTool, Lightbulb, TrendingDown, BarChart3, Lock, Unlock,
  Cpu, Layers, Gauge, BarChart, Activity, Crown, Medal, Rocket, Lightning, 
  Heart, Shield, Swords, Sparkles, FireIcon, ThumbsUp, Eye
} from "lucide-react";

const EnhancedStudyNowPage = () => {
  const [selectedTab, setSelectedTab] = useState("practice");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [todayGoal, setTodayGoal] = useState(30);
  const [selectedLeaderboardView, setSelectedLeaderboardView] = useState("overall");
  const [showMyRank, setShowMyRank] = useState(false);

  // Mock data for demonstration
  const userStats = {
    dailyQuestions: 18,
    dailyAccuracy: 0.85,
    totalQuestions: 2847,
    studyStreak: 15,
    dailyTopicsStudied: 4,
    currentRank: 42,
    totalPoints: 15680,
    motivationalMessage: "You're on fire! Keep up the momentum!"
  };

  // Enhanced leaderboard data
  const leaderboardData = {
    overall: [
      {
        id: 1,
        name: "Arjun Sharma",
        avatar: "AS",
        rank: 1,
        points: 28450,
        accuracy: 94,
        streak: 45,
        questionsToday: 67,
        badge: "Champion",
        badgeColor: "bg-yellow-500",
        isOnline: true,
        level: 15,
        achievements: 28
      },
      {
        id: 2,
        name: "Priya Patel",
        avatar: "PP",
        rank: 2,
        points: 27230,
        accuracy: 91,
        streak: 38,
        questionsToday: 52,
        badge: "Expert",
        badgeColor: "bg-purple-500",
        isOnline: true,
        level: 14,
        achievements: 25
      },
      {
        id: 3,
        name: "Rohan Kumar",
        avatar: "RK",
        rank: 3,
        points: 25890,
        accuracy: 89,
        streak: 34,
        questionsToday: 48,
        badge: "Master",
        badgeColor: "bg-blue-500",
        isOnline: false,
        level: 13,
        achievements: 22
      },
      {
        id: 4,
        name: "Sneha Gupta",
        avatar: "SG",
        rank: 4,
        points: 24560,
        accuracy: 87,
        streak: 29,
        questionsToday: 41,
        badge: "Scholar",
        badgeColor: "bg-green-500",
        isOnline: true,
        level: 12,
        achievements: 20
      },
      {
        id: 5,
        name: "Karan Singh",
        avatar: "KS",
        rank: 5,
        points: 23120,
        accuracy: 85,
        streak: 25,
        questionsToday: 36,
        badge: "Achiever",
        badgeColor: "bg-orange-500",
        isOnline: true,
        level: 11,
        achievements: 18
      },
      // Current user (highlighted)
      {
        id: 42,
        name: "You",
        avatar: "YU",
        rank: 42,
        points: 15680,
        accuracy: 85,
        streak: 15,
        questionsToday: 18,
        badge: "Rising Star",
        badgeColor: "bg-pink-500",
        isOnline: true,
        level: 8,
        achievements: 12,
        isCurrentUser: true
      }
    ],
    weekly: [
      {
        id: 1,
        name: "Priya Patel",
        avatar: "PP",
        rank: 1,
        points: 3420,
        accuracy: 92,
        streak: 7,
        questionsToday: 52,
        badge: "Week Star",
        badgeColor: "bg-cyan-500",
        isOnline: true,
        level: 14,
        achievements: 3
      }
    ],
    monthly: [
      {
        id: 1,
        name: "Arjun Sharma",
        avatar: "AS",
        rank: 1,
        points: 12890,
        accuracy: 94,
        streak: 28,
        questionsToday: 67,
        badge: "Month Hero",
        badgeColor: "bg-red-500",
        isOnline: true,
        level: 15,
        achievements: 8
      }
    ]
  };

  const topics = [
    {
      id: "physics-mechanics",
      subject: "Physics", 
      name: "Mechanics & Motion",
      description: "Newton's laws, motion, forces, energy",
      icon: Target,
      color: "bg-blue-500",
      totalQuestions: 145,
      currentLevel: 3,
      accuracy: 0.87,
      questionsAttempted: 98,
      isUnlocked: true,
      difficulty: "Medium",
      estimatedTime: "25 min",
      popularity: 92,
      lastStudied: "2 hours ago"
    },
    {
      id: "chemistry-organic",
      subject: "Chemistry",
      name: "Organic Chemistry", 
      description: "Hydrocarbons, functional groups, reactions",
      icon: Beaker,
      color: "bg-green-500",
      totalQuestions: 132,
      currentLevel: 2,
      accuracy: 0.72,
      questionsAttempted: 67,
      isUnlocked: true,
      difficulty: "Hard",
      estimatedTime: "35 min",
      popularity: 85,
      lastStudied: "1 day ago"
    },
    {
      id: "math-calculus",
      subject: "Mathematics",
      name: "Differential Calculus",
      description: "Limits, derivatives, applications", 
      icon: Calculator,
      color: "bg-purple-500",
      totalQuestions: 187,
      currentLevel: 4,
      accuracy: 0.91,
      questionsAttempted: 156,
      isUnlocked: true,
      difficulty: "Hard",
      estimatedTime: "30 min",
      popularity: 89,
      lastStudied: "30 min ago"
    },
    {
      id: "physics-waves",
      subject: "Physics",
      name: "Waves & Oscillations",
      description: "SHM, wave properties, sound, light",
      icon: Activity,
      color: "bg-indigo-500",
      totalQuestions: 98,
      currentLevel: 1,
      accuracy: 0.64,
      questionsAttempted: 23,
      isUnlocked: true,
      difficulty: "Medium",
      estimatedTime: "20 min",
      popularity: 76,
      lastStudied: "3 days ago"
    },
    {
      id: "chemistry-inorganic",
      subject: "Chemistry",
      name: "Inorganic Chemistry",
      description: "Periodic table, coordination, metallurgy",
      icon: Shield,
      color: "bg-teal-500",
      totalQuestions: 156,
      currentLevel: 2,
      accuracy: 0.78,
      questionsAttempted: 89,
      isUnlocked: true,
      difficulty: "Medium",
      estimatedTime: "28 min",
      popularity: 81,
      lastStudied: "5 hours ago"
    },
    {
      id: "math-algebra",
      subject: "Mathematics",
      name: "Complex Numbers",
      description: "Complex plane, operations, applications",
      icon: Layers,
      color: "bg-orange-500",
      totalQuestions: 78,
      currentLevel: 1,
      accuracy: 0.58,
      questionsAttempted: 34,
      isUnlocked: false,
      difficulty: "Hard",
      estimatedTime: "40 min",
      popularity: 69,
      lastStudied: "Never"
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Hard": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 0.8) return "text-green-600";
    if (accuracy >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const renderLeaderboardItem = (user, index) => (
    <Card 
      key={user.id} 
      className={`mb-3 transition-all duration-300 hover:shadow-lg border-l-4 ${
        user.isCurrentUser 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500 shadow-md" 
          : "hover:bg-gray-50 border-l-gray-200"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Rank Badge */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" :
              user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white" :
              user.rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white" :
              user.isCurrentUser ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" :
              "bg-gray-100 text-gray-700"
            }`}>
              {user.rank <= 3 ? (
                user.rank === 1 ? <Crown className="w-6 h-6" /> :
                user.rank === 2 ? <Medal className="w-6 h-6" /> :
                <Award className="w-6 h-6" />
              ) : (
                `#${user.rank}`
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={`font-bold ${user.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                    {user.name}
                    {user.isCurrentUser && " (You)"}
                  </h3>
                  {user.rank <= 5 && (
                    <Badge className={`${user.badgeColor} text-white text-xs`}>
                      {user.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    {user.points.toLocaleString()} pts
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {user.accuracy}% acc
                  </span>
                  <span className="flex items-center">
                    <Flame className="w-3 h-3 mr-1" />
                    {user.streak}d streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right space-y-1">
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900">Lv.{user.level}</div>
                <div className="text-xs text-gray-500">Level</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{user.questionsToday}</div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{user.achievements}</div>
                <div className="text-xs text-gray-500">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="container mx-auto max-w-7xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Study Arena ⚡
            </h1>
            <p className="text-xl text-gray-600">
              Level up your skills with adaptive learning & competitive challenges
            </p>
            <p className="text-sm text-blue-600 mt-2 font-medium">
              💡 {userStats.motivationalMessage}
            </p>
          </div>
          
          {/* Today's Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Today's Mission</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                {userStats.dailyQuestions}/{todayGoal}
              </div>
              <Progress 
                value={(userStats.dailyQuestions / todayGoal) * 100} 
                className="h-3 mb-3"
              />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{Math.round(userStats.dailyAccuracy * 100)}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500">{userStats.studyStreak}</div>
                  <div className="text-xs text-gray-500">Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">#{userStats.currentRank}</div>
                  <div className="text-xs text-gray-500">Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((userStats.dailyQuestions / todayGoal) * 100)}%
              </div>
              <div className="text-sm opacity-90">Goal Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-400 to-red-600 text-white">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.studyStreak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Points</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">#{userStats.currentRank}</div>
              <div className="text-sm opacity-90">Global Rank</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.dailyTopicsStudied}</div>
              <div className="text-sm opacity-90">Topics Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="practice" className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>Practice Hub</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search topics, concepts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedSubject === "" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject("")}
                    >
                      All Subjects
                    </Button>
                    <Button
                      variant={selectedSubject === "Physics" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject("Physics")}
                    >
                      Physics
                    </Button>
                    <Button
                      variant={selectedSubject === "Chemistry" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject("Chemistry")}
                    >
                      Chemistry  
                    </Button>
                    <Button
                      variant={selectedSubject === "Mathematics" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject("Mathematics")}
                    >
                      Mathematics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => {
                const IconComponent = topic.icon;
                return (
                  <Card key={topic.id} className={`hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${!topic.isUnlocked ? 'opacity-60' : ''}`}>
                    {!topic.isUnlocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 ${topic.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <CardHeader className="pb-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-xl ${topic.color} bg-opacity-10`}>
                          <IconComponent className={`w-7 h-7 ${topic.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getDifficultyColor(topic.difficulty)} text-xs px-2 py-1`}>
                            {topic.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Lv.{topic.currentLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors mb-2">
                        {topic.name}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 relative">
                      {/* Progress Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-lg p-3">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {topic.questionsAttempted}
                          </div>
                          <div className="text-xs text-gray-600">Attempted</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${getAccuracyColor(topic.accuracy)}`}>
                            {Math.round(topic.accuracy * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">Accuracy</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {topic.estimatedTime}
                          </div>
                          <div className="text-xs text-gray-600">Est. Time</div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {topic.popularity}% popularity
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {topic.lastStudied}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <Button
                          className="w-full"
                          size="lg"
                          disabled={!topic.isUnlocked}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {topic.isUnlocked ? "Start Practice Session" : "Unlock Required"}
                        </Button>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>📚 {topic.totalQuestions} questions</span>
                          <span>⚡ Smart difficulty</span>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      {topic.questionsAttempted > 0 && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Topic Mastery</span>
                            <span className="text-xs text-gray-500">
                              {Math.round((topic.questionsAttempted / topic.totalQuestions) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(topic.questionsAttempted / topic.totalQuestions) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Leaderboard */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Trophy className="w-6 h-6 mr-2" />
                        Global Leaderboard
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant={selectedLeaderboardView === "overall" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedLeaderboardView("overall")}
                          className="text-white"
                        >
                          Overall
                        </Button>
                        <Button
                          variant={selectedLeaderboardView === "weekly" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedLeaderboardView("weekly")}
                          className="text-white"
                        >
                          Weekly
                        </Button>
                        <Button
                          variant={selectedLeaderboardView === "monthly" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedLeaderboardView("monthly")}
                          className="text-white"
                        >
                          Monthly
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                </Card>

                <div className="space-y-3">
                  {leaderboardData[selectedLeaderboardView].slice(0, 10).map((user, index) => 
                    renderLeaderboardItem(user, index)
                  )}
                  
                  {/* Show current user if not in top 10 */}
                  {!leaderboardData[selectedLeaderboardView].slice(0, 10).some(u => u.isCurrentUser) && (
                    <>
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <div className="h-px bg-gray-300 w-8"></div>
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Your Position</span>
                          <div className="h-px bg-gray-300 w-8"></div>
                        </div>
                      </div>
                      {leaderboardData[selectedLeaderboardView].find(u => u.isCurrentUser) && 
                        renderLeaderboardItem(leaderboardData[selectedLeaderboardView].find(u => u.isCurrentUser), -1)
                      }
                    </>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4">
                
                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                      Hall of Fame
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {leaderboardData.overall.slice(0, 3).map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-600"
                        }`}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.points.toLocaleString()} pts</div>
                        </div>
                        <Badge className={`${user.badgeColor} text-white text-xs`}>
                          {user.badge}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="w-5 h-5 mr-2 text-green-500" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span><strong>Arjun</strong> solved 5 Physics questions</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span><strong>Priya</strong> reached Level 14!</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span><strong>Rohan</strong> started a 30-day streak</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span><strong>Sneha</strong> aced Chemistry test (95%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Challenges */}
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Rocket className="w-5 h-5 mr-2" />
                      Weekly Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">Physics Marathon</div>
                        <div className="text-sm opacity-90">Solve 100 Physics questions</div>
                      </div>
                      <Progress value={67} className="bg-white/20" />
                      <div className="flex justify-between text-sm">
                        <span>67/100 questions</span>
                        <span>3 days left</span>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-white text-purple-600">🏆 1500 points reward</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Showcase */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Award className="w-5 h-5 mr-2 text-purple-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        🔥
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Speed Demon</div>
                        <div className="text-xs text-gray-500">Solved 10 questions in 5 minutes</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        🎯
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Perfect Shot</div>
                        <div className="text-xs text-gray-500">100% accuracy in Chemistry</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        📚
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Scholar</div>
                        <div className="text-xs text-gray-500">15-day study streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Performance chart would be rendered here</p>
                      <p className="text-sm">(Interactive chart showing daily progress)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    Subject Mastery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Physics</span>
                        <span className="text-sm text-gray-600">87%</span>
                      </div>
                      <Progress value={87} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Chemistry</span>
                        <span className="text-sm text-gray-600">74%</span>
                      </div>
                      <Progress value={74} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Mathematics</span>
                        <span className="text-sm text-gray-600">91%</span>
                      </div>
                      <Progress value={91} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Study Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2h 45m</div>
                      <div className="text-sm text-blue-700">Today</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">18h 30m</div>
                      <div className="text-sm text-green-700">This Week</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Peak Hours</span>
                      <span className="text-sm font-semibold">8-10 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Session</span>
                      <span className="text-sm font-semibold">32 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Most Active Day</span>
                      <span className="text-sm font-semibold">Sunday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weakness Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <div className="font-semibold text-red-800">Organic Chemistry</div>
                      <div className="text-sm text-red-600">58% accuracy - Needs improvement</div>
                    </div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <div className="font-semibold text-yellow-800">Wave Optics</div>
                      <div className="text-sm text-yellow-600">64% accuracy - Practice more</div>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <div className="font-semibold text-green-800">Calculus</div>
                      <div className="text-sm text-green-600">91% accuracy - Well done!</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Detailed Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{userStats.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round(userStats.dailyAccuracy * userStats.totalQuestions)}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">247</div>
                    <div className="text-sm text-gray-600">Hours Studied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">89</div>
                    <div className="text-sm text-gray-600">Topics Covered</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Study Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Smart Study Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-400">
                <div className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Cpu className="w-4 h-4 mr-2" />
                  Adaptive Learning
                </div>
                <p className="text-blue-700 text-sm">
                  Our AI adjusts difficulty based on your performance. Master basics before advancing to complex problems!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                <div className="font-semibold text-green-800 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Focus Mode
                </div>
                <p className="text-green-700 text-sm">
                  Concentrate on weak areas identified by our analytics. 20 minutes of focused practice beats hours of random studying.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-400">
                <div className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Competition
                </div>
                <p className="text-purple-700 text-sm">
                  Compete with peers to stay motivated. Join weekly challenges and climb the leaderboard for extra rewards!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedStudyNowPage;
