import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain, Target, Beaker, Calculator, Activity, ChevronRight,
  Star, Lock, CheckCircle2, Trophy, Flame,
  ArrowLeft, Lightbulb, XCircle, Award
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
  const [currentLevel, setCurrentLevel] = useState(1);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, streak: 0 });
  const [userPerformance, setUserPerformance] = useState({ recentAccuracy: 0, totalAttempts: 0 });

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
        .select('is_correct')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (attempts && attempts.length > 0) {
        const correct = attempts.filter(a => a.is_correct).length;
        const accuracy = (correct / attempts.length) * 100;
        setUserPerformance({
          recentAccuracy: accuracy,
          totalAttempts: attempts.length
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
        .select('subject');

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectConfig = {
        'Physics': { icon: Target, gradient: 'from-blue-600 to-indigo-600', emoji: '⚡' },
        'Chemistry': { icon: Beaker, gradient: 'from-green-600 to-emerald-600', emoji: '🧪' },
        'Mathematics': { icon: Calculator, gradient: 'from-purple-600 to-pink-600', emoji: '🔢' },
        'Biology': { icon: Activity, gradient: 'from-red-600 to-rose-600', emoji: '🧬' }
      };

      const subjectsData = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject);

          return {
            name: subject,
            ...subjectConfig[subject],
            totalQuestions: count || 0
          };
        })
      );

      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const loadChapters = async (subject) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('chapter')
        .eq('subject', subject);

      if (error) throw error;

      const uniqueChapters = [...new Set(data?.map(q => q.chapter) || [])];
      
      const chaptersData = await Promise.all(
        uniqueChapters.map(async (chapter, index) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject)
            .eq('chapter', chapter);

          let userProgress = 0;
          if (user) {
            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id')
              .eq('user_id', user.id);

            const { data: chapterQs } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', subject)
              .eq('chapter', chapter);

            const chapterQIds = chapterQs?.map(q => q.id) || [];
            const attempted = attempts?.filter(a => chapterQIds.includes(a.question_id)).length || 0;
            userProgress = Math.round((attempted / (count || 1)) * 100);
          }

          return {
            name: chapter,
            sequence: index + 1,
            totalQuestions: count || 0,
            progress: userProgress,
            isUnlocked: index === 0 || userProgress > 0
          };
        })
      );

      setChapters(chaptersData.sort((a, b) => a.sequence - b.sequence));
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
          const topicQuestions = data?.filter(q => q.topic === topic) || [];
          const difficulties = {
            easy: topicQuestions.filter(q => q.difficulty?.toLowerCase() === 'easy').length,
            medium: topicQuestions.filter(q => q.difficulty?.toLowerCase() === 'medium').length,
            hard: topicQuestions.filter(q => q.difficulty?.toLowerCase() === 'hard').length
          };

          let levelStatus = { 1: 0, 2: 0, 3: 0 };
          
          if (user) {
            for (let level = 1; level <= 3; level++) {
              const difficulty = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
              
              const { data: levelQs } = await supabase
                .from('questions')
                .select('id')
                .eq('subject', selectedSubject)
                .eq('chapter', chapter)
                .eq('topic', topic)
                .ilike('difficulty', difficulty);

              const levelQIds = levelQs?.map(q => q.id) || [];
              
              const { data: attempts } = await supabase
                .from('question_attempts')
                .select('is_correct')
                .eq('user_id', user.id)
                .in('question_id', levelQIds);

              if (attempts && attempts.length >= 10) {
                const accuracy = (attempts.filter(a => a.is_correct).length / attempts.length) * 100;
                levelStatus[level] = accuracy >= 75 ? 2 : 1;
              } else if (level === 1 || levelStatus[level - 1] === 2) {
                levelStatus[level] = 1;
              }
            }
          } else {
            levelStatus[1] = 1;
          }

          return {
            name: topic,
            sequence: index + 1,
            difficulties,
            levelStatus,
            totalLevels: 3,
            isUnlocked: index === 0 || Object.values(levelStatus).some(s => s > 0)
          };
        })
      );

      setTopics(topicsData.sort((a, b) => a.sequence - b.sequence));
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

  const startPractice = async (topic, level) => {
    const difficulty = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
    const questionCount = getAdaptiveQuestionCount();
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('chapter', selectedChapter)
        .eq('topic', topic.name)
        .ilike('difficulty', difficulty)
        .limit(questionCount);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        alert('No questions available for this level. Try another topic!');
        return;
      }

      console.log(`Loaded ${data.length} questions for ${topic.name} - Level ${level}`);

      setPracticeQuestions(data);
      setSelectedTopic(topic);
      setCurrentLevel(level);
      setCurrentQuestionIndex(0);
      setSessionStats({ correct: 0, total: 0, streak: 0 });
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

    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    if (user) {
      await supabase.from('question_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: answer,
        is_correct: isCorrect,
        time_taken: 30
      });
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      const passed = accuracy >= 75;

      if (passed) {
        alert(`🎉 Level ${currentLevel} Completed!\n\nScore: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n\n${currentLevel < 3 ? '✨ Next level unlocked!' : '🏆 Topic Mastered!'}`);
      } else {
        alert(`📚 Keep Practicing!\n\nScore: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n\n75%+ needed to unlock next level`);
      }

      await loadUserPerformance();
      await loadTopics(selectedChapter);
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse mx-auto">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">JEENIUS</h1>
          <p className="text-gray-600 text-lg">Loading your learning journey...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-4 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/30 text-white text-sm">Level {currentLevel}</Badge>
                      <span className="text-sm opacity-90">{selectedTopic?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black">{sessionStats.correct}/{sessionStats.total}</span>
                      {sessionStats.streak > 2 && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1 animate-pulse">
                          <Flame className="w-4 h-4" />
                          {sessionStats.streak} Streak!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black">{accuracy.toFixed(0)}%</div>
                    <div className="text-sm opacity-90">Accuracy</div>
                  </div>
                </div>
                <Progress value={progress} className="h-3 bg-white/30" />
                <p className="text-sm mt-2 opacity-90">Question {currentQuestionIndex + 1} of {practiceQuestions.length}</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-0">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className={`${
                    currentLevel === 1 ? 'bg-green-600' :
                    currentLevel === 2 ? 'bg-yellow-600' : 'bg-red-600'
                  } text-white text-sm px-4 py-2`}>
                    {currentLevel === 1 ? '🟢 Easy' : currentLevel === 2 ? '🟡 Medium' : '🔴 Hard'}
                  </Badge>
                </div>

                <h2 className="text-3xl font-bold mb-8 text-gray-900 leading-relaxed">
                  {question.question}
                </h2>

                <div className="space-y-4">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_answer;
                    
                    let btnClass = 'w-full text-left p-6 rounded-2xl border-3 transition-all transform hover:scale-[1.02] ';
                    
                    if (showResult) {
                      if (isCorrect) {
                        btnClass += 'border-green-600 bg-green-50 scale-[1.02] shadow-lg';
                      } else if (isSelected) {
                        btnClass += 'border-red-600 bg-red-50';
                      } else {
                        btnClass += 'border-gray-200 opacity-40';
                      }
                    } else {
                      btnClass += isSelected 
                        ? 'border-blue-600 bg-blue-50 shadow-xl scale-[1.02]' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50';
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswer(letter)}
                        disabled={showResult}
                        className={btnClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              showResult && isCorrect ? 'bg-green-600 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {letter}
                            </div>
                            <span className="text-lg font-medium">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-7 h-7 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-7 h-7 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && question.explanation && (
                  <div className="mt-6 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2 text-lg">💡 Explanation</p>
                        <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showResult && (
                  <Button 
                    onClick={nextQuestion}
                    size="lg"
                    className="w-full mt-6 h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  >
                    {currentQuestionIndex < practiceQuestions.length - 1 ? (
                      <>Next Question <ChevronRight className="w-6 h-6 ml-2" /></>
                    ) : (
                      <>Finish Level <Trophy className="w-6 h-6 ml-2" /></>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="ghost" 
              onClick={() => setView('topics')}
              className="mt-4 w-full"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Topics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SUBJECTS VIEW
  if (view === 'subjects') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Card 
                    key={subject.name}
                    onClick={() => loadChapters(subject.name)}
                    className="cursor-pointer hover:scale-105 transition-all shadow-xl border-0 overflow-hidden group"
                  >
                    <div className={`bg-gradient-to-br ${subject.gradient} p-8 text-white text-center`}>
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                        {subject.emoji}
                      </div>
                      <Icon className="w-12 h-12 mx-auto mb-3 opacity-90" />
                      <h3 className="text-2xl font-bold">{subject.name}</h3>
                    </div>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-black text-gray-900 mb-2">
                        {subject.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">Questions</div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base font-semibold">
                        Start Learning
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setView('subjects')}
              className="mb-6"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <Card 
                  key={chapter.name}
                  onClick={() => chapter.isUnlocked && loadTopics(chapter.name)}
                  className={`${
                    chapter.isUnlocked 
                      ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' 
                      : 'opacity-50 cursor-not-allowed'
                  } transition-all border-0 shadow-xl`}
                >
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-white/30 text-white">
                        Chapter {chapter.sequence}
                      </Badge>
                      {!chapter.isUnlocked && <Lock className="w-6 h-6" />}
                      {chapter.progress >= 100 && <Trophy className="w-7 h-7 text-yellow-300" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{chapter.name}</h3>
                    {chapter.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className="font-bold">{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} className="h-2 bg-white/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {chapter.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Questions</div>
                    <Button 
                      disabled={!chapter.isUnlocked}
                      className="w-full h-12 text-base font-semibold"
                    >
                      {chapter.isUnlocked ? 'Explore Topics' : 'Locked'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Adaptive Learning Info */}
            <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Adaptive Learning Active</h3>
                    <p className="text-sm text-gray-600">
                      {userPerformance.recentAccuracy >= 85 
                        ? '🔥 Excellent! Optimized to 10 questions per level'
                        : userPerformance.recentAccuracy >= 70
                        ? '✨ Good pace! 15 questions per level'
                        : '📚 Building foundation with 20 questions per level'
                      }
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">75%+</div>
                    <div className="text-gray-600">Required to unlock</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{userPerformance.recentAccuracy.toFixed(0)}%</div>
                    <div className="text-gray-600">Your accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{userPerformance.totalAttempts}</div>
                    <div className="text-gray-600">Total attempts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // TOPICS VIEW
  if (view === 'topics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setView('chapters')}
              className="mb-6"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <div className="space-y-6">
              {topics.map((topic) => (
                <Card key={topic.name} className="border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {topic.name}
                        </h3>
                        <div className="flex gap-3">
                          <Badge variant="outline" className="text-green-700 border-green-400 text-sm">
                            {topic.difficulties.easy} Easy
                          </Badge>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-400 text-sm">
                            {topic.difficulties.medium} Medium
                          </Badge>
                          <Badge variant="outline" className="text-red-700 border-red-400 text-sm">
                            {topic.difficulties.hard} Hard
                          </Badge>
                        </div>
                      </div>
                      {topic.levelStatus[3] === 2 && (
                        <Award className="w-12 h-12 text-yellow-500" />
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[1, 2, 3].map((level) => {
                        const status = topic.levelStatus[level];
                        const isLocked = status === 0;
                        const isCompleted = status === 2;

                        return (
                          <Card 
                            key={level}
                            className={`${
                              isLocked ? 'opacity-50 cursor-not-allowed' :
                              'cursor-pointer hover:scale-105 hover:shadow-xl'
                            } transition-all border-2 ${
                              isCompleted ? 'border-green-600 bg-green-50' :
                              'border-blue-300'
                            }`}
                            onClick={() => !isLocked && startPractice(topic, level)}
                          >
                            <CardContent className="p-6 text-center">
                              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                                isCompleted ? 'bg-green-600' :
                                isLocked ? 'bg-gray-300' : 'bg-blue-600'
                              }`}>
                                {isLocked ? (
                                  <Lock className="w-10 h-10 text-white" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="w-10 h-10 text-white" />
                                ) : (
                                  <Star className="w-10 h-10 text-white" />
                                )}
                              </div>
                              <div className="font-bold text-xl mb-2">Level {level}</div>
                              <div className={`text-base font-semibold ${
                                level === 1 ? 'text-green-700' :
                                level === 2 ? 'text-yellow-700' : 'text-red-700'
                              }`}>
                                {level === 1 ? '🟢 Easy' : level === 2 ? '🟡 Medium' : '🔴 Hard'}
                              </div>
                              <div className="text-sm text-gray-600 mt-3 font-medium">
                                {isCompleted ? '✅ Completed' : isLocked ? '🔒 Locked' : '▶️ Start'}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-blue-600">
                          {Object.values(topic.levelStatus).filter(s => s === 2).length}/3 Complete
                        </span>
                      </div>
                      <Progress 
                        value={(Object.values(topic.levelStatus).filter(s => s === 2).length / 3) * 100} 
                        className="h-3"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
