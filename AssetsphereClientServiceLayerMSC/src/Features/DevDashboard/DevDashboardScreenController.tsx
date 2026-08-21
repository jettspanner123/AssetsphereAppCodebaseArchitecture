import React, { useState } from 'react';
import HeaderStaticComponent from '../Navigation/Components/static/HeaderStaticComponent';
import ProfileDropdownStaticComponent from '../Navigation/Components/static/ProfileDropdownStaticComponent';
import DevDashboardSidebarComponent, { DevTabType } from './Components/DevDashboardSidebarComponent';
import DevOverviewViewController from './Views/DevOverviewViewController';
import DevCreateUserViewController from './Views/DevCreateUserViewController';
import DevEditUserViewController from './Views/DevEditUserViewController';
import DevSystemLogsViewController from './Views/DevSystemLogsViewController';
import DevApiKeysViewController from './Views/DevApiKeysViewController';

export interface DevDashboardScreenControllerProps {
  currentTheme: string;
  onToggleTheme: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  showMockData: boolean;
  onToggleShowMockData: () => void;
  onNavigateAppDashboard: () => void;
  onNavigateSettings: () => void;
  onSignOut: () => void;
}

export default function DevDashboardScreenController({
  currentTheme,
  onToggleTheme,
  deploymentMode,
  onToggleDeploymentMode,
  showMockData,
  onToggleShowMockData,
  onNavigateAppDashboard,
  onNavigateSettings,
  onSignOut,
}: DevDashboardScreenControllerProps): React.JSX.Element {
  const [activeDevTab, setActiveDevTab] = useState<DevTabType>('create_user');

  // Header State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-[#000000] text-slate-900 dark:text-zinc-100 select-none">
      {/* Shared Header Navigation */}
      <HeaderStaticComponent
        globalSearch={globalSearch}
        onSearchChange={setGlobalSearch}
        onOpenNewAsset={onNavigateAppDashboard}
        onOpenScanner={() => {}}
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
        deploymentMode={deploymentMode}
        onToggleDeploymentMode={onToggleDeploymentMode}
        unreadCount={0}
        isNotificationsOpen={false}
        onToggleNotifications={() => {}}
        showMockData={showMockData}
        onToggleShowMockData={onToggleShowMockData}
        onNavigateDevDashboard={() => setActiveDevTab('overview')}
        onNavigateSettings={onNavigateSettings}
        onSignOut={onSignOut}
      />

      {/* Main Developer Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dedicated Developer Sidebar */}
        <DevDashboardSidebarComponent
          activeTab={activeDevTab}
          setActiveTab={setActiveDevTab}
          onReturnToAppDashboard={onNavigateAppDashboard}
        />

        {/* Dynamic Developer Subview Content Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 dark:bg-[#0a0a0c]">
          {activeDevTab === 'overview' && <DevOverviewViewController />}
          {activeDevTab === 'create_user' && <DevCreateUserViewController />}
          {activeDevTab === 'edit_user' && <DevEditUserViewController />}
          {activeDevTab === 'logs' && <DevSystemLogsViewController />}
          {activeDevTab === 'api_keys' && <DevApiKeysViewController />}
          {activeDevTab === 'env_flags' && <DevOverviewViewController />}
        </main>
      </div>
    </div>
  );
}
