import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain, Target, Trophy, Flame, Zap, TrendingUp, Clock,
  CheckCircle2, Circle, Sparkles, AlertCircle, PlayCircle,
  RefreshCw, Calendar, Award, BarChart3
} from 'lucide-react';

const AIStudyPlanner = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveStats, setLiveStats] = useState({
    questionsToday: 12,
    accuracyToday: 78,
    streak: 5,
    timeStudied: 145
  });

  // Mock study plan data (replace with actual Supabase call)
  const mockPlan = {
    subjects: [
      {
        name: 'Physics',
        priority: 'high',
        allocatedTime: 90,
        progress: 65,
        topics: [
          { name: 'Newton\'s Laws', completed: true, difficulty: 'easy', questions: 10 },
          { name: 'Kinematics', completed: false, difficulty: 'medium', questions: 15 },
          { name: 'Work & Energy', completed: false, difficulty: 'hard', questions: 12 }
        ],
        aiInsight: 'Your mechanics concepts need reinforcement. Focus on problem-solving.'
      },
      {
        name: 'Chemistry',
        priority: 'medium',
        allocatedTime: 60,
        progress: 45,
        topics: [
          { name: 'Organic Chemistry', completed: false, difficulty: 'medium', questions: 12 },
          { name: 'Periodic Table', completed: true, difficulty: 'easy', questions: 8 }
        ],
        aiInsight: 'Strong foundation. Ready for advanced organic chemistry.'
      },
      {
        name: 'Mathematics',
        priority: 'high',
        allocatedTime: 90,
        progress: 80,
        topics: [
          { name: 'Calculus', completed: true, difficulty: 'hard', questions: 15 },
          { name: 'Algebra', completed: true, difficulty: 'medium', questions: 10 }
        ],
        aiInsight: 'Excellent progress! Maintain this momentum.'
      }
    ],
    recommendations: [
      { message: 'Complete 5 more questions to hit today\'s target!', priority: 'high' },
      { message: 'Your Physics accuracy dropped to 65%. Review basics.', priority: 'medium' }
    ],
    ai_metrics: {
      learningRate: 0.85,
      retentionScore: 0.78,
      consistencyScore: 0.92,
      adaptiveLevel: 'Advanced'
    }
  };

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setStudyPlan(mockPlan);
      setLoading(false);
    }, 1000);

    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        questionsToday: prev.questionsToday + Math.floor(Math.random() * 2),
        timeStudied: prev.timeStudied + 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDaysRemaining = () => {
    const target = new Date('2026-05-24');
    const today = new Date();
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-2xl">
        <CardContent className="p-12 flex flex-col items-center justify-center min-h-[500px]">
          <div className="relative">
            <Brain className="h-24 w-24 text-indigo-600 animate-pulse" />
            <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900 mt-6 mb-2">AI is Analyzing...</h3>
          <p className="text-indigo-600">Creating your personalized study roadmap</p>
        </CardContent>
      </Card>
    );
  }

  if (!studyPlan) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-2xl">
        <CardContent className="p-12 text-center">
          <Brain className="h-20 w-20 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Dominate JEE?</h2>
          <p className="text-gray-600 mb-8">Let AI create your perfect study plan</p>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Generate My Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats Bar */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-white/80 mr-2" />
                <span className="text-white/80 text-sm font-medium">JEE 2026</span>
              </div>
              <div className="text-3xl font-bold text-white">{getDaysRemaining()}</div>
              <div className="text-white/70 text-xs mt-1">days left</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-5 w-5 text-orange-300 mr-2" />
                <span className="text-white/80 text-sm font-medium">Streak</span>
              </div>
              <div className="text-3xl font-bold text-white">{liveStats.streak}</div>
              <div className="text-white/70 text-xs mt-1">days strong</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white/80 text-sm font-medium">Today</span>
              </div>
              <div className="text-3xl font-bold text-white">{liveStats.questionsToday}</div>
              <div className="text-white/70 text-xs mt-1">questions solved</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-green-300 mr-2" />
                <span className="text-white/80 text-sm font-medium">Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-white">{liveStats.accuracyToday}%</div>
              <div className="text-white/70 text-xs mt-1">on fire!</div>
            </div>
          </div>

          <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">Daily Target Progress</span>
              <span className="text-white font-bold">{liveStats.questionsToday}/30</span>
            </div>
            <Progress value={(liveStats.questionsToday / 30) * 100} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              AI Performance Metrics
            </h3>
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              {studyPlan.ai_metrics.adaptiveLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Learning', value: studyPlan.ai_metrics.learningRate * 100, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Retention', value: studyPlan.ai_metrics.retentionScore * 100, icon: Brain, color: 'text-blue-600' },
              { label: 'Consistency', value: studyPlan.ai_metrics.consistencyScore * 100, icon: Flame, color: 'text-orange-600' }
            ].map((metric, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-md">
                <metric.icon className={`h-5 w-5 ${metric.color} mb-2`} />
                <div className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">{metric.label}</div>
                <Progress value={metric.value} className="h-1.5 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      {studyPlan.recommendations.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Action Required
            </h4>
            <div className="space-y-2">
              {studyPlan.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-orange-500 flex items-start gap-3">
                  <Zap className="h-4 w-4 text-orange-600 mt-0.5" />
                  <p className="text-sm text-gray-800 flex-1">{rec.message}</p>
                  <Button size="sm" variant="outline" className="text-xs">Act Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Today's Focus
          </h3>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>

        {studyPlan.subjects.map((subject, idx) => (
          <Card key={idx} className={`border-2 shadow-lg transition-all hover:shadow-2xl ${
            subject.priority === 'high' ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50' :
            subject.priority === 'medium' ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50' :
            'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    subject.priority === 'high' ? 'bg-red-100' :
                    subject.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {subject.priority === 'high' ? '🔥' : subject.priority === 'medium' ? '📚' : '✅'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{subject.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {subject.allocatedTime} mins
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {subject.topics.length} topics
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="bg-white/70 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>

              {/* AI Insight */}
              <div className="bg-white/70 rounded-lg p-3 border-l-4 border-purple-500">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                  <p className="text-sm text-gray-700">{subject.aiInsight}</p>
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                {subject.topics.map((topic, tidx) => (
                  <div key={tidx} className={`bg-white rounded-lg p-3 border transition-all hover:shadow-md ${
                    topic.completed ? 'border-green-300' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {topic.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{topic.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {topic.difficulty === 'easy' ? '🟢' : topic.difficulty === 'medium' ? '🟡' : '🔴'}
                              {topic.difficulty}
                            </Badge>
                            <span className="text-xs text-gray-600">{topic.questions} questions</span>
                          </div>
                        </div>
                      </div>
                      {!topic.completed && (
                        <Button size="sm" variant="outline">Practice</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIStudyPlanner;
