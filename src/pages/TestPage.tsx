import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed Supabase - using mock test data
import { useAuth } from "@/contexts/AuthContext";
import TestGeneratorModal from "@/components/TestGeneratorModal";
import { toast } from "sonner";
import {
  BookOpen,
  Brain,
  Trophy,
  Play,
  Plus,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation?: string;
  topic: string;
  chapter: string;
  difficulty: string;
  year?: number;
  subjects?: { name: string };
}

interface TestData {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  estimatedTime: number;
}

// Mock data generation functions
const generateMockQuestions = (subject: string, chapters: string[]) => {
  const mockQuestions = [];
  const topics = ['Topic 1', 'Topic 2', 'Topic 3'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  for (let i = 0; i < 50; i++) {
    mockQuestions.push({
      id: `mock-${subject}-${i}`,
      subject: subject,
      chapter: chapters.length > 0 ? chapters[0] : 'General',
      topic: topics[i % topics.length],
      difficulty: difficulties[i % difficulties.length],
      question_text: `Sample question ${i + 1} for ${subject}`,
      option_a: 'Option A',
      option_b: 'Option B', 
      option_c: 'Option C',
      option_d: 'Option D',
      correct_option: 'A'
    });
  }
  return mockQuestions;
};

const generateMockQuestionsForTest = (testData: TestData) => {
  const mockQuestions = [];
  for (let i = 0; i < testData.questionCount; i++) {
    mockQuestions.push({
      id: `test-${testData.id}-${i}`,
      subject: testData.subject,
      chapter: testData.chapter,
      topic: testData.topic,
      difficulty: testData.difficulty,
      question_text: `Test question ${i + 1} for ${testData.subject} - ${testData.topic}`,
      option_a: 'Option A',
      option_b: 'Option B',
      option_c: 'Option C', 
      option_d: 'Option D',
      correct_option: ['A', 'B', 'C', 'D'][i % 4]
    });
  }
  return mockQuestions;
};

const TestPage = () => {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<{ [subject: string]: string[] }>({});
  const [availableTests, setAvailableTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'reconnecting'>('checking');
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [questionStats, setQuestionStats] = useState({
    total: 0,
    physics: 0,
    chemistry: 0,
    mathematics: 0,
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();


  // Auto-retry connection
  useEffect(() => {
    checkDatabaseConnection();
    
    // Set up periodic health check
    const healthCheckInterval = setInterval(async () => {
      if (connectionStatus === 'connected') {
        await performHealthCheck();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheckInterval);
  }, []);

  // Retry connection on error with exponential backoff
  useEffect(() => {
    if (connectionStatus === 'error' && retryCount < 3) {
      const timeout = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
      console.log(`🔄 Auto-retry in ${timeout/1000}s (attempt ${retryCount + 1}/3)`);
      
      const retryTimer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        checkDatabaseConnection();
      }, timeout);

      return () => clearTimeout(retryTimer);
    }
  }, [connectionStatus, retryCount]);

  const performHealthCheck = async () => {
    try {
      // Mock health check - always pass
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log("✅ Mock health check passed");
    } catch (error) {
      console.warn("⚠️ Health check exception:", error);
      setConnectionStatus('error');
    }
  };

  const checkDatabaseConnection = async () => {
    try {
      console.log("🔍 Loading mock data...");
      setLoading(true);
      setConnectionStatus('checking');
      setErrorMessage("");
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ Mock data loaded successfully");
      setConnectionStatus('connected');
      setRetryCount(0);
      
      // Load mock data
      await loadAllData();

    } catch (error: any) {
      console.error("❌ Error loading mock data:", error);
      setConnectionStatus('error');
      setErrorMessage(error.message || "Unknown error");
      toast.error("Failed to load test data");
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      console.log("📊 Loading mock question statistics...");
      
      // Mock data
      const stats = {
        total: 15420,
        physics: 5140,
        chemistry: 4890,
        mathematics: 5390,
      };

      setQuestionStats(stats);
      console.log("📊 Mock stats loaded:", stats);

      // Load mock subjects and chapters
      await loadSubjectsAndChapters();

    } catch (error) {
      console.error("❌ Error loading mock data:", error);
      throw error;
    }
  };

  const loadSubjectsAndChapters = async () => {
    try {
      console.log("📚 Loading mock subjects and chapters...");
      
      // Mock data
      const mockSubjects = ['Physics', 'Chemistry', 'Mathematics'];
      const mockChapters = {
        'Physics': ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity'],
        'Chemistry': ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
        'Mathematics': ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry']
      };
      
      setSubjects(mockSubjects);
      setChapters(mockChapters);
      
      console.log("🎯 Mock subjects loaded:", mockSubjects);
      console.log("📖 Mock chapters loaded:", mockChapters);

      toast.success(`Loaded ${mockSubjects.length} subjects successfully!`);

    } catch (error: any) {
      console.error("❌ Error loading mock data:", error);
      toast.error("Failed to load subjects and chapters");
      throw error;
    }
  };

  const generateAvailableTests = async () => {
    if (!selectedSubject) return;

    try {
      console.log(`🔍 Generating tests for ${selectedSubject}${selectedChapters.length > 0 ? ` > ${selectedChapters.join(', ')}` : ''}`);
      
      // Mock test questions data
      const questionsData = generateMockQuestions(selectedSubject, selectedChapters);
      const error = null;

      // Filter by chapters if needed
      let filteredData = questionsData || [];
      if (selectedChapters.length > 0) {
        filteredData = filteredData.filter(q => selectedChapters.includes(q.chapter));
      }

      if (error || !filteredData) {
        console.error("❌ Error generating tests:", error);
        setAvailableTests([]);
        return;
      }

      console.log(`📝 Found ${filteredData.length} questions for ${selectedSubject}`);
      console.log("📋 Sample question data:", filteredData?.slice(0, 2).map(q => ({
        topic: q.topic,
        difficulty: q.difficulty,
        chapter: q.chapter
      })));

      if (!filteredData || filteredData.length === 0) {
        setAvailableTests([]);
        return;
      }

      // Group by topic and difficulty (not chapter when chapter is selected)
      const testGroups: { [key: string]: any[] } = {};

      filteredData.forEach((q) => {
        const topic = q.topic || 'General';
        const difficulty = q.difficulty || 'Mixed';
        const chapterName = q.chapter || 'Unknown';
        const key = selectedChapters.length > 0
          ? `${topic}_${difficulty}`
          : `${chapterName}_${topic}_${difficulty}`;
        if (!testGroups[key]) testGroups[key] = [];
        testGroups[key].push(q);
      });

      // Create test options
      const tests: TestData[] = Object.keys(testGroups)
        .map((key) => {
          const parts = key.split("_");
            let chapterName, topicName, difficulty;
            
            if (selectedChapters.length > 0) {
              // Format: topic_difficulty
              difficulty = parts[parts.length - 1];
              topicName = parts.slice(0, -1).join("_") || 'General';
              chapterName = selectedChapters.length === 1 ? selectedChapters[0] : 'Multiple Chapters';
            } else {
              // Format: chapter_topic_difficulty  
              difficulty = parts[parts.length - 1];
              chapterName = parts[0] || 'Unknown';
              topicName = parts.slice(1, -1).join("_") || 'General';
            }
          
          const questions = testGroups[key];

          return {
            id: `${selectedSubject}_${chapterName}_${topicName}_${difficulty}`,
            subject: selectedSubject,
            chapter: chapterName,
            topic: topicName,
            difficulty: difficulty,
            questionCount: questions.length,
            estimatedTime: Math.min(60, Math.ceil(questions.length * 1.2)),
          };
        })

        
        .filter((t) => t.questionCount >= 5) // Min 5 questions
        .sort((a, b) => b.questionCount - a.questionCount); // Sort by question count

      setAvailableTests(tests);
      console.log(`🎯 Generated ${tests.length} available tests:`, tests);

    } catch (error: any) {
      console.error("❌ Error generating tests:", error);
      toast.error("Failed to generate tests: " + (error.message || "Unknown error"));
    }
  };
useEffect(() => {
  if (selectedSubject && connectionStatus === 'connected') {
    console.log("🔄 Regenerating tests due to selection change");
    generateAvailableTests();
  }
}, [selectedSubject, selectedChapters, connectionStatus]);

  const handleStartTest = async (testData: TestData) => {
    if (!isAuthenticated) {
      toast.error("Please login to attempt tests");
      navigate("/login");
      return;
    }

    if (connectionStatus !== 'connected') {
      toast.error("Database not connected. Please wait for connection to restore.");
      return;
    }

    try {
      console.log("🚀 Starting test:", testData);
      
      // Mock questions for test
      const allQuestions = generateMockQuestionsForTest(testData);
      const questionsError = null;

      if (questionsError || !allQuestions) {
        console.error("❌ Error fetching questions:", questionsError);
        navigate("/tests");
        return;
      }

      // Shuffle and limit questions
      const shuffledQuestions = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, testData.questionCount);

      // Convert question_text to question for compatibility
      const formattedQuestions = shuffledQuestions.map(q => ({
        ...q,
        question: q.question_text
      }));

      // Store test data for test session
      const testSession = {
        id: testData.id,
        title: `${testData.subject} - ${testData.chapter} (${testData.difficulty})`,
        questions: formattedQuestions,
        duration: testData.estimatedTime,
        startTime: new Date().toISOString(),
      };

      localStorage.setItem("currentTest", JSON.stringify(testSession));
      toast.success(`Starting test with ${shuffledQuestions.length} questions!`);

      navigate(`/test-attempt/${testData.id}`);
    } catch (error: any) {
      console.error("❌ Error starting test:", error);
      toast.error("Failed to start test: " + (error.message || "Please try again"));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleManualRetry = () => {
    setRetryCount(0);
    checkDatabaseConnection();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                {connectionStatus === 'checking' && 'Connecting to database...'}
                {connectionStatus === 'reconnecting' && 'Reconnecting...'}
                {connectionStatus === 'connected' && 'Loading data...'}
              </p>
              {retryCount > 0 && (
                <p className="mt-2 text-sm text-yellow-600">
                  Retry attempt {retryCount}/3
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <WifiOff className="w-5 h-5" />
                  Database Connection Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Unable to connect to Supabase database. Common causes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm mb-6">
                  <li>Network connectivity issues</li>
                  <li>Supabase project is paused or unavailable</li>
                  <li>Invalid API keys or project URL</li>
                  <li>RLS (Row Level Security) policy restrictions</li>
                  <li>Database schema changes</li>
                  <li>Authentication token expired</li>
                </ul>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm font-mono text-destructive">
                    Error: {errorMessage}
                  </p>
                  {retryCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Failed after {retryCount} automatic retries
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleManualRetry} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Connection
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                  Test Center 🎯
                  {connectionStatus === 'connected' && (
                    <Wifi className="w-5 h-5 text-green-500" aria-label="Connected" />
                  )}
                </h1>
                <p className="text-muted-foreground">
                  {questionStats.total.toLocaleString()} questions available • {subjects.length} subjects loaded
                </p>
              </div>
            </div>
          </div>

          {/* Database Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {questionStats.physics.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Physics Questions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {questionStats.chemistry.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Chemistry Questions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {questionStats.mathematics.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Math Questions</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {questionStats.total.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Total Questions</div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Status Banner */}
          {connectionStatus === 'reconnecting' && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Reconnecting to database...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Configuration */}
          <div className="grid lg:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subjects.length > 0 ? subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? "default" : "outline"}
                      className="w-full justify-start"
                       onClick={() => {
                         setSelectedSubject(subject);
                         setSelectedChapters([]);
                         setTimeout(() => generateAvailableTests(), 100);
                       }}
                      disabled={connectionStatus !== 'connected'}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {subject}
                    </Button>
                  )) : (
                    <p className="text-sm text-muted-foreground">
                      {connectionStatus === 'connected' ? 'No subjects found in database' : 'Waiting for connection...'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Chapters (Multiple)</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSubject ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <Button
                      variant={selectedChapters.length === 0 ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setSelectedChapters([])}
                      disabled={connectionStatus !== 'connected'}
                    >
                      All Chapters ({selectedChapters.length === 0 ? 'Selected' : 'Select All'})
                    </Button>
                    {chapters[selectedSubject]?.map((chapter) => (
                      <Button
                        key={chapter}
                        variant={selectedChapters.includes(chapter) ? "default" : "outline"}
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          setSelectedChapters(prev => 
                            prev.includes(chapter) 
                              ? prev.filter(c => c !== chapter)
                              : [...prev, chapter]
                          );
                        }}
                        disabled={connectionStatus !== 'connected'}
                      >
                        {chapter} {selectedChapters.includes(chapter) && '✓'}
                      </Button>
                    ))}
                    {selectedChapters.length > 0 && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        Selected: {selectedChapters.length} chapter{selectedChapters.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a subject first</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {availableTests.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableTests.map((test) => (
                      <div key={test.id} className="p-2 border rounded-lg">
                         <div className="flex items-center justify-between mb-1">
                           <span className="font-medium text-sm">{test.topic}</span>
                           <Badge
                             variant="outline"
                             className={`${getDifficultyColor(test.difficulty)} text-white text-xs`}
                           >
                             {test.difficulty}
                           </Badge>
                         </div>
                         <div className="text-xs text-muted-foreground mb-2">
                           {test.chapter} • {test.questionCount} questions • ~{test.estimatedTime} mins
                         </div>
                         <Button
                           size="sm"
                           className="w-full"
                           onClick={() => handleStartTest(test)}
                           disabled={connectionStatus !== 'connected'}
                         >
                           <Play className="w-3 h-3 mr-1" />
                           Start Test
                         </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selectedSubject ? "No tests available for selection" : "Select subject to see tests"}
                  </p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Quick Stats */}
          {Object.keys(chapters).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Database Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {["Physics", "Chemistry", "Mathematics"].map(subject => (
                    <div key={subject}>
                      <h4 className="font-medium mb-2">{subject}</h4>
                      <div className="space-y-1">
                        {chapters[subject]?.slice(0, 3).map((chapter) => (
                          <div key={chapter} className="text-sm text-muted-foreground">
                            • {chapter}
                          </div>
                        ))}
                        {chapters[subject]?.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{chapters[subject].length - 3} more chapters
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TestGeneratorModal
        open={showGeneratorModal}
        onOpenChange={setShowGeneratorModal}
        onTestGenerated={() => {
          checkDatabaseConnection();
          toast.success("Test generated and ready!");
        }}
      />
    </div>
  );
};

export default TestPage;
