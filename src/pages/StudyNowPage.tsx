import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Brain, Target, BookOpen, Clock, Trophy, 
  PlayCircle, Search, TrendingUp, Zap, Flame,
  Beaker, Calculator, Activity, ChevronRight,
  Star, Award, Crown, Lock, Unlock, Sparkles,
  BarChart3, Users, Medal, CheckCircle2
} from "lucide-react";

const StudyNowPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [userProgress, setUserProgress] = useState({
    dailyGoal: 25,
    dailyCompleted: 0,
    totalQuestions: 0,
    accuracy: 0,
    streak: 0,
    rank: 0,
    totalPoints: 0
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadSubjects(),
      loadChapters(),
      loadUserProgress()
    ]);
    setLoading(false);
  };

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject')
        .order('subject');

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectIcons = {
        'Physics': { icon: Target, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
        'Chemistry': { icon: Beaker, color: 'green', gradient: 'from-green-500 to-emerald-500' },
        'Mathematics': { icon: Calculator, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
        'Biology': { icon: Activity, color: 'red', gradient: 'from-red-500 to-rose-500' }
      };

      const subjectsWithData = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject);

          return {
            id: subject.toLowerCase(),
            name: subject,
            ...subjectIcons[subject] || { icon: BookOpen, color: 'gray', gradient: 'from-gray-500 to-gray-600' },
            totalQuestions: count || 0
          };
        })
      );

      setSubjects(subjectsWithData);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject, chapter, topic, difficulty');

      if (error) throw error;

      interface ChapterData {
        subject: string;
        chapter: string;
        topics: Set<string>;
        questionCount: number;
      }

      const chapterMap: Record<string, ChapterData> = {};
      data?.forEach(q => {
        const key = `${q.subject}-${q.chapter}`;
        if (!chapterMap[key]) {
          chapterMap[key] = {
            subject: q.subject,
            chapter: q.chapter,
            topics: new Set(),
            questionCount: 0
          };
        }
        chapterMap[key].topics.add(q.topic);
        chapterMap[key].questionCount++;
      });

      const chaptersArray = await Promise.all(
        Object.entries(chapterMap).map(async ([key, value], index) => {
          let userStats = { progress: 0, accuracy: 0 };
          
          if (user) {
            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id, is_correct')
              .eq('user_id', user.id);

            const { data: chapterQuestions } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', value.subject)
              .eq('chapter', value.chapter);

            const chapterQuestionIds = chapterQuestions?.map(q => q.id) || [];
            const chapterAttempts = attempts?.filter(a => 
              chapterQuestionIds.includes(a.question_id)
            ) || [];

            if (chapterAttempts.length > 0) {
              const correct = chapterAttempts.filter(a => a.is_correct).length;
              userStats.accuracy = Math.round((correct / chapterAttempts.length) * 100);
              userStats.progress = Math.round((chapterAttempts.length / value.questionCount) * 100);
            }
          }

          return {
            id: index + 1,
            name: value.chapter,
            subject: value.subject,
            subjectId: value.subject.toLowerCase(),
            topics: Array.from(value.topics),
            questionsCount: value.questionCount,
            progress: userStats.progress,
            accuracy: userStats.accuracy,
            isUnlocked: true,
            isCompleted: userStats.progress >= 100,
            masteryScore: userStats.progress
          };
        })
      );

      setChapters(chaptersArray);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_goal')
        .eq('id', user.id)
        .single();

      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('question_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('attempted_at', today);

      if (stats) {
        const accuracy = stats.total_questions_answered > 0
          ? Math.round((stats.correct_answers / stats.total_questions_answered) * 100)
          : 0;

        setUserProgress({
          dailyGoal: profile?.daily_goal || 25,
          dailyCompleted: todayCount || 0,
          totalQuestions: stats.total_questions_answered || 0,
          accuracy,
          streak: stats.daily_streak || 0,
          rank: stats.rank_position || 0,
          totalPoints: stats.total_points || 0
        });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const allChapters = chapters.map(chapter => {
    const subject = subjects.find(s => s.id === chapter.subjectId);
    return {
      ...chapter,
      subjectGradient: subject?.gradient || 'from-gray-500 to-gray-600'
    };
  });

  const filteredChapters = allChapters.filter(chapter => {
    const matchesSearch = chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chapter.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || chapter.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getMasteryBadge = (score) => {
    if (score >= 90) return { text: "Master", color: "bg-yellow-500 text-white", icon: Crown };
    if (score >= 75) return { text: "Expert", color: "bg-purple-500 text-white", icon: Award };
    if (score >= 60) return { text: "Advanced", color: "bg-blue-500 text-white", icon: Star };
    if (score >= 40) return { text: "Intermediate", color: "bg-green-500 text-white", icon: Target };
    if (score >= 20) return { text: "Basic", color: "bg-gray-500 text-white", icon: BookOpen };
    return { text: "Beginner", color: "bg-gray-400 text-white", icon: PlayCircle };
  };

  const startPractice = (chapterId) => {
    const chapter = allChapters.find(c => c.id === chapterId);
    if (!chapter) return;

    navigate('/practice', {
      state: {
        subject: chapter.subject,
        chapter: chapter.name,
        topics: chapter.topics
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your learning data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto max-w-7xl p-6">
          
          {/* Dynamic Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-3xl -z-10"></div>
            <div className="py-8">
              <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3">
                <Brain className="w-10 h-10 text-primary animate-pulse" />
                Adaptive Learning Hub
                <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce" />
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Master <span className="font-bold text-primary">100,000+</span> questions with AI-powered progression
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Rank #{userProgress.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">{userProgress.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">{userProgress.totalPoints.toLocaleString()} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-green-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-primary mr-2" />
                  <div className="text-2xl font-bold text-primary">
                    {userProgress.dailyCompleted}/{userProgress.dailyGoal}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Today's Mission</p>
                <Progress 
                  value={(userProgress.dailyCompleted / userProgress.dailyGoal) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userProgress.dailyGoal - userProgress.dailyCompleted} questions to go!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {userProgress.totalQuestions.toLocaleString()}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Questions Solved</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +127 this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {userProgress.accuracy}%
                  </div>
                </div>
                <p className="text-sm text-gray-600">Overall Accuracy</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  ↗️ +3% this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-orange-600 mr-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {userProgress.streak}
                  </div>
                </div>
                <p className="text-sm text-gray-600">Day Streak</p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  🔥 On fire!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search chapters or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant={selectedSubject === "all" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedSubject("all")}
                    className="font-medium"
                  >
                    All Subjects
                  </Button>
                  {subjects.map(subject => {
                    const Icon = subject.icon;
                    return (
                      <Button
                        key={subject.id}
                        variant={selectedSubject === subject.id ? "default" : "outline"}
                        size="lg"
                        onClick={() => setSelectedSubject(subject.id)}
                        className="font-medium"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {subject.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chapters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredChapters.map((chapter) => {
              const masteryBadge = getMasteryBadge(chapter.masteryScore);
              const BadgeIcon = masteryBadge.icon;
              
              return (
                <Card 
                  key={chapter.id} 
                  className={`group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden ${
                    !chapter.isUnlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                  } ${chapter.isCompleted ? 'ring-2 ring-green-200' : ''}`}
                >
                  {/* Header with gradient background */}
                  <div className={`bg-gradient-to-r ${chapter.subjectGradient} p-6 text-white relative overflow-hidden`}>
                    {!chapter.isUnlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                    {chapter.isCompleted && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-1">{chapter.subject}</p>
                        <h3 className="text-xl font-bold leading-tight">{chapter.name}</h3>
                      </div>
                    </div>

                    {/* Level Progress */}
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Level {chapter.currentLevel}/{chapter.maxLevel}
                      </span>
                      <div className="flex-1 bg-white/20 rounded-full h-2 ml-2">
                        <div 
                          className="bg-white rounded-full h-2 transition-all duration-300"
                          style={{ width: `${(chapter.currentLevel / chapter.maxLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Mastery Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${masteryBadge.color}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {masteryBadge.text}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Topics */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Topics Covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {chapter.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {chapter.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{chapter.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {chapter.questionsCount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Questions</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-lg font-bold ${chapter.accuracy >= 80 ? 'text-green-600' : chapter.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {chapter.accuracy || 0}%
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {chapter.progress > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
                          <span className="text-sm font-bold text-primary">{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} className="h-3" />
                      </div>
                    )}

                    {/* Last Practiced */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Time spent: {chapter.timeSpent}</span>
                      <span>Last: {chapter.lastPracticed}</span>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                        !chapter.isUnlocked 
                          ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                          : chapter.progress > 0
                          ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl'
                      }`}
                      onClick={() => startPractice(chapter.id)}
                      disabled={!chapter.isUnlocked}
                    >
                      {!chapter.isUnlocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      ) : chapter.progress > 0 ? (
                        <>
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Continue Journey
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Begin Adventure
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>

                    {/* Unlock Requirement */}
                    {!chapter.isUnlocked && chapter.nextUnlock && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        🔓 {chapter.nextUnlock}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No chapters found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Adaptive Learning Info */}
          <Card className="mt-16 border-0 shadow-xl bg-gradient-to-r from-primary/5 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
                  <Brain className="w-8 h-8 text-primary" />
                  How Adaptive Learning Works
                </h2>
                <p className="text-lg text-gray-600">
                  Our AI analyzes your performance and adapts the difficulty in real-time
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Smart Assessment</h3>
                  <p className="text-gray-600">
                    Start with diagnostic questions to identify your current level and knowledge gaps
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Progressive Difficulty</h3>
                  <p className="text-gray-600">
                    Questions adapt based on your accuracy. Master basics before advancing to complex problems
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Mastery Tracking</h3>
                  <p className="text-gray-600">
                    Earn mastery badges and unlock new chapters as you demonstrate consistent understanding
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
