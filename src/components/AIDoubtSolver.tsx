import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AIDoubtSolver = ({ question, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const messagesEndRef = useRef(null);

  // 🔥 API KEY
  const MASTER_API_KEY = process.env.VITE_GEMINI_API_KEY;

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

    // Rate limit check
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
      
      const contextPrompt = isGeneralDoubt ? 
        `Student ka doubt: ${input}` :
        `Question: ${question.question}
Options:
A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}
Correct Answer: ${question.correct_option}

Student ka doubt: ${input}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Tu "JEEnie" naam ka AI tutor hai - ek friendly magical genie jo JEE aspirants ki help karta hai.

**Your personality:**
- Friendly aur encouraging
- Hinglish mein baat karo (Hindi + English mix)
- Short, crisp answers (4-6 lines max)
- Use emojis occasionally 
- Always motivate the student

**Context:**
${contextPrompt}

**Instructions:**
1. Answer in HINGLISH (Hindi-English mix)
2. Keep it SHORT - max 5-6 lines
3. Use bullet points (•) for steps
4. Add 1 motivational line at end
5. If formula hai, simple language mein explain karo
6. No long paragraphs - crisp and clear!

**Format:**
💡 [Main concept in 1-2 lines]
• [Key point 1]
• [Key point 2]
✨ [Quick tip/trick]
🎯 [Motivational closing]

Ab answer do:`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'API request failed');
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
      console.error('🔥 JEEnie Error:', error);
      
      let errorMsg = '❌ **Oops!** Kuch technical problem aa gayi.';
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMsg = `⚠️ **API limit khatam ho gayi!**

Bohot zyada questions poocho rahe ho! 

**Solutions:**
1. 5-10 min wait karo
2. Ya admin ko batao API key upgrade karne ke liye

**Free tier limit:** 15 requests/minute 🔄`;
      } else if (error.message?.includes('invalid') || error.message?.includes('API_KEY')) {
        errorMsg = '🔑 **API key issue hai!** Developer ko batao.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMsg = '🌐 **Internet connection check karo!** Network issue lag raha hai.';
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
                <p className="text-xs text-purple-100">Powered by Gemini</p>
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
              ✓ JEEnie Ready! 🧞‍♂️
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDoubtSolver;
