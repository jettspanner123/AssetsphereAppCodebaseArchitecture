import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import NavigationCON from '../../Constants/NavigationCON';
import { TabType } from '../../../../Types/NavigationType';
import BadgeSharedComponent from '../../../../Shared/Components/BadgeSharedComponent';
import ApplicationPermissionService from '@/src/Services/ApplicationPermissionService';
import useAuthenticationStateStore from '@/src/Store/AuthenticationStateStore';

export interface SidebarStaticComponentProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadAlertCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SidebarStaticComponent({
  activeTab,
  onSelectTab,
  unreadAlertCount,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
}: SidebarStaticComponentProps): React.JSX.Element {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  // Subscribe to user role to re-render when auth changes
  const userRole = useAuthenticationStateStore((state) => state.user?.role);

  const isCollapsed =
    externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const handleToggle = () => {
    if (externalOnToggleCollapse) {
      externalOnToggleCollapse();
    } else {
      setInternalIsCollapsed(!internalIsCollapsed);
    }
  };

  const categories = ['Core', 'Organization', 'Operations', 'Intelligence'];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0 border-r border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-black/60 hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-3 select-none z-20 overflow-x-hidden"
    >
      {/* Collapse Toggle Header */}
      <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!isCollapsed && (
          <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wider">
            Navigation
          </span>
        )}
        <button
          onClick={handleToggle}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Items List */}
      <div className="space-y-5 flex-1">
        {categories.map((category) => {
          const items = NavigationCON.NAV_ITEMS.filter(
            (i) => i.category === category && ApplicationPermissionService.current.canAccessTab(i.id)
          );
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase font-mono mb-1.5 transition-opacity">
                  {category}
                </h3>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-2.5 py-2'
                    } rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer relative group ${
                      isActive
                        ? 'bg-slate-200/80 dark:bg-zinc-800/90 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <BadgeSharedComponent variant="info" size="sm">
                        {item.badge}
                      </BadgeSharedComponent>
                    )}

                    {item.id === 'compliance' && unreadAlertCount > 0 && (
                      <span
                        className={`w-2 h-2 rounded-full bg-rose-500 shrink-0 ${
                          isCollapsed ? 'absolute top-1.5 right-1.5' : ''
                        }`}
                      />
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 top-1 bottom-1 w-1 bg-zinc-900 dark:bg-white rounded-r-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </motion.aside>
  );
}
