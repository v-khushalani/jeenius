import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Lightbulb, Sparkles, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AIDoubtSolver = ({ question, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: question ? `Main tumhe **"${question.question}"** ke baare mein help kar sakta hun. Koi specific doubt hai?` : 'Namaste! 🙏 Main tumhara AI Doubt Solver hun. Koi bhi JEE doubt pucho!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // ✅ Rate limit check (1 request per 2 seconds)
    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⏳ Thoda wait karo! AI thoda busy hai (2 sec wait).'
      }]);
      return;
    }
    setLastRequestTime(now);

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not configured. Please add VITE_GEMINI_API_KEY in .env file');
      }

      // Build conversation history for context (last 3 messages only)
      const conversationHistory = messages.slice(-3).map(msg => 
        `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}`
      ).join('\n');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are JEEnie - a friendly JEE prep buddy (not a formal teacher). You talk like a helpful senior who's been through JEE and knows the struggle. Be casual, natural, and relatable.

**Your personality:**
- Talk like a friendly batchmate, not a teacher
- Use casual Hinglish naturally (jaise normal students baat karte hain)
- Be encouraging but honest
- No formality - no "aap", use "tu/tum"
- React naturally with "arre", "dekh", "simple hai yaar" type expressions
- Use emojis sparingly and naturally (💡😅🔥)

${question && question.question !== "I have a doubt..." ? `
**Question context:**
${question.question}

Options:
A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}
${question.correct_option ? `\nSahi answer: ${question.correct_option}` : ''}
` : ''}

**Student bola:** ${input}

**Recent chat:**
${conversationHistory.slice(-200)}

**How to respond:**
1. Don't introduce yourself - seedha doubt address kar
2. Explain step-by-step but casually (jaise friend ko samjha raha ho)
3. If concept tough hai, pehle simple example de
4. Keep it short (100-120 words max)
5. End naturally - "samjh gaya?" ya "aur kuch confuse ho toh bata"

Respond in natural Hinglish:`
              }]
            }]
          })
        }
      );
      // ✅ Better error handling
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API Error');
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
      
      // ✅ Specific error messages
      let errorMsg = '❌ Sorry! Kuch technical issue aa gaya.';
      
      if (error.message.includes('quota')) {
        errorMsg = '⚠️ API quota khatam ho gaya! Thodi der baad try karo.';
      } else if (error.message.includes('invalid')) {
        errorMsg = '🔑 API key invalid hai. Developer ko batao!';
      } else if (error.message.includes('429')) {
        errorMsg = '⏳ Too many requests! 1 minute wait karo.';
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg
      }]);
    } finally {
      setLoading(false);
    }
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
