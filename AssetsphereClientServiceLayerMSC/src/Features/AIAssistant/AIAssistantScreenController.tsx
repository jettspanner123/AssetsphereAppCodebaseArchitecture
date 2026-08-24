import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Asset } from '../../Types/AssetType';
import { askAIAssistant } from '@/src/Services/aiService';
import {
  Send,
  Bot,
  Plus,
  Mic,
  MicOff,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';

export interface AIAssistantScreenControllerProps {
  assets: Asset[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const AVAILABLE_AGENTS = [
  { id: 'gemini', name: 'Gemini 3.6 Flash', provider: 'Google AI', badge: 'Fastest' },
  { id: 'gpt4o', name: 'GPT-4o Enterprise', provider: 'OpenAI', badge: 'Reasoning' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: 'Coding' },
  { id: 'deepseek', name: 'DeepSeek V3 Air-Gapped', provider: 'Local LLM', badge: 'Private' },
];

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
  const [selectedAgent, setSelectedAgent] = useState(AVAILABLE_AGENTS[0]);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleToggleDictation = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        setTimeout(() => {
          setInputPrompt((prev) =>
            prev
              ? `${prev} Show high risk MacBook Pro laptops`
              : 'Show high risk MacBook Pro laptops'
          );
          setIsListening(false);
        }, 1500);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputPrompt((prev) =>
        prev ? `${prev} [Attached: ${file.name}]` : `Analyzing file context: ${file.name}`
      );
    }
  };

  return (
    <div className="space-y-6 pb-6 relative min-h-[calc(100vh-120px)] flex flex-col justify-between">
      {/* Clean Avatar-less Chat Stream Container (Uses Single Root Page Scroll) */}
      <div className="space-y-4 px-1 py-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-900 font-medium rounded-br-none shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-900/90 text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800/80 rounded-bl-none whitespace-pre-wrap'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`text-[10px] mt-2 font-mono ${
                  msg.sender === 'user'
                    ? 'text-zinc-400 dark:text-zinc-500 text-right'
                    : 'text-slate-400 dark:text-zinc-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 italic px-2">
            <Bot className="w-4 h-4 animate-spin text-indigo-500" />
            <span>{selectedAgent.name} analyzing portfolio data...</span>
          </div>
        )}
      </div>

      {/* Google Gemini Style Sticky Bottom Floating Input Bar with Toolbar */}
      <div className="sticky bottom-4 z-20 pt-2 pb-1 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md">
        {/* Hidden File Input for Attachment */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 rounded-[28px] bg-slate-100 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 transition-all shadow-xs focus-within:border-slate-400 dark:focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-slate-900/5 dark:focus-within:ring-white/5 relative"
        >
          {/* Left: Add / Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-200/80 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer shrink-0"
            title="Attach file, log or CSV"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Textarea / Input Bar */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask Copilot about assets, warranties, or compliance..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none py-2 px-1"
          />

          {/* Right Group: Agent Selector Dropdown -> Dictation Mic -> Send Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Agent Selector Dropdown Button (Exact h-9 Height Matching Dictation Button) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                className="h-9 px-3 rounded-full bg-slate-200/70 dark:bg-zinc-800 text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate max-w-[110px] sm:max-w-none">{selectedAgent.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Agent Picker Popover Menu */}
              <AnimatePresence>
                {isAgentMenuOpen && (
                  <React.Fragment>
                    <div
                      onClick={() => setIsAgentMenuOpen(false)}
                      className="fixed inset-0 z-30 bg-transparent"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-11 w-60 z-40 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 text-xs space-y-1"
                    >
                      <div className="px-2.5 py-1 text-[10px] uppercase font-mono font-semibold text-slate-400 dark:text-zinc-500">
                        Select Intelligence Model
                      </div>
                      {AVAILABLE_AGENTS.map((agent) => (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            setSelectedAgent(agent);
                            setIsAgentMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-left ${
                            selectedAgent.id === agent.id
                              ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold'
                              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                          }`}
                        >
                          <div>
                            <div className="font-mono text-xs">{agent.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans">
                              {agent.provider}
                            </div>
                          </div>
                          {selectedAgent.id === agent.id && (
                            <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </React.Fragment>
                )}
              </AnimatePresence>
            </div>

            {/* Dictation / Voice Microphone Button (Exact h-9 Height) */}
            <button
              type="button"
              onClick={handleToggleDictation}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 relative ${
                isListening
                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 animate-pulse'
                  : 'hover:bg-slate-200/80 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
              }`}
              title={isListening ? 'Listening... Speak now' : 'Start Voice Dictation'}
            >
              {isListening ? (
                <React.Fragment>
                  <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                  <MicOff className="w-4 h-4 text-rose-500" />
                </React.Fragment>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
