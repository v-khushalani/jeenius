import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from '@/components/Header';
import { 
  Search, 
  MessageCircle, 
  Users, 
  Clock, 
  BookOpen, 
  Brain, 
  Send, 
  Camera, 
  Mic, 
  Smartphone, 
  Download,
  Bot,
  Star,
  Trophy,
  Plus,
  Filter,
  TrendingUp
} from 'lucide-react';

const GROQ_API_KEY = "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";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Doubt {
  id: number;
  question: string;
  subject: string;
  answers: number;
  views: number;
  timeAgo: string;
  status: 'solved' | 'active';
  author: string;
  upvotes: number;
  tags?: string[];
}

const DoubtSolver = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'community'>('ai');
  const [newDoubtTitle, setNewDoubtTitle] = useState('');
  const [newDoubtContent, setNewDoubtContent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showNewDoubtForm, setShowNewDoubtForm] = useState(false);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: "Hello! I'm your JEEnius AI Tutor. I can solve any Physics, Chemistry, or Math problem step-by-step. Try asking me something like 'Solve x² - 5x + 6 = 0' or 'Explain Newton's first law'.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "Solve the quadratic equation: x² - 7x + 12 = 0",
    "Explain the concept of electromagnetic induction",
    "Balance this equation: H2 + O2 → H2O",
    "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1"
  ];

  // Database Integration Functions
  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        subject: filterSubject === 'all' ? '' : filterSubject,
        sort: sortBy
      });
      
      const response = await fetch(`/api/doubts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDoubts(data);
      }
    } catch (error) {
      console.error('Error fetching doubts:', error);
    }
    setLoading(false);
  };

  const submitNewDoubt = async () => {
    if (!newDoubtTitle.trim() || !newDoubtContent.trim() || !selectedSubject) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/doubts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newDoubtTitle,
          content: newDoubtContent,
          subject: selectedSubject
        })
      });

      if (response.ok) {
        setNewDoubtTitle('');
        setNewDoubtContent('');
        setSelectedSubject('');
        setShowNewDoubtForm(false);
        fetchDoubts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error submitting doubt:', error);
    }
  };

  const generateDetailedResponse = async (question: string) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{
            role: 'user', 
            content: `You are JEEnius AI - an expert JEE tutor for Physics, Chemistry, and Mathematics. 

For this question: "${question}"

Please provide:
1. Step-by-step solution with clear explanations
2. Identify the topic/concept involved
3. Show all formulas used
4. Give the final answer clearly
5. Add a related practice tip

Format your response with emojis and clear sections like:
🎯 **Topic:** [concept name]
📝 **Solution:**
⚡ **Final Answer:**
💡 **Practice Tip:**

Make it detailed but easy to understand for JEE students.`
          }]
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content + "\n\n📱 **Get more detailed solutions in our Android app!**";
      } else {
        throw new Error('No response from AI');
      }
      
    } catch (error) {
      console.error('API Error:', error);
      return `🤖 **JEEnius AI Analysis**

I understand your question about "${question}". Let me break this down:

**For this type of problem:**
- Identify the key concepts involved
- Apply relevant formulas step by step  
- Work through the solution systematically
- Verify your final answer

**Recommended approach:**
1. Read the question carefully
2. List what's given and what to find
3. Choose appropriate method/formula
4. Solve step by step
5. Check your answer

📱 **For detailed step-by-step solutions with AI explanations, our full AI tutor is being optimized. Please try again in a moment!**

Would you like me to help with a specific calculation or concept explanation?`;
    }
  };

  const handleAISend = async () => {
    if (!aiInput.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: aiInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = aiInput;
    setAiInput('');
    setIsTyping(true);

    try {
      const aiContent = await generateDetailedResponse(currentInput);
      const aiResponse: Message = {
        type: 'ai',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse: Message = {
        type: 'ai',
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again in a moment!",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
    
    setIsTyping(false);
  };

  // Fetch doubts on component mount and when filters change
  useEffect(() => {
    if (activeTab === 'community') {
      fetchDoubts();
    }
  }, [searchQuery, filterSubject, sortBy, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile App Promotion Banner */}
          <div className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Get Full JEEnius Experience!</div>
                  <div className="text-sm opacity-90">Download our Android app for offline study, advanced features & more</div>
                </div>
              </div>
              <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <Download className="w-4 h-4 mr-2" />
                Download App
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doubt Solver 🤔</h1>
            <p className="text-gray-600">Get your JEE doubts solved by AI and community experts</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === 'ai' ? 'default' : 'ghost'}
              className="flex-1 flex items-center gap-2"
              onClick={() => setActiveTab('ai')}
            >
              <Brain className="w-4 h-4" />
              AI Tutor
            </Button>
            <Button
              variant={activeTab === 'community' ? 'default' : 'ghost'}
              className="flex-1 flex items-center gap-2"
              onClick={() => setActiveTab('community')}
            >
              <Users className="w-4 h-4" />
              Community
            </Button>
          </div>

          {/* AI Chat Interface */}
          {activeTab === 'ai' && (
            <Card className="shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6" />
                    <span>JEEnius AI Tutor</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Ready to solve</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md px-4 py-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-gray-200 shadow-sm'
                      }`}>
                        <div className="whitespace-pre-line text-sm">
                          {msg.content}
                        </div>
                        <div className={`text-xs mt-2 ${
                          msg.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 shadow-sm max-w-md px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm text-gray-600">JEEnius AI is solving your problem...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Questions */}
                <div className="px-6 py-4 border-t bg-white">
                  <div className="text-sm text-gray-600 mb-3">Try these sample questions:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleQuestions.map((q, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => setAiInput(q)}
                        className="text-xs text-left h-auto p-2 whitespace-normal"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t bg-white">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Ask any JEE question... e.g., 'Solve x² - 5x + 6 = 0' or 'Explain projectile motion'"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        rows={2}
                        className="resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAISend();
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="icon" variant="outline" title="Upload Image">
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" title="Voice Input">
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        onClick={handleAISend}
                        disabled={!aiInput.trim() || isTyping}
                        className="bg-primary hover:bg-primary/90"
                        title="Send Message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-3 h-3" />
                      <span>Full features available in Android app!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Community Interface */}
          {activeTab === 'community' && (
            <>
              {/* Search and Filters */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search & Ask Doubts
                    </CardTitle>
                    <Button
                      onClick={() => setShowNewDoubtForm(!showNewDoubtForm)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ask New Doubt
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-64">
                      <Input 
                        placeholder="Search existing doubts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                    >
                      <option value="all">All Subjects</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="solved">Solved First</option>
                      <option value="unanswered">Unanswered First</option>
                    </select>
                  </div>
                  
                  {/* New Doubt Form */}
                  {showNewDoubtForm && (
                    <div className="border-t pt-4 space-y-3">
                      <h3 className="font-medium">Ask a new doubt:</h3>
                      <Input 
                        placeholder="Enter your question title..."
                        value={newDoubtTitle}
                        onChange={(e) => setNewDoubtTitle(e.target.value)}
                      />
                      <Textarea 
                        placeholder="Describe your doubt in detail..."
                        rows={3}
                        value={newDoubtContent}
                        onChange={(e) => setNewDoubtContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <select 
                          className="px-3 py-2 border rounded-md"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          <option value="">Select Subject</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Mathematics">Mathematics</option>
                        </select>
                        <Button onClick={submitNewDoubt} className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Submit Doubt
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Community Doubts List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Community Doubts</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      {doubts.length} doubts found
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : doubts.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No doubts found. Be the first to ask a question!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {doubts.map((doubt) => (
                        <Card key={doubt.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doubt.subject === 'Physics' ? 'bg-blue-100 text-blue-800' :
                                doubt.subject === 'Chemistry' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {doubt.subject}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                doubt.status === 'solved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doubt.status}
                              </span>
                            </div>
                            
                            <h3 className="font-medium text-gray-900 mb-2 hover:text-primary">
                              {doubt.question}
                            </h3>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {doubt.answers}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {doubt.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {doubt.timeAgo}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Star className="w-3 h-3" />
                                {doubt.upvotes}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Doubts</span>
                        <span className="font-semibold">{doubts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solved Today</span>
                        <span className="font-semibold text-green-600">--</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Contributions</span>
                        <span className="font-semibold">--</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <BookOpen className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p>Be specific about the concept you're struggling with</p>
                      </div>
                      <div className="flex gap-2">
                        <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p>Include what you've already tried</p>
                      </div>
                      <div className="flex gap-2">
                        <Search className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p>Search existing doubts first</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trending Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500 mb-2">Loading popular topics...</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtSolver;
