import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import ButtonSharedComponent from '../../../../Shared/Components/ButtonSharedComponent';
import ProfileDropdownStaticComponent from './ProfileDropdownStaticComponent';
import NotificationsDropdownStaticComponent from './NotificationsDropdownStaticComponent';
import NavigationCON from '../../Constants/NavigationCON';
import { TabType } from '../../../../Types/NavigationType';
import weplmLogo from '../../../../assets/weplm.jpeg';

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
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
  nonCompliantCount?: number;
  openTicketCount?: number;
  onNavigateTab?: (tab: TabType) => void;
  onNavigateSettings?: () => void;
  onNavigateDevDashboard?: () => void;
  showMockData?: boolean;
  onToggleShowMockData?: () => void;
  onSignOut?: () => void;
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
  isNotificationsOpen,
  onToggleNotifications,
  nonCompliantCount = 0,
  openTicketCount = 0,
  onNavigateTab,
  onNavigateSettings,
  onNavigateDevDashboard,
  showMockData,
  onToggleShowMockData,
  onSignOut,
}: HeaderStaticComponentProps): React.JSX.Element {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-black/50 backdrop-blur-lg sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand logo / Mobile title */}
      <div className="flex items-center gap-3 shrink-0">
        <img
          src={weplmLogo}
          alt="We.PLM Logo"
          className="w-8 h-8 rounded-sm object-cover shrink-0 shadow-sm border border-slate-200/80 dark:border-zinc-800"
        />
        <div className="hidden sm:block">
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline leading-none">
            {NavigationCON.BRAND_TITLE}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
            {NavigationCON.BRAND_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Right Controls & Search Bar Grouped Together */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Global Search Bar with Ctrl + K Indicator */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={globalSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search devices, serials..."
            className="w-full h-9 pl-9 pr-14 text-xs rounded-lg bg-slate-200/70 dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 border border-slate-300/80 dark:border-zinc-700/80 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-900 dark:focus:border-white transition-all shadow-2xs"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:text-zinc-400 bg-slate-300/60 dark:bg-zinc-700/60 rounded border border-slate-300/80 dark:border-zinc-600/60 shadow-2xs pointer-events-none">
            Ctrl K
          </kbd>
        </div>

        {/* Notifications Popover Dropdown Button */}
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

          {/* Notifications Dropdown Popover */}
          <NotificationsDropdownStaticComponent
            isOpen={isNotificationsOpen}
            onClose={onToggleNotifications}
            nonCompliantCount={nonCompliantCount}
            openTicketCount={openTicketCount}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* Profile Button */}
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
            onNavigateDevDashboard={onNavigateDevDashboard}
            currentTheme={currentTheme}
            onToggleTheme={onToggleTheme}
            showMockData={showMockData}
            onToggleShowMockData={onToggleShowMockData}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
}
