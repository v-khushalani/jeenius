import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Target, Beaker, Calculator, Activity,
  Flame, ArrowLeft, Lightbulb, XCircle, CheckCircle2,
  Sparkles, Zap, Play
} from "lucide-react";

// Mock data for demo
const mockSubjects = [
  {
    name: 'Physics',
    emoji: '⚡',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    totalQuestions: 299,
    accuracy: 75,
    attempted: 45,
    difficulties: { easy: 152, medium: 101, hard: 46 }
  },
  {
    name: 'Chemistry',
    emoji: '🧪',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    totalQuestions: 354,
    accuracy: 68,
    attempted: 38,
    difficulties: { easy: 176, medium: 117, hard: 61 }
  },
  {
    name: 'Mathematics',
    emoji: '🔢',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    totalQuestions: 347,
    accuracy: 82,
    attempted: 52,
    difficulties: { easy: 169, medium: 124, hard: 54 }
  }
];

const mockChapters = [
  { name: 'Mechanics', sequence: 1, totalQuestions: 85, progress: 45, accuracy: 72, difficulties: { easy: 40, medium: 30, hard: 15 } },
  { name: 'Thermodynamics', sequence: 2, totalQuestions: 62, progress: 20, accuracy: 65, difficulties: { easy: 30, medium: 22, hard: 10 } },
  { name: 'Optics', sequence: 3, totalQuestions: 48, progress: 60, accuracy: 80, difficulties: { easy: 25, medium: 18, hard: 5 } }
];

const mockTopics = [
  { name: 'Laws of Motion', totalQuestions: 25, accuracy: 75, difficulties: { easy: 12, medium: 8, hard: 5 } },
  { name: 'Friction', totalQuestions: 18, accuracy: 68, difficulties: { easy: 10, medium: 6, hard: 2 } },
  { name: 'Circular Motion', totalQuestions: 22, accuracy: 82, difficulties: { easy: 8, medium: 10, hard: 4 } }
];

const mockQuestions = [
  {
    question: "A body of mass 2 kg is moving with velocity 10 m/s. What is its kinetic energy?",
    option_a: "50 J",
    option_b: "100 J",
    option_c: "200 J",
    option_d: "400 J",
    correct_option: "B",
    explanation: "Kinetic Energy = (1/2)mv² = (1/2) × 2 × 10² = 100 J"
  },
  {
    question: "What is Newton's Second Law of Motion?",
    option_a: "F = ma",
    option_b: "F = mv",
    option_c: "F = m/a",
    option_d: "F = a/m",
    correct_option: "A",
    explanation: "Newton's Second Law states that Force equals mass times acceleration (F = ma)"
  },
  {
    question: "The SI unit of force is:",
    option_a: "Joule",
    option_b: "Newton",
    option_c: "Watt",
    option_d: "Pascal",
    correct_option: "B",
    explanation: "The SI unit of force is Newton (N), named after Sir Isaac Newton"
  }
];

const StudyNowPage = () => {
  const [view, setView] = useState('subjects');
  const [subjects] = useState(mockSubjects);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters] = useState(mockChapters);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [topics] = useState(mockTopics);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, streak: 0 });

  const loadChapters = (subject) => {
    setSelectedSubject(subject);
    setView('chapters');
  };

  const loadTopics = (chapter) => {
    setSelectedChapter(chapter);
    setView('topics');
  };

  const startPractice = () => {
    setPracticeQuestions(mockQuestions);
    setCurrentQuestionIndex(0);
    setSessionStats({ correct: 0, total: 0, streak: 0 });
    setSelectedAnswer(null);
    setShowResult(false);
    setView('practice');
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

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const accuracy = (sessionStats.correct / sessionStats.total) * 100;
      alert(`🎉 Session Completed!\n\n✅ Score: ${sessionStats.correct}/${sessionStats.total} (${accuracy.toFixed(0)}%)\n🔥 Streak: ${sessionStats.streak}`);
      setView('topics');
    }
  };

  // PRACTICE MODE
  if (view === 'practice' && practiceQuestions.length > 0) {
    const question = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-4xl mt-8">
          
          {/* Progress Header */}
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

          {/* Question Card */}
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
    );
  }

  // SUBJECTS VIEW
  if (view === 'subjects') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-7xl mt-8">
          <div className="mb-8 text-center">
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CHAPTERS VIEW
  if (view === 'chapters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-6xl mt-8">
          <Button variant="outline" onClick={() => setView('subjects')} className="mb-8 border-2 border-blue-600">
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
    );
  }

  // TOPICS VIEW
  if (view === 'topics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="container mx-auto max-w-6xl mt-8">
          <Button variant="outline" onClick={() => setView('chapters')} className="mb-8 border-2 border-blue-600">
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
                onClick={startPractice}
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
                    <Zap className="w-4 h-4 mr-2" />
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyNowPage;
