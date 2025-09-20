// Enhanced StudyNowPage.tsx - Complete Practice-Based Learning System with Daily Reset
import Header from '@/components/Header';
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import services
import progressService from '@/services/progressService';
import { formatTime, getLevelColor, getAccuracyColor, formatPercentage } from '@/utils/helpers';

import {
  Brain, Target, BookOpen, Clock, Calendar, CheckCircle, TrendingUp, Users, Zap,
  PlayCircle, Star, Search, Filter, ArrowRight, Flame, Trophy, AlertCircle, ChevronRight,
  Play, Pause, RotateCcw, Beaker, Calculator, Award, MessageSquare, ChevronDown,
  ChevronUp, FileText, PenTool, Lightbulb, TrendingDown, BarChart3, Lock, Unlock,
  Cpu, Layers, Gauge, BarChart, Activity
} from "lucide-react";

// COMPREHENSIVE QUESTION DATABASE with Adaptive Levels
const QUESTION_DATABASE = {
  "physics-mechanics": {
    topicName: "Mechanics & Motion",
    levels: {
      1: [
        {
          id: "mech_l1_1",
          question: "A body at rest will remain at rest unless acted upon by:",
          options: ["External force", "Internal force", "Gravity only", "Friction only"],
          correct: 0,
          explanation: "Newton's First Law - A body continues in its state of rest or uniform motion unless acted upon by an external force.",
          difficulty: "easy",
          tags: ["newton-laws", "inertia"]
        },
        {
          id: "mech_l1_2", 
          question: "If a car is moving at constant velocity, the net force acting on it is:",
          options: ["Maximum", "Minimum", "Zero", "Cannot be determined"],
          correct: 2,
          explanation: "At constant velocity, acceleration is zero, so net force = ma = 0.",
          difficulty: "easy",
          tags: ["newton-laws", "velocity"]
        },
        {
          id: "mech_l1_3",
          question: "The SI unit of force is:",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correct: 1,
          explanation: "Newton (N) is the SI unit of force, named after Sir Isaac Newton.",
          difficulty: "easy",
          tags: ["units", "force"]
        },
        {
          id: "mech_l1_4",
          question: "Which quantity has both magnitude and direction?",
          options: ["Speed", "Distance", "Velocity", "Time"],
          correct: 2,
          explanation: "Velocity is a vector quantity with both magnitude and direction.",
          difficulty: "easy",
          tags: ["vectors", "velocity"]
        },
        {
          id: "mech_l1_5",
          question: "Acceleration is the rate of change of:",
          options: ["Distance", "Displacement", "Velocity", "Speed"],
          correct: 2,
          explanation: "Acceleration = change in velocity / time taken",
          difficulty: "easy",
          tags: ["acceleration", "velocity"]
        }
      ],
      2: [
        {
          id: "mech_l2_1",
          question: "A 2kg object experiences a net force of 10N. Its acceleration is:",
          options: ["5 m/s²", "20 m/s²", "12 m/s²", "8 m/s²"],
          correct: 0,
          explanation: "Using F = ma, a = F/m = 10N/2kg = 5 m/s²",
          difficulty: "medium",
          tags: ["newton-laws", "calculation"]
        },
        {
          id: "mech_l2_2",
          question: "A ball is thrown upward. At the highest point, which statement is correct?",
          options: ["Velocity is maximum", "Acceleration is zero", "Velocity is zero", "Both velocity and acceleration are zero"],
          correct: 2,
          explanation: "At the highest point, velocity becomes zero but acceleration due to gravity (9.8 m/s²) remains constant.",
          difficulty: "medium",
          tags: ["projectile", "gravity"]
        },
        {
          id: "mech_l2_3",
          question: "Two forces of 3N and 4N act perpendicular to each other. The resultant force is:",
          options: ["7N", "1N", "5N", "12N"],
          correct: 2,
          explanation: "Using Pythagoras theorem: R = √(3² + 4²) = √(9 + 16) = √25 = 5N",
          difficulty: "medium",
          tags: ["vectors", "resultant"]
        }
      ],
      3: [
        {
          id: "mech_l3_1",
          question: "A block slides down a 30° incline with coefficient of friction 0.2. If g=10m/s², the acceleration is:",
          options: ["3.27 m/s²", "6.73 m/s²", "5.0 m/s²", "8.66 m/s²"],
          correct: 0,
          explanation: "a = g(sin30° - μcos30°) = 10(0.5 - 0.2×0.866) = 10(0.5 - 0.173) = 3.27 m/s²",
          difficulty: "hard",
          tags: ["friction", "incline", "forces"]
        },
        {
          id: "mech_l3_2",
          question: "A satellite orbits Earth at height h. If Earth's radius is R, the orbital velocity is proportional to:",
          options: ["√(R+h)", "√(1/(R+h))", "1/(R+h)", "(R+h)²"],
          correct: 1,
          explanation: "Orbital velocity v = √(GM/(R+h)), so v ∝ √(1/(R+h))",
          difficulty: "hard",
          tags: ["orbital", "gravity", "satellite"]
        }
      ]
    }
  },
  "chemistry-atomic": {
    topicName: "Atomic Structure",
    levels: {
      1: [
        {
          id: "atom_l1_1",
          question: "The nucleus of an atom contains:",
          options: ["Protons only", "Neutrons only", "Protons and neutrons", "Electrons and protons"],
          correct: 2,
          explanation: "The nucleus contains protons (positive charge) and neutrons (no charge). Electrons orbit around the nucleus.",
          difficulty: "easy",
          tags: ["nucleus", "particles"]
        },
        {
          id: "atom_l1_2",
          question: "The atomic number represents:",
          options: ["Number of neutrons", "Number of protons", "Number of electrons", "Mass of atom"],
          correct: 1,
          explanation: "Atomic number = number of protons in the nucleus, which defines the element.",
          difficulty: "easy",
          tags: ["atomic-number", "protons"]
        },
        {
          id: "atom_l1_3",
          question: "Electrons are found in:",
          options: ["Nucleus", "Orbitals around nucleus", "Center of atom", "Between protons"],
          correct: 1,
          explanation: "Electrons move in orbitals (energy levels) around the nucleus.",
          difficulty: "easy",
          tags: ["electrons", "orbitals"]
        }
      ],
      2: [
        {
          id: "atom_l2_1",
          question: "An atom with 6 protons and 8 neutrons has mass number:",
          options: ["6", "8", "14", "2"],
          correct: 2,
          explanation: "Mass number = number of protons + number of neutrons = 6 + 8 = 14",
          difficulty: "medium",
          tags: ["mass-number", "calculation"]
        },
        {
          id: "atom_l2_2",
          question: "Isotopes are atoms with:",
          options: ["Same protons, different electrons", "Same neutrons, different protons", "Same protons, different neutrons", "Same mass number"],
          correct: 2,
          explanation: "Isotopes have the same number of protons but different numbers of neutrons.",
          difficulty: "medium",
          tags: ["isotopes", "neutrons"]
        }
      ],
      3: [
        {
          id: "atom_l3_1",
          question: "The electronic configuration of Chromium (Z=24) is:",
          options: ["[Ar] 3d⁴ 4s²", "[Ar] 3d⁵ 4s¹", "[Ar] 3d⁶", "[Ar] 4s² 3d⁴"],
          correct: 1,
          explanation: "Chromium has exceptional configuration [Ar] 3d⁵ 4s¹ for extra stability due to half-filled d orbitals.",
          difficulty: "hard",
          tags: ["electronic-configuration", "exceptions"]
        }
      ]
    }
  },
  "math-algebra": {
    topicName: "Algebra & Equations",
    levels: {
      1: [
        {
          id: "alg_l1_1",
          question: "Solve: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 9", "x = 3"],
          correct: 0,
          explanation: "2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4",
          difficulty: "easy",
          tags: ["linear-equations", "solve"]
        },
        {
          id: "alg_l1_2",
          question: "What is the value of 3x² when x = 2?",
          options: ["6", "12", "9", "18"],
          correct: 1,
          explanation: "3x² = 3 × (2)² = 3 × 4 = 12",
          difficulty: "easy",
          tags: ["substitution", "power"]
        }
      ],
      2: [
        {
          id: "alg_l2_1",
          question: "Factorize: x² - 9",
          options: ["(x-3)(x-3)", "(x+3)(x+3)", "(x+3)(x-3)", "Cannot be factorized"],
          correct: 2,
          explanation: "x² - 9 = x² - 3² = (x+3)(x-3) [Difference of squares formula]",
          difficulty: "medium",
          tags: ["factorization", "difference-of-squares"]
        }
      ],
      3: [
        {
          id: "alg_l3_1",
          question: "Find the discriminant of 2x² + 3x - 1 = 0",
          options: ["17", "7", "11", "5"],
          correct: 0,
          explanation: "Discriminant = b² - 4ac = 3² - 4(2)(-1) = 9 + 8 = 17",
          difficulty: "hard",
          tags: ["quadratic", "discriminant"]
        }
      ]
    }
  }
};

