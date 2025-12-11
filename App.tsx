import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import { TOPICS } from './constants';
import { sendMessageStream, initializeChat } from './services/geminiService';
import Sidebar from './components/Sidebar';
import MarkdownRenderer from './components/MarkdownRenderer';
import { Send, Menu, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! I'm your Laravel Tenancy Architect. I can help you design multi-tenant systems, choose the right package, or write migration strategies. What are you building today?",
      sender: Sender.AI,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Gemini chat on mount
    try {
      initializeChat();
    } catch (e) {
      console.error("Failed to initialize chat:", e);
      setMessages(prev => [...prev, {
        id: 'error-init',
        text: "Error: API_KEY is missing. Please check your environment variables.",
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for AI message
      setMessages(prev => [...prev, {
        id: aiMsgId,
        text: '',
        sender: Sender.AI,
        timestamp: Date.now(),
        isStreaming: true
      }]);

      await sendMessageStream(text, (streamedText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: streamedText }
            : msg
        ));
      });

      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I encountered an error connecting to the architecture engine. Please try again.",
        sender: Sender.AI,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar 
        topics={TOPICS} 
        onSelectTopic={handleSendMessage} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-4 justify-between md:justify-end shrink-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
               <Sparkles size={14} />
               <span>Gemini 2.5 Flash Connected</span>
             </span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === Sender.USER ? 'flex-row-reverse' : 'flex-row'} max-w-5xl mx-auto`}
            >
              <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${msg.sender === Sender.USER ? 'bg-indigo-600' : 'bg-sky-600'}`}>
                {msg.sender === Sender.USER ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`flex-1 min-w-0 ${msg.sender === Sender.USER ? 'flex justify-end' : ''}`}>
                <div 
                  className={`relative p-4 md:p-6 rounded-2xl shadow-xl ${
                    msg.sender === Sender.USER 
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                  } ${msg.sender === Sender.USER ? 'max-w-2xl' : 'w-full'}`}
                >
                  {msg.sender === Sender.AI ? (
                    <MarkdownRenderer content={msg.text} />
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  )}
                  
                  {msg.isStreaming && (
                    <div className="absolute bottom-4 right-4 animate-pulse">
                       <div className="h-2 w-2 bg-sky-400 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className={`mt-2 text-xs text-slate-500 ${msg.sender === Sender.USER ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2 pointer-events-none">
              {isLoading && (
                <div className="bg-sky-500/10 backdrop-blur border border-sky-500/20 text-sky-400 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                  <Loader2 size={12} className="animate-spin" />
                  Generating Architecture...
                </div>
              )}
            </div>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="relative group"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Multi-Tenancy (e.g., 'How to separate tenant databases?')"
                className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 placeholder-slate-500 transition-all shadow-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-all shadow-md"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-center text-xs text-slate-600 mt-3">
              Generates Laravel 10/11 compliant code. Always verify architecture in staging.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;