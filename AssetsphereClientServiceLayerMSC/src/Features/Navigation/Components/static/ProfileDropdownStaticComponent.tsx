import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  QrCode,
  Settings,
  LogOut,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';
import ApplicationThemeCON from '../../../../Constants/ApplicationThemeCON';

export interface ProfileDropdownStaticComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  onNavigateSettings?: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
}

export default function ProfileDropdownStaticComponent({
  isOpen,
  onClose,
  onOpenScanner,
  deploymentMode,
  onToggleDeploymentMode,
  onNavigateSettings,
  currentTheme,
  onToggleTheme,
}: ProfileDropdownStaticComponentProps): React.JSX.Element {
  const isDark = currentTheme === ApplicationThemeCON.DARK;
  const isSelfHosted = deploymentMode === 'Self-Hosted Air-Gapped';

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent cursor-default"
          />

          {/* Clean Executive Profile Popover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-80 z-50 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 text-xs select-none space-y-4"
          >
            {/* 1. Header: User Identity */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-serif-headline text-sm shadow-xs shrink-0">
                AV
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white font-serif-headline text-sm truncate leading-tight">
                  Alexander Vance
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate mt-0.5 font-mono">
                  Director of IT
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5 truncate">
                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                  <span className="truncate">a.vance@assetsphere.io</span>
                </div>
              </div>
            </div>

            {/* 2. Full-Width Preferences & Environment Switchers */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 block px-1">
                Preferences & Controls
              </span>

              {/* Theme Mode Control Block */}
              <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200 font-medium">
                  {isDark ? (
                    <Moon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>Theme Mode</span>
                </div>

                <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-zinc-800 border border-slate-300/60 dark:border-zinc-700/60 h-8 w-full">
                  <button
                    onClick={() => isDark && onToggleTheme()}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 h-6 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      !isDark
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => !isDark && onToggleTheme()}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 h-6 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Environment Control Block */}
              <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200 font-medium">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Deployment Environment</span>
                </div>

                <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-zinc-800 border border-slate-300/60 dark:border-zinc-700/60 h-8 w-full">
                  <button
                    onClick={() => !isSelfHosted && onToggleDeploymentMode()}
                    className={`flex-1 py-1 h-6 rounded-md text-xs font-medium transition-all cursor-pointer text-center ${
                      isSelfHosted
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Air-Gapped
                  </button>
                  <button
                    onClick={() => isSelfHosted && onToggleDeploymentMode()}
                    className={`flex-1 py-1 h-6 rounded-md text-xs font-medium transition-all cursor-pointer text-center ${
                      !isSelfHosted
                        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Cloud Sync
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Quick Action Links */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors font-medium cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Scan Asset Barcode</span>
              </button>

              {onNavigateSettings && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors font-medium cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>System Settings & Config</span>
                </button>
              )}
            </div>

            {/* 4. Footer: Sign Out */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
              <button
                onClick={() => {
                  onClose();
                  alert('Signed out of AssetSphere Enterprise.');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
