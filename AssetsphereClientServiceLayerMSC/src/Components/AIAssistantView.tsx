import React, { useState } from 'react';
import { Asset } from '../types';
import { askAIAssistant } from '../Services/aiService';
import { Sparkles, Send, Bot, User, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';

interface AIAssistantViewProps {
  assets: Asset[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ assets }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello Alexander! I am AssetSphere AI, powered by Gemini 3.6 Flash. I have full context of your enterprise asset inventory, warranty schedules, software licenses, and security compliance matrices. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQueries = [
    'Which laptops have battery health under 85%?',
    'Show non-compliant security devices requiring patch remediation.',
    'Recommend hardware replacement candidates based on age & TCO.',
    'List unreturned assets for departing employees.',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    const aiAnswer = await askAIAssistant(prompt, {
      assetCount: assets.length,
      sampleAssets: assets.map((a) => ({
        deviceName: a.deviceName,
        assetNumber: a.assetNumber,
        category: a.category,
        currentValue: a.currentValue,
        health: a.health,
        security: a.security,
      })),
    });

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Enterprise AI Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gemini 3.6 Flash intelligent operational assistant for ITAM forecasting & compliance analysis
          </p>
        </div>
      </div>

      {/* Query Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-[#161618] border border-slate-800 hover:border-indigo-500/50 text-slate-400 rounded-lg hover:text-white transition-colors text-left"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-[#161618] border border-slate-800 rounded-xl p-6 overflow-y-auto space-y-4 max-h-[500px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 text-xs ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold ${
                m.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700 text-indigo-400'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl p-4 rounded-xl space-y-1 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1 text-[10px] font-mono opacity-80">
                <span className="font-bold">{m.sender === 'user' ? 'Alexander Wright' : 'AssetSphere AI'}</span>
                <span>{m.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed font-sans">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> Analyzing inventory records...
          </div>
        )}
      </div>

      {/* Prompt Input Box */}
      <div className="flex gap-3">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Assistant anything about your assets, software seats, or failure risks..."
          className="flex-1 bg-[#161618] border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputPrompt.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
};
