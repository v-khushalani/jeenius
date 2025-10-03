import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Flag,
  Trophy,
  X,
  Menu,
} from "lucide-react";

// Mock data for demo
const mockTest = {
  id: "1",
  title: "JEE-Main",
  subject: "Physics - Mechanics",
  questions: Array.from({ length: 75 }, (_, i) => ({
    id: `q${i + 1}`,
    question: `Question ${i + 1}: A particle of mass m moves with velocity v. What is its ${
      i % 3 === 0 ? "momentum" : i % 3 === 1 ? "energy" : "acceleration"
    }?`,
    option_a: "Option 1 - Some detailed physics explanation here",
    option_b: "Option 2 - Another physics concept explanation",
    option_c: "Option 3 - Third possible answer",
    option_d: "Option 4 - Fourth alternative solution",
    correct_option: "A",
    topic: "Kinematics",
    chapter: "Motion in One Dimension",
    difficulty: "Medium",
  })),
  duration: 180,
  startTime: new Date().toISOString(),
};

const TestAttemptPage = () => {
  const [testSession] = useState(mockTest);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(10753);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (option) => {
    const currentQuestion = testSession.questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        questionId: currentQuestion.id,
        selectedOption: option,
        isMarkedForReview: prev[currentQuestion.id]?.isMarkedForReview || false,
      },
    }));
  };

  const handleMarkForReview = () => {
    const currentQuestion = testSession.questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        questionId: currentQuestion.id,
        selectedOption: prev[currentQuestion.id]?.selectedOption || "",
        isMarkedForReview: !prev[currentQuestion.id]?.isMarkedForReview,
      },
    }));
  };

  const navigateQuestion = (direction) => {
    let newIndex;
    if (typeof direction === "number") {
      newIndex = direction;
      setShowPalette(false);
    } else {
      newIndex =
        direction === "next"
          ? Math.min(currentQuestionIndex + 1, testSession.questions.length - 1)
          : Math.max(currentQuestionIndex - 1, 0);
    }
    setCurrentQuestionIndex(newIndex);
  };

  const saveAndNext = () => {
    navigateQuestion("next");
  };

  const clearResponse = () => {
    const currentQuestion = testSession.questions[currentQuestionIndex];
    setUserAnswers((prev) => {
      const updated = { ...prev };
      if (updated[currentQuestion.id]) {
        updated[currentQuestion.id].selectedOption = "";
      }
      return updated;
    });
  };

  const getQuestionStatus = (questionIndex) => {
    const question = testSession.questions[questionIndex];
    const userAnswer = userAnswers[question.id];

    if (!userAnswer) return "not-visited";
    if (userAnswer.selectedOption && userAnswer.isMarkedForReview)
      return "answered-marked";
    if (userAnswer.isMarkedForReview) return "marked";
    if (userAnswer.selectedOption) return "answered";
    return "not-answered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white hover:bg-green-600";
      case "marked":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "answered-marked":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "not-answered":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-gray-300 text-gray-700 hover:bg-gray-400";
    }
  };

  const currentQuestion = testSession.questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestion?.id];
  const answeredCount = Object.values(userAnswers).filter(
    (a) => a.selectedOption && !a.isMarkedForReview
  ).length;
  const notAnsweredCount = Object.values(userAnswers).filter(
    (a) => !a.selectedOption && Object.keys(userAnswers).includes(a.questionId)
  ).length;
  const markedCount = Object.values(userAnswers).filter(
    (a) => a.isMarkedForReview && !a.selectedOption
  ).length;
  const answeredMarkedCount = Object.values(userAnswers).filter(
    (a) => a.isMarkedForReview && a.selectedOption
  ).length;
  const notVisitedCount =
    testSession.questions.length - Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="lg:hidden p-2 hover:bg-blue-500 rounded transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold">{testSession.title}</h1>
                <p className="text-xs text-blue-100">{testSession.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center hidden sm:block">
                <div className="text-sm text-blue-100">Candidate Name</div>
                <div className="text-xs font-medium">[Your Name]</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg px-3 py-2">
                <div
                  className={`text-xl font-bold ${
                    timeRemaining < 300 ? "text-red-300" : ""
                  }`}
                >
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-blue-100">Time Left</div>
              </div>
            </div>
          </div>
        </div>
      </div
