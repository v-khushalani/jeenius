import React, { useState, useEffect } from 'react';
import { Brain, Target, Clock, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from 'sonner';

const PracticeSession = () => {
  const { isAuthenticated } = useAuth();
  const { getRandomQuestions, submitAnswer, loading } = useQuestions();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    startTime: Date.now()
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadQuestions();
    }
  }, [isAuthenticated]);

  const loadQuestions = async () => {
    const questionsData = await getRandomQuestions(null, null, null, 10);

      if (questionsData.length === 0) {
        toast.info('No new questions available. All questions attempted!');
      }
    
    setQuestions(questionsData);
  };

  const handleAnswerSelect = async (optionKey) => {
    if (!questions[currentQuestion]) return;
    
    setSelectedAnswer(optionKey);
    
    try {
      const timeSpent = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      const result = await submitAnswer(questions[currentQuestion].id, optionKey, timeSpent);

      const handleAnswerSelect = async (optionKey) => {
  if (!questions[currentQuestion]) return;
  
  setSelectedAnswer(optionKey);
  
  try {
    const timeSpent = Math.floor((Date.now() - sessionStats.startTime) / 1000);
    const result = await submitAnswer(questions[currentQuestion].id, optionKey, timeSpent);
    
    // Store validation result to show correct answer and explanation
    setValidationResult(result);
    setShowExplanation(true);
    
    // Update topic mastery after each attempt
    try {
    const currentQ = questions[currentQuestion];
    
    console.log('🔍 Calling mastery function for:', {
      subject: currentQ.subject,
      chapter: currentQ.chapter || currentQ.topic,
      topic: currentQ.topic
    });
    
    const { data, error } = await supabase.functions.invoke('calculate-topic-mastery', {
      body: {
        subject: currentQ.subject,
        chapter: currentQ.chapter || currentQ.topic,
        topic: currentQ.topic
      }
    });
    
    if (error) {
      console.error('❌ Mastery function error:', error);
    } else {
      console.log('✅ Topic mastery response:', data);
    }
  } catch (masteryError) {
    console.error('❌ Error updating mastery:', masteryError);
  }
    // END OF NEW BLOCK ⬆️
    
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (result.isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};
      
      // Store validation result to show correct answer and explanation
      setValidationResult(result);
      setShowExplanation(true);
      
      setSessionStats(prev => ({
        ...prev,
        correct: prev.correct + (result.isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setValidationResult(null);
      setSessionStats(prev => ({ ...prev, startTime: Date.now() }));
    }
  };

  if (loading || questions.length === 0) {
    return <LoadingScreen message="Loading practice questions..." />;
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  const options = currentQ.options || {};
  const optionEntries = Object.entries(options);

  const getAnswerStyle = (optionKey) => {
    if (!showExplanation || !validationResult) {
      return selectedAnswer === optionKey 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 hover:border-purple-300';
    }
    
    // Show correct answer in green
    if (optionKey === validationResult.correctAnswer) {
      return 'border-green-500 bg-green-50';
    }
    
    // Show user's wrong answer in red
    if (selectedAnswer === optionKey && optionKey !== validationResult.correctAnswer) {
      return 'border-red-500 bg-red-50';
    }
    
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <section id="practice" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Practice Sessions
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Experience intelligent question selection that adapts to your learning patterns, 
            identifies weak areas, and provides personalized practice sessions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Status */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-800">AI Active</span>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Smart Selection</h3>
                  <p className="text-sm text-purple-700">Analyzing your performance...</p>
                </div>
              </div>
            </div>

            {/* Weakness Analysis */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-500" />
                <span>Focus Areas</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Friction Problems</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Weak</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projectile Motion</span>
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Moderate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Work & Energy</span>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Strong</span>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Session Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <span className="text-sm font-medium">{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="text-sm font-medium">
                    {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="text-sm font-medium flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>2:30</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {currentQ.subject}
                    </span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      Level {currentQ.difficulty_level}
                    </span>
                  </div>
                  <span className="text-sm">Question {currentQuestion + 1} of {questions.length}</span>
                </div>
                <h3 className="text-lg font-medium">{currentQ.topic}</h3>
              </div>

              {/* AI Insight */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">AI analyzing your performance on {currentQ.subject} - {currentQ.topic}</p>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6">
                <div className="mb-8">
                  <p className="text-lg text-gray-900 leading-relaxed mb-6">
                    {currentQ.question_text}
                  </p>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {optionEntries.map(([optionKey, optionValue]) => (
                      <button
                        key={optionKey}
                        onClick={() => handleAnswerSelect(optionKey)}
                        disabled={showExplanation}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getAnswerStyle(optionKey)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">{String(optionValue)}</span>
                          {showExplanation && validationResult && (
                            <div>
                              {optionKey === validationResult.correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : selectedAnswer === optionKey ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {showExplanation && validationResult && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-fade-in">
                    <h4 className="font-semibold text-gray-900 mb-3">Explanation:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {validationResult.explanation}
                    </p>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {validationResult.isCorrect ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Correct!</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Incorrect</span>
                          </div>
                        )}
                      </div>
                      
                      <Button onClick={nextQuestion} className="bg-gradient-to-r from-purple-600 to-blue-600">
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticeSession;
