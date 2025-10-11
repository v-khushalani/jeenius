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
  BookOpen, BarChart3, Play
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
        'Physics': { icon: Target, emoji: '⚡', color: 'from-blue-500 to-indigo-600', bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-200' },
        'Chemistry': { icon: Beaker, emoji: '🧪', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' },
        'Mathematics': { icon: Calculator, emoji: '🔢', color: 'from-purple-500 to-pink-600', bgColor: 'from-purple-50 to-pink-50', borderColor: 'border-purple-200' },
        'Biology': { icon: Activity, emoji: '🧬', color: 'from-orange-500 to-red-600', bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-200' }
      };

      const subjectsData = uniqueSubjects.map(subject => {
        const subjectQuestions = data?.filter(q => q.subject === subject) || [];
        const difficulties = {
          easy: subjectQuestions.filter(q => q.difficulty === 'Easy').length,
          medium: subjectQuestions.filter(q => q.difficulty === 'Medium').length,
          hard: subjectQuestions.filter(q => q.difficulty === 'Hard').length
        };
        const subjectAccuracy = userPerformance.subjectStats[subject]?.accuracy || 0;

        return {
          name: subject, ...subjectConfig[subject], totalQuestions: subjectQuestions.length,
          difficulties, accuracy: subjectAccuracy,
          attempted: userPerformance.subjectStats[subject]?.total || 0
        };
      });

      setSubjects(subjectsData);
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
          progress: userProgress, accuracy: chapterAccuracy, difficulties
        };
      });

      setChapters(chaptersData);
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
        let topicAccuracy = 0;
        if (topicAttempts.length > 0) {
          const correct = topicAttempts.filter(a => a.is_correct).length;
          topicAccuracy = Math.round((correct / topicAttempts.length) * 100);
        }

        return {
          name: topic, sequence: index + 1, totalQuestions: topicQs.length,
          accuracy: topicAccuracy, difficulties
        };
      });

      setTopics(topicsData);
      setSelectedChapter(chapter);
      setView('topics');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startPractice = async (topic) => {
    try {
      const { data, error } = await supabase.from('questions').select('*')
        .eq('subject', selectedSubject).eq('chapter', selectedChapter).eq('topic', topic.name).limit(20);
      
      if (error) throw error;
      if (!data || data.length === 0) {
        alert('No questions available!');
        return;
      }
      
      const shuffled = data.sort(() => Math.random() - 0.5);
      setPracticeQuestions(shuffled);
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
    const isCorrect = answer === question.correct_option;
    
    if (user && sessionStats.startTime) {
      const timeElapsed = Math.floor((new Date().getTime() - new Date(sessionStats.startTime).getTime()) / 1000);
      await supabase.from('question_attempts').insert({
        user_id: user.id, question_id: question.id, selected_option: answer,
        is_correct: isCorrect, time_taken: timeElapsed
      });
    }
    
    setSessionStats(prev => ({
      ...prev, 
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1, 
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSessionStats(prev => ({ ...prev, startTime: new Date() }));
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      alert(`🎉 Session Completed!\n\n✅ Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n🔥 Streak: ${sessionStats.streak}\n\n${
        accuracy >= 90 ? '🌟 Outstanding!' : accuracy >= 75 ? '💪 Great job!' : accuracy >= 60 ? '📈 Good progress!' : '📚 Keep learning!'
      }`);
      await loadUserPerformance();
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // PRACTICE MODE
  if (view === 'practice' && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            
            {/* Progress Header */}
            <Card className="mb-6 border-2 border-primary/20 shadow-xl bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      Question {currentQuestionIndex + 1}/{practiceQuestions.length}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {selectedSubject} • {selectedChapter}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionStats.correct}/{sessionStats.total}
                      </div>
                      <div className="text-xs text-gray-500">Correct</div>
                    </div>
                    {sessionStats.streak > 2 && (
                      <Badge className="bg-orange-500 text-white animate-pulse">
                        <Flame className="w-3 h-3 mr-1" />
                        {sessionStats.streak}
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="border-2 border-primary/20 shadow-xl bg-white mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                      {currentQuestionIndex + 1}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 flex-1">{question.question}</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_option;
                    
                    let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass += 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50';
                      } else if (isSelected) {
                        buttonClass += 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50';
                      } else {
                        buttonClass += 'border-gray-200 opacity-50';
                      }
                    } else {
                      buttonClass += isSelected 
                        ? 'border-primary bg-gradient-to-r from-blue-50 to-indigo-50' 
                        : 'border-gray-300 hover:border-primary/50 hover:bg-blue-50/30';
                    }

                    return (
                      <button 
                        key={key} 
                        onClick={() => handleAnswer(letter)} 
                        disabled={showResult}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-md ${
                              showResult && isCorrect ? 'bg-green-500 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                              isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {letter}
                            </div>
                            <span className="text-base font-medium text-gray-900">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && question.explanation && (
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-bold text-primary mb-2">Explanation</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // SUBJECTS VIEW
  if (view === 'subjects') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Study Now</h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                AI-Powered adaptive learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Card 
                    key={subject.name}
                    onClick={() => loadChapters(subject.name)}
                    className={`group cursor-pointer hover:scale-105 transition-all duration-300 border-2 ${subject.borderColor} shadow-lg hover:shadow-xl overflow-hidden`}
                  >
                    <div className={`p-6 text-center bg-gradient-to-br ${subject.bgColor}`}>
                      <div className="text-5xl mb-3">{subject.emoji}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                      <Badge className="bg-white/80 text-gray-700">AI Powered</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{subject.totalQuestions}</div>
                          <div className="text-xs text-gray-500">Questions</div>
                        </div>
                        {subject.attempted > 0 && (
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              subject.accuracy >= 80 ? 'text-green-600' : 
                              subject.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {Math.round(subject.accuracy)}%
                            </div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <div className="font-bold text-green-600">{subject.difficulties.easy}</div>
                            <div className="text-gray-600">Easy</div>
                          </div>
                          <div>
                            <div className="font-bold text-yellow-600">{subject.difficulties.medium}</div>
                            <div className="text-gray-600">Medium</div>
                          </div>
                          <div>
                            <div className="font-bold text-red-600">{subject.difficulties.hard}</div>
                            <div className="text-gray-600">Hard</div>
                          </div>
                        </div>
                      </div>

                      <Button className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90 text-white font-semibold`}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Practicing
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

  // CHAPTERS VIEW
  if (view === 'chapters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Button variant="outline" onClick={() => setView('subjects')} className="mb-8 border-2 border-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>

            <div className="mb-8 text-center">
              <Badge className="bg-primary text-white text-lg px-4 py-2 mb-4">
                {selectedSubject}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map((chapter) => (
                <Card 
                  key={chapter.name}
                  onClick={() => loadTopics(chapter.name)}
                  className="group cursor-pointer hover:scale-105 transition-all border-2 border-primary/20 shadow-lg hover:shadow-xl"
                >
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-blue-50">
                    <Badge className="mb-2">Chapter {chapter.sequence}</Badge>
                    <h3 className="font-bold text-lg text-gray-900">{chapter.name}</h3>
                    {chapter.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={chapter.progress} className="h-1.5 mb-1" />
                        <p className="text-xs text-gray-600">Progress: {chapter.progress}%</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{chapter.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      {chapter.accuracy > 0 && (
                        <div className="text-center">
                          <div className={`text-xl font-bold ${
                            chapter.accuracy >= 80 ? 'text-green-600' : 
                            chapter.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {chapter.accuracy}%
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Explore Topics
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TOPICS VIEW
  if (view === 'topics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Button variant="outline" onClick={() => setView('chapters')} className="mb-8 border-2 border-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>

            <div className="mb-8 text-center">
              <Badge className="bg-primary text-white text-lg px-4 py-2 mb-2">
                {selectedSubject} • {selectedChapter}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <Card 
                  key={topic.name}
                  onClick={() => startPractice(topic)}
                  className="group cursor-pointer hover:scale-105 transition-all border-2 border-purple-200 shadow-lg hover:shadow-xl"
                >
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.name}</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{topic.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                      {topic.accuracy > 0 && (
                        <div className="text-center">
                          <div className={`text-xl font-bold ${
                            topic.accuracy >= 80 ? 'text-green-600' : 
                            topic.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {topic.accuracy}%
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <div className="font-bold text-green-600">{topic.difficulties.easy}</div>
                          <div className="text-gray-600">Easy</div>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-600">{topic.difficulties.medium}</div>
                          <div className="text-gray-600">Med</div>
                        </div>
                        <div>
                          <div className="font-bold text-red-600">{topic.difficulties.hard}</div>
                          <div className="text-gray-600">Hard</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold">
                      <Zap className="w-4 h-4
