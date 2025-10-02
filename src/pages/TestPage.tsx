import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen, Trophy, Play, Clock, Target, FileText, ArrowLeft, CheckCircle2,
  TrendingUp, Zap, Users, Star, Award, Brain, Sparkles
} from "lucide-react";

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState("");
  const [subjects] = useState(["Physics", "Chemistry", "Mathematics"]);
  const [chapters] = useState({
    "Physics": ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism"],
    "Chemistry": ["Organic", "Inorganic", "Physical Chemistry"],
    "Mathematics": ["Calculus", "Algebra", "Trigonometry", "Coordinate Geometry"]
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [liveUsers, setLiveUsers] = useState(247);
  const [userStats] = useState({
    testsCompleted: 23, averageScore: 78, streak: 5, rank: 142,
    strongSubject: "Physics", weakSubject: "Chemistry"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => {
      const newSelection = prev.includes(subject) 
        ? prev.filter(s => s !== subject) : [...prev, subject];
      const newChapters = newSelection.flatMap(s => 
        chapters[s]?.map(ch => ({ subject: s, chapter: ch })) || []
      );
      setAvailableChapters(newChapters);
      setSelectedChapters(prevChapters => 
        prevChapters.filter(ch => newChapters.some(nc => nc.subject === ch.subject && nc.chapter === ch.chapter))
      );
      return newSelection;
    });
  };

  const handleChapterToggle = (subject, chapter) => {
    setSelectedChapters(prev => {
      const exists = prev.some(ch => ch.subject === subject && ch.chapter === chapter);
      return exists ? prev.filter(ch => !(ch.subject === subject && ch.chapter === chapter))
        : [...prev, { subject, chapter }];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-black mb-3 text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
            Loading Your Tests...
          </h2>
          <p className="text-gray-400 mb-6">Setting up your personalized test environment</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!testMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            <div className="mb-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Master Your JEE Journey
                </h1>
                <p className="text-xl text-gray-300 mb-8">AI-powered personalized testing for top rankers</p>
                
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-bold">{liveUsers}</span>
                    <span className="text-green-300/70 text-sm">students testing now</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 font-bold">{userStats.streak}</span>
                    <span className="text-orange-300/70 text-sm">day streak 🔥</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 font-bold">#{userStats.rank}</span>
                    <span className="text-blue-300/70 text-sm">in leaderboard</span>
                  </div>
                </div>

                <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
                  <div className="grid grid-cols-3 gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                        {userStats.testsCompleted}
                      </div>
                      <div className="text-sm text-gray-400">Tests Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2">
                        {userStats.averageScore}%
                      </div>
                      <div className="text-sm text-gray-400">Average Score</div>
                    </div>
                    <div className="text-center">
                      <Brain className="w-12 h-12 mx-auto mb-2 text-transparent bg-gradient-to-r from-purple-400 to-pink-400" style={{filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'}} />
                      <div className="text-sm text-gray-400">AI Insights Ready</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Strong: {userStats.strongSubject}
                    </Badge>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2">
                      <Target className="w-4 h-4 mr-1" />
                      Focus: {userStats.weakSubject}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div 
                className="group relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-blue-500/50"
                onClick={() => setTestMode("chapter")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/10 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/50">
                    <BookOpen className="w-12 h-12 text-blue-300" />
                  </div>
                  
                  <h3 className="text-3xl font-black mb-3 text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text">
                    Chapter-wise Test
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Select multiple chapters for laser-focused practice and rapid improvement
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">25</div>
                        <div className="text-gray-500 text-xs">Questions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">60</div>
                        <div className="text-gray-500 text-xs">Minutes</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-6 text-lg rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Select Chapters
                  </Button>
                  
                  <Badge className="mt-4 bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                    Beginner Friendly
                  </Badge>
                </div>
              </div>

              <div 
                className="group relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/50 to-pink-950/50 backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-purple-500/50"
                onClick={() => setTestMode("subject")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-600/10 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/50">
                    <Target className="w-12 h-12 text-purple-300" />
                  </div>
                  
                  <h3 className="text-3xl font-black mb-3 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                    Subject-wise Test
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Master entire subjects with comprehensive question coverage
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">25</div>
                        <div className="text-gray-500 text-xs">Questions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-pink-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">60</div>
                        <div className="text-gray-500 text-xs">Minutes</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 text-lg rounded-2xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                    <Brain className="w-5 h-5 mr-2" />
                    Select Subjects
                  </Button>
                  
                  <Badge className="mt-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-3 py-1">
                    Intermediate Level
                  </Badge>
                </div>
              </div>

              <div 
                className="group relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-950/50 to-red-950/50 backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-orange-500/50"
                onClick={() => alert('Starting Full Mock Test...')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 via-orange-600/10 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                    <Award className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                
                <div className="relative p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-500/50">
                    <Trophy className="w-12 h-12 text-orange-300" />
                  </div>
                  
                  <h3 className="text-3xl font-black mb-3 text-transparent bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text">
                    Full Syllabus Mock
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Complete JEE pattern mock test for real exam simulation
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-orange-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">75</div>
                        <div className="text-gray-500 text-xs">Questions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-red-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-xl">180</div>
                        <div className="text-gray-500 text-xs">Minutes</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-6 text-lg rounded-2xl shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
                    <Play className="w-5 h-5 mr-2" />
                    Start Mock Test
                  </Button>
                  
                  <Badge className="mt-4 bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1">
                    Advanced • JEE Pattern
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/50">
                  <Brain className="w-10 h-10 text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3 flex items-center gap-2">
                    AI Recommendation
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </h3>
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    Based on your recent performance, we recommend focusing on <span className="font-bold text-purple-300">{userStats.weakSubject}</span> chapter tests. 
                    You've shown strong improvement in <span className="font-bold text-green-300">{userStats.strongSubject}</span>! Keep up the momentum! 🚀
                  </p>
                  <Button 
                    className="border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm px-6 py-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setTestMode("chapter")}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Start Recommended Test
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testMode === "chapter") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              className="mb-8 border-2 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold"
              onClick={() => {
                setTestMode("");
                setSelectedSubjects([]);
                setSelectedChapters([]);
                setAvailableChapters([]);
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Test Selection
            </Button>

            <Card className="border border-blue-500/20 shadow-2xl bg-gradient-to-br from-gray-900/90 to-blue-950/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-blue-500/20 p-8">
                <CardTitle className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <BookOpen className="w-8 h-8 text-blue-300" />
                  </div>
                  Chapter-wise Test Setup
                </CardTitle>
                <p className="text-gray-400 text-lg mt-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Select subjects first, then choose specific chapters to master
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/50">
                      1
                    </div>
                    Select Subjects
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                      <div 
                        key={subject}
                        className="group relative overflow-hidden p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105"
                        style={{
                          borderColor: selectedSubjects.includes(subject) ? '#3b82f6' : '#1e293b',
                          backgroundColor: selectedSubjects.includes(subject) ? '#1e3a8a20' : '#0f172a',
                          boxShadow: selectedSubjects.includes(subject) ? '0 0 30px #3b82f650' : 'none'
                        }}
                        onClick={() => handleSubjectToggle(subject)}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative flex items-center space-x-4">
                          <Checkbox 
                            checked={selectedSubjects.includes(subject)}
                            className="w-6 h-6 border-blue-400 data-[state=checked]:bg-blue-600"
                          />
                          <label className="cursor-pointer flex-1">
                            <div className="font-bold text-xl text-white mb-1">{subject}</div>
                            <div className="text-sm text-gray-400">{chapters[subject]?.length || 0} chapters available</div>
                          </label>
                          {selectedSubjects.includes(subject) && (
                            <CheckCircle2 className="w-7 h-7 text-blue-400 animate-pulse" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSubjects.length > 0 && (
                  <div className="mb-10 animate-fadeIn">
                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/50">
                        2
                      </div>
                      Select Chapters
                      <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 text-base">
                        {selectedChapters.length} selected
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      {availableChapters.map(({ subject, chapter }) => (
                        <div 
                          key={`${subject}-${chapter}`}
                          className="group relative overflow-hidden p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-102"
                          style={{
                            borderColor: selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter) ? '#8b5cf6' : '#1e293b',
                            backgroundColor: selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter) ? '#5b21b620' : '#0f172a',
                            boxShadow: selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter) ? '0 0 25px #8b5cf650' : 'none'
                          }}
                          onClick={() => handleChapterToggle(subject, chapter)}
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative flex items-center space-x-3">
                            <Checkbox 
                              checked={selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter)}
                              className="w-5 h-5 border-purple-400 data-[state=checked]:bg-purple-600"
                            />
                            <label className="cursor-pointer flex-1">
                              <span className="font-semibold text-white text-lg block mb-1">{chapter}</span>
                              <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                                {subject}
                              </Badge>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChapters.length > 0 && (
                  <div className="flex items-center justify-between p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 backdrop-blur-xl animate-slideUp shadow-xl">
                    <div>
                      <p className="font-black text-3xl text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text mb-2">
                        {selectedChapters.length} Chapter{selectedChapters.length > 1 ? 's' : ''} Selected
                      </p>
                      <div className="flex items-center gap-6 text-base text-gray-400">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          <span className="font-semibold">25 Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">60 Minutes</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => alert('Starting Test...')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-7 text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Start Test Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (testMode === "subject") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              className="mb-8 border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold"
              onClick={() => {
                setTestMode("");
                setSelectedSubjects([]);
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Test Selection
            </Button>

            <Card className="border border-purple-500/20 shadow-2xl bg-gradient-to-br from-gray-900/90 to-purple-950/50 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-b border-purple-500/20 p-8">
                <CardTitle className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <Target className="w-8 h-8 text-purple-300" />
                  </div>
                  Subject-wise Test Setup
                </CardTitle>
                <p className="text-gray-400 text-lg mt-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Choose subjects to test your comprehensive understanding
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {subjects.map((subject, index) => {
                    const colors = [
                      { border: '#3b82f6', bg: '#1e3a8a20', glow: '#3b82f650', icon: '⚛️' },
                      { border: '#8b5cf6', bg: '#5b21b620', glow: '#8b5cf650', icon: '🧪' },
                      { border: '#f59e0b', bg: '#78350f20', glow: '#f59e0b50', icon: '📐' }
                    ];
                    const color = colors[index % 3];
                    
                    return (
                      <div 
                        key={subject}
                        className="group relative overflow-hidden p-8 border-2 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105"
                        style={{
                          borderColor: selectedSubjects.includes(subject) ? color.border : '#1e293b',
                          backgroundColor: selectedSubjects.includes(subject) ? color.bg : '#0f172a',
                          boxShadow: selectedSubjects.includes(subject) ? `0 0 40px ${color.glow}` : 'none'
                        }}
                        onClick={() => handleSubjectToggle(subject)}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
                          style={{ backgroundColor: `${color.border}20` }}
                        ></div>
                        
                        <div className="relative">
                          <div className="flex items-start justify-between mb-6">
                            <Checkbox 
                              checked={selectedSubjects.includes(subject)}
                              className="w-6 h-6 border-2 data-[state=checked]:bg-gradient-to-br"
                              style={{ borderColor: color.border }}
                            />
                            {selectedSubjects.includes(subject) && (
                              <CheckCircle2 className="w-9 h-9 animate-pulse" style={{ color: color.border }} />
                            )}
                          </div>
                          
                          <div className="text-5xl mb-4 text-center">{color.icon}</div>
                          <div className="font-black text-3xl text-white mb-3 text-center">{subject}</div>
                          <div className="text-sm text-gray-400 mb-6 text-center">
                            {chapters[subject]?.length || 0} chapters • Complete coverage
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="h-3 flex-1 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                  width: selectedSubjects.includes(subject) ? '100%' : '0%',
                                  background: `linear-gradient(90deg, ${color.border}, ${color.glow})`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-500">
                              {selectedSubjects.includes(subject) ? '100%' : '0%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedSubjects.length > 0 && (
                  <div className="flex items-center justify-between p-8 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 backdrop-blur-xl animate-slideUp shadow-xl">
                    <div>
                      <p className="font-black text-3xl text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text mb-3">
                        {selectedSubjects.length} Subject{selectedSubjects.length > 1 ? 's' : ''} Selected
                      </p>
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center shadow-lg">
                            <FileText className="w-7 h-7 text-purple-300" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xl">25</div>
                            <div className="text-xs text-gray-400">Questions</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center shadow-lg">
                            <Clock className="w-7 h-7 text-pink-300" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xl">60</div>
                            <div className="text-xs text-gray-400">Minutes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => alert('Starting Test...')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-7 text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 group"
                    >
                      <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                      Start Test Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.6s ease-out;
  }

  .hover\\:scale-102:hover {
    transform: scale(1.02);
  }
`;
if (!document.head.querySelector('style[data-test-page]')) {
  style.setAttribute('data-test-page', 'true');
  document.head.appendChild(style);
}

export default TestPage;
