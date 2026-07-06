import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Sparkles, Trash2, ArrowUpRight, User } from 'lucide-react';
import api, { queryKeys } from '../services/api';

export default function AIChatPage() {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: queryKeys.chat,
    queryFn: async () => {
      const { data } = await api.get('/ai/chat-history');
      return data;
    }
  });

  // Mutations
  const sendPromptMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post('/ai/chat', { prompt: text });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat });
      setPrompt('');
    }
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/ai/chat-history');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat });
    }
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || sendPromptMutation.isPending) return;
    sendPromptMutation.mutate(prompt);
  };

  const handleQuickPrompt = (text: string) => {
    if (sendPromptMutation.isPending) return;
    sendPromptMutation.mutate(text);
  };

  const quickPrompts = [
    { title: 'Adapt my recipe to Keto', query: 'Can you show me how to adapt a standard chicken rice recipe to fit keto diets?' },
    { title: 'Estimate protein details', query: 'How much protein is in 2 boiled eggs, a Greek yogurt, and a handful of almonds?' },
    { title: 'Suggest a core warmup', query: 'What is a quick 5-minute dynamic warmup routine before strength training?' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[85vh] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between glass px-6 py-4 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-sm">Personal AI Health Coach</h2>
            <p className="text-[10px] text-slate-400">Powered by NutriMind Core LLM</p>
          </div>
        </div>
        <button
          onClick={() => clearHistoryMutation.mutate()}
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-grow glass rounded-3xl p-6 overflow-y-auto space-y-4 border border-slate-200/50 dark:border-slate-800/50 scroll-smooth">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          </div>
        ) : chatHistory && chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.map((msg: any, idx: number) => {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                  <div className={`flex items-start space-x-2.5 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-xl ${isUser ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-200'}`}>
                      {isUser ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-primary text-white font-medium rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/40 dark:border-slate-800/40'}`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="p-4 bg-primary/15 rounded-full text-primary">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Start Conversation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Ask about recipe macros, exercise target guidelines, or toggle custom diet planning.
              </p>
            </div>
            
            {/* Quick Prompts cards */}
            <div className="w-full grid grid-cols-1 gap-2.5 pt-4">
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(item.query)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-left text-xs font-semibold hover:border-primary transition-colors group"
                >
                  <span className="text-slate-600 dark:text-slate-300">{item.title}</span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask AI Personal Coach anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={sendPromptMutation.isPending}
          className="flex-grow px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={sendPromptMutation.isPending || !prompt.trim()}
          className="px-6 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
