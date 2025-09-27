import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';

import {
  Brain, Target, BookOpen, Clock, CheckCircle, TrendingUp, Users, Zap,
  PlayCircle, Star, Search, ArrowRight, Flame, Trophy, AlertCircle,
  Beaker, Calculator, Award, Lightbulb, BarChart3, Lock,
  Cpu, Layers, Activity, Crown, Medal, Rocket
} from "lucide-react";

const StudyNowPage = () => {
  const [selectedTab, setSelectedTab] = useState("practice");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [todayGoal] = useState(30);

  // Simple user stats - matching your original theme
  const userStats = {
    dailyQuestions: 18,
    dailyAccuracy: 0.85,
    totalQuestions: 2847,
    studyStreak: 15,
    currentRank: 42,
    totalPoints: 15680,
    motivationalMessage: "You're doing great! Keep up the momentum!"
  };

  // Clean leaderboard data
  const leaderboardData = [
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
      isOnline: true
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
      isOnline: true
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
      isOnline: false
    },
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
      isCurrentUser: true
    }
  ];

  // Simplified topics - matching your original structure
  const topics = [
    {
      id: "physics-mechanics",
      subject: "Physics", 
      name: "Mechanics & Motion",
      description: "Newton's laws, motion, forces",
      icon: Target,
      color: "bg-blue-500",
      totalQuestions: 145,
      currentLevel: 3,
      accuracy: 0.87,
      questionsAttempted: 98,
      isUnlocked: true
    },
    {
      id: "chemistry-organic",
      subject: "Chemistry",
      name: "Organic Chemistry", 
      description: "Hydrocarbons, functional groups",
      icon: Beaker,
      color: "bg-green-500",
      totalQuestions: 132,
      currentLevel: 2,
      accuracy: 0.72,
      questionsAttempted: 67,
      isUnlocked: true
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
      isUnlocked: true
    },
    {
      id: "physics-waves",
      subject: "Physics",
      name: "Waves & Oscillations",
      description: "SHM, wave properties, sound",
      icon: Activity,
      color: "bg-indigo-500",
      totalQuestions: 98,
      currentLevel: 1,
      accuracy: 0.64,
      questionsAttempted: 23,
      isUnlocked: true
    },
    {
      id: "chemistry-inorganic",
      subject: "Chemistry",
      name: "Inorganic Chemistry",
      description: "Periodic table, coordination",
      icon: Layers,
      color: "bg-teal-500",
      totalQuestions: 156,
      currentLevel: 2,
      accuracy: 0.78,
      questionsAttempted: 89,
      isUnlocked: true
    },
    {
      id: "math-algebra",
      subject: "Mathematics",
      name: "Complex Numbers",
      description: "Complex plane, operations",
      icon: Brain,
      color: "bg-orange-500",
      totalQuestions: 78,
      currentLevel: 1,
      accuracy: 0.58,
      questionsAttempted: 34,
      isUnlocked: false
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 0.8) return "text-green-600";
    if (accuracy >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const renderLeaderboardItem = (user, index) => (
    <Card 
      key={user.id} 
      className={`mb-3 transition-all duration-300 hover:shadow-lg ${
        user.isCurrentUser 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500" 
          : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Rank */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              user.rank === 1 ? "bg-yellow-500 text-white" :
              user.rank === 2 ? "bg-gray-400 text-white" :
              user.rank === 3 ? "bg-amber-600 text-white" :
              user.isCurrentUser ? "bg-primary text-white" :
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
                  <AvatarFallback className="bg-primary text-white font-bold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div>
                <h3 className={`font-bold ${user.isCurrentUser ? "text-primary" : "text-gray-900"}`}>
                  {user.name}
                  {user.isCurrentUser && " (You)"}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Trophy className="w-3 h-3 mr-1" />
                    {user.points.toLocaleString()} pts
                  </span>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {user.accuracy}%
                  </span>
                  <span className="flex items-center">
                    <Flame className="w-3 h-3 mr-1" />
                    {user.streak}d
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Questions */}
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{user.questionsToday}</div>
            <div className="text-xs text-gray-500">questions today</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto max-w-7xl p-4">
          
          {/* Clean Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{color: '#013062'}}>
              Practice & Progress 🚀
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Level up your skills with adaptive learning
            </p>
            <p className="text-sm text-blue-600 font-medium">
              💡 {userStats.motivationalMessage}
            </p>
          </div>

          {/* Today's Progress - Matching your original design */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-md shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">Today's Mission</div>
                <div className="text-4xl font-bold mb-2" style={{color: '#013062'}}>
                  {userStats.dailyQuestions}/{todayGoal}
                </div>
                <Progress 
                  value={(userStats.dailyQuestions / todayGoal) * 100} 
                  className="h-3 mb-4"
                />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(userStats.dailyAccuracy * 100)}%
                    </div>
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
              </CardContent>
            </Card>
          </div>

          {/* Simple Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="analytics">Progress</TabsTrigger>
            </TabsList>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-6">
              
              {/* Simple Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          placeholder="Search topics..."
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
                        All
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
                        Maths
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clean Topic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <Card key={topic.id} className={`hover:shadow-lg transition-all duration-300 group ${!topic.isUnlocked ? 'opacity-60' : ''}`}>
                      
                      {!topic.isUnlocked && (
                        <div className="absolute top-4 right-4 z-10">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-3 rounded-lg ${topic.color} bg-opacity-10`}>
                            <IconComponent className={`w-6 h-6 ${topic.color.replace('bg-', 'text-')}`} />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Level {topic.currentLevel}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {topic.name}
                        </CardTitle>
                        <p className="text-gray-600 text-sm">{topic.description}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        
                        {/* Simple Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">
                              {topic.questionsAttempted}
                            </div>
                            <div className="text-xs text-gray-600">Done</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold ${getAccuracyColor(topic.accuracy)}`}>
                              {Math.round(topic.accuracy * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Accuracy</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className="w-full"
                          size="lg"
                          disabled={!topic.isUnlocked}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {topic.isUnlocked ? "Start Practice" : "Locked"}
                        </Button>
                        
                        {/* Progress Bar */}
                        {topic.questionsAttempted > 0 && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-600">Progress</span>
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

            {/* Clean Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                    Global Leaderboard
                  </CardTitle>
                </CardHeader>
              </Card>

              <div className="max-w-4xl mx-auto space-y-3">
                {leaderboardData.map((user, index) => renderLeaderboardItem(user, index))}
              </div>
            </TabsContent>

            {/* Simple Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Subject Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Subject Progress
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

                {/* Focus Areas */}
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
                        <div className="text-sm text-red-600">Needs more practice</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <div className="font-semibold text-yellow-800">Wave Optics</div>
                        <div className="text-sm text-yellow-600">Keep practicing</div>
                      </div>
                      <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                        <div className="font-semibold text-green-800">Calculus</div>
                        <div className="text-sm text-green-600">Doing great!</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Simple Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">{userStats.totalQuestions}</div>
                      <div className="text-sm text-gray-600">Total Questions</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {Math.round(userStats.dailyAccuracy * userStats.totalQuestions)}
                      </div>
                      <div className="text-sm text-gray-600">Correct Answers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">{userStats.studyStreak}</div>
                      <div className="text-sm text-gray-600">Study Streak</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">{userStats.totalPoints.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Simple Study Tips - Matching your theme */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Study Smart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Cpu className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Adaptive Learning</h3>
                  <p className="text-sm text-gray-600">
                    Questions adjust to your level automatically
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Focus Areas</h3>
                  <p className="text-sm text-gray-600">
                    Practice more where you need it most
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Competition</h3>
                  <p className="text-sm text-gray-600">
                    Compete with peers to stay motivated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyNowPage;
