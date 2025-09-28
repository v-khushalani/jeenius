import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';

import {
  Brain, Target, BookOpen, Clock, Trophy, 
  PlayCircle, Search, TrendingUp, Zap,
  Beaker, Calculator, Activity, ChevronRight,
  Users, Medal, Crown
} from "lucide-react";

const StudyNowPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgress, setUserProgress] = useState({
    dailyGoal: 30,
    dailyCompleted: 0,
    totalQuestions: 0,
    accuracy: 0,
    streak: 1,
    rank: 999
  });

  // Load user progress from localStorage/API
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // This would normally come from your API/Supabase
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserProgress(prev => ({
        ...prev,
        ...progress
      }));
    }
  };

  // Get subjects based on user's target exam
  const getSubjects = () => {
    const savedGoals = localStorage.getItem('userGoals');
    let targetExam = 'JEE';
    
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      targetExam = goals.goal || 'JEE';
    }

    const subjects = {
      'JEE': [
        { id: 'physics', name: 'Physics', icon: Target, color: 'blue', chapters: 12 },
        { id: 'chemistry', name: 'Chemistry', icon: Beaker, color: 'green', chapters: 14 },
        { id: 'mathematics', name: 'Mathematics', icon: Calculator, color: 'purple', chapters: 16 }
      ],
      'NEET': [
        { id: 'physics', name: 'Physics', icon: Target, color: 'blue', chapters: 10 },
        { id: 'chemistry', name: 'Chemistry', icon: Beaker, color: 'green', chapters: 12 },
        { id: 'biology', name: 'Biology', icon: Activity, color: 'red', chapters: 18 }
      ],
      'Foundation': [
        { id: 'mathematics', name: 'Mathematics', icon: Calculator, color: 'purple', chapters: 8 },
        { id: 'science', name: 'Science', icon: Beaker, color: 'blue', chapters: 10 },
        { id: 'english', name: 'English', icon: BookOpen, color: 'green', chapters: 6 }
      ]
    };

    return subjects[targetExam] || subjects['JEE'];
  };

  // Sample chapters data (would come from API)
  const getChapters = (subjectId) => {
    const chaptersData = {
      physics: [
        { id: 1, name: "Mechanics", questionsCount: 150, difficulty: "Medium", progress: 65, isUnlocked: true },
        { id: 2, name: "Thermodynamics", questionsCount: 120, difficulty: "Hard", progress: 30, isUnlocked: true },
        { id: 3, name: "Waves & Optics", questionsCount: 140, difficulty: "Medium", progress: 0, isUnlocked: false }
      ],
      chemistry: [
        { id: 4, name: "Organic Chemistry", questionsCount: 180, difficulty: "Hard", progress: 45, isUnlocked: true },
        { id: 5, name: "Inorganic Chemistry", questionsCount: 160, difficulty: "Medium", progress: 70, isUnlocked: true },
        { id: 6, name: "Physical Chemistry", questionsCount: 140, difficulty: "Hard", progress: 20, isUnlocked: true }
      ],
      mathematics: [
        { id: 7, name: "Calculus", questionsCount: 200, difficulty: "Hard", progress: 55, isUnlocked: true },
        { id: 8, name: "Algebra", questionsCount: 175, difficulty: "Medium", progress: 80, isUnlocked: true },
        { id: 9, name: "Coordinate Geometry", questionsCount: 165, difficulty: "Medium", progress: 25, isUnlocked: true }
      ],
      biology: [
        { id: 10, name: "Human Physiology", questionsCount: 190, difficulty: "Medium", progress: 40, isUnlocked: true },
        { id: 11, name: "Plant Biology", questionsCount: 150, difficulty: "Easy", progress: 75, isUnlocked: true },
        { id: 12, name: "Genetics", questionsCount: 130, difficulty: "Hard", progress: 15, isUnlocked: true }
      ]
    };
    return chaptersData[subjectId] || [];
  };

  const subjects = getSubjects();
  const allChapters = subjects.flatMap(subject => 
    getChapters(subject.id).map(chapter => ({ ...chapter, subject: subject.name, subjectId: subject.id }))
  );

  const filteredChapters = allChapters.filter(chapter => {
    const matchesSearch = chapter.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || chapter.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const startPractice = (chapterId) => {
    // Navigate to practice session or show modal
    alert(`Starting practice for chapter ${chapterId}`);
    // This would typically navigate to /practice/${chapterId}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto max-w-6xl p-6">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Practice & Learn 📚
            </h1>
            <p className="text-gray-600">
              Choose a chapter and start practicing questions
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-1">
                  {userProgress.dailyCompleted}/{userProgress.dailyGoal}
                </div>
                <p className="text-sm text-gray-600">Today's Goal</p>
                <Progress 
                  value={(userProgress.dailyCompleted / userProgress.dailyGoal) * 100} 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {userProgress.totalQuestions}
                </div>
                <p className="text-sm text-gray-600">Total Solved</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {userProgress.accuracy}%
                </div>
                <p className="text-sm text-gray-600">Accuracy</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {userProgress.streak}
                </div>
                <p className="text-sm text-gray-600">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedSubject === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject("all")}
                  >
                    All Subjects
                  </Button>
                  {subjects.map(subject => (
                    <Button
                      key={subject.id}
                      variant={selectedSubject === subject.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <Card 
                key={chapter.id} 
                className={`hover:shadow-lg transition-all duration-300 ${
                  !chapter.isUnlocked ? 'opacity-60' : 'cursor-pointer hover:scale-105'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">
                      {chapter.subject}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(chapter.difficulty)}`}>
                      {chapter.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {chapter.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  {chapter.progress > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{chapter.progress}%</span>
                      </div>
                      <Progress value={chapter.progress} className="h-2" />
                    </div>
                  )}

                  {/* Questions Count */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Questions Available:</span>
                    <span className="font-medium">{chapter.questionsCount}</span>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => startPractice(chapter.id)}
                    disabled={!chapter.isUnlocked}
                  >
                    {chapter.progress > 0 ? (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Practice
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Practice
                      </>
                    )}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Quick Tips */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <Brain className="w-5 h-5 mr-2" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">Start with Basics</h3>
                  <p className="text-sm text-gray-600">
                    Master fundamental concepts before moving to advanced topics
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">Practice Daily</h3>
                  <p className="text-sm text-gray-600">
                    Consistency is key - even 30 minutes daily makes a difference
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">Track Progress</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your improvement and identify areas for focus
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
