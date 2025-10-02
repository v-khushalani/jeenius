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
  Trophy,
  Play,
  Clock,
  Target,
  FileText,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const TestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testMode, setTestMode] = useState(""); // "chapter" | "subject" | "full"
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);

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

      const chaptersBySubject = {};
      questions?.forEach(q => {
        if (!chaptersBySubject[q.subject]) {
          chaptersBySubject[q.subject] = new Set();
        }
        chaptersBySubject[q.subject].add(q.chapter);
      });

      const chaptersObj = {};
      Object.keys(chaptersBySubject).forEach(subject => {
        chaptersObj[subject] = Array.from(chaptersBySubject[subject]);
      });
      
      setChapters(chaptersObj);
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => {
      const newSelection = prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject];
      
      // Update available chapters based on selected subjects
      const newChapters = newSelection.flatMap(s => 
        chapters[s]?.map(ch => ({ subject: s, chapter: ch })) || []
      );
      setAvailableChapters(newChapters);
      
      // Clear selected chapters that are no longer available
      setSelectedChapters(prevChapters => 
        prevChapters.filter(ch => 
          newChapters.some(nc => nc.subject === ch.subject && nc.chapter === ch.chapter)
        )
      );
      
      return newSelection;
    });
  };

  const handleChapterToggle = (subject, chapter) => {
    const chapterObj = { subject, chapter };
    setSelectedChapters(prev => {
      const exists = prev.some(ch => ch.subject === subject && ch.chapter === chapter);
      return exists
        ? prev.filter(ch => !(ch.subject === subject && ch.chapter === chapter))
        : [...prev, chapterObj];
    });
  };

  const handleStartTest = async () => {
    if (!user) {
      alert('Please log in to start a test');
      return;
    }

    if (testMode === "chapter" && selectedChapters.length === 0) {
      alert('Please select at least one chapter');
      return;
    }

    if (testMode === "subject" && selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    try {
      let allQuestions = [];
      let title = '';
      let duration = 60;
      let targetQuestions = 25;

      if (testMode === "chapter") {
        // Fetch questions from selected chapters
        for (const { subject, chapter } of selectedChapters) {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', subject)
            .eq('chapter', chapter);

          if (error) throw error;
          if (data) allQuestions.push(...data);
        }
        title = `Chapter Test - ${selectedChapters.length} Chapter(s)`;
      } else if (testMode === "subject") {
        // Fetch questions from selected subjects
        for (const subject of selectedSubjects) {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', subject);

          if (error) throw error;
          if (data) allQuestions.push(...data);
        }
        title = `Subject Test - ${selectedSubjects.join(', ')}`;
      } else if (testMode === "full") {
        // Full syllabus test
        const { data, error } = await supabase
          .from('questions')
          .select('*');

        if (error) throw error;
        
        // Get 25 questions from each subject
        const physicsSubs = ['Physics'];
        const chemistrySubs = ['Chemistry'];
        const mathsSubs = ['Mathematics', 'Maths'];

        const physicsQs = data?.filter(q => physicsSubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25) || [];
        const chemistryQs = data?.filter(q => chemistrySubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25) || [];
        const mathsQs = data?.filter(q => mathsSubs.includes(q.subject)).sort(() => Math.random() - 0.5).slice(0, 25) || [];

        allQuestions = [...physicsQs, ...chemistryQs, ...mathsQs];
        targetQuestions = 75;
        duration = 180;
        title = 'JEE Full Syllabus Mock Test';
      }

      if (allQuestions.length === 0) {
        alert('No questions available for your selection');
        return;
      }

      // Shuffle and select questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const questions = shuffled.slice(0, Math.min(targetQuestions, shuffled.length));

      if (testMode === "full" && questions.length < 75) {
        alert('Not enough questions for a complete JEE mock test');
        return;
      }

      const testSession = {
        id: `${testMode}-test-${Date.now()}`,
        title: title,
        testType: testMode,
        questions: questions.map(q => ({
          id: q.id,
          question_text: q.question,
          options: {
            A: q.option_a,
            B: q.option_b,
            C: q.option_c,
            D: q.option_d
          },
          correct_answer: q.correct_answer,
          subject: q.subject,
          topic: q.topic,
          chapter: q.chapter
        })),
        duration: duration,
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            {/* Test Type Selection */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                onClick={() => setTestMode("chapter")}
              >
                <div className="p-8 text-white text-center" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Chapter-wise Test</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Select multiple chapters for focused practice
                  </p>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      25 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      60 Minutes
                    </div>
                  </div>
                  <Button className="w-full text-white" style={{backgroundColor: '#013062'}}>
                    Select Chapters
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                onClick={() => setTestMode("subject")}
              >
                <div className="p-8 text-white text-center" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Subject-wise Test</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Select one or more subjects for comprehensive practice
                  </p>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      25 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      60 Minutes
                    </div>
                  </div>
                  <Button className="w-full text-white" style={{backgroundColor: '#013062'}}>
                    Select Subjects
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                onClick={() => {
                  setTestMode("full");
                  handleStartTest();
                }}
              >
                <div className="p-8 text-white text-center" style={{background: 'linear-gradient(135deg, #013062 0%, #024a8f 100%)'}}>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Full Syllabus Mock</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Complete JEE pattern mock test
                  </p>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      75 Questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" style={{color: '#013062'}} />
                      180 Minutes
                    </div>
                  </div>
                  <Button className="w-full text-white" style={{backgroundColor: '#013062'}}>
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
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => {
                setTestMode("");
                setSelectedSubjects([]);
                setSelectedChapters([]);
                setAvailableChapters([]);
              }}
              style={{borderColor: '#013062', color: '#013062'}}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test Selection
            </Button>

            <Card className="border-0 shadow-xl">
              <CardHeader style={{backgroundColor: '#f0f7ff'}}>
                <CardTitle className="text-2xl" style={{color: '#013062'}}>
                  Chapter-wise Test Setup
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">Select subjects first, then choose chapters</p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Subject Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4" style={{color: '#013062'}}>
                    Step 1: Select Subjects
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <div 
                        key={subject}
                        className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: selectedSubjects.includes(subject) ? '#013062' : '#e5e7eb',
                          backgroundColor: selectedSubjects.includes(subject) ? '#f0f7ff' : 'white'
                        }}
                        onClick={() => handleSubjectToggle(subject)}
                      >
                        <Checkbox 
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <label className="cursor-pointer flex-1 font-medium">
                          {subject}
                        </label>
                        {selectedSubjects.includes(subject) && (
                          <CheckCircle2 className="w-5 h-5" style={{color: '#013062'}} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapter Selection */}
                {selectedSubjects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4" style={{color: '#013062'}}>
                      Step 2: Select Chapters
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {availableChapters.map(({ subject, chapter }) => (
                        <div 
                          key={`${subject}-${chapter}`}
                          className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
                          style={{
                            borderColor: selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter) ? '#013062' : '#e5e7eb',
                            backgroundColor: selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter) ? '#f0f7ff' : 'white'
                          }}
                          onClick={() => handleChapterToggle(subject, chapter)}
                        >
                          <Checkbox 
                            checked={selectedChapters.some(ch => ch.subject === subject && ch.chapter === chapter)}
                            onCheckedChange={() => handleChapterToggle(subject, chapter)}
                          />
                          <label className="cursor-pointer flex-1">
                            <span className="font-medium">{chapter}</span>
                            <Badge variant="outline" className="ml-2 text-xs">{subject}</Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Start Test Button */}
                {selectedChapters.length > 0 && (
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{backgroundColor: '#f0f7ff'}}>
                    <div>
                      <p className="font-bold text-lg" style={{color: '#013062'}}>
                        {selectedChapters.length} Chapter(s) Selected
                      </p>
                      <p className="text-sm text-gray-600">25 Questions • 60 Minutes</p>
                    </div>
                    <Button 
                      onClick={handleStartTest}
                      size="lg"
                      className="text-white"
                      style={{backgroundColor: '#013062'}}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Test
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

  // Subject-wise selection screen
  if (testMode === "subject") {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#e9e9e9'}}>
        <Header />
        <div className="pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            
            <Button 
              variant="outline" 
              className="mb-6"
              onClick={() => {
                setTestMode("");
                setSelectedSubjects([]);
              }}
              style={{borderColor: '#013062', color: '#013062'}}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Test Selection
            </Button>

            <Card className="border-0 shadow-xl">
              <CardHeader style={{backgroundColor: '#f0f7ff'}}>
                <CardTitle className="text-2xl" style={{color: '#013062'}}>
                  Subject-wise Test Setup
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">Select one or more subjects for your test</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {subjects.map((subject) => (
                    <div 
                      key={subject}
                      className="flex items-center space-x-3 p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg"
                      style={{
                        borderColor: selectedSubjects.includes(subject) ? '#013062' : '#e5e7eb',
                        backgroundColor: selectedSubjects.includes(subject) ? '#f0f7ff' : 'white'
                      }}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      <Checkbox 
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <label className="cursor-pointer flex-1">
                        <div className="font-bold text-lg" style={{color: '#013062'}}>{subject}</div>
                        <div className="text-sm text-gray-600">{chapters[subject]?.length || 0} chapters</div>
                      </label>
                      {selectedSubjects.includes(subject) && (
                        <CheckCircle2 className="w-6 h-6" style={{color: '#013062'}} />
                      )}
                    </div>
                  ))}
                </div>

                {selectedSubjects.length > 0 && (
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{backgroundColor: '#f0f7ff'}}>
                    <div>
                      <p className="font-bold text-lg" style={{color: '#013062'}}>
                        {selectedSubjects.length} Subject(s) Selected
                      </p>
                      <p className="text-sm text-gray-600">25 Questions • 60 Minutes</p>
                    </div>
                    <Button 
                      onClick={handleStartTest}
                      size="lg"
                      className="text-white"
                      style={{backgroundColor: '#013062'}}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Test
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

export default TestPage;
