import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  FileText,
  ArrowLeft
} from "lucide-react";

const TestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testMode, setTestMode] = useState(""); // "chapter" | "subject" | "full"
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    setLoading(true);
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('subject, chapter, topic');

      if (error) throw error;

      const uniqueSubjects = [...new Set(questions?.map(q => q.subject) || [])];
      setSubjects(uniqueSubjects);

      const uniqueChapters = [...new Set(questions?.map(q => ({ subject: q.subject, chapter: q.chapter })) || [])]
        .reduce((acc, curr) => {
          if (!acc[curr.subject]) acc[curr.subject] = [];
          if (!acc[curr.subject].includes(curr.chapter)) {
            acc[curr.subject].push(curr.chapter);
          }
          return acc;
        }, {});
      
      setChapters(uniqueChapters);
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterToggle = (chapter) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  const handleStartChapterTest = async () => {
    if (!user) {
      alert('Please log in to start a test');
      return;
    }

    if (selectedChapters.length === 0) {
      alert('Please select at least one chapter');
      return;
    }

    try {
      // Fetch questions from selected chapters with balanced difficulty
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', selectedSubject)
        .in('chapter', selectedChapters);

      if (error) throw error;

      if (!allQuestions || allQuestions.length === 0) {
        alert('No questions available for selected chapters');
        return;
      }

      // Shuffle and take 25 questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const questions = shuffled.slice(0, Math.min(25, shuffled.length));

      const testSession = {
        id: `chapter-test-${Date.now()}`,
        title: `Chapter Test - ${selectedSubject}`,
        subject: selectedSubject,
        chapters: selectedChapters,
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
        duration: 60, // 1 hour
        startTime: new Date().toISOString(),
      };

      localStorage.setItem("currentTest", JSON.stringify(testSession));
      navigate('/test-attempt');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleStartSubjectTest = async (subject) => {
    if (!user) {
      alert('Please log in to start a test');
      return;
    }

    try {
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', subject);

      if (error) throw error;

      if (!allQuestions || allQuestions.length === 0) {
        alert('No questions available for this subject');
        return;
      }

      // Shuffle and take 25 questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const questions = shuffled.slice(0, Math.min(25, shuffled.length));

      const testSession = {
        id: `subject-test-${Date.now()}`,
        title: `${subject} Test`,
        subject: subject,
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
        duration: 60, // 1 hour
        startTime: new Date().toISOString(),
      };

      localStorage.setItem("currentTest", JSON.stringify(testSession));
      navigate('/test-attempt');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleStartFullTest = async () => {
    if (!user) {
      alert('Please log in to start a test');
      return;
    }

    try {
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*');

      if (error) throw error;

      if (!allQuestions || allQuestions.length < 75) {
        alert('Not enough questions available for full syllabus test');
        return;
      }

      // Get 25 questions from each subject (Physics, Chemistry, Maths)
      const physicsSubs = ['Physics'];
      const chemistrySubs = ['Chemistry'];
      const mathsSubs = ['Mathematics', 'Maths'];

      const physicsQs = allQuestions.filter(q => physicsSubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25);
      const chemistryQs = allQuestions.filter(q => chemistrySubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25);
      const mathsQs = allQuestions.filter(q => mathsSubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25);

      const questions = [...physicsQs, ...chemistryQs, ...mathsQs].sort(() => Math.random() - 0.5);

      if (questions.length < 75) {
        alert('Not enough questions for a complete JEE mock test');
        return;
      }

      const testSession = {
        id: `full-test-${Date.now()}`,
        title: 'JEE Full Syllabus Mock Test',
        subject: 'All Subjects',
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
        duration: 180, // 3 hours
        startTime: new Date().toISOString(),
      };

      localStorage.setItem("currentTest", JSON.stringify(testSession));
      navigate('/test-attempt');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#013062'}}></div>
              <h2 className="text-xl font-semibold mb-2" style={{color: '#013062'}}>Loading Tests...</h2>
              <p className="text-gray-600">Setting up your test environment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main selection screen
  if (!testMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Test Type Selection */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card 
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setTestMode("chapter")}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center" style={{color: '#013062'}}>Chapter-wise Test</h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    Practice specific chapters to strengthen your concepts
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      25 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      60 Minutes
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    style={{backgroundColor: '#013062'}}
                  >
                    Select Chapters
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setTestMode("subject")}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center" style={{color: '#013062'}}>Subject-wise Test</h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    Complete subject coverage with mixed chapters
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      25 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      60 Minutes
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Select Subject
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleStartFullTest()}
              >
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center" style={{color: '#013062'}}>Full Syllabus Mock</h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    Complete JEE pattern mock test
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      75 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      180 Minutes
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Start Mock Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chapter-wise selection screen
  if (testMode === "chapter") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => {
                setTestMode("");
                setSelectedSubject("");
                setSelectedChapters([]);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test Selection
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" style={{color: '#013062'}}>
                  Select Subject & Chapters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Subject Selection */}
                {!selectedSubject ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <Card 
                        key={subject}
                        className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-500"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <CardContent className="p-6 text-center">
                          <Brain className="w-12 h-12 mx-auto mb-3" style={{color: '#013062'}} />
                          <h3 className="text-xl font-bold" style={{color: '#013062'}}>{subject}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Chapter Selection */
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold" style={{color: '#013062'}}>
                        {selectedSubject} - Select Chapters
                      </h3>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedSubject("");
                          setSelectedChapters([]);
                        }}
                      >
                        Change Subject
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-6">
                      {chapters[selectedSubject]?.map((chapter) => (
                        <div 
                          key={chapter}
                          className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleChapterToggle(chapter)}
                        >
                          <Checkbox 
                            checked={selectedChapters.includes(chapter)}
                            onCheckedChange={() => handleChapterToggle(chapter)}
                          />
                          <label className="cursor-pointer flex-1">
                            {chapter}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-semibold" style={{color: '#013062'}}>
                          {selectedChapters.length} chapter(s) selected
                        </p>
                        <p className="text-sm text-gray-600">25 Questions • 60 Minutes</p>
                      </div>
                      <Button 
                        onClick={handleStartChapterTest}
                        disabled={selectedChapters.length === 0}
                        style={{backgroundColor: '#013062'}}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Test
                      </Button>
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

  // Subject-wise selection screen
  if (testMode === "subject") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => setTestMode("")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test Selection
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" style={{color: '#013062'}}>
                  Select Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <Card 
                      key={subject}
                      className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-500"
                      onClick={() => handleStartSubjectTest(subject)}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3" style={{color: '#013062'}}>{subject}</h3>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            25 Questions
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            60 Min
                          </div>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Test
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TestPage;
