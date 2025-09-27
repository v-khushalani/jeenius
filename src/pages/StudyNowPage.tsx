import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from '@/components/Header';

import {
  Brain, Target, BookOpen, Clock, Trophy, 
  PlayCircle, Star, Search, Flame, Award,
  Beaker, Calculator, Activity, Layers,
  Users, TrendingUp, Crown, Medal
} from "lucide-react";

const StudyNowPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [todayGoal] = useState(30);

  // Get real user stats from localStorage or default
  const [userStats, setUserStats] = useState({
    dailyQuestions: 0,
    dailyAccuracy: 0,
    totalQuestions: 0,
    studyStreak: 0,
    currentRank: 999,
    totalPoints: 0,
    motivationalMessage: "Start your learning journey today!"
  });

  // Load real data on component mount
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = () => {
    try {
      // Load from localStorage
      const progressData = localStorage.getItem('studyProgress');
      const goalsData = localStorage.getItem('userGoals');
      
      if (progressData) {
        const progress = JSON.parse(progressData);
        setUserStats(prev => ({
          ...prev,
          totalQuestions: progress.totalQuestions || 0,
          dailyQuestions: progress.dailyQuestions || 0,
          dailyAccuracy: progress.accuracy || 0,
          totalPoints: progress.totalPoints || (progress.totalQuestions * 10),
          studyStreak: progress.studyStreak || 1,
          currentRank: Math.max(1000 - (progress.totalQuestions * 2), 1),
          motivationalMessage: progress.totalQuestions > 0 
            ? "You're making great progress! Keep it up! 🔥"
            : "Ready to start your learning journey? Let's go! 🚀"
        }));
      }

      // Load goal info
      if (goalsData) {
        const goals = JSON.parse(goalsData);
        console.log('User goals loaded:', goals);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  // Real topics based on user's goal
  const getTopics = () => {
    const savedGoals = localStorage.getItem('userGoals');
    let targetExam = 'JEE';
    
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      targetExam = goals.goal || 'JEE';
    }

    if (targetExam === 'NEET') {
      return [
        {
          id: "physics-mechanics",
          subject: "Physics", 
          name: "Mechanics & Motion",
          description: "Laws of motion, forces, energy",
          icon: Target,
          color: "bg-blue-500",
          totalQuestions: 145,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 50),
          isUnlocked: true
        },
        {
          id: "chemistry-organic",
          subject: "Chemistry",
          name: "Organic Chemistry", 
          description: "Carbon compounds, reactions",
          icon: Beaker,
          color: "bg-green-500",
          totalQuestions: 132,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 30),
          isUnlocked: true
        },
        {
          id: "biology-human",
          subject: "Biology",
          name: "Human Physiology",
          description: "Body systems, functions",
          icon: Activity,
          color: "bg-red-500",
          totalQuestions: 98,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 25),
          isUnlocked: true
        },
        {
          id: "biology-plant",
          subject: "Biology",
          name: "Plant Biology",
          description: "Photosynthesis, plant structure",
          icon: Layers,
          color: "bg-emerald-500",
          totalQuestions: 76,
          currentLevel: 1,
          accuracy: Math.random() * 0.4 + 0.2,
          questionsAttempted: Math.floor(Math.random() * 20),
          isUnlocked: true
        }
      ];
    } else if (targetExam === 'JEE') {
      return [
        {
          id: "physics-mechanics",
          subject: "Physics", 
          name: "Mechanics & Motion",
          description: "Newton's laws, kinematics",
          icon: Target,
          color: "bg-blue-500",
          totalQuestions: 145,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 50),
          isUnlocked: true
        },
        {
          id: "chemistry-inorganic",
          subject: "Chemistry",
          name: "Inorganic Chemistry",
          description: "Periodic table, chemical bonding",
          icon: Beaker,
          color: "bg-green-500",
          totalQuestions: 132,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 30),
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
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 40),
          isUnlocked: true
        },
        {
          id: "math-algebra",
          subject: "Mathematics",
          name: "Algebra",
          description: "Equations, functions, graphs",
          icon: Brain,
          color: "bg-indigo-500",
          totalQuestions: 156,
          currentLevel: 1,
          accuracy: Math.random() * 0.4 + 0.2,
          questionsAttempted: Math.floor(Math.random() * 35),
          isUnlocked: true
        }
      ];
    } else {
      // Foundation
      return [
        {
          id: "math-basic",
          subject: "Mathematics",
          name: "Basic Mathematics",
          description: "Arithmetic, algebra basics",
          icon: Calculator,
          color: "bg-purple-500",
          totalQuestions: 120,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.4,
          questionsAttempted: Math.floor(Math.random() * 45),
          isUnlocked: true
        },
        {
          id: "science-general",
          subject: "Science",
          name: "General Science",
          description: "Physics, chemistry, biology basics",
          icon: Beaker,
          color: "bg-blue-500",
          totalQuestions: 98,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 30),
          isUnlocked: true
        },
        {
          id: "english-grammar",
          subject: "English",
          name: "English Grammar",
          description: "Grammar, vocabulary, comprehension",
          icon: BookOpen,
          color: "bg-green-500",
          totalQuestions: 85,
          currentLevel: 1,
          accuracy: Math.random() * 0.5 + 0.3,
          questionsAttempted: Math.floor(Math.random() * 25),
          isUnlocked: true
        }
      ];
    }
  };

  const topics = getTopics();

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

  // Simple leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: "Arjun S.",
      avatar: "AS",
      rank: 1,
      points: 28450,
      questionsToday: 67,
      isOnline: true
    },
    {
      id: 2,
      name: "Priya P.",
      avatar: "PP",
      rank: 2,
      points: 27230,
      questionsToday: 52,
      isOnline: true
    },
    {
      id: 3,
      name: "Rohan K.",
      avatar: "RK",
      rank: 3,
      points: 25890,
      questionsToday: 48,
      isOnline: false
    },
    {
      id: 4,
      name: "You",
      avatar: "YU",
      rank: userStats.currentRank,
      points: userStats.totalPoints,
      questionsToday: userStats.dailyQuestions,
      isCurrentUser: true,
      isOnline: true
    }
  ];

  const startPracticeSession = (topicId) => {
    console.log('Starting practice session for:', topicId);
    
    // Update progress in localStorage
    const currentProgress = localStorage.getItem('studyProgress');
    let progress = currentProgress ? JSON.parse(currentProgress) : {
      totalQuestions: 0,
      correctAnswers: 0,
      dailyQuestions: 0,
      totalPoints: 0,
      studyStreak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0]
    };

    // Simulate starting a session
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      alert(`Starting practice session for ${topic.name}!\n\nThis will open the practice interface with adaptive questions.`);
      
      // You can navigate to actual practice page here
      // navigate(`/practice/${topicId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto max-w-7xl p-4">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{color: '#013062'}}>
              Practice & Progress 🚀
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Master your concepts with adaptive learning
            </p>
            <p className="text-sm text-blue-600 font-medium">
              💡 {userStats.motivationalMessage}
            </p>
          </div>

          {/* Today's Progress */}
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

          {/* Search and Filters */}
          <Card className="mb-6">
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
                    All Subjects
                  </Button>
                  {Array.from(new Set(topics.map(t => t.subject))).map(subject => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            
            {/* Topics - 3/4 width */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTopics.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <Card key={topic.id} className="hover:shadow-lg transition-all duration-300 group">
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
                            <div className="text-xs text-gray-600">Solved</div>
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
                          onClick={() => startPracticeSession(topic.id)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Practice
                        </Button>
                        
                        {/* Progress Bar */}
                        {topic.questionsAttempted > 0 && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-600">Topic Progress</span>
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

                        <div className="text-center text-xs text-gray-500">
                          {topic.totalQuestions} total questions available
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Sidebar - 1/4 width */}
            <div className="space-y-6">
              
              {/* Quick Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {leaderboardData.slice(0, 4).map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`flex items-center gap-3 p-3 border-b last:border-b-0 ${
                          user.isCurrentUser ? "bg-blue-50 font-medium" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          user.rank === 1 ? "bg-yellow-500" :
                          user.rank === 2 ? "bg-gray-400" :
                          user.rank === 3 ? "bg-amber-600" :
                          user.isCurrentUser ? "bg-primary" :
                          "bg-gray-400"
                        }`}>
                          {user.rank <= 3 ? (
                            user.rank === 1 ? "🏆" : user.rank === 2 ? "🥈" : "🥉"
                          ) : `#${user.rank}`}
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-white text-xs font-bold">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className={`text-sm ${user.isCurrentUser ? "text-primary font-semibold" : "text-gray-900"}`}>
                              {user.name}
                              {user.isCurrentUser && " (You)"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.points.toLocaleString()} pts
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-bold text-green-600">{user.questionsToday}</div>
                          <div className="text-xs text-gray-500">today</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    Subject Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(topics.map(t => t.subject))).map(subject => {
                      const subjectTopics = topics.filter(t => t.subject === subject);
                      const avgAccuracy = subjectTopics.reduce((sum, t) => sum + t.accuracy, 0) / subjectTopics.length;
                      
                      return (
                        <div key={subject}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{subject}</span>
                            <span className="text-sm text-gray-600">{Math.round(avgAccuracy * 100)}%</span>
                          </div>
                          <Progress value={avgAccuracy * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Star className="w-5 h-5 mr-2 text-purple-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{userStats.totalQuestions}</div>
                      <div className="text-xs text-gray-600">Total Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{userStats.totalPoints.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Points Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{userStats.studyStreak}</div>
                      <div className="text-xs text-gray-600">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Study Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Brain className="w-5 h-5 mr-2" />
                Study Smart Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Focus on Weak Areas</h3>
                  <p className="text-sm text-gray-600">
                    Identify and practice topics with lower accuracy scores
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Daily Consistency</h3>
                  <p className="text-sm text-gray-600">
                    Study a little every day to build knowledge gradually
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Track Progress</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your improvement and celebrate achievements
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
