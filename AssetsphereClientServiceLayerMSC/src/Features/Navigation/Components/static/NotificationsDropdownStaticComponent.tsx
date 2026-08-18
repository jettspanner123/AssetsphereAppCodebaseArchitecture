import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { TabType } from '../../../../components/Sidebar';

export interface NotificationsDropdownStaticComponentProps {
  isOpen: boolean;
  onClose: () => void;
  nonCompliantCount: number;
  openTicketCount: number;
  onNavigateTab?: (tab: TabType) => void;
}

export default function NotificationsDropdownStaticComponent({
  isOpen,
  onClose,
  nonCompliantCount,
  openTicketCount,
  onNavigateTab,
}: NotificationsDropdownStaticComponentProps): React.JSX.Element | null {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-Outside Dismissal Listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-12 w-80 sm:w-96 z-50 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 space-y-3"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif-headline">
                Notifications & Alerts
              </h3>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              {nonCompliantCount + openTicketCount} Active
            </span>
          </div>

          {/* Notifications Items List */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-0.5">
            {nonCompliantCount > 0 && (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-semibold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{nonCompliantCount} Security Violations</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-relaxed font-sans">
                  Devices detected without active Disk Encryption or required EDR agents.
                </p>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateTab('compliance');
                    }}
                    className="pt-1 flex items-center gap-1 text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    <span>Inspect Compliance Matrix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {openTicketCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-semibold text-xs">
                  <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{openTicketCount} Open Service Tickets</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-sans">
                  Hardware repairs and tickets pending technician assignment.
                </p>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateTab('servicedesk');
                    }}
                    className="pt-1 flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>View Service Queue</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {nonCompliantCount === 0 && openTicketCount === 0 && (
              <div className="py-6 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  All Systems Clear
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                  No pending compliance or service alerts.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
