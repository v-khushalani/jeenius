import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Brain, Target, BookOpen, Clock, Trophy, 
  PlayCircle, Search, TrendingUp, Zap, Flame,
  Beaker, Calculator, Activity, ChevronRight,
  Star, Award, Crown, Lock, CheckCircle2,
  Lightbulb, BookMarked, GraduationCap, Rocket
} from "lucide-react";

const StudyNowPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadSubjects(),
      loadChapters()
    ]);
    setLoading(false);
  };

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject')
        .order('subject');

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(q => q.subject) || [])];
      const subjectIcons = {
        'Physics': { icon: Target, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
        'Chemistry': { icon: Beaker, color: 'green', gradient: 'from-green-500 to-emerald-500' },
        'Mathematics': { icon: Calculator, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
        'Biology': { icon: Activity, color: 'red', gradient: 'from-red-500 to-rose-500' }
      };

      const subjectsWithData = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('subject', subject);

          return {
            id: subject.toLowerCase(),
            name: subject,
            ...subjectIcons[subject] || { icon: BookOpen, color: 'gray', gradient: 'from-gray-500 to-gray-600' },
            totalQuestions: count || 0
          };
        })
      );

      setSubjects(subjectsWithData);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject, chapter, topic, difficulty');

      if (error) throw error;

      const chapterMap = {};
      data?.forEach(q => {
        const key = `${q.subject}-${q.chapter}`;
        if (!chapterMap[key]) {
          chapterMap[key] = {
            subject: q.subject,
            chapter: q.chapter,
            topics: new Set(),
            questionCount: 0,
            difficulties: { easy: 0, medium: 0, hard: 0 }
          };
        }
        chapterMap[key].topics.add(q.topic);
        chapterMap[key].questionCount++;
        if (q.difficulty) {
          chapterMap[key].difficulties[q.difficulty.toLowerCase()]++;
        }
      });

      const chaptersArray = await Promise.all(
        Object.entries(chapterMap).map(async ([key, value], index) => {
          let userStats = { progress: 0, accuracy: 0, attempted: 0 };
          
          if (user) {
            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id, is_correct')
              .eq('user_id', user.id);

            const { data: chapterQuestions } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', value.subject)
              .eq('chapter', value.chapter);

            const chapterQuestionIds = chapterQuestions?.map(q => q.id) || [];
            const chapterAttempts = attempts?.filter(a => 
              chapterQuestionIds.includes(a.question_id)
            ) || [];

            if (chapterAttempts.length > 0) {
              const correct = chapterAttempts.filter(a => a.is_correct).length;
              userStats.accuracy = Math.round((correct / chapterAttempts.length) * 100);
              userStats.progress = Math.round((chapterAttempts.length / value.questionCount) * 100);
              userStats.attempted = chapterAttempts.length;
            }
          }

          return {
            id: index + 1,
            name: value.chapter,
            subject: value.subject,
            subjectId: value.subject.toLowerCase(),
            topics: Array.from(value.topics),
            questionsCount: value.questionCount,
            difficulties: value.difficulties,
            progress: userStats.progress,
            accuracy: userStats.accuracy,
            attempted: userStats.attempted,
            sequenceNumber: index + 1
          };
        })
      );

      // Sort and apply sequential unlock
      const sortedChapters = chaptersArray.sort((a, b) => 
        a.sequenceNumber - b.sequenceNumber
      );

      sortedChapters.forEach((chapter, index) => {
        if (index === 0) {
          chapter.isUnlocked = true;
        } else {
          const prevChapter = sortedChapters[index - 1];
          chapter.isUnlocked = prevChapter.progress >= 70;
        }
        chapter.isCompleted = chapter.progress >= 100;
      });

      setChapters(sortedChapters);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const startLearning = async (chapter) => {
    if (!user) {
      alert('Please log in to start learning');
      return;
    }

    if (!chapter.isUnlocked) {
      alert('Complete the previous chapter first!');
      return;
    }

    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', chapter.subject)
        .eq('chapter', chapter.name)
        .order('difficulty')
        .limit(10);

      if (error) throw error;

      if (!questions || questions.length === 0) {
        alert('No questions available');
        return;
      }

      setPracticeQuestions(questions);
      setCurrentPracticeIndex(0);
      setPracticeStats({ correct: 0, total: 0 });
      setPracticeMode(true);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error starting learning:', error);
      alert('Failed to load questions');
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);

    const question = practiceQuestions[currentPracticeIndex];
    const isCorrect = answer === question.correct_answer;

    setPracticeStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (user) {
      try {
        await supabase.from('question_attempts').insert({
          user_id: user.id,
          question_id: question.id,
          selected_answer: answer,
          is_correct: isCorrect,
          time_taken: 30
        });
      } catch (error) {
        console.error('Error saving attempt:', error);
      }
    }
  };

  const nextQuestion = () => {
    if (currentPracticeIndex < practiceQuestions.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      // Practice session complete
      alert(`Session Complete!\nScore: ${practiceStats.correct}/${practiceStats.total}`);
      setPracticeMode(false);
      loadChapters(); // Reload to update progress
    }
  };

  const allChapters = chapters.map(chapter => {
    const subject = subjects.find(s => s.id === chapter.subjectId);
    return {
      ...chapter,
      subjectGradient: subject?.gradient || 'from-gray-500 to-gray-600'
    };
  });

  const filteredChapters = allChapters.filter(chapter => {
    const matchesSearch = chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chapter.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || chapter.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your learning journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice Mode UI
  if (practiceMode && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentPracticeIndex];
    const progress = ((currentPracticeIndex + 1) / practiceQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        <div className="pt-20 pb-8">
          <div className="container mx-auto max-w-4xl px-4">
            {/* Progress Header */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Question {currentPracticeIndex + 1} of {practiceQuestions.length}</p>
                    <p className="font-semibold">{question.subject} • {question.chapter}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{practiceStats.correct}/{practiceStats.total}</p>
                    <p className="text-xs text-gray-600">Correct</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-start gap-3 mb-6">
                  <Badge className={`${
                    question.difficulty === 'easy' ? 'bg-green-500' :
                    question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline">{question.topic}</Badge>
                </div>

                <h3 className="text-2xl font-bold mb-8">{question.question}</h3>
                
                <div className="space-y-3 mb-8">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((optKey, idx) => {
                    const optLetter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === optLetter;
                    const isCorrect = optLetter === question.correct_answer;
                    
                    let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
                    
                    if (showAnswer) {
                      if (isCorrect) {
                        buttonClass += 'border-green-500 bg-green-50';
                      } else if (isSelected && !isCorrect) {
                        buttonClass += 'border-red-500 bg-red-50';
                      } else {
                        buttonClass += 'border-gray-200 opacity-50';
                      }
                    } else {
                      buttonClass += isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-primary/50';
                    }

                    return (
                      <button
                        key={optKey}
                        onClick={() => !showAnswer && handleAnswerSubmit(optLetter)}
                        disabled={showAnswer}
                        className={buttonClass}
                      >
                        <span className="font-semibold mr-3">{optLetter}.</span>
                        {question[optKey]}
                        {showAnswer && isCorrect && (
                          <CheckCircle2 className="inline-block ml-2 w-5 h-5 text-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showAnswer && question.explanation && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {showAnswer && (
                  <Button 
                    onClick={nextQuestion}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    {currentPracticeIndex < practiceQuestions.length - 1 ? 'Next Question' : 'Finish Session'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Exit Practice */}
            <Button 
              variant="outline" 
              onClick={() => setPracticeMode(false)}
              className="w-full"
            >
              Exit Practice Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Chapter Selection UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              Smart Learning Path
              <Rocket className="w-8 h-8 text-orange-500" />
            </h1>
            <p className="text-xl text-gray-600">
              Learn step-by-step with instant feedback & explanations
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant={selectedSubject === "all" ? "default" : "outline"}
                    onClick={() => setSelectedSubject("all")}
                  >
                    All Subjects
                  </Button>
                  {subjects.map(subject => {
                    const Icon = subject.icon;
                    return (
                      <Button
                        key={subject.id}
                        variant={selectedSubject === subject.id ? "default" : "outline"}
                        onClick={() => setSelectedSubject(subject.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {subject.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter, index) => (
              <Card 
                key={chapter.id}
                className={`hover:shadow-xl transition-all ${
                  !chapter.isUnlocked ? 'opacity-60' : 'hover:scale-105'
                }`}
              >
                <div className={`bg-gradient-to-r ${chapter.subjectGradient} p-5 text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Badge className="bg-white/20 text-white mb-2">
                        Chapter {chapter.sequenceNumber}
                      </Badge>
                      <h3 className="text-lg font-bold">{chapter.name}</h3>
                      <p className="text-sm opacity-90">{chapter.subject}</p>
                    </div>
                    {!chapter.isUnlocked && <Lock className="w-5 h-5" />}
                    {chapter.isCompleted && <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  
                  {chapter.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{chapter.progress}%</span>
                      </div>
                      <Progress value={chapter.progress} className="h-1.5 bg-white/30" />
                    </div>
                  )}
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-bold text-green-700">{chapter.difficulties.easy}</div>
                      <div className="text-xs text-green-600">Easy</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="font-bold text-yellow-700">{chapter.difficulties.medium}</div>
                      <div className="text-xs text-yellow-600">Medium</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="font-bold text-red-700">{chapter.difficulties.hard}</div>
                      <div className="text-xs text-red-600">Hard</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{chapter.attempted}/{chapter.questionsCount} attempted</span>
                    {chapter.accuracy > 0 && (
                      <span className="font-semibold text-primary">{chapter.accuracy}% accuracy</span>
                    )}
                  </div>

                  <Button
                    onClick={() => startLearning(chapter)}
                    disabled={!chapter.isUnlocked}
                    className="w-full"
                  >
                    {!chapter.isUnlocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : chapter.progress > 0 ? (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookMarked className="w-4 h-4 mr-2" />
                        Start Learning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No chapters found</h3>
              <p className="text-gray-600">Try different search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyNowPage;
