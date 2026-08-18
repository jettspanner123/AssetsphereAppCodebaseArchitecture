import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Cloud,
  QrCode,
  Settings,
  LogOut,
  Mail,
  Sun,
  Moon,
} from 'lucide-react';
import BadgeSharedComponent from '../../../../Shared/Components/BadgeSharedComponent';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent cursor-default"
          />

          {/* Spacious Dropdown Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-[350px] z-50 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-5 text-xs select-none space-y-5"
          >
            {/* User Profile Info Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
              <div className="w-11 h-11 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-serif-headline text-base shadow-sm shrink-0">
                AV
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white font-serif-headline text-sm truncate">
                  Alexander Vance
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                  Director of IT & Enterprise Security
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500 font-mono mt-1">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">a.vance@assetsphere.io</span>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider px-1">
                Quick Tools & Environment
              </h4>

              {/* Theme Mode Toggle Action */}
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-xs">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <BadgeSharedComponent variant="neutral" size="sm">
                  Switch
                </BadgeSharedComponent>
              </button>

              {/* Barcode Scanner Action */}
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span className="text-xs">Scan Asset Barcode</span>
                </div>
              </button>

              {/* System Settings Link */}
              {onNavigateSettings && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSettings();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="text-xs">System Settings & Config</span>
                  </div>
                </button>
              )}

              {/* Deployment Mode Toggle */}
              <button
                onClick={onToggleDeploymentMode}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {deploymentMode === 'Self-Hosted Air-Gapped' ? (
                      <Shield className="w-4 h-4" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate text-left">
                    <span className="block text-xs truncate">{deploymentMode}</span>
                  </div>
                </div>
                <BadgeSharedComponent
                  variant={deploymentMode === 'Self-Hosted Air-Gapped' ? 'success' : 'info'}
                  size="sm"
                >
                  Active
                </BadgeSharedComponent>
              </button>
            </div>

            {/* Sign Out Section */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-zinc-800/80">
              <button
                onClick={() => {
                  onClose();
                  alert('Signed out of AssetSphere Enterprise.');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer font-medium text-xs"
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
