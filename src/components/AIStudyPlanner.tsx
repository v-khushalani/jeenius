import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  Calendar,
  BookOpen
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

interface Topic {
  name: string;
  duration: number;
  difficulty: string;
  reason: string;
  focusArea: string;
  aiRecommendation?: string;
  completed?: boolean;
  questionsRequired: number; 
  questionsCompleted: number; 
  subject: string; 
  chapter?: string; 
  topicName: string;
}

interface Subject {
  name: string;
  allocatedTime: number;
  priority: string;
  topics: Topic[];
  aiInsight?: string;
}

interface StudyPlan {
  id: string;
  subjects: Subject[];
  performance: {
    overallAccuracy: number;
    todayAccuracy: number;
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: Array<{
    type: string;
    message: string;
    priority: string;
    action?: string;
  }>;
  total_study_time: number;
  completion_status: number;
  ai_metrics: {
    learningRate: number;
    retentionScore: number;
    consistencyScore: number;
    adaptiveLevel: string;
  };
  next_refresh_time: string;
  last_updated: string;
}

interface SyllabusStats {
  totalTopics: number;
  pendingTopics: number;
  inProgressTopics: number;
  completedTopics: number;
  completionPercentage: number;
}

const AIStudyPlanner: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set([0]));
  const [syllabusStats, setSyllabusStats] = useState<SyllabusStats | null>(null);
  const [liveStats, setLiveStats] = useState({
    questionsToday: 0,
    accuracyToday: 0,
    streak: 0
  });
  
  const calculateDaysRemaining = () => {
    const targetDate = new Date('2026-05-24');
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchSyllabusStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: priorities } = await supabase
        .from('topic_priorities')
        .select('status')
        .eq('user_id', user.id);

      if (priorities && priorities.length > 0) {
        const total = priorities.length;
        const pending = priorities.filter(p => p.status === 'pending').length;
        const inProgress = priorities.filter(p => p.status === 'in_progress').length;
        const completed = priorities.filter(p => p.status === 'completed').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        setSyllabusStats({
          totalTopics: total,
          pendingTopics: pending,
          inProgressTopics: inProgress,
          completedTopics: completed,
          completionPercentage: percentage
        });
      }
    } catch (error) {
      console.error('Error fetching syllabus stats:', error);
    }
  }, []);

  const updateLiveStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('is_correct, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAttempts = attempts?.filter(a => 
        new Date(a.created_at) >= today
      ) || [];
      
      const todayCorrect = todayAttempts.filter(a => a.is_correct).length;
      const todayTotal = todayAttempts.length;
      const todayAccuracy = todayTotal > 0 ? Math.round((todayCorrect / todayTotal) * 100) : 0;
            
      let streak = 0;
      const DAILY_TARGET = 30;
      const sortedAttempts = [...(attempts || [])].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const questionsOnThisDay = sortedAttempts.filter(a => {
          const attemptDate = new Date(a.created_at);
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === currentDate.getTime();
        }).length;
        
        if (questionsOnThisDay >= DAILY_TARGET) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (i === 0 && questionsOnThisDay > 0) {
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      setLiveStats({
        questionsToday: todayTotal,
        accuracyToday: todayAccuracy,
        streak: streak
      });

    } catch (error) {
      console.error('Error updating live stats:', error);
    }
  }, []);

  const updateTopicProgress = useCallback(async () => {
    try {
      if (!studyPlan || !studyPlan.subjects) return;
  
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*, questions(subject, chapter, topic)')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());
             
      const updatedSubjects = studyPlan.subjects.map(subject => ({
        ...subject,
        topics: (subject.topics || []).map(topic => {
          const topicAttempts = attempts?.filter(a => 
            a.questions?.subject === subject.name &&
            a.questions?.topic === topic.topicName
          ) || [];
  
          const questionsCompleted = topicAttempts.length;
          const isCompleted = questionsCompleted >= topic.questionsRequired;
  
          return {
            ...topic,
            questionsCompleted,
            completed: isCompleted
          };
        })
      }));
      
      const totalTopics = updatedSubjects.reduce((sum, s) => sum + (s.topics?.length || 0), 0);
      const completedTopics = updatedSubjects.reduce(
        (sum, s) => sum + (s.topics?.filter(t => t.completed).length || 0), 
        0
      );
      const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  
      setStudyPlan(prev => prev ? {
        ...prev,
        subjects: updatedSubjects,
        completion_status: completionPercentage
      } : null);
  
    } catch (error) {
      console.error('Error updating topic progress:', error);
    }
  }, [studyPlan]);

  const fetchStudyPlan = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      await supabase.functions.invoke('initialize-student');

      const { data: plans, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false })
        .limit(1);

      if (error) throw error;

      // When fetching from database, parse JSON fields:
const latestPlan = plans?.[0] as any;

