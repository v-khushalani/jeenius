import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain, Target, Beaker, Calculator, Activity, ChevronRight,
  Trophy, Flame, ArrowLeft, Lightbulb, XCircle, CheckCircle2,
  Sparkles, Zap, Award, Clock, TrendingUp, AlertTriangle, Star,
  BookOpen, BarChart3, Filter, ChevronDown
} from "lucide-react";

const StudyNowPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, streak: 0, startTime: null });
  const [userPerformance, setUserPerformance] = useState({ 
    recentAccuracy: 0, 
    totalAttempts: 0,
    subjectStats: {}
  });
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPerformance();
      loadSubjects();
    }
  }, [user]);

  const loadUserPerformance = async () => {
    if (!user) return;
    
    try {
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('is_correct, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (attempts && attempts.length > 0) {
        const recent50 = attempts.slice(0, 50);
        const correct = recent50.filter(a => a.is_correct).length;
        const accuracy = (correct / recent50.length) * 100;
        
        // Get subject-wise performance
        const { data: subjectAttempts } = await supabase
          .from('question_attempts')
          .select(`
            is_correct,
            questions(subject)
          `)
          .eq('user_id', user.id);

        const subjectStats = {};
        subjectAttempts?.forEach(attempt => {
          const subject = attempt.questions?.subject;
          if (subject) {
            if (!subjectStats[subject]) {
              subjectStats[subject] = { correct: 0, total: 0, accuracy: 0 };
            }
            subjectStats[subject].total++;
            if (attempt.is_correct) subjectStats[subject].correct++;
          }
        });

        Object.keys(subjectStats).forEach(subject => {
          subjectStats[subject].accuracy = (subjectStats[subject].correct / subjectStats[subject].total) * 100;
        });

        setUserPerformance({
          recentAccuracy: accuracy,
          totalAttempts: attempts.length,
          subjectStats
        });
      }
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject, difficulty');

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectConfig = {
        'Physics': { icon: Target, emoji: '⚡', color: 'from-blue-500 to-indigo-600' },
        'Chemistry': { icon: Beaker, emoji: '🧪', color: 'from-green-500 to-emerald-600' },
        'Mathematics': { icon: Calculator, emoji: '🔢', color: 'from-purple-500 to-pink-600' },
        'Biology': { icon: Activity, emoji: '🧬', color: 'from-orange-500 to-red-600' }
      };

      const subjectsData = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject);

          // Get difficulty breakdown
          const { data: diffData } = await supabase
            .from('questions')
            .select('difficulty')
            .eq('subject', subject);

          const difficulties = {
            easy: diffData?.filter(q => q.difficulty === 'Easy').length || 0,
            medium: diffData?.filter(q => q.difficulty === 'Medium').length || 0,
            hard: diffData?.filter(q => q.difficulty === 'Hard').length || 0
          };

          // Get user's accuracy for this subject
          const subjectAccuracy = userPerformance.subjectStats[subject]?.accuracy || 0;
          const needsFocus = subjectAccuracy < 70 && userPerformance.subjectStats[subject]?.total > 10;

          return {
            name: subject,
            ...subjectConfig[subject],
            totalQuestions: count || 0,
            difficulties,
            accuracy: subjectAccuracy,
            needsFocus,
            attempted: userPerformance.subjectStats[subject]?.total || 0
          };
        })
      );

      // Sort: needs focus first, then by name
      setSubjects(subjectsData.sort((a, b) => {
        if (a.needsFocus && !b.needsFocus) return -1;
        if (!a.needsFocus && b.needsFocus) return 1;
        return a.name.localeCompare(b.name);
      }));
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const loadChapters = async (subject) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('chapter, difficulty');

      if (error) throw error;

      const subjectQuestions = data?.filter(q => q.subject === subject) || [];
      const uniqueChapters = [...new Set(subjectQuestions.map(q => q.chapter))];
      
      const chaptersData = await Promise.all(
        uniqueChapters.map(async (chapter, index) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject)
            .eq('chapter', chapter);

          // Get difficulty breakdown
          const chapterQs = subjectQuestions.filter(q => q.chapter === chapter);
          const difficulties = {
            easy: chapterQs.filter(q => q.difficulty === 'Easy').length,
            medium: chapterQs.filter(q => q.difficulty === 'Medium').length,
            hard: chapterQs.filter(q => q.difficulty === 'Hard').length
          };

          let userProgress = 0;
          let chapterAccuracy = 0;
          if (user) {
            const { data: chapterQIds } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', subject)
              .eq('chapter', chapter);

            const questionIds = chapterQIds?.map(q => q.id) || [];

            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id, is_correct')
              .eq('user_id', user.id)
              .in('question_id', questionIds);

            const attempted = attempts?.length || 0;
            userProgress = Math.round((attempted / (count || 1)) * 100);

            if (attempts && attempts.length > 0) {
              const correct = attempts.filter(a => a.is_correct).length;
              chapterAccuracy = Math.round((correct / attempts.length) * 100);
            }
          }

          return {
            name: chapter,
            sequence: index + 1,
            totalQuestions: count || 0,
            progress: userProgress,
            accuracy: chapterAccuracy,
            difficulties,
            needsFocus: chapterAccuracy < 70 && userProgress > 30
          };
        })
      );

      // Sort: needs focus first, then by sequence
      setChapters(chaptersData.sort((a, b) => {
        if (a.needsFocus && !b.needsFocus) return -1;
        if (!a.needsFocus && b.needsFocus) return 1;
        return a.sequence - b.sequence;
      }));
      setSelectedSubject(subject);
      setView('chapters');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadTopics = async (chapter) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('topic, difficulty')
        .eq('subject', selectedSubject)
        .eq('chapter', chapter);

      if (error) throw error;

      const uniqueTopics = [...new Set(data?.map(q => q.topic) || [])];
      
      const topicsData = await Promise.all(
        uniqueTopics.map(async (topic, index) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', selectedSubject)
            .eq('chapter', chapter)
            .eq('topic', topic);

          // Get difficulty breakdown
          const topicQs = data?.filter(q => q.topic === topic) || [];
          const difficulties = {
            easy: topicQs.filter(q => q.difficulty === 'Easy').length,
            medium: topicQs.filter(q => q.difficulty === 'Medium').length,
            hard: topicQs.filter(q => q.difficulty === 'Hard').length
          };

          let userProgress = 0;
          let topicAccuracy = 0;
          if (user) {
            const { data: topicQIds } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', selectedSubject)
              .eq('chapter', chapter)
              .eq('topic', topic);

            const questionIds = topicQIds?.map(q => q.id) || [];

            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id, is_correct')
              .eq('user_id', user.id)
              .in('question_id', questionIds);

            const attempted = attempts?.length || 0;
            userProgress = Math.round((attempted / (count || 1)) * 100);

            if (attempts && attempts.length > 0) {
              const correct = attempts.filter(a => a.is_correct).length;
              topicAccuracy = Math.round((correct / attempts.length) * 100);
            }
          }

          return {
            name: topic,
            sequence: index + 1,
            totalQuestions: count || 0,
            progress: userProgress,
            accuracy: topicAccuracy,
            difficulties,
            needsFocus: topicAccuracy < 70 && userProgress > 20,
            recommended: userProgress === 0 || (topicAccuracy >= 70 && userProgress < 100)
          };
        })
      );

      // Sort: needs focus first, recommended second, then by sequence
      setTopics(topicsData.sort((a, b) => {
        if (a.needsFocus && !b.needsFocus) return -1;
        if (!a.needsFocus && b.needsFocus) return 1;
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.sequence - b.sequence;
      }));
      setSelectedChapter(chapter);
      setView('topics');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getAdaptiveQuestionCount = () => {
    if (userPerformance.recentAccuracy >= 85) return 10;
    if (userPerformance.recentAccuracy >= 70) return 15;
    return 20;
  };

  const startPractice = async (topic) => {
    const questionCount = getAdaptiveQuestionCount();
    
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('chapter', selectedChapter)
        .eq('topic', topic.name);

      // Apply difficulty filter
      if (difficultyFilter !== 'all') {
        query = query.eq('difficulty', difficultyFilter);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert(`No ${difficultyFilter !== 'all' ? difficultyFilter : ''} questions available for this topic!`);
        return;
      }

      const shuffled = data.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

      setPracticeQuestions(selected);
      setSelectedTopic(topic);
      setCurrentQuestionIndex(0);
      setSessionStats({ correct: 0, total: 0, streak: 0, startTime: new Date() });
      setSelectedAnswer(null);
      setShowResult(false);
      setView('practice');
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    }
  };

  const handleAnswer = async (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const question = practiceQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correct_answer;

    // Save attempt to database
    if (user) {
      await supabase.from('question_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        is_correct: isCorrect,
        time_taken: Math.floor((new Date() - sessionStats.startTime) / 1000)
      });
    }

    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSessionStats(prev => ({ ...prev, startTime: new Date() }));
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      const totalTime = Math.floor((new Date() - sessionStats.startTime) / 1000 / 60);
      
      alert(`🎉 Practice Session Completed!\n\n✅ Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n⏱️ Time: ${totalTime} minutes\n🔥 Best Streak: ${sessionStats.streak}\n\n${
        accuracy >= 90 ? '🌟 Outstanding! You\'re a genius!' :
        accuracy >= 75 ? '💪 Great job! Keep it up!' :
        accuracy >= 60 ? '📈 Good progress! Practice more to improve!' :
        '📚 Keep learning! Focus on weak areas!'
      }`);

      await loadUserPerformance();
      await loadTopics(selectedChapter);
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse mx-auto bg-gradient-to-br from-blue-600 to-indigo-700">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-blue-900">JEEnius</h1>
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
            <p className="text-gray-600 text-lg">Loading your AI-powered learning journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // PRACTICE MODE - Enhanced
  if (view === 'practice' && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0;
    const timeElapsed = sessionStats.startTime ? Math.floor((new Date() - sessionStats.startTime) / 1000) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            {/* Enhanced Stats Header */}
            <Card className="mb-6 border-0 shadow-2xl text-white bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge className="bg-white/20 text-white text-sm flex items-center gap-1.5 px-3 py-1 backdrop-blur-xl">
                        <Sparkles className="w-4 h-4" />
                        AI Adaptive
                      </Badge>
                      <span className="text-sm opacity-90">{selectedSubject} • {selectedChapter}</span>
                      {question.difficulty && (
                        <Badge className={`text-white text-xs ${
                          question.difficulty === 'Easy' ? 'bg-green-500/30' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/30' :
                          'bg-red-500/30'
                        }`}>
                          {question.difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                      <div>
                        <p className="text-5xl font-black mb-1">{sessionStats.correct}/{sessionStats.total}</p>
                        <p className="text-sm opacity-75">Correct</p>
                      </div>
                      {sessionStats.streak > 2 && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1.5 animate-pulse px-4 py-2">
                          <Flame className="w-5 h-5" />
                          {sessionStats.streak} Streak!
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-6xl font-black mb-1 ${
                      accuracy >= 80 ? 'text-green-300' :
                      accuracy >= 60 ? 'text-yellow-300' :
                      'text-red-300'
                    }`}>
                      {accuracy.toFixed(0)}%
                    </div>
                    <div className="text-sm opacity-90">Accuracy</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-3 bg-white/20" />
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Question {currentQuestionIndex + 1} of {practiceQuestions.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-8 sm:p-10">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                    {currentQuestionIndex + 1}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold leading-relaxed text-slate-900 flex-1">
                    {question.question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_answer;
                    
                    let btnClass = 'w-full text-left p-5 sm:p-6 rounded-xl border-2 transition-all transform hover:scale-[1.01] ';
                    
                    if (showResult) {
                      if (isCorrect) {
                        btnClass += 'border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 scale-[1.01] shadow-lg';
                      } else if (isSelected) {
                        btnClass += 'border-red-600 bg-gradient-to-r from-red-50 to-orange-50';
                      } else {
                        btnClass += 'border-gray-200 opacity-50';
                      }
                    } else {
                      btnClass += isSelected 
                        ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl scale-[1.01]' 
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50';
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswer(letter)}
                        disabled={showResult}
                        className={btnClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shadow-md ${
                              showResult && isCorrect ? 'bg-green-600 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                              isSelected ? 'bg-blue-600 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {letter}
                            </div>
                            <span className="text-base sm:text-lg font-medium text-slate-800">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && question.explanation && (
                  <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold mb-3 text-lg sm:text-xl text-blue-900 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Explanation
                        </p>
                        <p className="leading-relaxed text-slate-700 text-sm sm:text-base">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showResult && (
                  <div className="mt-6 flex gap-3">
                    <Button 
                      onClick={nextQuestion}
                      size="lg"
                      className="flex-1 h-14 text-lg font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                    >
                      {currentQuestionIndex < practiceQuestions.length - 1 ? (
                        <>Next Question <ChevronRight className="w-6 h-6 ml-2" /></>
                      ) : (
                        <>Finish Practice <Trophy className="w-6 h-6 ml-2" /></>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => {
                if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
                  setView('topics');
                }
              }}
              className="mt-6 w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Exit Practice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SUBJECTS VIEW - Enhanced
  if (view === 'subjects') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Smart Recommendation Banner */}
            {subjects.some(s => s.needsFocus) && (
              <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Recommendation: Focus Needed
                      </h3>
                      <p className="text-slate-700 mb-3">
                        {subjects.filter(s => s.needsFocus).map(s => s.name).join(', ')} need your attention. 
                        Your accuracy is below 70% - let's improve it together!
                      </p>
                      <Badge className="bg-orange-500 text-white">Priority</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subjects Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                const accuracyColor = subject.accuracy >= 80 ? 'text-green-600' :
                                      subject.accuracy >= 60 ? 'text-yellow-600' :
                                      subject.accuracy > 0 ? 'text-red-600' : 'text-gray-400';
                
                return (
                  <Card 
                    key={subject.name}
                    onClick={() => loadChapters(subject.name)}
                    className={`cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 overflow-hidden group ${
                      subject.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' : 'border-transparent'
                    }`}
                  >
                    <div className={`p-8 text-white text-center relative overflow-hidden bg-gradient-to-br ${subject.color}`}>
                      {subject.needsFocus && (
                        <Badge className="absolute top-4 right-4 bg-orange-500 text-white animate-pulse">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Focus
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {subject.emoji}
                        </div>
                        <Icon className="w-14 h-14 mx-auto mb-4 opacity-90" />
                        <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                        <Badge className="bg-white/20 text-white flex items-center gap-1 w-fit mx-auto">
                          <Sparkles className="w-3 h-3" />
                          AI Powered
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <div className="text-4xl font-black text-blue-900 mb-1">
                            {subject.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-600">Questions</div>
                        </div>
                        {subject.attempted > 0 && (
                          <div className="text-center flex-1 border-l border-gray-200">
                            <div className={`text-4xl font-black ${accuracyColor} mb-1`}>
                              {Math.round(subject.accuracy)}%
                            </div>
                            <div className="text-xs text-gray-600">Your Accuracy</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Difficulty Breakdown */}
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="font-bold text-green-600">{subject.difficulties.easy}</p>
                            <p className="text-gray-600">Easy</p>
                          </div>
                          <div>
                            <p className="font-bold text-yellow-600">{subject.difficulties.medium}</p>
                            <p className="text-gray-600">Medium</p>
                          </div>
                          <div>
                            <p className="font-bold text-red-600">{subject.difficulties.hard}</p>
                            <p className="text-gray-600">Hard</p>
                          </div>
                        </div>
                      </div>

                      <Button className={`w-full h-12 text-base font-semibold text-white transition-opacity bg-gradient-to-r ${subject.color}`}>
                        {subject.needsFocus ? (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Improve Now
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Start Learning
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Performance Card - Enhanced */}
            {userPerformance.totalAttempts > 0 && (
              <Card className="mt-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-2xl mb-1 text-blue-900">AI-Powered Adaptive Learning</h3>
                      <p className="text-slate-700">
                        {userPerformance.recentAccuracy >= 85 
                          ? '🔥 Outstanding! Your personalized learning path is optimized for excellence'
                          : userPerformance.recentAccuracy >= 70
                          ? '✨ Excellent progress! AI is fine-tuning your study plan'
                          : '📚 Building strong foundations with intelligent AI guidance'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-white rounded-xl shadow-md border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-gray-600 font-medium">Accuracy</p>
                      </div>
                      <p className="text-4xl font-black text-blue-900">{userPerformance.recentAccuracy.toFixed(0)}%</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-md border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <p className="text-sm text-gray-600 font-medium">Questions</p>
                      </div>
                      <p className="text-4xl font-black text-indigo-900">{userPerformance.totalAttempts}</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-md border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <p className="text-sm text-gray-600 font-medium">Status</p>
                      </div>
                      <p className="text-lg font-bold text-purple-900">
                        {userPerformance.recentAccuracy >= 85 ? 'Excellent! 🌟' :
                         userPerformance.recentAccuracy >= 70 ? 'Good Progress 📈' :
                         'Keep Practicing 💪'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CHAPTERS VIEW - Enhanced
  if (view === 'chapters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => setView('subjects')}
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Subjects
              </Button>
              <Badge className="bg-blue-600 text-white text-base px-4 py-2">
                {selectedSubject}
              </Badge>
            </div>

            {/* Priority Chapters Banner */}
            {chapters.some(c => c.needsFocus) && (
              <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-bold text-yellow-900 mb-1">💡 AI Recommendation</p>
                      <p className="text-sm text-slate-700">
                        Focus on: {chapters.filter(c => c.needsFocus).map(c => c.name).join(', ')} - 
                        These chapters need improvement to boost your overall score!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => {
                const accuracyColor = chapter.accuracy >= 80 ? 'text-green-600' :
                                      chapter.accuracy >= 60 ? 'text-yellow-600' :
                                      chapter.accuracy > 0 ? 'text-red-600' : 'text-gray-400';

                return (
                  <Card 
                    key={chapter.name}
                    onClick={() => loadTopics(chapter.name)}
                    className={`cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 shadow-xl overflow-hidden group ${
                      chapter.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' : 'border-transparent'
                    }`}
                  >
                    <div className="p-6 text-white relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className="bg-white/20 text-white backdrop-blur-xl">
                            Chapter {chapter.sequence}
                          </Badge>
                          <div className="flex gap-2">
                            {chapter.needsFocus && (
                              <Badge className="bg-orange-500 text-white animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Focus
                              </Badge>
                            )}
                            {chapter.progress >= 80 && <Trophy className="w-6 h-6 text-yellow-300" />}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4 leading-tight">{chapter.name}</h3>
                        {chapter.progress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span className="font-bold">{chapter.progress}%</span>
                            </div>
                            <Progress value={chapter.progress} className="h-2 bg-white/20 mb-2" />
                            {chapter.accuracy > 0 && (
                              <p className="text-sm">
                                Accuracy: <span className={`font-bold ${chapter.accuracy >= 70 ? 'text-green-200' : 'text-yellow-200'}`}>
                                  {chapter.accuracy}%
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <div className="text-4xl font-black text-blue-900 mb-1">
                            {chapter.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-600">Questions</div>
                        </div>
                        {chapter.accuracy > 0 && (
                          <div className="text-center flex-1 border-l border-gray-200">
                            <div className={`text-4xl font-black ${accuracyColor} mb-1`}>
                              {chapter.accuracy}%
                            </div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                        )}
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="font-bold text-green-600">{chapter.difficulties.easy}</p>
                            <p className="text-gray-600">Easy</p>
                          </div>
                          <div>
                            <p className="font-bold text-yellow-600">{chapter.difficulties.medium}</p>
                            <p className="text-gray-600">Medium</p>
                          </div>
                          <div>
                            <p className="font-bold text-red-600">{chapter.difficulties.hard}</p>
                            <p className="text-gray-600">Hard</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {chapter.needsFocus ? 'Improve Topics' : 'Explore Topics'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TOPICS VIEW - Enhanced
  if (view === 'topics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => setView('chapters')}
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Chapters
              </Button>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white text-base px-4 py-2">
                  {selectedSubject} • {selectedChapter}
                </Badge>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-2 border-slate-300"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Difficulty Filter */}
            {showFilters && (
              <Card className="mb-6 border-2 border-blue-200 shadow-lg">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Filter by Difficulty:</p>
                  <div className="flex gap-3 flex-wrap">
                    {['all', 'Easy', 'Medium', 'Hard'].map(diff => (
                      <Button
                        key={diff}
                        onClick={() => setDifficultyFilter(diff)}
                        variant={difficultyFilter === diff ? 'default' : 'outline'}
                        className={`${
                          difficultyFilter === diff 
                            ? 'bg-blue-600 text-white' 
                            : 'border-2 border-blue-300 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        {diff === 'all' ? 'All Questions' : diff}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Smart Recommendations */}
            {topics.some(t => t.needsFocus || t.recommended) && (
              <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-900 mb-2">🤖 AI Study Recommendations</p>
                      <div className="space-y-1 text-sm text-slate-700">
                        {topics.filter(t => t.needsFocus).length > 0 && (
                          <p>
                            ⚠️ <strong>Focus:</strong> {topics.filter(t => t.needsFocus).map(t => t.name).join(', ')} - 
                            Low accuracy, needs practice!
                          </p>
                        )}
                        {topics.filter(t => t.recommended && !t.needsFocus).length > 0 && (
                          <p>
                            ✨ <strong>Recommended:</strong> {topics.filter(t => t.recommended && !t.needsFocus).map(t => t.name).join(', ')} - 
                            Good progress, continue momentum!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => {
                const accuracyColor = topic.accuracy >= 80 ? 'text-green-600' :
                                      topic.accuracy >= 60 ? 'text-yellow-600' :
                                      topic.accuracy > 0 ? 'text-red-600' : 'text-gray-400';

                return (
                  <Card 
                    key={topic.name} 
                    className={`border-2 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden group ${
                      topic.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' :
                      topic.recommended ? 'border-green-400 ring-2 ring-green-200' :
                      'border-transparent'
                    }`}
                    onClick={() => startPractice(topic)}
                  >
                    <div className="p-6 text-white relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <Badge className="bg-white/20 text-white flex items-center gap-1.5 backdrop-blur-xl">
                            <Sparkles className="w-3 h-3" />
                            AI Powered
                          </Badge>
                          <div className="flex gap-2">
                            {topic.needsFocus && (
                              <Badge className="bg-orange-500 text-white animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Focus
                              </Badge>
                            )}
                            {topic.recommended && !topic.needsFocus && (
                              <Badge className="bg-green-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                            {topic.progress >= 80 && <Award className="w-5 h-5 text-yellow-300" />}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-4 leading-tight">{topic.name}</h3>
                        {topic.progress > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span className="font-bold">{topic.progress}%</span>
                            </div>
                            <Progress value={topic.progress} className="h-2 bg-white/20 mb-2" />
                            {topic.accuracy > 0 && (
                              <p className="text-sm">
                                Accuracy: <span className={`font-bold ${topic.accuracy >= 70 ? 'text-green-200' : 'text-yellow-200'}`}>
                                  {topic.accuracy}%
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center flex-1">
                          <div className="text-4xl font-black text-indigo-900 mb-1">
                            {topic.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-600">Available</div>
                        </div>
                        {topic.accuracy > 0 && (
                          <div className="text-center flex-1 border-l border-gray-200">
                            <div className={`text-4xl font-black ${accuracyColor} mb-1`}>
                              {topic.accuracy}%
                            </div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                        )}
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="font-bold text-green-600">{topic.difficulties.easy}</p>
                            <p className="text-gray-600">Easy</p>
                          </div>
                          <div>
                            <p className="font-bold text-yellow-600">{topic.difficulties.medium}</p>
                            <p className="text-gray-600">Medium</p>
                          </div>
                          <div>
                            <p className="font-bold text-red-600">{topic.difficulties.hard}</p>
                            <p className="text-gray-600">Hard</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className={`w-full h-12 text-base font-semibold text-white ${
                          topic.needsFocus 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800'
                        }`}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {topic.needsFocus ? 'Improve Now' : 
                         topic.recommended ? 'Continue Practice' : 
                         'Start AI Practice'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
