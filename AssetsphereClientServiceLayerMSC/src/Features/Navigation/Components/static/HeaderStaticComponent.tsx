import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Bell, Menu } from 'lucide-react';
import ButtonSharedComponent from '../../../../Shared/Components/ButtonSharedComponent';
import ProfileDropdownStaticComponent from './ProfileDropdownStaticComponent';
import NotificationsDropdownStaticComponent from './NotificationsDropdownStaticComponent';
import MobileNavigationDrawerStaticComponent from './MobileNavigationDrawerStaticComponent';
import NavigationCON from '../../Constants/NavigationCON';
import { TabType } from '../../../../Types/NavigationType';
import weplmLogo from '../../../../assets/weplm.jpeg';
import useAuthenticationStateStore from '../../../../Store/AuthenticationStateStore';
import TanstackQueryClientService from '../../../../Services/TanstackQueryClientService';

export interface HeaderStaticComponentProps {
  globalSearch: string;
  onSearchChange: (value: string) => void;
  onOpenNewAsset: () => void;
  onOpenScanner: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  unreadCount?: number;
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
  nonCompliantCount?: number;
  openTicketCount?: number;
  activeTab: TabType;
  unreadAlertCount: number;
  onNavigateTab?: (tab: TabType) => void;
  onNavigateSettings?: () => void;
  onNavigateDevDashboard?: () => void;
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
  unreadCount: propUnreadCount,
  isNotificationsOpen,
  onToggleNotifications,
  nonCompliantCount = 0,
  openTicketCount = 0,
  activeTab,
  unreadAlertCount,
  onNavigateTab,
  onNavigateSettings,
  onNavigateDevDashboard,
  onSignOut,
}: HeaderStaticComponentProps): React.JSX.Element {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const user = useAuthenticationStateStore((state) => state.user);
  const displayName =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    'Enterprise User';
  const displayEmail = user?.email || '';

  // Query live notifications for reactive unread badge
  const { data: notifications = [] } =
    TanstackQueryClientService.current.notifications.useNotificationsQuery(
      user?.id,
      user?.role
    );

  const effectiveUnreadCount =
    notifications.length > 0 || user?.id
      ? notifications.filter((n) => !n.isRead).length
      : propUnreadCount ?? 0;

  const getInitials = (name: string, email: string): string => {
    if (name && name.trim() && name !== 'Enterprise User') {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'EU';
  };

  const initials = getInitials(displayName, displayEmail);

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
    <header className="h-16 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-black md:bg-white/50 md:dark:bg-black/50 md:backdrop-blur-lg sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand logo / Mobile title - 1:1 SignForge sizing */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <img
          src={weplmLogo}
          alt="We.PLM Logo"
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-sm object-cover shrink-0 shadow-sm border border-slate-200/80 dark:border-zinc-800"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline leading-tight">
            {NavigationCON.BRAND_TITLE}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5 leading-none">
            {NavigationCON.BRAND_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Right Controls & Search Bar Grouped Together */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Global Search Bar with Ctrl + K Indicator - hidden below md, matches Sidebar's mobile breakpoint */}
        <div className="relative hidden md:block md:w-64">
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

        {/* Notifications Popover Dropdown Button - hidden below md */}
        <div className="relative hidden md:block">
          <button
            onClick={onToggleNotifications}
            className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hairline-border hover:bg-slate-200 dark:hover:bg-zinc-700/80 transition-colors cursor-pointer relative flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {effectiveUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {effectiveUnreadCount}
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
            className="h-10 w-10 sm:h-9 sm:w-9 rounded-xl sm:rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hairline-border hover:bg-slate-200 dark:hover:bg-zinc-700/80 transition-colors cursor-pointer relative flex items-center justify-center"
            title={`${displayName} - Profile & Settings`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
              />
            ) : (
              <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs sm:text-[10px] font-mono">
                {initials}
              </div>
            )}
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
            onSignOut={onSignOut}
          />
        </div>

        {/* Mobile Menu Button (<md) - opens bottom drawer, 1:1 SignForge */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Open Navigation Menu"
          className="md:hidden h-10 w-10 sm:h-9 sm:w-9 rounded-xl sm:rounded-lg flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800 cursor-pointer"
        >
          <Menu className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Mobile Bottom Drawer Navigation */}
      <MobileNavigationDrawerStaticComponent
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => onNavigateTab?.(tab)}
        unreadAlertCount={unreadAlertCount}
        onSignOut={onSignOut}
      />
    </header>
  );
}
