import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Code,
  Quote,
  Eye,
  Edit3,
  Sparkles,
} from 'lucide-react';

export interface RichTextEditorSharedComponentProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

export default function RichTextEditorSharedComponent({
  label,
  value,
  onChange,
  placeholder = 'Provide a detailed technical description of the device fault, steps to reproduce, or diagnostic observations...',
  minHeight = '140px',
  required = false,
  helperText,
  className = 'w-full',
}: RichTextEditorSharedComponentProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Helper to insert markdown formatting around selected text or cursor
  const applyFormat = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end) || defaultText;

    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyFormat('**', '**', 'bold text');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        applyFormat('*', '*', 'italic text');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        applyFormat('`', '`', 'code');
      }
    }
  };

  // Convert markdown to formatted preview HTML elements
  const renderPreview = (text: string) => {
    if (!text.trim()) {
      return (
        <p className="text-slate-400 dark:text-zinc-500 italic text-xs py-4 text-center">
          Nothing to preview yet. Switch to "Write" tab to describe the issue.
        </p>
      );
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('## ')) {
            return (
              <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                {line.replace('## ', '')}
              </h4>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white pt-1">
                {line.replace('# ', '')}
              </h3>
            );
          }
          // Quotes
          if (line.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="pl-3 border-l-2 border-[#0C2086] text-slate-600 dark:text-zinc-400 italic my-1"
              >
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          // Bullet lists
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-zinc-300">
                {line.replace(/^[-*]\s/, '')}
              </li>
            );
          }
          // Numbered lists
          if (/^\d+\.\s/.test(line)) {
            return (
              <li key={idx} className="ml-4 list-decimal text-slate-700 dark:text-zinc-300">
                {line.replace(/^\d+\.\s/, '')}
              </li>
            );
          }
          // Code block indicator
          if (line.startsWith('```')) {
            return (
              <div key={idx} className="text-[10px] font-mono text-slate-400">
                {line}
              </div>
            );
          }
          // Standard paragraphs / empty lines
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }

          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 block">
            {label} {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-2.5 h-2.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="rounded-xl border border-slate-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-2xs focus-within:border-[#0C2086] focus-within:ring-1 focus-within:ring-[#0C2086]/40 transition-all">
        {/* Formatting Toolbar */}
        {activeTab === 'write' && (
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400">
            <button
              type="button"
              onClick={() => applyFormat('**', '**', 'bold')}
              title="Bold (Ctrl+B)"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('*', '*', 'italic')}
              title="Italic (Ctrl+I)"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('~~', '~~', 'strikethrough')}
              title="Strikethrough"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-1" />

            <button
              type="button"
              onClick={() => applyFormat('### ', '', 'Heading 3')}
              title="Heading 3"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer font-bold text-[11px] px-1.5"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => applyFormat('#### ', '', 'Heading 4')}
              title="Heading 4"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer font-bold text-[10px] px-1.5"
            >
              H4
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-1" />

            <button
              type="button"
              onClick={() => applyFormat('- ', '', 'List item')}
              title="Bullet List"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('1. ', '', 'Numbered item')}
              title="Numbered List"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-3.5 bg-slate-300 dark:bg-zinc-700 mx-1" />

            <button
              type="button"
              onClick={() => applyFormat('`', '`', 'code')}
              title="Inline Code (Ctrl+E)"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('> ', '', 'Quoted text')}
              title="Quote"
              className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 ml-auto hidden sm:inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0C2086] dark:text-blue-400" />
              Markdown Formatted
            </span>
          </div>
        )}

        {/* Editor Body */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-3 text-xs bg-transparent text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none resize-y font-sans leading-relaxed"
          />
        ) : (
          <div style={{ minHeight }} className="p-3 bg-slate-50/50 dark:bg-zinc-950/40 overflow-y-auto">
            {renderPreview(value)}
          </div>
        )}

        {/* Footer Counters */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-100 dark:border-zinc-800 text-[10px] font-mono text-slate-400 dark:text-zinc-500 bg-slate-50/40 dark:bg-zinc-900/40">
          <span>{helperText || 'Supports markdown formatting, bullet points, and code blocks.'}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
