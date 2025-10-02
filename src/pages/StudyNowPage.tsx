import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Target, Beaker, Calculator, Activity, ChevronRight,
  Star, Lock, CheckCircle2, Zap, Trophy, Flame,
  ArrowLeft, Lightbulb, XCircle, Clock, Award
} from "lucide-react";

const StudyNowPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('subjects'); // subjects, chapters, topics, practice
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
  const [levelProgress, setLevelProgress] = useState({});

  useEffect(() => {
    if (user) loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject');

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectConfig = {
        'Physics': { icon: Target, gradient: 'from-blue-500 to-cyan-500', emoji: '⚡' },
        'Chemistry': { icon: Beaker, gradient: 'from-green-500 to-emerald-500', emoji: '🧪' },
        'Mathematics': { icon: Calculator, gradient: 'from-purple-500 to-pink-500', emoji: '🔢' },
        'Biology': { icon: Activity, gradient: 'from-red-500 to-rose-500', emoji: '🧬' }
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

          // Load user progress for each level
          let levelStatus = { 1: 0, 2: 0, 3: 0 }; // 0=locked, 1=unlocked, 2=completed
          
          if (user) {
            for (let level = 1; level <= 3; level++) {
              const difficulty = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
              
              const { data: levelQs } = await supabase
                .from('questions')
                .select('id')
                .eq('subject', selectedSubject)
                .eq('chapter', chapter)
                .eq('topic', topic)
                .eq('difficulty', difficulty);

              const { data: attempts } = await supabase
                .from('question_attempts')
                .select('is_correct')
                .eq('user_id', user.id)
                .in('question_id', levelQs?.map(q => q.id) || []);

              if (attempts && attempts.length >= 10) {
                const accuracy = (attempts.filter(a => a.is_correct).length / attempts.length) * 100;
                levelStatus[level] = accuracy >= 75 ? 2 : 1;
              } else if (level === 1 || levelStatus[level - 1] === 2) {
                levelStatus[level] = 1; // Unlocked
              }
            }
          } else {
            levelStatus[1] = 1; // First level always unlocked
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

  const startPractice = async (topic, level) => {
    const difficulty = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('chapter', selectedChapter)
        .eq('topic', topic.name)
        .eq('difficulty', difficulty)
        .limit(15);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('No questions available for this level');
        return;
      }

      setPracticeQuestions(data);
      setSelectedTopic(topic);
      setCurrentLevel(level);
      setCurrentQuestionIndex(0);
      setSessionStats({ correct: 0, total: 0, streak: 0 });
      setSelectedAnswer(null);
      setShowResult(false);
      setView('practice');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load questions');
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
      // Session complete
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      const passed = accuracy >= 75;

      if (passed) {
        alert(`🎉 Level ${currentLevel} Completed!\n\nScore: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n\n${currentLevel < 3 ? 'Next level unlocked!' : 'Topic Mastered! 🏆'}`);
      } else {
        alert(`📚 Keep Practicing!\n\nScore: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n\nNeed 75%+ to unlock next level`);
      }

      // Reload topics to update progress
      await loadTopics(selectedChapter);
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <Zap className="w-16 h-16 text-purple-600 mx-auto" />
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading your learning adventure...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Fun Header */}
            <Card className="mb-4 border-0 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-white/20 text-white">Level {currentLevel}</Badge>
                      <span className="text-sm opacity-90">{selectedTopic?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black">{sessionStats.correct}/{sessionStats.total}</span>
                      {sessionStats.streak > 2 && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1 animate-pulse">
                          <Flame className="w-3 h-3" />
                          {sessionStats.streak} Streak!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black">{accuracy.toFixed(0)}%</div>
                    <div className="text-xs opacity-90">Accuracy</div>
                  </div>
                </div>
                <Progress value={progress} className="mt-3 h-2 bg-white/30" />
                <p className="text-xs mt-1 opacity-75">Question {currentQuestionIndex + 1} of {practiceQuestions.length}</p>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="shadow-2xl border-0">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className={`${
                    currentLevel === 1 ? 'bg-green-500' :
                    currentLevel === 2 ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white text-sm px-3 py-1`}>
                    {currentLevel === 1 ? '🟢 Easy' : currentLevel === 2 ? '🟡 Medium' : '🔴 Hard'}
                  </Badge>
                </div>

                <h2 className="text-2xl font-bold mb-8 text-gray-900 leading-relaxed">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_answer;
                    
                    let btnClass = 'w-full text-left p-5 rounded-2xl border-2 transition-all transform ';
                    
                    if (showResult) {
                      if (isCorrect) {
                        btnClass += 'border-green-500 bg-green-50 scale-105';
                      } else if (isSelected) {
                        btnClass += 'border-red-500 bg-red-50';
                      } else {
                        btnClass += 'border-gray-200 opacity-40';
                      }
                    } else {
                      btnClass += isSelected 
                        ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 hover:scale-102';
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswer(letter)}
                        disabled={showResult}
                        className={btnClass}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              showResult && isCorrect ? 'bg-green-500 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                              isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100'
                            }`}>
                              {letter}
                            </div>
                            <span className="text-lg">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResult && question.explanation && (
                  <div className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2">💡 Explanation</p>
                        <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Button */}
                {showResult && (
                  <Button 
                    onClick={nextQuestion}
                    size="lg"
                    className="w-full mt-6 h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {currentQuestionIndex < practiceQuestions.length - 1 ? (
                      <>Next Question <ChevronRight className="w-5 h-5 ml-2" /></>
                    ) : (
                      <>Finish Level <Trophy className="w-5 h-5 ml-2" /></>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="ghost" 
              onClick={() => setView('topics')}
              className="mt-4 w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-gray-900 mb-3">
                Choose Your Subject 🚀
              </h1>
              <p className="text-xl text-gray-600">
                Master topics level by level with instant feedback
              </p>
            </div>

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
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        {subject.emoji}
                      </div>
                      <Icon className="w-12 h-12 mx-auto mb-3 opacity-80" />
                      <h3 className="text-2xl font-bold">{subject.name}</h3>
                    </div>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-black text-gray-900 mb-1">
                        {subject.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600">Questions Ready</div>
                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setView('subjects')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>

            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                {selectedSubject} Chapters 📚
              </h1>
              <p className="text-gray-600">Select a chapter to explore topics</p>
            </div>

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
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-white/20 text-white">
                        Chapter {chapter.sequence}
                      </Badge>
                      {!chapter.isUnlocked && <Lock className="w-5 h-5" />}
                      {chapter.progress >= 100 && <Trophy className="w-6 h-6 text-yellow-300" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{chapter.name}</h3>
                    {chapter.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-bold">{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} className="h-2 bg-white/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {chapter.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Total Questions</div>
                    <Button 
                      disabled={!chapter.isUnlocked}
                      className="w-full"
                    >
                      {chapter.isUnlocked ? 'Explore Topics' : 'Locked'}
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setView('chapters')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>

            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                {selectedChapter} 🎯
              </h1>
              <p className="text-gray-600">Complete each level to unlock the next</p>
            </div>

            <div className="space-y-6">
              {topics.map((topic) => (
                <Card key={topic.name} className="border-0 shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {topic.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            {topic.difficulties.easy} Easy
                          </Badge>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            {topic.difficulties.medium} Medium
                          </Badge>
                          <Badge variant="outline" className="text-red-600 border-red-300">
                            {topic.difficulties.hard} Hard
                          </Badge>
                        </div>
                      </div>
                      {topic.levelStatus[3] === 2 && (
                        <Award className="w-10 h-10 text-yellow-500" />
                      )}
                    </div>

                    {/* Level Progression */}
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((level) => {
                        const status = topic.levelStatus[level];
                        const isLocked = status === 0;
                        const isCompleted = status === 2;
                        const isUnlocked = status === 1;

                        return (
                          <Card 
                            key={level}
                            className={`${
                              isLocked ? 'opacity-50 cursor-not-allowed' :
                              'cursor-pointer hover:scale-105 hover:shadow-lg'
                            } transition-all border-2 ${
                              isCompleted ? 'border-green-500 bg-green-50' :
                              isUnlocked ? 'border-purple-300' : 'border-gray-200'
                            }`}
                            onClick={() => !isLocked && startPractice(topic, level)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-green-500' :
                                isUnlocked ? 'bg-purple-500' : 'bg-gray-300'
                              }`}>
                                {isLocked ? (
                                  <Lock className="w-8 h-8 text-white" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="w-8 h-8 text-white" />
                                ) : (
                                  <Star className="w-8 h-8 text-white" />
                                )}
                              </div>
                              <div className="font-bold text-lg mb-1">Level {level}</div>
                              <div className={`text-sm ${
                                level === 1 ? 'text-green-600' :
                                level === 2 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {level === 1 ? '🟢 Easy' : level === 2 ? '🟡 Medium' : '🔴 Hard'}
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                {isCompleted ? '✅ Mastered' : isUnlocked ? '▶️ Start' : '🔒 Locked'}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Topic Progress</span>
                        <span className="font-semibold text-purple-600">
                          {Object.values(topic.levelStatus).filter(s => s === 2).length}/3 Levels
                        </span>
                      </div>
                      <Progress 
                        value={(Object.values(topic.levelStatus).filter(s => s === 2).length / 3) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Instructions Card */}
            <Card className="mt-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  How It Works
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">1️⃣</span>
                    <p><strong>Start with Level 1 (Easy)</strong> - Complete 15 questions with 75%+ accuracy</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">2️⃣</span>
                    <p><strong>Unlock Level 2 (Medium)</strong> - Progress to harder questions automatically</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">3️⃣</span>
                    <p><strong>Master Level 3 (Hard)</strong> - Prove your expertise and earn mastery badge!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
