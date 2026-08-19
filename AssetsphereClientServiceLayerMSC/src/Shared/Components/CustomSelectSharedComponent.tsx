import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectSharedComponentProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelectSharedComponent({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select option...',
}: CustomSelectSharedComponentProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1 block">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 hairline-border-strong hover:border-slate-300 dark:hover:border-zinc-700 transition-colors focus:outline-none text-xs flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 truncate font-medium">
          {selectedOption?.icon}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-700 dark:text-zinc-200' : ''
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl p-1 text-xs space-y-0.5 max-h-56 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-zinc-800/90 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    {option.icon}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.sublabel && (
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                          {option.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
