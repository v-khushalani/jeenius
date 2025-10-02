import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Zap, BookOpen, Target, Brain, TrendingUp, AlertTriangle, CheckCircle, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, profile, loading } = useUserData();
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  useEffect(() => {
    if (user) {
      loadPerformanceData();
    }
  }, [user]);

  const loadPerformanceData = async () => {
    if (!user) return;
    
    try {
      // Get question attempts
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select(`
          is_correct,
          created_at,
          questions(subject, topic, chapter)
        `)
        .eq('user_id', user.id);

      // Get test sessions
      const { data: tests } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('user_id', user.id);

      // Calculate subject-wise performance
      const subjectStats: any = {};
      attempts?.forEach((attempt: any) => {
        const subject = attempt.questions?.subject;
        if (subject) {
          if (!subjectStats[subject]) {
            subjectStats[subject] = { correct: 0, total: 0, topics: new Set() };
          }
          subjectStats[subject].total++;
          if (attempt.is_correct) subjectStats[subject].correct++;
          if (attempt.questions?.topic) {
            subjectStats[subject].topics.add(attempt.questions.topic);
          }
        }
      });

      // Classify subjects by performance
      const strongAreas: any[] = [];
      const moderateAreas: any[] = [];
      const focusAreas: any[] = [];

      Object.entries(subjectStats).forEach(([subject, data]: [string, any]) => {
        const accuracy = (data.correct / data.total) * 100;
        const areaData = {
          subject,
          accuracy: Math.round(accuracy),
          attempted: data.total,
          correct: data.correct,
          topicsCovered: data.topics.size
        };

        if (accuracy >= 75) strongAreas.push(areaData);
        else if (accuracy >= 50) moderateAreas.push(areaData);
        else focusAreas.push(areaData);
      });

      // Calculate test performance
      const totalTests = tests?.length || 0;
      const avgTestScore = tests?.length 
        ? tests.reduce((sum, t) => sum + (t.score || 0), 0) / tests.length 
        : 0;

      setPerformanceData({
        strongAreas,
        moderateAreas,
        focusAreas,
        totalTests,
        avgTestScore: Math.round(avgTestScore),
        totalAttempts: attempts?.length || 0
      });
    } catch (error) {
      console.error('Error loading performance:', error);
    } finally {
      setLoadingPerformance(false);
    }
  };

  if (loading || loadingPerformance) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-1">
              Welcome back, {displayName}! 🎯
            </h1>
            <p className="text-muted-foreground">Ready to continue your JEE journey?</p>
          </div>

          {/* Stats Cards with enhanced colors */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.totalPoints || 0}</div>
                <div className="text-xs opacity-90">Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.streak || 0}</div>
                <div className="text-xs opacity-90">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats?.totalQuestions || 0}</div>
                <div className="text-xs opacity-90">Questions</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Study Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Questions Attempted</span>
                    <span className="text-sm font-bold text-primary">{performanceData?.totalAttempts || 0}</span>
                  </div>
                  <Progress value={Math.min((performanceData?.totalAttempts || 0) / 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Overall Accuracy</span>
                    <span className="text-sm font-bold text-green-600">{stats?.accuracy || 0}%</span>
                  </div>
                  <Progress value={stats?.accuracy || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Test Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tests Completed</span>
                    <span className="text-sm font-bold text-primary">{performanceData?.totalTests || 0}</span>
                  </div>
                  <Progress value={Math.min((performanceData?.totalTests || 0) * 10, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Average Score</span>
                    <span className="text-sm font-bold text-blue-600">{performanceData?.avgTestScore || 0}%</span>
                  </div>
                  <Progress value={performanceData?.avgTestScore || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Areas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Strong Areas */}
            <Card className="border-2 border-green-200 bg-green-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData?.strongAreas.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.strongAreas.map((area: any) => (
                      <div key={area.subject} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{area.subject}</span>
                          <Badge className="bg-green-600 text-white">{area.accuracy}%</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {area.correct}/{area.attempted} correct • {area.topicsCovered} topics
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Start practicing to build strong areas!</p>
                )}
              </CardContent>
            </Card>

            {/* Moderate Areas */}
            <Card className="border-2 border-yellow-200 bg-yellow-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <TrendingUp className="w-5 h-5" />
                  Moderate Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData?.moderateAreas.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.moderateAreas.map((area: any) => (
                      <div key={area.subject} className="bg-white rounded-lg p-3 border border-yellow-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{area.subject}</span>
                          <Badge className="bg-yellow-600 text-white">{area.accuracy}%</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {area.correct}/{area.attempted} correct • {area.topicsCovered} topics
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Keep practicing consistently!</p>
                )}
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card className="border-2 border-red-200 bg-red-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData?.focusAreas.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.focusAreas.map((area: any) => (
                      <div key={area.subject} className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{area.subject}</span>
                          <Badge className="bg-red-600 text-white">{area.accuracy}%</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {area.correct}/{area.attempted} correct • {area.topicsCovered} topics
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Great! No weak areas yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Button 
              className="h-16 flex-col space-y-1 bg-gradient-to-br from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white border-0 shadow-lg" 
              onClick={() => navigate('/study-now')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Study Now</span>
            </Button>
            <Button 
              className="h-16 flex-col space-y-1 bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-600/90 hover:to-indigo-700/90 text-white border-0 shadow-lg"
              onClick={() => navigate('/tests')}
            >
              <Target className="w-6 h-6" />
              <span className="text-sm">Take Tests</span>
            </Button>
            <Button 
              className="h-16 flex-col space-y-1 bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-600/90 hover:to-emerald-700/90 text-white border-0 shadow-lg"
              onClick={() => navigate('/doubt-solver')}
            >
              <Brain className="w-6 h-6" />
              <span className="text-sm">Ask Jeenie</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;