const StudyNowPage = () => {
  // Core State
  const [selectedSubject, setSelectedSubject] = useState("");
  const [todayGoal, setTodayGoal] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');

  // Progress tracking state
  const [progressData, setProgressData] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [strengthWeaknessData, setStrengthWeaknessData] = useState(null);
  
  // Practice session state
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, timeSpent: 0 });
  const [levelUpNotification, setLevelUpNotification] = useState(null);

  // Initialize progress on mount
  useEffect(() => {
    const initializeProgress = () => {
      const data = progressService.initializeProgress();
      const stats = progressService.getOverallStats();
      const swAnalysis = progressService.getStrengthWeaknessAnalysis();
      
      setProgressData(data);
      setOverallStats(stats);
      setStrengthWeaknessData(swAnalysis);
    };

    initializeProgress();
  }, []);

  // Start question timer
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion]);

  // Smart Topic Data with Adaptive Levels
  const topics = [
    {
      id: "physics-mechanics",
      subject: "Physics", 
      name: "Mechanics & Motion",
      description: "Newton's laws, motion, forces",
      icon: Target,
      color: "bg-blue-500",
      totalQuestions: getTotalQuestionsForTopic("physics-mechanics"),
      currentLevel: getTopicLevel("physics-mechanics"),
      accuracy: getTopicAccuracy("physics-mechanics"),
      questionsAttempted: getTopicQuestionsAttempted("physics-mechanics"),
      isUnlocked: true,
      nextLevelRequirement: getNextLevelRequirement("physics-mechanics")
    },
    {
      id: "chemistry-atomic",
      subject: "Chemistry",
      name: "Atomic Structure", 
      description: "Atoms, electrons, periodic table",
      icon: Beaker,
      color: "bg-green-500",
      totalQuestions: getTotalQuestionsForTopic("chemistry-atomic"),
      currentLevel: getTopicLevel("chemistry-atomic"),
      accuracy: getTopicAccuracy("chemistry-atomic"),
      questionsAttempted: getTopicQuestionsAttempted("chemistry-atomic"),
      isUnlocked: true,
      nextLevelRequirement: getNextLevelRequirement("chemistry-atomic")
    },
    {
      id: "math-algebra",
      subject: "Mathematics",
      name: "Algebra & Equations",
      description: "Linear, quadratic equations, factorization", 
      icon: Calculator,
      color: "bg-purple-500",
      totalQuestions: getTotalQuestionsForTopic("math-algebra"),
      currentLevel: getTopicLevel("math-algebra"),
      accuracy: getTopicAccuracy("math-algebra"),
      questionsAttempted: getTopicQuestionsAttempted("math-algebra"),
      isUnlocked: true,
      nextLevelRequirement: getNextLevelRequirement("math-algebra")
    }
  ];

  // Helper Functions
  function getTotalQuestionsForTopic(topicId: string): number {
    const topicData = (QUESTION_DATABASE as any)[topicId];
    if (!topicData) return 0;
    const levels = Object.values(topicData.levels) as Array<any[]>;
    return levels.reduce((total, level) => total + (level?.length ?? 0), 0);
  }

  function getTopicLevel(topicId) {
    const stats = progressService.getTopicStats(topicId);
    return stats?.level || 1;
  }

  function getTopicAccuracy(topicId) {
    const stats = progressService.getTopicStats(topicId);
    return stats?.accuracy || 0;
  }

  function getTopicQuestionsAttempted(topicId) {
    const stats = progressService.getTopicStats(topicId);
    return stats?.questionsAttempted || 0;
  }

  function getNextLevelRequirement(topicId) {
    const currentLevel = getTopicLevel(topicId);
    const stats = progressService.getTopicStats(topicId);
    const levelReq = progressService.LEVEL_REQUIREMENTS[currentLevel];
    
    if (!levelReq || currentLevel >= 3) return null;
    
    const questionsNeeded = Math.max(0, levelReq.questionsNeeded - (stats?.questionsAttempted || 0));
    const accuracyNeeded = levelReq.accuracyRequired;
    
    return {
      questionsNeeded,
      accuracyNeeded,
      currentAccuracy: stats?.accuracy || 0
    };
  }

  // Smart Question Generation
  function generateAdaptiveQuestions(topicId, count = 10) {
    const topicData = QUESTION_DATABASE[topicId];
    if (!topicData) return [];

    const currentLevel = getTopicLevel(topicId);
    const accuracy = getTopicAccuracy(topicId);
    const questionsAttempted = getTopicQuestionsAttempted(topicId);
    
    let questions = [];
    
    // Adaptive Logic:
    if (currentLevel === 1) {
      questions = [...topicData.levels[1]];
    } else if (currentLevel === 2) {
      if (accuracy >= 0.8 && questionsAttempted >= 10) {
        questions = [
          ...topicData.levels[2],
          ...(topicData.levels[3] || []).slice(0, 2)
        ];
      } else if (accuracy < 0.6) {
        questions = [
          ...topicData.levels[1].slice(0, 2),
          ...topicData.levels[2]
        ];
      } else {
        questions = [...topicData.levels[2]];
      }
    } else if (currentLevel === 3) {
      questions = [
        ...topicData.levels[2].slice(0, 1),
        ...topicData.levels[3]
      ];
    }
    
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Start Practice Session
  const startPracticeSession = (topicId) => {
    const questions = generateAdaptiveQuestions(topicId, 10);
    if (questions.length === 0) {
      alert("No questions available for this topic!");
      return;
    }

    setActiveTopic(topicId);
    setSessionQuestions(questions);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionStats({ correct: 0, total: 0, timeSpent: 0 });
  };

  // Handle Answer Selection
  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  // Submit Answer with Progress Tracking
  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const timeSpent = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 30;
    
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      timeSpent: prev.timeSpent + timeSpent
    }));

    const result = progressService.recordQuestionAttempt(
      activeTopic,
      QUESTION_DATABASE[activeTopic]?.topicName || 'Unknown Topic',
      isCorrect,
      timeSpent,
      'multiple_choice'
    );
    
    setProgressData(result.progressData);
    setOverallStats(progressService.getOverallStats());
    setStrengthWeaknessData(progressService.getStrengthWeaknessAnalysis());
    
    if (result.leveledUp) {
      setLevelUpNotification({
        topicName: QUESTION_DATABASE[activeTopic]?.topicName,
        newLevel: result.newLevel,
        show: true
      });
      
      setTimeout(() => {
        setLevelUpNotification(null);
      }, 5000);
    }
  };

  // Next Question
  const nextQuestion = () => {
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(sessionQuestions[nextIndex]);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeSession();
    }
  };

  // Complete Session
  const completeSession = () => {
    setActiveTopic(null);
    setCurrentQuestion(null);
    setSessionQuestions([]);
    
    setOverallStats(progressService.getOverallStats());
    setStrengthWeaknessData(progressService.getStrengthWeaknessAnalysis());
  };

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Practice Session UI
  if (activeTopic && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / sessionQuestions.length) * 100;
    const currentTopicData = topics.find(t => t.id === activeTopic);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto max-w-4xl">
            {/* Level Up Notification */}
            {levelUpNotification?.show && (
              <Card className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-bounce">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Trophy className="w-8 h-8" />
                    <div className="text-center">
                      <h3 className="text-xl font-bold">🎉 LEVEL UP! 🎉</h3>
                      <p>You've reached Level {levelUpNotification.newLevel} in {levelUpNotification.topicName}!</p>
                    </div>
                    <Star className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Header */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={completeSession}
                className="flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                End Session
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-bold">{currentTopicData?.name}</h2>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {sessionQuestions.length}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Session Stats</div>
                <div className="text-lg font-bold text-primary">
                  {sessionStats.correct}/{sessionStats.total} correct
                </div>
                <div className="text-sm text-gray-500">
                  {sessionStats.total > 0 ? Math.round((sessionStats.correct/sessionStats.total)*100) : 0}% accuracy
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Session Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Level {getTopicLevel(activeTopic)} Question</span>
                  <Badge className={`${getLevelColor(getTopicLevel(activeTopic)).light} ${getLevelColor(getTopicLevel(activeTopic)).text}`}>
                    {currentQuestion.difficulty}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                          selectedAnswer === index
                            ? showResult
                              ? index === currentQuestion.correct
                                ? "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-200"
                                : "bg-red-100 border-red-500 text-red-800 ring-2 ring-red-200"
                              : "bg-blue-100 border-blue-500 ring-2 ring-blue-200"
                            : showResult && index === currentQuestion.correct
                            ? "bg-green-100 border-green-500 text-green-800"
                            : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                      selectedAnswer === currentQuestion.correct
                        ? "bg-green-50 border-green-400"
                        : "bg-red-50 border-red-400"
                    }`}>
                      <div className="flex items-start">
                        {selectedAnswer === currentQuestion.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className="font-semibold mb-2">
                            {selectedAnswer === currentQuestion.correct ? "Correct! 🎉" : "Incorrect 😔"}
                          </h4>
                          <p className="text-gray-700">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  {!showResult ? (
                    <Button 
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="px-8 py-3"
                      size="lg"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion} className="px-8 py-3" size="lg">
                      {currentQuestionIndex < sessionQuestions.length - 1 ? "Next Question" : "Complete Session"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Practice & Progress 🚀
                </h1>
                <p className="text-xl text-gray-600">
                  Adaptive learning system - questions get smarter as you do!
                </p>
                {overallStats?.motivationalMessage && (
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    💡 {overallStats.motivationalMessage}
                  </p>
                )}
              </div>
              
              {/* ✨ UPDATED: Today's Progress with Daily Stats */}
              <div className="text-right bg-white rounded-xl p-6 shadow-lg">
                <div className="text-sm text-gray-600">Today's Progress</div>
                <div className="text-3xl font-bold text-primary">
                  {overallStats?.dailyQuestions || 0}/{todayGoal}
                </div>
                <div className="text-sm text-gray-600 mb-3">questions solved today</div>
                <Progress 
                  value={((overallStats?.dailyQuestions || 0) / todayGoal) * 100} 
                  className="mt-2 h-3"
                />
                <div className="text-xs text-gray-500 mt-2">
                  Today's Accuracy: {Math.round((overallStats?.dailyAccuracy || 0) * 100)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Total: {overallStats?.totalQuestions || 0} questions
                </div>
              </div>
            </div>

            {/* ✨ UPDATED: Stats Dashboard with Daily Focus */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round(((overallStats?.dailyQuestions || 0) / todayGoal) * 100)}%
                  </div>
                  <div className="text-sm opacity-90">Daily Goal</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-400 to-red-600 text-white">
                <CardContent className="p-4 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{overallStats?.studyStreak || 0}</div>
                  <div className="text-sm opacity-90">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round((overallStats?.dailyAccuracy || 0) * 100)}%
                  </div>
                  <div className="text-sm opacity-90">Today's Accuracy</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <CardContent className="p-4 text-center">
                  <Layers className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{overallStats?.dailyTopicsStudied || 0}</div>
                  <div className="text-sm opacity-90">Topics Today</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            {strengthWeaknessData && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {strengthWeaknessData.strengths.length}
                      </div>
                      <div className="text-sm text-green-700 font-medium">Strong Topics</div>
                      <div className="text-xs text-green-600 mt-1">80%+ accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 mb-1">
                        {strengthWeaknessData.moderate.length}
                      </div>
                      <div className="text-sm text-yellow-700 font-medium">Moderate Topics</div>
                      <div className="text-xs text-yellow-600 mt-1">60-79% accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        {strengthWeaknessData.weaknesses.length}
                      </div>
                      <div className="text-sm text-red-700 font-medium">Focus Areas</div>
                      <div className="text-xs text-red-600 mt-1">&lt;60% accuracy</div>
                    </div>
                  </div>
                  
                  {strengthWeaknessData.weaknesses.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Quick Recommendation
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Focus on <strong>{strengthWeaknessData.weaknesses[0].topicName}</strong> 
                        - you have {strengthWeaknessData.weaknesses[0].accuracy}% accuracy. 
                        Practice more to improve!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedSubject === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject("")}
                  >
                    All Subjects
                  </Button>
                  <Button
                    variant={selectedSubject === "Physics" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject("Physics")}
                  >
                    Physics
                  </Button>
                  <Button
                    variant={selectedSubject === "Chemistry" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject("Chemistry")}
                  >
                    Chemistry
                  </Button>
                  <Button
                    variant={selectedSubject === "Mathematics" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject("Mathematics")}
                  >
                    Mathematics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const IconComponent = topic.icon;
              const levelColor = getLevelColor(topic.currentLevel);
              const accuracyColor = getAccuracyColor(topic.accuracy);
              
              return (
                <Card key={topic.id} className="hover:shadow-lg transition-all duration-200 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${topic.color} bg-opacity-10`}>
                        <IconComponent className={`w-6 h-6 ${topic.color.replace('bg-', 'text-')}`} />
                      </div>
                      <Badge className={`${levelColor.light} ${levelColor.text}`}>
                        Level {topic.currentLevel}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {topic.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{topic.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {topic.questionsAttempted}
                        </div>
                        <div className="text-xs text-gray-600">Questions Done</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className={`text-lg font-bold ${accuracyColor}`}>
                          {Math.round(topic.accuracy * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>

                    {/* Level Progress */}
                    {topic.nextLevelRequirement && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Level Progress</span>
                          <span className="font-medium">
                            Level {topic.currentLevel + 1}
                          </span>
                        </div>
                        <Progress 
                          value={topic.nextLevelRequirement.questionsNeeded === 0 ? 100 : 
                            Math.max(0, 100 - (topic.nextLevelRequirement.questionsNeeded / progressService.LEVEL_REQUIREMENTS[topic.currentLevel].questionsNeeded) * 100)} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500 space-y-1">
                          {topic.nextLevelRequirement.questionsNeeded > 0 && (
                            <div>📚 {topic.nextLevelRequirement.questionsNeeded} more questions needed</div>
                          )}
                          {topic.nextLevelRequirement.currentAccuracy < topic.nextLevelRequirement.accuracyNeeded && (
                            <div>
                              🎯 Need {Math.round(topic.nextLevelRequirement.accuracyNeeded * 100)}% accuracy 
                              (current: {Math.round(topic.nextLevelRequirement.currentAccuracy * 100)}%)
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={() => startPracticeSession(topic.id)}
                        className="w-full"
                        size="lg"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start Practice Session
                      </Button>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>📊 {topic.totalQuestions} total questions</span>
                        <span>⚡ Adaptive difficulty</span>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    {topic.questionsAttempted > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center text-xs text-gray-600">
                          <Activity className="w-3 h-3 mr-1" />
                          {topic.accuracy >= 0.8 ? (
                            <span className="text-green-600">🔥 Strong performance!</span>
                          ) : topic.accuracy >= 0.6 ? (
                            <span className="text-yellow-600">📈 Good progress</span>
                          ) : (
                            <span className="text-red-600">💪 Needs more practice</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Topics Found */}
          {filteredTopics.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No topics found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}

          {/* Study Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Smart Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Cpu className="w-4 h-4 mr-2" />
                    Adaptive Learning
                  </div>
                  <p className="text-blue-700">
                    Questions automatically adjust to your skill level. Master basics before advancing!
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Focus Areas
                  </div>
                  <p className="text-green-700">
                    System identifies weak areas and gives you more practice where you need it most.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Level Up
                  </div>
                  <p className="text-purple-700">
                    Achieve 70%+ accuracy with enough practice to unlock harder questions!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyNowPage;
