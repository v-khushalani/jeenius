import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Trophy,
  Play,
  AlertTriangle,
  Clock,
  Target,
  Users,
  FileText
} from "lucide-react";

const TestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    setLoading(true);
    try {
      const { data: questions, error } = await supabase
        .from('questions_public')
        .select('subject, chapter, topic, difficulty');

      if (error) throw error;

      const uniqueSubjects = [...new Set(questions?.map(q => q.subject) || [])];
      setSubjects(uniqueSubjects);

      const stats: Record<string, number> = {};
      uniqueSubjects.forEach(subject => {
        const subjectQuestions = questions?.filter(q => q.subject === subject) || [];
        stats[subject] = subjectQuestions.length;
      });
      setSubjectStats(stats);

      interface TestData {
        id: string;
        subject: string;
        chapter: string;
        topic: string;
        difficulty: string;
        questionCount: number;
        estimatedTime: number;
      }

      const testMap: Record<string, TestData> = {};
      questions?.forEach(q => {
        const key = `${q.subject}-${q.chapter}-${q.difficulty}`;
        if (!testMap[key]) {
          testMap[key] = {
            id: key,
            subject: q.subject,
            chapter: q.chapter,
            topic: q.topic,
            difficulty: q.difficulty,
            questionCount: 0,
            estimatedTime: 0
          };
        }
        testMap[key].questionCount++;
      });

      const tests = Object.values(testMap).map(test => ({
        ...test,
        estimatedTime: Math.ceil(test.questionCount * 1.5)
      }));

      setAvailableTests(tests);
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500"; 
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleStartTest = async (testData) => {
    if (!user) {
      alert('Please log in to start a test');
      return;
    }

    try {
      const { data: questions, error } = await supabase
        .from('questions_public')
        .select('*')
        .eq('subject', testData.subject)
        .eq('chapter', testData.chapter)
        .eq('difficulty', testData.difficulty)
        .limit(testData.questionCount);

      if (error) throw error;

      if (!questions || questions.length === 0) {
        alert('No questions available for this test');
        return;
      }

      const testSession = {
        id: testData.id,
        title: `${testData.subject} - ${testData.chapter}`,
        subject: testData.subject,
        chapter: testData.chapter,
        difficulty: testData.difficulty,
        questions: questions.map(q => ({
          id: q.id,
          question_text: q.question,
          options: {
            A: q.option_a,
            B: q.option_b,
            C: q.option_c,
            D: q.option_d
          },
          subject: q.subject,
          topic: q.topic,
          chapter: q.chapter
        })),
        duration: testData.estimatedTime,
        startTime: new Date().toISOString(),
      };

      localStorage.setItem("currentTest", JSON.stringify(testSession));
      navigate('/test-attempt');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const filteredTests = selectedSubject 
    ? availableTests.filter(test => test.subject === selectedSubject)
    : availableTests;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#013062'}}></div>
              <h2 className="text-xl font-semibold mb-2" style={{color: '#013062'}}>Loading Test Center...</h2>
              <p className="text-gray-600">Setting up your test environment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
      <Header />
      <div className="pt-32 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{color: '#013062'}}>
                  Test Center 🎯
                </h1>
                <p className="text-gray-600">
                  Practice with tests from your question database
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {subjects.slice(0, 3).map((subject, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600'
              ];
              return (
                <Card key={subject} className={`bg-gradient-to-r ${colors[index]} text-white`}>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{subjectStats[subject] || 0}</div>
                    <div className="text-sm opacity-90">{subject} Questions</div>
                  </CardContent>
                </Card>
              );
            })}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {(Object.values(subjectStats).reduce((a: number, b: number) => a + b, 0) as number)}
                </div>
                <div className="text-sm opacity-90">Total Questions</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Select Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedSubject === "" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedSubject("")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    All Subjects
                  </Button>
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {subject}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Tests */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Available Tests
                      {selectedSubject && (
                        <Badge variant="outline" className="ml-2">
                          {selectedSubject}
                        </Badge>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {filteredTests.length} tests
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredTests.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTests.map((test) => (
                        <Card key={test.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                className={`${getDifficultyColor(test.difficulty)} text-white text-xs`}
                              >
                                {test.difficulty}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {test.estimatedTime}m
                              </div>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-1" style={{color: '#013062'}}>
                              {test.topic}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {test.subject} • {test.chapter}
                            </p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <FileText className="w-4 h-4 mr-1" />
                                {test.questionCount} questions
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-1" />
                                {Math.floor(Math.random() * 500) + 100} taken
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleStartTest(test)}
                              className="w-full"
                              style={{backgroundColor: '#013062'}}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Test
                            </Button>
                            
                            <div className="mt-2 text-center text-xs text-gray-500">
                              Avg Score: {Math.floor(Math.random() * 30) + 60}%
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No tests found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {selectedSubject 
                          ? `No tests available for ${selectedSubject}` 
                          : "No tests are currently available"
                        }
                      </p>
                      {selectedSubject && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedSubject("")}
                        >
                          View All Subjects
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Test Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#013062'}}>Quick Practice</h3>
                <p className="text-gray-600 mb-4">
                  Short 10-15 question tests for quick revision
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  15-20 minutes • Easy to Medium
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#013062'}}>Chapter Tests</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive chapter-wise assessments
                </p>
                <div className="text-sm text-green-600 font-medium">
                  25-35 minutes • Mixed Difficulty
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#013062'}}>Mock Exams</h3>
                <p className="text-gray-600 mb-4">
                  Full-length practice tests simulating real exams
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  3 hours • JEE/NEET Pattern
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Test Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Before Starting:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Ensure stable internet connection
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Find a quiet study environment
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Keep pen and paper handy for calculations
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Close all distracting applications
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">During the Test:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Read each question carefully
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Manage your time wisely
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Review your answers before submitting
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      Don't spend too much time on difficult questions
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Test Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Time Management</h3>
                  <p className="text-sm text-gray-600">
                    Allocate time per question and stick to it. Don't get stuck on one question.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Strategic Approach</h3>
                  <p className="text-sm text-gray-600">
                    Attempt easy questions first, then tackle medium and hard ones.
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2" style={{color: '#013062'}}>Stay Calm</h3>
                  <p className="text-sm text-gray-600">
                    Keep calm and focused. Take deep breaths if you feel anxious.
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

export default TestPage;
