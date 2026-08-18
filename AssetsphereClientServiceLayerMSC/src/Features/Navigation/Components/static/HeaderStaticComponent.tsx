import React, { useState } from 'react';
import { Search, Plus, Bell, User } from 'lucide-react';
import ButtonSharedComponent from '../../../../Shared/Components/ButtonSharedComponent';
import ThemeToggleSharedComponent from '../../../../Shared/Components/ThemeToggleSharedComponent';
import ProfileDropdownStaticComponent from './ProfileDropdownStaticComponent';
import NavigationCON from '../../Constants/NavigationCON';

export interface HeaderStaticComponentProps {
  globalSearch: string;
  onSearchChange: (value: string) => void;
  onOpenNewAsset: () => void;
  onOpenScanner: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  onNavigateSettings?: () => void;
}

export default function HeaderStaticComponent({
  globalSearch,
  onSearchChange,
  onOpenNewAsset,
  onOpenScanner,
  currentTheme,
  onToggleTheme,
  deploymentMode,
  onToggleDeploymentMode,
  unreadCount,
  onToggleNotifications,
  onNavigateSettings,
}: HeaderStaticComponentProps): React.JSX.Element {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand logo / Mobile title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold font-serif-headline text-lg shadow-sm">
          A
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline leading-none">
            {NavigationCON.BRAND_TITLE}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
            {NavigationCON.BRAND_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search devices, serial numbers, employees..."
          className="w-full h-9 pl-9 pr-4 text-xs sm:text-sm rounded-md bg-slate-100 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 hairline-border focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Add Asset Trigger */}
        <ButtonSharedComponent
          variant="primary"
          size="sm"
          onClick={onOpenNewAsset}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Asset
        </ButtonSharedComponent>

        {/* Theme Toggle */}
        <ThemeToggleSharedComponent
          currentTheme={currentTheme}
          onToggle={onToggleTheme}
        />

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hairline-border hover:bg-slate-200 dark:hover:bg-zinc-700/80 transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile Button beside Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hairline-border hover:bg-slate-200 dark:hover:bg-zinc-700/80 transition-colors cursor-pointer flex items-center gap-1.5"
            title="User Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px] font-mono">
              AV
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          <ProfileDropdownStaticComponent
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onOpenScanner={onOpenScanner}
            deploymentMode={deploymentMode}
            onToggleDeploymentMode={onToggleDeploymentMode}
            onNavigateSettings={onNavigateSettings}
          />
        </div>
      </div>
    </header>
  );
}
