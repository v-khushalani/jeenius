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
  Sparkles, Zap, Award
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
        'Physics': { icon: Target, emoji: '⚡' },
        'Chemistry': { icon: Beaker, emoji: '🧪' },
        'Mathematics': { icon: Calculator, emoji: '🔢' },
        'Biology': { icon: Activity, emoji: '🧬' }
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
            progress: userProgress
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
        .select('topic')
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

          let userProgress = 0;
          if (user) {
            const { data: topicQs } = await supabase
              .from('questions')
              .select('id')
              .eq('subject', selectedSubject)
              .eq('chapter', chapter)
              .eq('topic', topic);

            const topicQIds = topicQs?.map(q => q.id) || [];

            const { data: attempts } = await supabase
              .from('question_attempts')
              .select('question_id')
              .eq('user_id', user.id)
              .in('question_id', topicQIds);

            const attempted = attempts?.length || 0;
            userProgress = Math.round((attempted / (count || 1)) * 100);
          }

          return {
            name: topic,
            sequence: index + 1,
            totalQuestions: count || 0,
            progress: userProgress
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

  const startPractice = async (topic) => {
    const questionCount = getAdaptiveQuestionCount();
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('chapter', selectedChapter)
        .eq('topic', topic.name)
        .limit(50);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('No questions available for this topic!');
        return;
      }

      const shuffled = data.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

      setPracticeQuestions(selected);
      setSelectedTopic(topic);
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
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      
      alert(`🎉 Practice Session Completed!\n\nScore: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n\n${accuracy >= 75 ? '✨ Great job! Keep it up!' : '📚 Keep practicing to improve!'}`);

      await loadUserPerformance();
      await loadTopics(selectedChapter);
      setView('topics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#e9e9e9'}}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse mx-auto" style={{backgroundColor: '#013062'}}>
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{color: '#013062'}}>JEENIUS</h1>
          <p className="text-gray-600 text-lg">Loading your AI-powered learning journey...</p>
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Card className="mb-6 border-0 shadow-2xl text-white" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-white/20 text-white text-sm flex items-center gap-1.5 px-3 py-1">
                        <Sparkles className="w-4 h-4" />
                        AI Adaptive Learning
                      </Badge>
                      <span className="text-sm opacity-90">{selectedTopic?.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-5xl font-black">{sessionStats.correct}/{sessionStats.total}</span>
                      {sessionStats.streak > 2 && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1.5 animate-pulse px-3 py-1.5">
                          <Flame className="w-5 h-5" />
                          {sessionStats.streak} Streak!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-black">{accuracy.toFixed(0)}%</div>
                    <div className="text-sm opacity-90 mt-1">Accuracy</div>
                  </div>
                </div>
                <Progress value={progress} className="h-3 bg-white/20" />
                <p className="text-sm mt-3 opacity-90">Question {currentQuestionIndex + 1} of {practiceQuestions.length}</p>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-0">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold mb-10 leading-relaxed" style={{color: '#013062'}}>
                  {question.question}
                </h2>

                <div className="space-y-4">
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((key, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedAnswer === letter;
                    const isCorrect = letter === question.correct_answer;
                    
                    let btnClass = 'w-full text-left p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ';
                    
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
                        ? 'shadow-xl scale-[1.02]' 
                        : 'border-gray-300 hover:bg-blue-50/50';
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswer(letter)}
                        disabled={showResult}
                        className={btnClass}
                        style={!showResult && isSelected ? {borderColor: '#013062', backgroundColor: '#f0f7ff'} : {}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${
                              showResult && isCorrect ? 'bg-green-600 text-white' :
                              showResult && isSelected && !isCorrect ? 'bg-red-600 text-white' :
                              isSelected ? 'text-white' : 'bg-gray-200 text-gray-700'
                            }`} style={isSelected && !showResult ? {backgroundColor: '#013062'} : {}}>
                              {letter}
                            </div>
                            <span className="text-lg font-medium">{question[key]}</span>
                          </div>
                          {showResult && isCorrect && (
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-8 h-8 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResult && question.explanation && (
                  <div className="mt-8 p-6 rounded-xl" style={{backgroundColor: '#f0f7ff', borderLeft: '5px solid #013062'}}>
                    <div className="flex items-start gap-4">
                      <Lightbulb className="w-7 h-7 mt-1 flex-shrink-0" style={{color: '#013062'}} />
                      <div>
                        <p className="font-bold mb-2 text-xl" style={{color: '#013062'}}>💡 Explanation</p>
                        <p className="leading-relaxed text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showResult && (
                  <Button 
                    onClick={nextQuestion}
                    size="lg"
                    className="w-full mt-8 h-16 text-xl font-bold shadow-lg text-white hover:opacity-90"
                    style={{backgroundColor: '#013062'}}
                  >
                    {currentQuestionIndex < practiceQuestions.length - 1 ? (
                      <>Next Question <ChevronRight className="w-6 h-6 ml-2" /></>
                    ) : (
                      <>Finish Practice <Trophy className="w-6 h-6 ml-2" /></>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => setView('topics')}
              className="mt-6 w-full"
              size="lg"
              style={{borderColor: '#013062', color: '#013062'}}
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Card 
                    key={subject.name}
                    onClick={() => loadChapters(subject.name)}
                    className="cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-0 overflow-hidden group"
                  >
                    <div className="p-8 text-white text-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
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
                    <CardContent className="p-6 text-center bg-white">
                      <div className="text-5xl font-black mb-2" style={{color: '#013062'}}>
                        {subject.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600 mb-5">Questions Available</div>
                      <Button className="w-full h-12 text-base font-semibold text-white hover:opacity-90 transition-opacity" style={{backgroundColor: '#013062'}}>
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Info Card */}
            {userPerformance.totalAttempts > 0 && (
              <Card className="mt-8 border-0 shadow-xl" style={{background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f0ff 100%)'}}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#013062'}}>
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-1" style={{color: '#013062'}}>AI-Powered Adaptive Learning</h3>
                      <p className="text-gray-600">
                        {userPerformance.recentAccuracy >= 85 
                          ? '🔥 Outstanding! Your personalized learning path is optimized'
                          : userPerformance.recentAccuracy >= 70
                          ? '✨ Excellent progress! AI is adjusting to your pace'
                          : '📚 Building strong foundations with AI guidance'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-md">
                      <div className="text-4xl font-black mb-2" style={{color: '#013062'}}>{userPerformance.recentAccuracy.toFixed(0)}%</div>
                      <div className="text-sm text-gray-600 font-medium">Your Accuracy</div>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md">
                      <div className="text-4xl font-black mb-2" style={{color: '#013062'}}>{userPerformance.totalAttempts}</div>
                      <div className="text-sm text-gray-600 font-medium">Questions Solved</div>
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

  // CHAPTERS VIEW
  if (view === 'chapters') {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Button 
              variant="outline" 
              onClick={() => setView('subjects')}
              className="mb-6"
              size="lg"
              style={{borderColor: '#013062', color: '#013062'}}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Subjects
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <Card 
                  key={chapter.name}
                  onClick={() => loadTopics(chapter.name)}
                  className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-0 shadow-xl overflow-hidden group"
                >
                  <div className="p-6 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-white/20 text-white">
                          Chapter {chapter.sequence}
                        </Badge>
                        {chapter.progress >= 80 && <Trophy className="w-7 h-7 text-yellow-300" />}
                      </div>
                      <h3 className="text-xl font-bold mb-4">{chapter.name}</h3>
                      {chapter.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>AI Progress</span>
                            <span className="font-bold">{chapter.progress}%</span>
                          </div>
                          <Progress value={chapter.progress} className="h-2 bg-white/20" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6 text-center bg-white">
                    <div className="text-4xl font-bold mb-2" style={{color: '#013062'}}>
                      {chapter.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600 mb-5">Questions</div>
                    <Button 
                      className="w-full h-12 text-base font-semibold text-white hover:opacity-90"
                      style={{backgroundColor: '#013062'}}
                    >
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Button 
              variant="outline" 
              onClick={() => setView('chapters')}
              className="mb-6"
              size="lg"
              style={{borderColor: '#013062', color: '#013062'}}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Chapters
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <Card 
                  key={topic.name} 
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden group"
                  onClick={() => startPractice(topic)}
                >
                  <div className="p-6 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-white/20 text-white flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          AI Powered
                        </Badge>
                        {topic.progress >= 80 && <Award className="w-6 h-6 text-yellow-300" />}
                      </div>
                      <h3 className="text-xl font-bold mb-4">{topic.name}</h3>
                      {topic.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>AI Progress</span>
                            <span className="font-bold">{topic.progress}%</span>
                          </div>
                          <Progress value={topic.progress} className="h-2 bg-white/20" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6 text-center bg-white">
                    <div className="text-4xl font-bold mb-2" style={{color: '#013062'}}>
                      {topic.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600 mb-5">Questions Available</div>
                    <Button 
                      className="w-full h-12 text-base font-semibold text-white hover:opacity-90"
                      style={{backgroundColor: '#013062'}}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Start AI Practice
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

  return null;
};

export default StudyNowPage;
