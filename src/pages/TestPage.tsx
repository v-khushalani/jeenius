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
  Clock,
  Target,
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
        .from('questions')
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
        .from('questions')
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
                  Practice Tests 🎯
                </h1>
                <p className="text-gray-600">
                  Choose your test type and start practicing
                </p>
              </div>
            </div>
          </div>

          {/* Test Type Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center" style={{color: '#013062'}}>Chapter-wise Test</h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Practice specific chapters to strengthen your concepts
                </p>
                <Button 
                  className="w-full" 
                  style={{backgroundColor: '#013062'}}
                  onClick={() => setSelectedSubject("")}
                >
                  Select Chapter
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center" style={{color: '#013062'}}>Subject-wise Test</h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Complete subject coverage with mixed chapters
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {/* Add subject-wise logic */}}
                >
                  Select Subject
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center" style={{color: '#013062'}}>Full Syllabus Mock</h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Complete mock test covering entire syllabus
                </p>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => {/* Add full syllabus logic */}}
                >
                  Start Mock Test
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Filter by Subject
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
                      <Badge variant="secondary" className="ml-auto">
                        {subjectStats[subject]}
                      </Badge>
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
                      Available Chapter Tests
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
                            </div>
                            
                            <Button
                              onClick={() => handleStartTest(test)}
                              className="w-full"
                              style={{backgroundColor: '#013062'}}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Test
                            </Button>
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
        </div>
      </div>
    </div>
  );
};

export default TestPage;
