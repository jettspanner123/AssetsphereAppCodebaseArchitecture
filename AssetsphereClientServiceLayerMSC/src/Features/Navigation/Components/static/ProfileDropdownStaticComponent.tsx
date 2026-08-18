import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Cloud,
  QrCode,
  Settings,
  LogOut,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';
import BadgeSharedComponent from '../../../../Shared/Components/BadgeSharedComponent';

export interface ProfileDropdownStaticComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  onNavigateSettings?: () => void;
}

export default function ProfileDropdownStaticComponent({
  isOpen,
  onClose,
  onOpenScanner,
  deploymentMode,
  onToggleDeploymentMode,
  onNavigateSettings,
}: ProfileDropdownStaticComponentProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent cursor-default"
          />

          {/* Dropdown Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-80 z-50 bg-white dark:bg-[#0a0a0c] hairline-border-strong rounded-xl shadow-2xl p-4 text-xs space-y-4 select-none"
          >
            {/* User Details Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-serif-headline text-sm shadow-sm shrink-0">
                AV
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white font-serif-headline truncate text-sm">
                  Alexander Vance
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  Director of IT & Enterprise Security
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                  <Mail className="w-3 h-3" /> a.vance@assetsphere.io
                </div>
              </div>
            </div>

            {/* Quick Actions & Settings Controls */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider">
                Quick Actions & Controls
              </span>

              {/* Barcode Scanner Action */}
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-100/70 dark:bg-zinc-900 hover:bg-slate-200/80 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-500">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <span>Scan Asset Barcode</span>
                </div>
                <BadgeSharedComponent variant="info" size="sm">
                  Camera
                </BadgeSharedComponent>
              </button>

              {/* System Settings Link */}
              {onNavigateSettings && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSettings();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-100/70 dark:bg-zinc-900 hover:bg-slate-200/80 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span>System Settings & Config</span>
                  </div>
                  <BadgeSharedComponent variant="neutral" size="sm">
                    Admin
                  </BadgeSharedComponent>
                </button>
              )}

              {/* Deployment Mode Toggle */}
              <button
                onClick={onToggleDeploymentMode}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-100/70 dark:bg-zinc-900 hover:bg-slate-200/80 dark:hover:bg-zinc-800 transition-colors text-slate-900 dark:text-zinc-100 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
                    {deploymentMode === 'Self-Hosted Air-Gapped' ? (
                      <Shield className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Cloud className="w-4 h-4 text-sky-500" />
                    )}
                  </div>
                  <div className="truncate text-left">
                    <span className="block truncate">{deploymentMode}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Click to toggle env</span>
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

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
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
