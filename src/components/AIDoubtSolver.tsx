
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Send, Camera, Mic, Smartphone, Download } from 'lucide-react';
const GROQ_API_KEY = "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";

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: "Hello! I'm your JEEnius AI Tutor. I can solve any Physics, Chemistry, or Math problem step-by-step. Try asking me something like 'Solve x² - 5x + 6 = 0' or 'Explain Newton's first law'.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "Solve the quadratic equation: x² - 7x + 12 = 0",
    "Explain the concept of electromagnetic induction",
    "Balance this equation: H2 + O2 → H2O",
    "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1"
  ];

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
  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    type: 'user',
    content: input,
    timestamp: new Date().toLocaleTimeString()
  };

  setMessages(prev => [...prev, userMessage]);
  const currentInput = input;
  setInput('');
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
  
  return (
    <div className="max-w-4xl mx-auto">
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
                  onClick={() => setInput(q)}
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
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
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
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
    </div>
  );
};

export default AITutor;
