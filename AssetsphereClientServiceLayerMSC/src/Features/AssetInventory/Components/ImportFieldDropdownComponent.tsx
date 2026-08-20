import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search, XCircle, FileSpreadsheet } from 'lucide-react';

export interface ImportFieldDropdownComponentProps {
  detectedHeaders: string[];
  selectedHeader: string;
  onSelect: (header: string) => void;
  isRequired?: boolean;
  targetFieldLabel: string;
}

export default function ImportFieldDropdownComponent({
  detectedHeaders,
  selectedHeader,
  onSelect,
  isRequired,
  targetFieldLabel,
}: ImportFieldDropdownComponentProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const filteredHeaders = detectedHeaders.filter((h) =>
    h.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const isMapped = Boolean(selectedHeader);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
          isMapped
            ? 'bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900/60 text-slate-900 dark:text-zinc-100 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-700'
            : isRequired
            ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-300/60 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 hover:border-amber-400'
            : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <FileSpreadsheet
            className={`w-3.5 h-3.5 shrink-0 ${
              isMapped
                ? 'text-indigo-600 dark:text-indigo-400'
                : isRequired
                ? 'text-amber-500'
                : 'text-slate-400 dark:text-zinc-500'
            }`}
          />
          {isMapped ? (
            <span className="font-medium font-mono truncate text-slate-800 dark:text-zinc-200">
              {selectedHeader}
            </span>
          ) : (
            <span className="italic text-slate-400 dark:text-zinc-500 truncate">
              {isRequired ? '— Select required column —' : '— Unmapped (Skip) —'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isMapped && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Popover Menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#0e0e11] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 text-xs space-y-1 max-h-64 flex flex-col"
          >
            {/* Header & Filter Search */}
            <div className="p-1 pb-1.5 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="text-[10px] uppercase font-mono font-semibold text-slate-400 dark:text-zinc-500 mb-1 px-1">
                Map column to: <span className="text-slate-700 dark:text-zinc-300 font-bold">{targetFieldLabel}</span>
              </div>
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter CSV headers..."
                  className="w-full h-7 pl-7 pr-2 rounded-md bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/60 text-slate-900 dark:text-zinc-100 text-[11px] focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto space-y-0.5 max-h-40 py-0.5">
              {/* Unmapped Option */}
              <button
                type="button"
                onClick={() => {
                  onSelect('');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  !selectedHeader
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="italic">— Do not map (Leave blank) —</span>
                </div>
                {!selectedHeader && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
              </button>

              {/* Detected Headers */}
              {filteredHeaders.map((header) => {
                const isSelected = selectedHeader === header;
                return (
                  <button
                    key={header}
                    type="button"
                    onClick={() => {
                      onSelect(header);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="font-mono text-xs truncate pr-2">{header}</div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}

              {filteredHeaders.length === 0 && (
                <div className="py-3 text-center text-slate-400 dark:text-zinc-500 text-[11px]">
                  No matching columns found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
