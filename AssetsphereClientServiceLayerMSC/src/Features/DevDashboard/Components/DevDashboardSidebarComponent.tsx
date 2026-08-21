import React from 'react';
import {
  UserPlus,
  UserCheck,
  Terminal,
  Activity,
  KeyRound,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';

export type DevTabType =
  | 'overview'
  | 'create_user'
  | 'edit_user'
  | 'logs'
  | 'api_keys'
  | 'env_flags';

interface DevDashboardSidebarComponentProps {
  activeTab: DevTabType;
  setActiveTab: (tab: DevTabType) => void;
  onReturnToAppDashboard: () => void;
}

export default function DevDashboardSidebarComponent({
  activeTab,
  setActiveTab,
  onReturnToAppDashboard,
}: DevDashboardSidebarComponentProps): React.JSX.Element {
  const sections = [
    {
      group: 'DEVELOPER OPERATIONS',
      items: [
        { id: 'create_user' as DevTabType, label: 'Create New User', icon: UserPlus, badge: 'FORM' },
        { id: 'edit_user' as DevTabType, label: 'Edit Existing User', icon: UserCheck },
        { id: 'logs' as DevTabType, label: 'System Logs & Audits', icon: Terminal, badge: 'LIVE' },
      ],
    },
    {
      group: 'SYSTEM MONITORING',
      items: [
        { id: 'overview' as DevTabType, label: 'Dev Overview & Health', icon: Activity },
        { id: 'api_keys' as DevTabType, label: 'API Keys & Webhooks', icon: KeyRound },
        { id: 'env_flags' as DevTabType, label: 'Environment Flags', icon: SlidersHorizontal },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/80 dark:bg-[#070709] border-r border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between h-full select-none shrink-0 transition-colors">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Header / Developer Scope Badge */}
        <div className="pb-3 border-b border-slate-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0C2086] dark:text-indigo-400 uppercase bg-[#0C2086]/10 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-[#0C2086]/20 dark:border-indigo-800/60">
              DEV MODE CONSOLE
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">v2.4.0</span>
          </div>
        </div>

        {/* Return to Main Dashboard Quick Link */}
        <button
          onClick={onReturnToAppDashboard}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-zinc-800/60 hover:bg-slate-200/80 dark:hover:bg-zinc-800 transition-all cursor-pointer border border-slate-200/60 dark:border-zinc-700/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main Dashboard</span>
        </button>

        {/* Section Navigation Lists */}
        {sections.map((sec) => (
          <div key={sec.group} className="space-y-1.5">
            <p className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 px-3 uppercase">
              {sec.group}
            </p>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-zinc-900' : 'text-slate-400 dark:text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Developer Environment Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500 font-mono space-y-1">
        <div className="flex items-center justify-between">
          <span>ENV: DEVELOPMENT</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-[10px] text-slate-400/80 dark:text-zinc-600 truncate">
          ASSETSPHERE_ENV_MODE=development
        </div>
      </div>
    </aside>
  );
}
