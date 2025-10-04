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
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar { width: 8px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
        .select('is_correct, created_at, questions(subject)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (attempts && attempts.length > 0) {
        const recent50 = attempts.slice(0, 50);
        const correct = recent50.filter(a => a.is_correct).length;
        const accuracy = (correct / recent50.length) * 100;
        
        const subjectStats = {};
        attempts?.forEach(attempt => {
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

        setUserPerformance({ recentAccuracy: accuracy, totalAttempts: attempts.length, subjectStats });
      }
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('questions').select('subject, difficulty');
      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectConfig = {
        'Physics': { icon: Target, emoji: '⚡', color: 'from-blue-500 to-indigo-600' },
        'Chemistry': { icon: Beaker, emoji: '🧪', color: 'from-green-500 to-emerald-600' },
        'Mathematics': { icon: Calculator, emoji: '🔢', color: 'from-purple-500 to-pink-600' },
        'Biology': { icon: Activity, emoji: '🧬', color: 'from-orange-500 to-red-600' }
      };

      const subjectsData = uniqueSubjects.map(subject => {
        const subjectQuestions = data?.filter(q => q.subject === subject) || [];
        const difficulties = {
          easy: subjectQuestions.filter(q => q.difficulty === 'Easy').length,
          medium: subjectQuestions.filter(q => q.difficulty === 'Medium').length,
          hard: subjectQuestions.filter(q => q.difficulty === 'Hard').length
        };
        const subjectAccuracy = userPerformance.subjectStats[subject]?.accuracy || 0;
        const needsFocus = subjectAccuracy < 70 && userPerformance.subjectStats[subject]?.total > 10;

        return {
          name: subject, ...subjectConfig[subject], totalQuestions: subjectQuestions.length,
          difficulties, accuracy: subjectAccuracy, needsFocus,
          attempted: userPerformance.subjectStats[subject]?.total || 0
        };
      });

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
      const { data, error } = await supabase.from('questions').select('id, chapter, difficulty').eq('subject', subject);
      if (error) throw error;

      const subjectQuestions = data || [];
      const uniqueChapters = [...new Set(subjectQuestions.map(q => q.chapter))];
      
      let allAttempts = [];
      if (user) {
        const questionIds = subjectQuestions.map(q => q.id);
        const { data: attempts } = await supabase.from('question_attempts')
          .select('question_id, is_correct').eq('user_id', user.id).in('question_id', questionIds);
        allAttempts = attempts || [];
      }

      const chaptersData = uniqueChapters.map((chapter, index) => {
        const chapterQs = subjectQuestions.filter(q => q.chapter === chapter);
        const difficulties = {
          easy: chapterQs.filter(q => q.difficulty === 'Easy').length,
          medium: chapterQs.filter(q => q.difficulty === 'Medium').length,
          hard: chapterQs.filter(q => q.difficulty === 'Hard').length
        };
        const chapterQIds = chapterQs.map(q => q.id);
        const chapterAttempts = allAttempts.filter(a => chapterQIds.includes(a.question_id));
        const attempted = chapterAttempts.length;
        const userProgress = Math.round((attempted / chapterQs.length) * 100);
        let chapterAccuracy = 0;
        if (chapterAttempts.length > 0) {
          const correct = chapterAttempts.filter(a => a.is_correct).length;
          chapterAccuracy = Math.round((correct / chapterAttempts.length) * 100);
        }

        return {
          name: chapter, sequence: index + 1, totalQuestions: chapterQs.length,
          progress: userProgress, accuracy: chapterAccuracy, difficulties,
          needsFocus: chapterAccuracy < 70 && userProgress > 30
        };
      });

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
      const { data, error } = await supabase.from('questions')
        .select('id, topic, difficulty').eq('subject', selectedSubject).eq('chapter', chapter);
      if (error) throw error;

      const uniqueTopics = [...new Set(data?.map(q => q.topic) || [])];
      let allAttempts = [];
      if (user && data) {
        const questionIds = data.map(q => q.id);
        const { data: attempts } = await supabase.from('question_attempts')
          .select('question_id, is_correct').eq('user_id', user.id).in('question_id', questionIds);
        allAttempts = attempts || [];
      }

      const topicsData = uniqueTopics.map((topic, index) => {
        const topicQs = data?.filter(q => q.topic === topic) || [];
        const difficulties = {
          easy: topicQs.filter(q => q.difficulty === 'Easy').length,
          medium: topicQs.filter(q => q.difficulty === 'Medium').length,
          hard: topicQs.filter(q => q.difficulty === 'Hard').length
        };
        const topicQIds = topicQs.map(q => q.id);
        const topicAttempts = allAttempts.filter(a => topicQIds.includes(a.question_id));
        const attempted = topicAttempts.length;
        const userProgress = Math.round((attempted / topicQs.length) * 100);
        let topicAccuracy = 0;
        if (topicAttempts.length > 0) {
          const correct = topicAttempts.filter(a => a.is_correct).length;
          topicAccuracy = Math.round((correct / topicAttempts.length) * 100);
        }

        return {
          name: topic, sequence: index + 1, totalQuestions: topicQs.length,
          progress: userProgress, accuracy: topicAccuracy, difficulties,
          needsFocus: topicAccuracy < 70 && userProgress > 20,
          recommended: userProgress === 0 || (topicAccuracy >= 70 && userProgress < 100)
        };
      });

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
      let query = supabase.from('questions').select('*')
        .eq('subject', selectedSubject).eq('chapter', selectedChapter).eq('topic', topic.name);
      if (difficultyFilter !== 'all') query = query.eq('difficulty', difficultyFilter);
      const { data, error } = await query.limit(50);
      if (error) throw error;
      if (!data || data.length === 0) {
        alert(`No ${difficultyFilter !== 'all' ? difficultyFilter : ''} questions available!`);
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
    if (user && sessionStats.startTime) {
      const timeElapsed = Math.floor((new Date().getTime() - new Date(sessionStats.startTime).getTime()) / 1000);
      await supabase.from('question_attempts').insert({
        user_id: user.id, question_id: question.id, selected_option: answer,
        is_correct: isCorrect, time_taken: timeElapsed
      });
    }
    setSessionStats(prev => ({
      ...prev, correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1, streak: isCorrect ? prev.streak + 1 : 0
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
      const totalTime = sessionStats.startTime ? Math.floor((new Date().getTime() - new Date(sessionStats.startTime).getTime()) / 1000 / 60) : 0;
      alert(`🎉 Session Completed!\n\n✅ Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n⏱️ Time: ${totalTime} min\n🔥 Streak: ${sessionStats.streak}\n\n${
        accuracy >= 90 ? '🌟 Outstanding!' : accuracy >= 75 ? '💪 Great job!' : accuracy >= 60 ? '📈 Good progress!' : '📚 Keep learning!'
      }`);
      await loadUserPerformance();
      await loadTopics(selectedChapter);
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-xl animate-pulse mx-auto bg-gradient-to-br from-blue-600 to-indigo-700">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-blue-900">JEEnius</h1>
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
            <p className="text-gray-600 text-sm">Loading AI-powered learning...</p>
          </div>
        </div>
      </div>
    );
  }

  // PRACTICE MODE
  if (view === 'practice' && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0;
    const timeElapsed = sessionStats.startTime ? Math.floor((new Date().getTime() - new Date(sessionStats.startTime).getTime()) / 1000) : 0;

    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 pt-20 pb-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl h-full flex flex-col">
            <Card className="mb-3 border-0 shadow-xl text-white bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-white/20 text-white text-xs flex items-center gap-1 px-2 py-0.5 backdrop-blur-xl">
                        <Sparkles className="w-3 h-3" />AI Adaptive
                      </Badge>
                      <span className="text-xs opacity-90">{selectedSubject} • {selectedChapter}</span>
                      {question.difficulty && (
                        <Badge className={`text-white text-xs ${
                          question.difficulty === 'Easy' ? 'bg-green-500/30' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/30' : 'bg-red-500/30'
                        }`}>{question.difficulty}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-3xl font-black mb-0.5">{sessionStats.correct}/{sessionStats.total}</p>
                        <p className="text-xs opacity-75">Correct</p>
                      </div>
                      {sessionStats.streak > 2 && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1 animate-pulse px-3 py-1">
                          <Flame className="w-4 h-4" />{sessionStats.streak} Streak!
                        </Badge>
                      )}
                      <div className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className={`text-3xl font-black ${
                        accuracy >= 80 ? 'text-green-300' : accuracy >= 60 ? 'text-yellow-300' : 'text-red-300'
                      }`}>{accuracy.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Progress value={progress} className="h-2 bg-white/20" />
                  <div className="flex justify-between text-xs opacity-90">
                    <span>Question {currentQuestionIndex + 1} of {practiceQuestions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white flex-1 overflow-auto">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-lg shrink-0">
                    {currentQuestionIndex + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold leading-snug text-slate-900 flex-1">{question.question}</h2>
                </div>

                <div className="space-y-2 flex-1">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_answer;
                    let btnClass = 'w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all transform hover:scale-[1.01] ';
                    if (showResult) {
                      if (isCorrect) btnClass += 'border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 scale-[1.01] shadow-md';
                      else if (isSelected) btnClass += 'border-red-600 bg-gradient-to-r from-red-50 to-orange-50';
                      else btnClass += 'border-gray-200 opacity-50';
                    } else {
                      btnClass += isSelected ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-[1.01]' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50';
                    }
                    return (
                      <button key={key} onClick={() => handleAnswer(letter)} disabled={showResult} className={btnClass}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-md ${
                              showResult && isCorrect ? 'bg-green-600 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>{letter}</div>
                            <span className="text-sm sm:text-base font-medium text-slate-800">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && question.explanation && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold mb-2 text-base text-blue-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />AI Explanation
                        </p>
                        <p className="leading-relaxed text-slate-700 text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showResult && (
                  <div className="mt-4 flex gap-2">
                    <Button onClick={nextQuestion} size="lg" className="flex-1 h-12 text-base font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                      {currentQuestionIndex < practiceQuestions.length - 1 ? (
                        <>Next <ChevronRight className="w-5 h-5 ml-1" /></>
                      ) : (
                        <>Finish <Trophy className="w-5 h-5 ml-1" /></>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => {
              if (confirm('Exit practice? Progress will be saved.')) setView('topics');
            }} className="mt-3 w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-10 shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />Exit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SUBJECTS VIEW
  if (view === 'subjects') {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 pt-20 pb-4 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex flex-col">
            {subjects.some(s => s.needsFocus) && (
              <Card className="mb-3 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 shadow-lg shrink-0">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-orange-900 mb-1 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />AI: Focus Needed
                      </h3>
                      <p className="text-xs text-slate-700">{subjects.filter(s => s.needsFocus).map(s => s.name).join(', ')} - Accuracy below 70%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => {
                  const Icon = subject.icon;
                  const accuracyColor = subject.accuracy >= 80 ? 'text-green-600' : subject.accuracy >= 60 ? 'text-yellow-600' : subject.accuracy > 0 ? 'text-red-600' : 'text-gray-400';
                  return (
                    <Card key={subject.name} onClick={() => loadChapters(subject.name)} className={`cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg border-2 overflow-hidden group h-fit ${subject.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' : 'border-transparent'}`}>
                      <div className={`p-5 text-white text-center relative overflow-hidden bg-gradient-to-br ${subject.color}`}>
                        {subject.needsFocus && (
                          <Badge className="absolute top-2 right-2 bg-orange-500 text-white animate-pulse text-xs">
                            <AlertTriangle className="w-2 h-2 mr-1" />Focus
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-5xl mb-2">{subject.emoji}</div>
                          <Icon className="w-10 h-10 mx-auto mb-2 opacity-90" />
                          <h3 className="text-lg font-bold mb-1">{subject.name}</h3>
                          <Badge className="bg-white/20 text-white text-xs">AI Powered</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center flex-1">
                            <div className="text-2xl font-black text-blue-900">{subject.totalQuestions}</div>
                            <div className="text-xs text-gray-600">Questions</div>
                          </div>
                          {subject.attempted > 0 && (
                            <div className="text-center flex-1 border-l border-gray-200">
                              <div className={`text-2xl font-black ${accuracyColor}`}>{Math.round(subject.accuracy)}%</div>
                              <div className="text-xs text-gray-600">Accuracy</div>
                            </div>
                          )}
                        </div>
                        <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div><p className="font-bold text-green-600">{subject.difficulties.easy}</p><p className="text-gray-600">Easy</p></div>
                            <div><p className="font-bold text-yellow-600">{subject.difficulties.medium}</p><p className="text-gray-600">Medium</p></div>
                            <div><p className="font-bold text-red-600">{subject.difficulties.hard}</p><p className="text-gray-600">Hard</p></div>
                          </div>
                        </div>
                        <Button className={`w-full h-10 text-sm font-semibold text-white transition-opacity bg-gradient-to-r ${subject.color}`}>
                          {subject.needsFocus ? <><Target className="w-3 h-3 mr-2" />Improve</> : <><BookOpen className="w-3 h-3 mr-2" />Start</>}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {userPerformance.totalAttempts > 0 && (
                <Card className="mt-4 border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-blue-900">AI Adaptive Learning</h3>
                        <p className="text-xs text-slate-700">
                          {userPerformance.recentAccuracy >= 85 ? '🔥 Outstanding performance!' : userPerformance.recentAccuracy >= 70 ? '✨ Great progress!' : '📚 Building foundations'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-blue-600" /><p className="text-xs text-gray-600 font-medium">Accuracy</p></div>
                        <p className="text-2xl font-black text-blue-900">{userPerformance.recentAccuracy.toFixed(0)}%</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-indigo-100">
                        <div className="flex items-center gap-2 mb-1"><BookOpen className="w-4 h-4 text-indigo-600" /><p className="text-xs text-gray-600 font-medium">Questions</p></div>
                        <p className="text-2xl font-black text-indigo-900">{userPerformance.totalAttempts}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-purple-100">
                        <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-purple-600" /><p className="text-xs text-gray-600 font-medium">Status</p></div>
                        <p className="text-sm font-bold text-purple-900">{userPerformance.recentAccuracy >= 85 ? 'Excellent! 🌟' : userPerformance.recentAccuracy >= 70 ? 'Good 📈' : 'Practice 💪'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHAPTERS VIEW
  if (view === 'chapters') {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 pt-20 pb-4 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <Button variant="outline" onClick={() => setView('subjects')} size="sm" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />Back
              </Button>
              <Badge className="bg-blue-600 text-white text-sm px-3 py-1">{selectedSubject}</Badge>
            </div>

            {chapters.some(c => c.needsFocus) && (
              <Card className="mb-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shrink-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-bold text-yellow-900 text-xs mb-0.5">💡 AI Recommendation</p>
                      <p className="text-xs text-slate-700">Focus: {chapters.filter(c => c.needsFocus).map(c => c.name).join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => {
                  const accuracyColor = chapter.accuracy >= 80 ? 'text-green-600' : chapter.accuracy >= 60 ? 'text-yellow-600' : chapter.accuracy > 0 ? 'text-red-600' : 'text-gray-400';
                  return (
                    <Card key={chapter.name} onClick={() => loadTopics(chapter.name)} className={`cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 shadow-lg overflow-hidden group h-fit ${chapter.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' : 'border-transparent'}`}>
                      <div className="p-4 text-white relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className="bg-white/20 text-white backdrop-blur-xl text-xs">Ch. {chapter.sequence}</Badge>
                            <div className="flex gap-1">
                              {chapter.needsFocus && <Badge className="bg-orange-500 text-white animate-pulse text-xs"><AlertTriangle className="w-2 h-2 mr-1" />Focus</Badge>}
                              {chapter.progress >= 80 && <Trophy className="w-4 h-4 text-yellow-300" />}
                            </div>
                          </div>
                          <h3 className="text-base font-bold mb-2 leading-tight">{chapter.name}</h3>
                          {chapter.progress > 0 && (
                            <div>
                              <div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-bold">{chapter.progress}%</span></div>
                              <Progress value={chapter.progress} className="h-1.5 bg-white/20 mb-1" />
                              {chapter.accuracy > 0 && <p className="text-xs">Accuracy: <span className={`font-bold ${chapter.accuracy >= 70 ? 'text-green-200' : 'text-yellow-200'}`}>{chapter.accuracy}%</span></p>}
                            </div>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center flex-1">
                            <div className="text-2xl font-black text-blue-900">{chapter.totalQuestions}</div>
                            <div className="text-xs text-gray-600">Questions</div>
                          </div>
                          {chapter.accuracy > 0 && (
                            <div className="text-center flex-1 border-l border-gray-200">
                              <div className={`text-2xl font-black ${accuracyColor}`}>{chapter.accuracy}%</div>
                              <div className="text-xs text-gray-600">Score</div>
                            </div>
                          )}
                        </div>
                        <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div><p className="font-bold text-green-600">{chapter.difficulties.easy}</p><p className="text-gray-600">Easy</p></div>
                            <div><p className="font-bold text-yellow-600">{chapter.difficulties.medium}</p><p className="text-gray-600">Med</p></div>
                            <div><p className="font-bold text-red-600">{chapter.difficulties.hard}</p><p className="text-gray-600">Hard</p></div>
                          </div>
                        </div>
                        <Button className="w-full h-10 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                          <Sparkles className="w-3 h-3 mr-2" />{chapter.needsFocus ? 'Improve' : 'Explore'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TOPICS VIEW
  if (view === 'topics') {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 pt-20 pb-4 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3 shrink-0">
              <Button variant="outline" onClick={() => setView('chapters')} size="sm" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />Back
              </Button>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white text-xs px-3 py-1">{selectedSubject} • {selectedChapter}</Badge>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="border-2 border-slate-300">
                  <Filter className="w-4 h-4 mr-1" />Filter<ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {showFilters && (
              <Card className="mb-3 border-2 border-blue-200 shadow-md shrink-0">
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Difficulty:</p>
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'Easy', 'Medium', 'Hard'].map(diff => (
                      <Button key={diff} onClick={() => setDifficultyFilter(diff)} size="sm" variant={difficultyFilter === diff ? 'default' : 'outline'} className={`text-xs ${difficultyFilter === diff ? 'bg-blue-600 text-white' : 'border-2 border-blue-300 text-blue-700 hover:bg-blue-50'}`}>
                        {diff === 'all' ? 'All' : diff}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {topics.some(t => t.needsFocus || t.recommended) && (
              <Card className="mb-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 shrink-0">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-900 text-xs mb-1">🤖 AI Recommendations</p>
                      <div className="space-y-0.5 text-xs text-slate-700">
                        {topics.filter(t => t.needsFocus).length > 0 && <p>⚠️ <strong>Focus:</strong> {topics.filter(t => t.needsFocus).map(t => t.name).join(', ')}</p>}
                        {topics.filter(t => t.recommended && !t.needsFocus).length > 0 && <p>✨ <strong>Next:</strong> {topics.filter(t => t.recommended && !t.needsFocus).map(t => t.name).join(', ')}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => {
                  const accuracyColor = topic.accuracy >= 80 ? 'text-green-600' : topic.accuracy >= 60 ? 'text-yellow-600' : topic.accuracy > 0 ? 'text-red-600' : 'text-gray-400';
                  return (
                    <Card key={topic.name} className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden group h-fit ${
                      topic.needsFocus ? 'border-orange-400 ring-2 ring-orange-200' : topic.recommended ? 'border-green-400 ring-2 ring-green-200' : 'border-transparent'
                    }`} onClick={() => startPractice(topic)}>
                      <div className="p-4 text-white relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                            <Badge className="bg-white/20 text-white flex items-center gap-1 backdrop-blur-xl text-xs"><Sparkles className="w-2 h-2" />AI</Badge>
                            <div className="flex gap-1">
                              {topic.needsFocus && <Badge className="bg-orange-500 text-white animate-pulse text-xs"><AlertTriangle className="w-2 h-2 mr-1" />Focus</Badge>}
                              {topic.recommended && !topic.needsFocus && <Badge className="bg-green-500 text-white text-xs"><Star className="w-2 h-2 mr-1" />Next</Badge>}
                              {topic.progress >= 80 && <Award className="w-4 h-4 text-yellow-300" />}
                            </div>
                          </div>
                          <h3 className="text-base font-bold mb-2 leading-tight">{topic.name}</h3>
                          {topic.progress > 0 && (
                            <div>
                              <div className="flex justify-between text-xs mb-1"><span>Progress</span><span className="font-bold">{topic.progress}%</span></div>
                              <Progress value={topic.progress} className="h-1.5 bg-white/20 mb-1" />
                              {topic.accuracy > 0 && <p className="text-xs">Accuracy: <span className={`font-bold ${topic.accuracy >= 70 ? 'text-green-200' : 'text-yellow-200'}`}>{topic.accuracy}%</span></p>}
                            </div>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center flex-1">
                            <div className="text-2xl font-black text-indigo-900">{topic.totalQuestions}</div>
                            <div className="text-xs text-gray-600">Available</div>
                          </div>
                          {topic.accuracy > 0 && (
                            <div className="text-center flex-1 border-l border-gray-200">
                              <div className={`text-2xl font-black ${accuracyColor}`}>{topic.accuracy}%</div>
                              <div className="text-xs text-gray-600">Score</div>
                            </div>
                          )}
                        </div>
                        <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div><p className="font-bold text-green-600">{topic.difficulties.easy}</p><p className="text-gray-600">Easy</p></div>
                            <div><p className="font-bold text-yellow-600">{topic.difficulties.medium}</p><p className="text-gray-600">Med</p></div>
                            <div><p className="font-bold text-red-600">{topic.difficulties.hard}</p><p className="text-gray-600">Hard</p></div>
                          </div>
                        </div>
                        <Button className={`w-full h-10 text-sm font-semibold text-white ${
                          topic.needsFocus ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800'
                        }`}>
                          <Zap className="w-3 h-3 mr-2" />{topic.needsFocus ? 'Improve' : topic.recommended ? 'Continue' : 'Start'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