if (latestPlan) {
  // Parse JSON strings to objects
  const parsedPlan = {
    ...latestPlan,
    subjects: typeof latestPlan.subjects === 'string' 
      ? JSON.parse(latestPlan.subjects) 
      : latestPlan.subjects || [],
    performance: typeof latestPlan.performance === 'string'
      ? JSON.parse(latestPlan.performance)
      : latestPlan.performance || { overallAccuracy: 0, todayAccuracy: 0, strengths: [], weaknesses: [] },
    recommendations: typeof latestPlan.recommendations === 'string'
      ? JSON.parse(latestPlan.recommendations)
      : latestPlan.recommendations || [],
    ai_metrics: typeof latestPlan.ai_metrics === 'string'
      ? JSON.parse(latestPlan.ai_metrics)
      : latestPlan.ai_metrics || { learningRate: 0.5, retentionScore: 0.5, consistencyScore: 0.5, adaptiveLevel: 'beginner' }
  };
  
  setStudyPlan(parsedPlan as StudyPlan);
}
      
    } catch (error) {
      console.error('Error fetching study plan:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateNewPlan = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan');
      
      if (error) throw error;
      
      if (data?.success) {
        setStudyPlan(data.studyPlan);
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
    }
  }, []);

  useEffect(() => {
    updateLiveStats();
    updateTopicProgress();
    fetchSyllabusStats();
    
    const interval = setInterval(() => {
      updateLiveStats();
      updateTopicProgress();
      fetchSyllabusStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [updateLiveStats, updateTopicProgress, fetchSyllabusStats]);

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await generateNewPlan();
    await updateLiveStats();
    await fetchSyllabusStats();
    setRefreshing(false);
  };

  const toggleSubject = (index: number) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSubjects(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // EARLY RETURN 1: Loading
  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-3" />
            <p className="text-slate-600">AI is crafting your perfect study plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // EARLY RETURN 2: No plan
  if (!studyPlan) {
    return (
      <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
        <CardContent className="p-6">
          <p className="text-slate-600 text-center mb-4">No study plan available</p>
          <Button onClick={fetchStudyPlan} className="w-full">
            Generate Plan
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // EARLY RETURN 3: Empty subjects
  if (!studyPlan.subjects || studyPlan.subjects.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
        <CardContent className="p-6">
          <p className="text-slate-600 text-center">Study plan is empty. Generating new one...</p>
          <Button onClick={handleRefresh} className="w-full mt-4">
            Refresh Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = calculateDaysRemaining();
  const topicsPerDay = syllabusStats 
    ? (syllabusStats.pendingTopics + syllabusStats.inProgressTopics) / Math.max(daysRemaining, 1)
    : 0;

  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
      <CardHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                AI Study Plan
                <Badge className="bg-green-500 text-white animate-pulse text-xs">
                  <Activity className="h-3 w-3 mr-1" />LIVE
                </Badge>
              </h3>
              <p className="text-xs text-slate-500">Auto-updates • Smart recommendations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        
        {/* Exam Timeline Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="font-bold">JEE 2026 Countdown</span>
            </div>
            <Badge className="bg-white/20 text-white backdrop-blur">
              <Calendar className="h-3 w-3 mr-1" />
              {daysRemaining} days left
            </Badge>
          </div>
          
          {syllabusStats && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syllabus Completion</span>
                <span className="font-bold">{syllabusStats.completionPercentage}%</span>
              </div>
              <Progress value={syllabusStats.completionPercentage} className="h-2 bg-white/20" />
              
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="bg-white/10 rounded p-2 backdrop-blur">
                  <div className="font-bold text-lg">{syllabusStats.completedTopics}</div>
                  <div className="opacity-90">✅ Completed</div>
                </div>
                <div className="bg-white/10 rounded p-2 backdrop-blur">
                  <div className="font-bold text-lg">{syllabusStats.inProgressTopics}</div>
                  <div className="opacity-90">📚 In Progress</div>
                </div>
                <div className="bg-white/10 rounded p-2 backdrop-blur">
                  <div className="font-bold text-lg">{syllabusStats.pendingTopics}</div>
                  <div className="opacity-90">⏳ Pending</div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 mt-3 backdrop-blur">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Daily Target:</span>
                  <span className="font-bold">{topicsPerDay.toFixed(1)} topics/day</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Metrics */}
        {studyPlan.ai_metrics && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold text-sm text-indigo-900">AI Performance Metrics</h4>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
                {studyPlan.ai_metrics?.adaptiveLevel?.toUpperCase() || 'BEGINNER'}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className={`text-2xl font-bold ${getMetricColor(studyPlan.ai_metrics.learningRate * 100)}`}>
                  {(studyPlan.ai_metrics.learningRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600 mt-1">Learning Rate</p>
              </div>
              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className={`text-2xl font-bold ${getMetricColor(studyPlan.ai_metrics.retentionScore * 100)}`}>
                  {(studyPlan.ai_metrics.retentionScore * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600 mt-1">Retention</p>
              </div>
              <div className="text-center bg-white/70 rounded-lg p-2">
                <div className={`text-2xl font-bold ${getMetricColor(studyPlan.ai_metrics.consistencyScore * 100)}`}>
                  {(studyPlan.ai_metrics.consistencyScore * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600 mt-1">Consistency</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Overview */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-600" />
            Performance Overview
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-600">Overall Accuracy</p>
              <p className="text-lg font-bold text-slate-900">{studyPlan.performance?.overallAccuracy || 0}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Today's Accuracy</p>
              <p className="text-lg font-bold text-slate-900">{studyPlan.performance?.todayAccuracy || 0}%</p>
            </div>
          </div>
          
          {studyPlan.performance?.strengths && studyPlan.performance.strengths.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-green-700 font-semibold">💪 Strengths:</p>
              <p className="text-xs text-green-600">{studyPlan.performance.strengths.join(', ')}</p>
            </div>
          )}
          
          {studyPlan.performance?.weaknesses && studyPlan.performance.weaknesses.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-red-700 font-semibold">🎯 Focus Areas:</p>
              <p className="text-xs text-red-600">{studyPlan.performance.weaknesses.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Smart Recommendations */}
        {studyPlan.recommendations && Array.isArray(studyPlan.recommendations) && studyPlan.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Smart Recommendations
            </h4>
            {(studyPlan.recommendations || []).slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'bg-red-50 border-red-500'
                    : rec.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  {rec.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{rec.message}</p>
                    {rec.action && (
                      <p className="text-xs text-slate-600 mt-1">💡 {rec.action}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Schedule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Today's Schedule ({studyPlan.total_study_time || 0} mins)
            </h4>
            <div className="flex items-center gap-2">
              <Progress value={studyPlan.completion_status || 0} className="h-2 w-20" />
              <span className="text-xs font-semibold text-slate-600">
                {studyPlan.completion_status || 0}%
              </span>
            </div>
          </div>

          {/* Subjects List */}
          {studyPlan.subjects.map((subject, subjectIdx) => (
            <div
              key={subjectIdx}
              className={`rounded-lg border-2 overflow-hidden transition-all ${
                subject.priority === 'high'
                  ? 'border-red-300 bg-red-50'
                  : subject.priority === 'medium'
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-green-300 bg-green-50'
              }`}
            >
              <button
                onClick={() => toggleSubject(subjectIdx)}
                className="w-full p-3 flex items-center justify-between hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className={`p-1.5 rounded-lg ${getPriorityColor(subject.priority)}`}>
                    {subject.priority === 'high' ? '🔥' : subject.priority === 'medium' ? '📚' : '✅'}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-sm text-slate-900">{subject.name}</h5>
                      <Badge className={`text-xs ${getPriorityColor(subject.priority)}`}>
                        {subject.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {subject.allocatedTime} mins
                      </span>
                      <span className="text-xs text-slate-600">
                        {subject.topics?.length || 0} topics
                      </span>
                      <span className="text-xs text-slate-600">
                        {subject.topics?.filter(t => t.completed).length || 0}/{subject.topics?.length || 0} done
                      </span>
                    </div>
                  </div>
                </div>
                {expandedSubjects.has(subjectIdx) ? (
                  <ChevronUp className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                )}
              </button>

              {expandedSubjects.has(subjectIdx) && (
                <div className="px-3 pb-3 space-y-2">
                  {subject.aiInsight && (
                    <div className="bg-white/70 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs text-slate-700">
                        <Brain className="h-3 w-3 inline mr-1 text-purple-600" />
                        <span className="font-semibold">AI Insight:</span> {subject.aiInsight}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {(subject.topics || []).map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className={`bg-white rounded-lg p-2.5 border transition-all ${
                          topic.completed 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {topic.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h6 className="text-sm font-medium text-slate-900">{topic.topicName || topic.name}</h6>
                                {topic.chapter && (
                                  <p className="text-xs text-slate-500">{topic.chapter}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {topic.duration} min
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge
                                className={`text-xs ${
                                  topic.focusArea === 'weakness'
                                    ? 'bg-red-100 text-red-700'
                                    : topic.focusArea === 'revision'
                                    ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {topic.focusArea === 'weakness' ? '🎯 Weakness' :
                                 topic.focusArea === 'revision' ? '🔄 Revision' :
                                 '⭐ New Topic'}
                              </Badge>
                              
                              <Badge variant="outline" className="text-xs">
                                {topic.difficulty === 'hard' ? '🔴' : topic.difficulty === 'medium' ? '🟡' : '🟢'} {topic.difficulty}
                              </Badge>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-semibold text-slate-700">
                                  {topic.questionsCompleted || 0}/{topic.questionsRequired || 0}
                                </span>
                              </div>
                              <Progress 
                                value={topic.questionsRequired > 0 ? (topic.questionsCompleted / topic.questionsRequired) * 100 : 0} 
                                className="h-1.5"
                              />
                            </div>

                            {topic.reason && !topic.completed && (
                              <p className="text-xs text-slate-600 mt-2 italic">
                                📌 {topic.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-slate-500">
          Last updated: {new Date(studyPlan.last_updated).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStudyPlanner;
