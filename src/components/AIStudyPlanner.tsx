import React, { useState, useEffect } from "react";
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
  ChevronUp
} from "lucide-react";

import { supabase } from "@/lib/supabase";
interface Topic {
  name: string;
  duration: number;
  difficulty: string;
  reason: string;
  focusArea: string;
  aiRecommendation?: string;
  completed?: boolean;
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
  ai_metrics?: {
    learningRate: number;
    retentionScore: number;
    consistencyScore: number;
    adaptiveLevel: string;
  };
  next_refresh_time: string;
  last_updated: string;
}

const AIStudyPlanner: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set([0]));
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>("");

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  useEffect(() => {
    if (studyPlan?.next_refresh_time) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const refreshTime = new Date(studyPlan.next_refresh_time).getTime();
        const diff = refreshTime - now;
        
        if (diff <= 0) {
          setTimeUntilRefresh("Refreshing...");
          fetchStudyPlan();
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeUntilRefresh(`${hours}h ${minutes}m`);
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [studyPlan]);

  const fetchStudyPlan = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: plans, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false })
        .limit(1);

      if (error) throw error;

      const latestPlan = plans?.[0] as any;
      const needsRefresh = !latestPlan || new Date(latestPlan.next_refresh_time) <= new Date();

      if (needsRefresh) {
        await generateNewPlan();
      } else {
        setStudyPlan(latestPlan as StudyPlan);
      }
    } catch (error) {
      console.error('Error fetching study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan');
      
      if (error) throw error;
      
      if (data?.success) {
        setStudyPlan(data.studyPlan);
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await generateNewPlan();
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

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

  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl">
      <CardHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Study Plan</h3>
              <p className="text-xs text-slate-500">Refreshes in {timeUntilRefresh}</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* AI Metrics */}
        {studyPlan.ai_metrics && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-sm text-indigo-900">AI Performance Metrics</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {(studyPlan.ai_metrics.learningRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600">Learning Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(studyPlan.ai_metrics.retentionScore * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600">Retention</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {(studyPlan.ai_metrics.consistencyScore * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-slate-600">Consistency</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge className="bg-indigo-600 text-white">
                {studyPlan.ai_metrics.adaptiveLevel.toUpperCase()} Level
              </Badge>
            </div>
          </div>
        )}

        {/* Priority Recommendations */}
        {studyPlan.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Smart Recommendations
            </h4>
            {studyPlan.recommendations.slice(0, 3).map((rec, idx) => (
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

        {/* Today's Study Schedule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Today's Schedule ({studyPlan.total_study_time} mins)
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
              {/* Subject Header */}
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
                        {subject.topics.length} topics
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

              {/* Subject Details - Expandable */}
              {expandedSubjects.has(subjectIdx) && (
                <div className="px-3 pb-3 space-y-2">
                  {/* AI Insight */}
                  {subject.aiInsight && (
                    <div className="bg-white/70 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs text-slate-700">
                        <Brain className="h-3 w-3 inline mr-1 text-purple-600" />
                        {subject.aiInsight}
                      </p>
                    </div>
                  )}

                  {/* Topics */}
                  <div className="space-y-2">
                    {subject.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="bg-white rounded-lg p-2.5 border border-slate-200 hover:shadow-md transition-all"
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
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs">{getDifficultyIcon(topic.difficulty)}</span>
                              <h6 className="text-xs font-semibold text-slate-800 flex-1">
                                {topic.name}
                              </h6>
                              <Badge variant="outline" className="text-xs">
                                {topic.duration} min
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-slate-600 mb-1">
                              📌 {topic.reason}
                            </p>
                            
                            {topic.aiRecommendation && (
                              <div className="bg-indigo-50 rounded px-2 py-1 mt-1.5">
                                <p className="text-xs text-indigo-700">
                                  💡 <span className="font-medium">AI Tip:</span> {topic.aiRecommendation}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-2">
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
                                 '⭐ Strength'}
                              </Badge>
                            </div>
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

        {/* Performance Summary */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3 border border-slate-200">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Performance Overview
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-600 mb-1">Overall Accuracy</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">
                  {studyPlan.performance.overallAccuracy.toFixed(0)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Completion</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600">
                  {studyPlan.completion_status || 0}%
                </span>
              </div>
            </div>
          </div>

          {studyPlan.performance.strengths.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-green-700 mb-1">
                💪 Strengths:
              </p>
              <div className="flex flex-wrap gap-1">
                {studyPlan.performance.strengths.map((strength, idx) => (
                  <Badge key={idx} className="bg-green-100 text-green-700 text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {studyPlan.performance.weaknesses.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-orange-700 mb-1">
                🎯 Focus Areas:
              </p>
              <div className="flex flex-wrap gap-1">
                {studyPlan.performance.weaknesses.map((weakness, idx) => (
                  <Badge key={idx} className="bg-orange-100 text-orange-700 text-xs">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Last Updated Info */}
        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Last updated: {new Date(studyPlan.last_updated).toLocaleString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short'
            })}
          </p>
          <p className="text-xs text-indigo-600 font-medium mt-1">
            🤖 Powered by AI • Auto-refreshes every 24 hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStudyPlanner;
