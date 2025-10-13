import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIDoubtSolver = ({ question, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const messagesEndRef = useRef(null);

  // Gemini AI initialization
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const isGeneralDoubt = !question?.option_a || question?.question?.includes("koi bhi");
      
      if (isGeneralDoubt) {
        setMessages([{
          role: 'assistant',
          content: `🧞‍♂️ **Namaste! Main JEEnie hun - tumhara AI genie!**
**Ab bolo, kya doubt hai?** 🎯`
        }]);
      } else {
        setMessages([{
          role: 'assistant',
          content: `🧞‍♂️ **Hey! Main JEEnie hun!**

**Tumhara question:**
"${question.question}"

**Options:**
${question.option_a ? `A) ${question.option_a}` : ''}
${question.option_b ? `B) ${question.option_b}` : ''}
${question.option_c ? `C) ${question.option_c}` : ''}
${question.option_d ? `D) ${question.option_d}` : ''}

💬 **Kya doubt hai? Poocho!**`
        }]);
      }
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

    // Rate limit check (2 seconds)
    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⏳ **Ek second ruko bhai!** Main thoda busy hun... 2 seconds wait karo! 😅'
      }]);
      return;
    }
    setLastRequestTime(now);

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build JEE-specific context
      const isGeneralDoubt = !question?.option_a || question?.question?.includes("koi bhi");
      
      let contextPrompt = '';
      
      if (isGeneralDoubt) {
        contextPrompt = `You are JEEnie, a friendly AI tutor for JEE/NEET students in India. Student asks: "${input}"

Reply in simple Hinglish (mix of Hindi and English), keep it short (3-5 lines max), friendly, and exam-focused. Use emojis occasionally. Be encouraging!`;
      } else {
        contextPrompt = `You are JEEnie, an AI tutor for JEE/NEET preparation. 

Question: ${question.question}

Options:
A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}

Correct Answer: ${question.correct_option}

Student's doubt: "${input}"

Instructions:
- Reply in simple Hinglish (Hindi + English mix)
- Keep response short (4-6 lines)
- Focus on clarifying the doubt
- Use emojis occasionally
- Be friendly and encouraging
- If formula needed, explain it simply
- If shortcut exists, mention it`;
      }

      // Call Gemini API
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const aiText = response.text();

      if (aiText) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiText
        }]);
      } else {
        throw new Error('No response from Gemini AI');
      }

    } catch (error) {
      console.error('🔥 Gemini API Error:', error);
      
      let errorMsg = '❌ **Oops!** Kuch technical problem aa gayi.';
      
      // Check specific error types
      if (error.message?.includes('API key not valid') || error.message?.includes('API_KEY_INVALID')) {
        errorMsg = '🔑 **API Key invalid hai!** Developer se check karwao .env file me VITE_GEMINI_API_KEY sahi hai ya nahi.';
      } else if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Resource has been exhausted')) {
        errorMsg = `⚠️ **Gemini API quota khatam ho gaya!**

**Solutions:**
1. 1-2 minute wait karo
2. Free tier me 15 requests/minute limit hai
3. Ya Google AI Studio me billing enable karo`;
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        errorMsg = '🌐 **Internet connection check karo!** Network issue lag raha hai.';
      } else if (error.message?.includes('blocked') || error.message?.includes('safety')) {
        errorMsg = '🛡️ **Safety filter ne block kar diya!** Question thoda differently poocho.';
      } else {
        errorMsg = `❌ **Error:** ${error.message || 'Unknown error'}

**Try:**
1. Page refresh karo
2. API key check karo
3. Internet connection verify karo`;
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

  // JEE-specific quick doubts
  const quickDoubts = [
    "📐 Formula explain karo",
    "💡 Shortcut trick batao",
    "🎯 Concept clear karo",
    "⚡ Quick revision point"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl animate-pulse">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">JEEnie</h3>
                <p className="text-xs text-purple-100">Powered by Gemini 1.5 Pro</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50 to-white">
          {messages.length === 1 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2 text-center font-semibold">⚡ Quick doubts:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickDoubts.map((doubt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(doubt.split(' ').slice(1).join(' '))}
                    className="text-xs p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-lg text-left text-purple-700 transition-all hover:scale-105"
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
                    : 'bg-white border-2 border-purple-100 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">JEEnie 🧞‍♂️</span>
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
              <div className="bg-white border-2 border-purple-200 p-3 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-purple-600" size={18} />
                  <span className="text-sm text-gray-700 font-medium">JEEnie soch raha hai... 🤔</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Apna doubt yaha type karo... (Enter to send)"
              className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
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
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              ✓ Gemini 1.5 Pro Ready! 🧞‍♂️
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDoubtSolver;
