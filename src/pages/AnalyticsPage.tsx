import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Flame,
  Brain,
  Zap,
  BookOpen,
  ArrowRight,
  Filter
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*, questions(subject, chapter, topic, difficulty)')
        .eq('user_id', user?.id);

      const stats = calculateAnalytics(attempts || []);
      setAnalytics(stats);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (attempts: any[]) => {
    const subjectStats: any = {};
    const topicStats: any = {};

    attempts.forEach(attempt => {
      const { subject, chapter, topic, difficulty } = attempt.questions || {};
      if (!subject) return;

      if (!subjectStats[subject]) {
        subjectStats[subject] = { 
          total: 0, 
          correct: 0, 
          easy: { total: 0, correct: 0 },
          medium: { total: 0, correct: 0 },
          hard: { total: 0, correct: 0 },
          chapters: new Set(),
          topics: new Set()
        };
      }
      subjectStats[subject].total++;
      if (attempt.is_correct) subjectStats[subject].correct++;
      subjectStats[subject].chapters.add(chapter);
      subjectStats[subject].topics.add(topic);

      const diff = difficulty?.toLowerCase() || 'medium';
      if (subjectStats[subject][diff]) {
        subjectStats[subject][diff].total++;
        if (attempt.is_correct) subjectStats[subject][diff].correct++;
      }

      const topicKey = `${subject}-${topic}`;
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = { 
          subject, 
          topic, 
          chapter,
          total: 0, 
          correct: 0,
          lastPracticed: attempt.created_at
        };
      }
      topicStats[topicKey].total++;
      if (attempt.is_correct) topicStats[topicKey].correct++;
      if (new Date(attempt.created_at) > new Date(topicStats[topicKey].lastPracticed)) {
        topicStats[topicKey].lastPracticed = attempt.created_at;
      }
    });

    const totalQuestions = attempts.length;
    const correctAnswers = attempts.filter(a => a.is_correct).length;
    const overallAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    Object.keys(subjectStats).forEach(subject => {
      subjectStats[subject].accuracy = 
        (subjectStats[subject].correct / subjectStats[subject].total) * 100;
      subjectStats[subject].chaptersCount = subjectStats[subject].chapters.size;
      subjectStats[subject].topicsCount = subjectStats[subject].topics.size;
    });

    const topicList = Object.values(topicStats).map((topic: any) => {
      const accuracy = (topic.correct / topic.total) * 100;
      const daysSince = Math.floor(
        (Date.now() - new Date(topic.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      let status = 'not_started';
      if (topic.total === 0) status = 'not_started';
      else if (accuracy >= 85 && topic.total >= 20) status = 'mastered';
      else if (accuracy < 60 && topic.total >= 10) status = 'weak';
      else status = 'in_progress';

      return { ...topic, accuracy, daysSince, status };
    });

    return {
      overview: {
        totalQuestions,
        correctAnswers,
        overallAccuracy,
        totalTime: Math.floor(attempts.length * 2.5),
        topicsAttempted: Object.keys(topicStats).length
      },
      subjects: subjectStats,
      topics: topicList
    };
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      mastered: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Mastered' },
      in_progress: { icon: Circle, color: 'bg-yellow-100 text-yellow-700', label: 'In Progress' },
      weak: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', label: 'Weak' },
      not_started: { icon: Circle, color: 'bg-gray-100 text-gray-700', label: 'Not Started' }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading || !analytics) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-3" />
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 pt-20 pb-4 overflow-hidden">
        <div className="container mx-auto px-4 h-full flex flex-col">
          {/* Page Header */}
          <div className="mb-4 shrink-0">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Performance Analytics
            </h1>
            <p className="text-sm text-slate-600">Track your progress and identify areas for improvement</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-3 w-full max-w-md shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 overflow-auto mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-700 mb-1">Questions Solved</p>
                        <p className="text-3xl font-bold text-blue-900">{analytics.overview.totalQuestions}</p>
                      </div>
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-700 mb-1">Overall Accuracy</p>
                        <p className="text-3xl font-bold text-green-900">
                          {analytics.overview.overallAccuracy.toFixed(0)}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-purple-700 mb-1">Topics Attempted</p>
                        <p className="text-3xl font-bold text-purple-900">{analytics.overview.topicsAttempted}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-orange-700 mb-1">Study Time</p>
                        <p className="text-3xl font-bold text-orange-900">
                          {Math.floor(analytics.overview.totalTime / 60)}h
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analytics.subjects).map(([subject, data]: [string, any]) => (
                  <Card key={subject} className="border-2 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject}</CardTitle>
                        <div className={`text-2xl font-bold ${
                          data.accuracy >= 80 ? 'text-green-600' : 
                          data.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {data.accuracy.toFixed(0)}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Questions Solved</span>
                        <span className="font-semibold">{data.total}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Topics Covered</span>
                        <span className="font-semibold">{data.topicsCount}</span>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-slate-600 mb-2">Difficulty Breakdown:</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Easy
                            </span>
                            <span className="font-semibold">
                              {data.easy.total > 0 ? ((data.easy.correct / data.easy.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              Medium
                            </span>
                            <span className="font-semibold">
                              {data.medium.total > 0 ? ((data.medium.correct / data.medium.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Hard
                            </span>
                            <span className="font-semibold">
                              {data.hard.total > 0 ? ((data.hard.correct / data.hard.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Practice {subject}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="flex-1 overflow-auto mt-4">
              <div className="space-y-4">
                {Object.entries(analytics.subjects).map(([subject, data]: [string, any]) => (
                  <Card key={subject} className="border-2">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl">
                            {subject[0]}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{subject}</CardTitle>
                            <p className="text-sm text-slate-600">
                              {data.topicsCount} topics • {data.chaptersCount} chapters
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-4xl font-bold ${
                            data.accuracy >= 80 ? 'text-green-600' : 
                            data.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {data.accuracy.toFixed(0)}%
                          </div>
                          <p className="text-sm text-slate-600">Overall Accuracy</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900">{data.total}</p>
                          <p className="text-xs text-slate-600">Questions Solved</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-700">{data.correct}</p>
                          <p className="text-xs text-slate-600">Correct Answers</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-700">{data.topicsCount}</p>
                          <p className="text-xs text-slate-600">Topics Covered</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-green-700">Easy</span>
                            <span className="text-lg font-bold text-green-800">
                              {data.easy.total > 0 ? ((data.easy.correct / data.easy.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{data.easy.total} questions</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-yellow-700">Medium</span>
                            <span className="text-lg font-bold text-yellow-800">
                              {data.medium.total > 0 ? ((data.medium.correct / data.medium.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{data.medium.total} questions</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-red-700">Hard</span>
                            <span className="text-lg font-bold text-red-800">
                              {data.hard.total > 0 ? ((data.hard.correct / data.hard.total) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{data.hard.total} questions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Topics Tab */}
            <TabsContent value="topics" className="flex-1 overflow-auto mt-4">
              <div className="space-y-2">
                {analytics.topics
                  .sort((a: any, b: any) => a.accuracy - b.accuracy)
                  .map((topic: any, idx: number) => (
                    <Card key={idx} className={`border-l-4 ${
                      topic.status === 'mastered' ? 'border-l-green-500 bg-green-50/50' :
                      topic.status === 'weak' ? 'border-l-red-500 bg-red-50/50' :
                      topic.status === 'in_progress' ? 'border-l-yellow-500 bg-yellow-50/50' :
                      'border-l-gray-500 bg-gray-50/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{topic.topic}</h4>
                              {getStatusBadge(topic.status)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {topic.subject} • {topic.chapter}
                              </span>
                              <span>{topic.total} questions</span>
                              <span>Last: {topic.daysSince}d ago</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                topic.accuracy >= 80 ? 'text-green-600' : 
                                topic.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {topic.accuracy.toFixed(0)}%
                              </div>
                              <p className="text-xs text-slate-600">Accuracy</p>
                            </div>
                            <Button 
                              size="sm" 
                              className={`${
                                topic.status === 'weak' ? 'bg-red-600 hover:bg-red-700' : 
                                'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {topic.status === 'weak' ? 'Focus' : 'Practice'}
                            </Button>
                          </div>
                        </div>
                        <Progress value={topic.accuracy} className="h-1.5 mt-2" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
