import { useNavigate } from "react-router-dom";
import FloatingAIButton from '@/components/FloatingAIButton';
import AIDoubtSolver from '@/components/AIDoubtSolver';
import { SubscriptionPaywall } from '@/components/paywall/SubscriptionPaywall';
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from '@/components/Header';
import { canAccessChapter, canAttemptQuestion, trackQuestionAttempt } from '@/utils/contentAccess';
import LoadingScreen from '@/components/ui/LoadingScreen';
import {
  Flame, ArrowLeft, Lightbulb, XCircle, CheckCircle2, Trophy, Target,
  Sparkles, Zap, Play, Lock
} from "lucide-react";

const StudyNowPage = () => {
  const navigate = useNavigate();
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
  const [userStats, setUserStats] = useState({ attempted: 0, accuracy: 0 });
  const [showAIModal, setShowAIModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallType, setPaywallType] = useState<'chapter' | 'test' | 'ai'>('chapter');
  const [paywallMessage, setPaywallMessage] = useState('');
  
  
  // Fetch subjects with stats and profile
    useEffect(() => {
    fetchSubjects();
    loadProfile();
  }, []);
  
  // Make sure loadProfile is setting the profile state correctly
  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Track chapter access when user opens it
      if (user?.id) {
        await supabase.from('user_content_access').upsert({
          user_id: user.id,
          content_type: 'chapter',
          content_identifier: chapter,
          subject: selectedSubject,
          accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,content_type,content_identifier,subject',
          ignoreDuplicates: false
        });
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Loaded profile:', profileData); // DEBUG
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('subject, difficulty');
        
      if (error) throw error;

      const uniqueSubjects = [...new Set(allQuestions.map(q => q.subject))];
      
      const { data: userAttempts } = await supabase
        .from('question_attempts')
        .select('*, questions!inner(subject)')
        .eq('user_id', user?.id);

      const subjectStats = await Promise.all(
        uniqueSubjects.map(async (subject) => {
          const subjectQuestions = allQuestions.filter(q => q.subject === subject);
          const totalQuestions = subjectQuestions.length;
          
          const difficulties = {
            easy: subjectQuestions.filter(q => q.difficulty === 'Easy').length,
            medium: subjectQuestions.filter(q => q.difficulty === 'Medium').length,
            hard: subjectQuestions.filter(q => q.difficulty === 'Hard').length
          };

          const subjectAttempts = userAttempts?.filter(
            a => a.questions?.subject === subject
          ) || [];
          
          const attempted = subjectAttempts.length;
          const correct = subjectAttempts.filter(a => a.is_correct).length;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

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
            difficulties,
            attempted,
            accuracy
          };
        })
      );

      const totalAttempted = userAttempts?.length || 0;
      const totalCorrect = userAttempts?.filter(a => a.is_correct).length || 0;
      const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
      
      setUserStats({ attempted: totalAttempted, accuracy: overallAccuracy });
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
    
     // Add this inside your loadChapters function, right after setSelectedSubject
    console.log('Profile data:', profile);
    console.log('Is Premium?', profile?.is_premium);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('questions')
        .select('chapter, difficulty')
        .eq('subject', subject);
      
      if (error) throw error;
  
      const uniqueChapters = [...new Set(data.map(q => q.chapter))];
      
      const { data: userAttempts } = await supabase
        .from('question_attempts')
        .select('*, questions!inner(subject, chapter)')
        .eq('user_id', user?.id)
        .eq('questions.subject', subject);

      // Check if user has premium subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .single();
      
      const isPremium = !!subscription;
      
      // Get user's accessed chapters
      const { data: accessedChapters } = await supabase
        .from('user_content_access')
        .select('content_identifier, subject')
        .eq('user_id', user?.id)
        .eq('content_type', 'chapter')
        .eq('subject', subject);
      
      const accessedChapterNames = new Set(
        accessedChapters?.map(a => a.content_identifier) || []
      );

      
      const chapterStats = await Promise.all(
        uniqueChapters.map(async (chapter, index) => {
          const chapterQuestions = data.filter(q => q.chapter === chapter);
          const totalQuestions = chapterQuestions.length;
          
          const difficulties = {
            easy: chapterQuestions.filter(q => q.difficulty === 'Easy').length,
            medium: chapterQuestions.filter(q => q.difficulty === 'Medium').length,
            hard: chapterQuestions.filter(q => q.difficulty === 'Hard').length
          };
  
          const chapterAttempts = userAttempts?.filter(
            a => a.questions?.chapter === chapter
          ) || [];
          
          const attempted = chapterAttempts.length;
          const correct = chapterAttempts.filter(a => a.is_correct).length;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
          const progress = attempted > 0 ? Math.min(100, Math.round((attempted / totalQuestions) * 100)) : 0;
  
         // Determine if chapter is locked
          // Premium users: nothing locked
          // Free users: 5 chapters total across ALL subjects (tracked in accessed chapters)
          const isAlreadyAccessed = accessedChapterNames.has(chapter);
          const totalAccessedCount = await supabase
            .from('user_content_access')
            .select('content_identifier, subject', { count: 'exact', head: true })
            .eq('user_id', user?.id)
            .eq('content_type', 'chapter');
          
          const totalChaptersAccessed = totalAccessedCount.count || 0;
          const isLocked = !isPremium && !isAlreadyAccessed && totalChaptersAccessed >= 5;
  
  
          return {
            name: chapter,
            sequence: index + 1,
            totalQuestions,
            difficulties,
            attempted,
            accuracy,
            progress,
            isLocked
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
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('questions')
        .select('topic, difficulty')
        .eq('subject', selectedSubject)
        .eq('chapter', chapter);
      
      if (error) throw error;

      const uniqueTopics = [...new Set(data.map(q => q.topic).filter(Boolean))];
      
      if (uniqueTopics.length === 0) {
        startPractice(null);
        return;
      }

      const { data: userAttempts } = await supabase
        .from('question_attempts')
        .select('*, questions!inner(subject, chapter, topic)')
        .eq('user_id', user?.id)
        .eq('questions.subject', selectedSubject)
        .eq('questions.chapter', chapter);

      const topicStats = await Promise.all(
        uniqueTopics.map(async (topic) => {
          const topicQuestions = data.filter(q => q.topic === topic);
          const totalQuestions = topicQuestions.length;
          
          const difficulties = {
            easy: topicQuestions.filter(q => q.difficulty === 'Easy').length,
            medium: topicQuestions.filter(q => q.difficulty === 'Medium').length,
            hard: topicQuestions.filter(q => q.difficulty === 'Hard').length
          };

          const topicAttempts = userAttempts?.filter(
            a => a.questions?.topic === topic
          ) || [];
          
          const attempted = topicAttempts.length;
          const correct = topicAttempts.filter(a => a.is_correct).length;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

          return {
            name: topic,
            totalQuestions,
            difficulties,
            attempted,
            accuracy
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

  const handleAnswer = async (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const question = practiceQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correct_option;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('question_attempts').insert({
        user_id: user.id,
        question_id: question.id,
        selected_option: answer,
        is_correct: isCorrect,
        time_taken: 30,
        attempted_at: new Date().toISOString(),
        mode: 'study'
      });

      if (selectedTopic) {
        await supabase.functions.invoke('calculate-topic-mastery', {
          body: {
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: selectedTopic
          }
        });
      }
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
    
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    setTimeout(() => {
      nextQuestion();
    }, 100);
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

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setShowAIModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold shadow-lg px-6 py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ask AI for Help
                  </Button>
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
        <AIDoubtSolver 
          question={practiceQuestions[currentQuestionIndex]}
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
        />
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
              <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white border border-gray-200 shadow-lg">
                <div className="flex justify-center gap-3">
                  <Badge className="bg-green-50 text-green-700 border-green-200 px-4 py-1.5">
                    <Target className="w-4 h-4 mr-1" />
                    Attempted: {userStats.attempted}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5">
                    <Trophy className="w-4 h-4 mr-1" />
                    Accuracy: {userStats.accuracy}%
                  </Badge>
                </div>
              </div>
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
                            {subject.accuracy}%
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
              ))}
            </div>
          </div>
          <FloatingAIButton />
        </div>
        {showPaywall && (
          <SubscriptionPaywall
            contentType={paywallType}
            onClose={() => setShowPaywall(false)}
            onUpgrade={() => navigate('/subscription-plans')}
            message={paywallMessage}
          />
        )}
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
              {chapters.map((chapter) => {
                if (chapter.isLocked) {
                  return (
                    <Card 
                      key={chapter.name}
                      className="group relative border-2 border-gray-200 shadow-lg opacity-60"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full inline-block mb-3">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <p className="font-bold text-lg mb-2">Premium Chapter</p>
                          <p className="text-sm text-gray-600 mb-4 max-w-xs px-4">
                            Upgrade to unlock all chapters!
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaywallType('chapter');
                              setPaywallMessage(`Unlock ${chapter.name} and all premium chapters!`);
                              setShowPaywall(true);
                            }}
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
                          >
                            🔓 Unlock Now
                          </button>
                        </div>
                      </div>
            
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <Badge className="mb-2">Chapter {chapter.sequence}</Badge>
                        <h3 className="font-bold text-lg text-gray-900">{chapter.name}</h3>
                      </div>
                      <CardContent className="p-4">
                        <div className="text-center mb-3">
                          <div className="text-xl font-bold text-gray-900">{chapter.totalQuestions}</div>
                          <div className="text-xs text-gray-500">Questions</div>
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
            
                        <Button className="w-full bg-blue-600 text-white" disabled>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Explore Topics
                        </Button>
                      </CardContent>
                    </Card>
                  );
                }
            
                return (
                  <Card 
                    key={chapter.name}
                    onClick={() => loadTopics(chapter.name)}
                    className="group cursor-pointer hover:border-gray-800 hover:scale-105 transition-all border-2 border-blue-200 shadow-lg hover:shadow-xl"
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
                );
              })}
            </div>
          </div>
          <FloatingAIButton />
        </div>
        {showPaywall && (
          <SubscriptionPaywall
            contentType={paywallType}
            onClose={() => setShowPaywall(false)}
            onUpgrade={() => navigate('/subscription-plans')}
            message={paywallMessage}
          />
        )}
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
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{topic.totalQuestions}</div>
                        <div className="text-xs text-gray-500">Questions</div>
                      </div>
                      {topic.attempted > 0 && (
                        <div className="text-center">
                          <div className={`text-xl font-bold ${
                            topic.accuracy >= 80 ? 'text-green-600' : 
                            topic.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {topic.accuracy}%
                          </div>
                          <div className="text-xs text-gray-500">Accuracy</div>
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
                      <Zap className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <FloatingAIButton />
        </div>
        {showPaywall && (
          <SubscriptionPaywall
            contentType={paywallType}
            onClose={() => setShowPaywall(false)}
            onUpgrade={() => navigate('/subscription-plans')}
            message={paywallMessage}
          />
        )}
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
