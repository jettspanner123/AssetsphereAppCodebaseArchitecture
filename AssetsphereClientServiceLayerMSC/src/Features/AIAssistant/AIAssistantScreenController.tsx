import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Asset } from '../../types';
import { askAIAssistant } from '../../services/aiService';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import InputSharedComponent from '../../Shared/Components/InputSharedComponent';
import AIAssistantCON from './Constants/AIAssistantCON';

export interface AIAssistantScreenControllerProps {
  assets: Asset[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIAssistantScreenController({
  assets,
}: AIAssistantScreenControllerProps): React.JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am AssetSphere AI, powered by Gemini 3.6 Flash. I have full context of your enterprise asset inventory, warranty schedules, software licenses, and security compliance matrices. How can I assist your team today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            {AIAssistantCON.TITLE}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          {AIAssistantCON.SUBTITLE}
        </p>
      </div>

      {/* Query Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {AIAssistantCON.PRESET_QUERIES.map((query) => (
          <button
            key={query}
            onClick={() => handleSend(query)}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-300 transition-colors whitespace-nowrap hairline-border cursor-pointer"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <CardSharedComponent className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 hairline-border-strong whitespace-pre-wrap'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`text-[10px] mt-2 font-mono ${
                  msg.sender === 'user' ? 'text-zinc-400 dark:text-zinc-500' : 'text-slate-400 dark:text-zinc-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 italic">
            <Bot className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Gemini 3.6 Flash analyzing portfolio data...</span>
          </div>
        )}
      </CardSharedComponent>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <InputSharedComponent
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask Copilot about asset replacement risks, warranty renewals, or compliance..."
        />
        <ButtonSharedComponent
          type="submit"
          variant="primary"
          size="md"
          disabled={loading || !inputPrompt.trim()}
          icon={<Send className="w-4 h-4" />}
        >
          Send
        </ButtonSharedComponent>
      </form>
    </div>
  );
}
