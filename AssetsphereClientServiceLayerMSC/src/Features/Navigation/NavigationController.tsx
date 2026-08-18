import React from 'react';
import HeaderStaticComponent, { HeaderStaticComponentProps } from './Components/static/HeaderStaticComponent';
import SidebarStaticComponent, { SidebarStaticComponentProps } from './Components/static/SidebarStaticComponent';

export interface NavigationControllerProps
  extends HeaderStaticComponentProps,
    SidebarStaticComponentProps {
  children: React.ReactNode;
}

export default function NavigationController({
  children,
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
  nonCompliantCount,
  openTicketCount,
  activeTab,
  onSelectTab,
  unreadAlertCount,
}: NavigationControllerProps): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      <HeaderStaticComponent
        globalSearch={globalSearch}
        onSearchChange={onSearchChange}
        onOpenNewAsset={onOpenNewAsset}
        onOpenScanner={onOpenScanner}
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
        deploymentMode={deploymentMode}
        onToggleDeploymentMode={onToggleDeploymentMode}
        unreadCount={unreadCount}
        isNotificationsOpen={isNotificationsOpen}
        onToggleNotifications={onToggleNotifications}
        nonCompliantCount={nonCompliantCount}
        openTicketCount={openTicketCount}
        onNavigateTab={onSelectTab}
        onNavigateSettings={() => onSelectTab('settings')}
      />
      <div className="flex-1 flex w-full items-start">
        <SidebarStaticComponent
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          unreadAlertCount={unreadAlertCount}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
