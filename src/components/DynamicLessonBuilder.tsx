
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, Target, TrendingUp, Smartphone, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
}

const DynamicLessonBuilder = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(2);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [jeePoints, setJeePoints] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "If x + y = 5 and x - y = 1, what is the value of x?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "Adding the equations: (x+y) + (x-y) = 5+1, so 2x = 6, therefore x = 3",
      difficulty: 'Easy',
      subject: 'Math'
    },
    {
      id: 2,
      question: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11.2 m/s²"],
      correct: 0,
      explanation: "The standard acceleration due to gravity on Earth is approximately 9.8 m/s²",
      difficulty: 'Easy',
      subject: 'Physics'
    },
    {
      id: 3,
      question: "Which of the following is the molecular formula for glucose?",
      options: ["C₆H₁₂O₆", "C₆H₆", "CH₄", "H₂O"],
      correct: 0,
      explanation: "Glucose has the molecular formula C₆H₁₂O₆, containing 6 carbon, 12 hydrogen, and 6 oxygen atoms",
      difficulty: 'Medium',
      subject: 'Chemistry'
    },
    {
      id: 4,
      question: "Find the derivative of f(x) = x³ + 2x² - 5x + 3",
      options: ["3x² + 4x - 5", "x² + 4x - 5", "3x² + 2x - 5", "3x² + 4x + 5"],
      correct: 0,
      explanation: "Using power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0",
      difficulty: 'Hard',
      subject: 'Math'
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    const isCorrect = optionIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
      setJeePoints(prev => prev + (difficultyLevel * 10));
    }

    setShowResult(true);

    // Adaptive difficulty adjustment
    if (adaptiveMode) {
      if (isCorrect && difficultyLevel < 5) {
        setDifficultyLevel(prev => Math.min(5, prev + 1));
      } else if (!isCorrect && difficultyLevel > 1) {
        setDifficultyLevel(prev => Math.max(1, prev - 1));
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(current => current + 1);
      setShowResult(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelName = (level: number) => {
    const levels = ['JEE Rookie', 'JEE Warrior', 'JEE Champion', 'JEE Legend', 'JEE Master'];
    return levels[Math.min(level - 1, levels.length - 1)];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile App Promotion */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" />
            <div>
              <div className="font-semibold">Enhanced Learning in Mobile App!</div>
              <div className="text-sm opacity-90">Get personalized study plans, offline access & advanced analytics</div>
            </div>
          </div>
          <Button variant="secondary" className="bg-white text-purple-600">
            <Smartphone className="w-4 h-4 mr-2" />
            Get App
          </Button>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">JEEnius Points</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{jeePoints}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Current Level</span>
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{getLevelName(difficultyLevel)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Accuracy</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedAnswers.length > 0 ? Math.round((score / selectedAnswers.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adaptive Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>Dynamic Learning Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Adaptive Mode:</span>
              <Button
                size="sm"
                variant={adaptiveMode ? "default" : "outline"}
                onClick={() => setAdaptiveMode(!adaptiveMode)}
              >
                {adaptiveMode ? "ON" : "OFF"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Difficulty Level: {difficultyLevel}/5</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(questions[currentQuestion]?.difficulty)}`}>
                  {questions[currentQuestion]?.difficulty}
                </span>
              </div>
              <Progress value={difficultyLevel * 20} className="h-2" />
            </div>
            
            <div className="text-sm text-gray-600">
              {adaptiveMode 
                ? "🤖 AI is adjusting difficulty based on your performance"
                : "📚 Manual difficulty mode - consistent level questions"
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      {currentQuestion < questions.length && (
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {questions[currentQuestion].subject}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(questions[currentQuestion].difficulty)}`}>
                  {questions[currentQuestion].difficulty}
                </span>
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-lg font-medium text-gray-900">
              {questions[currentQuestion].question}
            </div>
            
            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`p-4 h-auto text-left justify-start transition-all ${
                    showResult
                      ? index === questions[currentQuestion].correct
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : selectedAnswers[currentQuestion] === index
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'opacity-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === questions[currentQuestion].correct && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                  {showResult && selectedAnswers[currentQuestion] === index && index !== questions[currentQuestion].correct && (
                    <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Explanation</span>
                </div>
                <p className="text-blue-800">{questions[currentQuestion].explanation}</p>
                
                <div className="mt-4 flex justify-between">
                  <div className="text-sm text-blue-700">
                    JEEnius Points Earned: +{difficultyLevel * 10}
                  </div>
                  <Button onClick={nextQuestion} className="bg-primary">
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {currentQuestion >= questions.length && (
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h3>
            <p className="text-gray-600 mb-6">
              You scored {score} out of {questions.length} questions correctly!
            </p>
            <div className="text-lg font-semibold text-primary mb-6">
              Total JEEnius Points Earned: {jeePoints}
            </div>
            <div className="space-y-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Continue Learning
              </Button>
              <div className="text-sm text-gray-600">
                📱 Download our Android app for more adaptive lessons and personalized learning paths!
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicLessonBuilder;
