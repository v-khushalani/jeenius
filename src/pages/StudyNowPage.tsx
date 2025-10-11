import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from '@/components/Header';
import LoadingScreen from '@/components/ui/LoadingScreen';
import {
  Flame, ArrowLeft, Lightbulb, XCircle, CheckCircle2,
  Sparkles, Zap, Play
} from "lucide-react";

const StudyNowPage = () => {
  const [loading, setLoading] = useState(false);
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

  // Fetch subjects with stats
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('subject');
      
      if (error) throw error;

      // Get unique subjects and calculate stats
      const uniqueSubjects = [...new Set(data.map(q => q.subject))];
      const subjectStats = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const { data: subjectQuestions } = await supabase
            .from('questions')
            .select('subject, difficulty'),
            .eq('subject', subject);

          const totalQuestions = subjectQuestions?.length || 0;
          const difficulties = {
            easy: subjectQuestions?.filter(q => q.difficulty === 'Easy').length || 0,
            medium: subjectQuestions?.filter(q => q.difficulty === 'Medium').length || 0,
            hard: subjectQuestions?.filter(q => q.difficulty === 'Hard').length || 0
          };

          const icons = {
            'Physics': '⚛️',
            'Chemistry': '🧪',
            'Mathematics': '📐'
          };

          const colors = {
            'Physics': {
              color: 'from-blue-500 to-indigo-600',
              bgColor: 'from-blue-50 to-indigo-50',
              borderColor: 'border-blue-200'
            },
            'Chemistry': {
              color: 'from-green-500 to-emerald-600',
              bgColor: 'from-green-50 to-emerald-50',
              borderColor: 'border-green-200'
            },
            'Mathematics': {
              color: 'from-purple-500 to-pink-600',
              bgColor: 'from-purple-50 to-pink-50',
              borderColor: 'border-purple-200'
            }
          };

          return {
            name: subject,
            emoji: icons[subject] || '📚',
            ...colors[subject],
            totalQuestions,
            difficulties
          };
        })
      );

      setSubjects(subjectStats);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('chapter')
        .eq('subject', subject);
      
      if (error) throw error;

      const uniqueChapters = [...new Set(data.map(q => q.chapter))];
      const chapterStats = await Promise.all(
        uniqueChapters.map(async (chapter, index) => {
          const { data: chapterQuestions } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', subject)
            .eq('chapter', chapter);

          const totalQuestions = chapterQuestions?.length || 0;
          const difficulties = {
            easy: chapterQuestions?.filter(q => q.difficulty === 'easy').length || 0,
            medium: chapterQuestions?.filter(q => q.difficulty === 'medium').length || 0,
            hard: chapterQuestions?.filter(q => q.difficulty === 'hard').length || 0
          };

          return {
            name: chapter,
            sequence: index + 1,
            totalQuestions,
            difficulties
          };
        })
      );

      setChapters(chapterStats);
      setView('chapters');
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (chapter) => {
    setLoading(true);
    setSelectedChapter(chapter);
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('topic')
        .eq('subject', selectedSubject)
        .eq('chapter', chapter);
      
      if (error) throw error;

      const uniqueTopics = [...new Set(data.map(q => q.topic).filter(Boolean))];
      
      if (uniqueTopics.length === 0) {
        // If no topics, start practice directly with chapter questions
        startPractice(null);
        return;
      }

      const topicStats = await Promise.all(
        uniqueTopics.map(async (topic) => {
          const { data: topicQuestions } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', selectedSubject)
            .eq('chapter', chapter)
            .eq('topic', topic);

          const totalQuestions = topicQuestions?.length || 0;
          const difficulties = {
            easy: topicQuestions?.filter(q => q.difficulty === 'easy').length || 0,
            medium: topicQuestions?.filter(q => q.difficulty === 'medium').length || 0,
            hard: topicQuestions?.filter(q => q.difficulty === 'hard').length || 0
          };

          return {
            name: topic,
            totalQuestions,
            difficulties
          };
        })
      );

      setTopics(topicStats);
      setView('topics');
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async (topic = null) => {
    setLoading(true);
    setSelectedTopic(topic);
    
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('chapter', selectedChapter);

      if (topic) {
        query = query.eq('topic', topic);
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No questions available');
        setLoading(false);
        return;
      }

      // Shuffle and select questions
      const shuffled = data.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(25, shuffled.length));

      setPracticeQuestions(selected);
      setCurrentQuestionIndex(0);
      setSessionStats({ correct: 0, total: 0, streak: 0 });
      setSelectedAnswer(null);
      setShowResult(false);
      setView('practice');
    } catch (error) {
      console.error('Error starting practice:', error);
      toast.error('Failed to start practice');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const question = practiceQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correct_option;
    
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      toast.success(`🎉 Session Completed! Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)`);
      setView('topics');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  // PRACTICE MODE
  if (view === 'practice' && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            
            <Button 
              variant="outline"
              className="mb-6 border-2 border-blue-600"
              onClick={() => setView('topics')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>

            <Card className="mb-6 border-2 border-blue-200 shadow-xl bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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

            <Card className="border-2 border-blue-200 shadow-xl bg-white mb-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
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
                        ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30';
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
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
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
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2">Explanation</p>
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
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Study Now</h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                AI-Powered adaptive learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject) => (
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
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{subject.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
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
              ))}
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
            <Button 
              variant="outline" 
              onClick={() => setView('subjects')} 
              className="mb-8 border-2 border-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>

            <div className="mb-8 text-center">
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2 mb-4">
                {selectedSubject}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map((chapter) => (
                <Card 
                  key={chapter.name}
                  onClick={() => loadTopics(chapter.name)}
                  className="group cursor-pointer hover:scale-105 transition-all border-2 border-blue-200 shadow-lg hover:shadow-xl"
                >
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <Badge className="mb-2">Chapter {chapter.sequence}</Badge>
                    <h3 className="font-bold text-lg text-gray-900">{chapter.name}</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{chapter.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                    </div>

                    <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <div className="font-bold text-green-600">{chapter.difficulties.easy}</div>
                          <div className="text-gray-600">Easy</div>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-600">{chapter.difficulties.medium}</div>
                          <div className="text-gray-600">Med</div>
                        </div>
                        <div>
                          <div className="font-bold text-red-600">{chapter.difficulties.hard}</div>
                          <div className="text-gray-600">Hard</div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
            <Button 
              variant="outline" 
              onClick={() => setView('chapters')} 
              className="mb-8 border-2 border-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>

            <div className="mb-8 text-center">
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2 mb-2">
                {selectedSubject} • {selectedChapter}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <Card 
                  key={topic.name}
                  onClick={() => startPractice(topic.name)}
                  className="group cursor-pointer hover:scale-105 transition-all border-2 border-purple-200 shadow-lg hover:shadow-xl"
                >
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{topic.name}</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{topic.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
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
                      <Zap className="w-4 h-4 mr-2" />
                      Start Practice
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
