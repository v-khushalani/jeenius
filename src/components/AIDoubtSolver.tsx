import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Lightbulb, Sparkles, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AIDoubtSolver = ({ question, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // 🔥 MASTER API KEY - Yaha apni key daal do (ek baar)
  const MASTER_API_KEY = 'AIzaSyAKKNJu5GPx--GQ43qfol7-pbUfh_XglU8'; //
  useEffect(() => {
    if (isOpen && question) {
      // Initial welcome message
      setMessages([{
        role: 'assistant',
        content: `👋 **Namaste!** Main tumhara AI tutor hu.\n\n**Current Question:**\n"${question.question}"\n\n**Options:**\nA) ${question.option_a}\nB) ${question.option_b}\nC) ${question.option_c}\nD) ${question.option_d}\n\n✨ Kya doubt hai? Poocho!`
      }]);
    }
  }, [isOpen, question]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
  if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      // Build context with question details
      const context = `
  Current Question: ${question.question}
  
  Options:
  A) ${question.option_a}
  B) ${question.option_b}
  C) ${question.option_c}
  D) ${question.option_d}
  
  Correct Answer: ${question.correct_option}
  ${question.explanation ? `\nExplanation: ${question.explanation}` : ''}
  
  Student's Doubt: ${input}
  `;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${MASTER_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Tu ek expert JEE teacher hai jo students ko doubts clear karta hai.
  
  ${context}
  
  Instructions:
  - **Short and crisp** answer do (3-5 sentences max)
  - **Hindi/English mix** (Hinglish) mein baat karo naturally
  - Step-by-step samjhao agar zaroorat ho
  - Concept clear karo with simple example
  - **Encouraging tone** rakho - "Great question!", "Good thinking!" jaise phrases use karo
  - **Formatting**: Use bullet points (•) for steps if needed
  - Agar formula/equation hai toh simple language mein explain karo
  
  Answer in this format:
  💡 [Short explanation]
  - [Key point 1]
  - [Key point 2]
  ✨ [Quick tip or memory trick]
  
  Now answer:`
              }]
            }]
          })
        }
      );
  
      // Better error handling
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const aiResponse = {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('AI Error:', error);
      
      // Specific error messages
      let errorMsg = '❌ Sorry! Kuch technical issue aa gaya.';
      
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        errorMsg = '⚠️ API quota khatam ho gaya! Naya API key chahiye. Developer ko batao!';
      } else if (error.message.includes('invalid') || error.message.includes('API_KEY_INVALID')) {
        errorMsg = '🔑 API key invalid hai. Developer se naya key lo!';
      } else if (error.message.includes('429')) {
        errorMsg = '⏳ Bahut zyada requests ho gayi! 1 minute wait karo.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMsg = '🌐 Internet connection check karo!';
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg + '\n\nThodi der baad dobara try karo.'
      }]);
    }
  
    setLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick doubt suggestions
  const quickDoubts = [
    "Ye step samajh nahi aaya",
    "Options mein confusion hai",
    "Formula explain karo",
    "Shortcut trick batao"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">AI Doubt Solver</h3>
                <p className="text-xs text-purple-100">Powered by Google Gemini • 100% Free</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 1 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 text-center">💡 Quick doubts:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickDoubts.map((doubt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(doubt)}
                    className="text-xs p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left text-purple-700 transition-colors"
                  >
                    {doubt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">AI Teacher</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-purple-600" size={18} />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Apna doubt type karo... (Enter to send)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg px-6"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              💡 Tip: "Step 2 explain karo" ya "Shortcut batao" type karo
            </p>
            <span className="text-xs text-green-600 font-semibold">✓ AI Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDoubtSolver;
