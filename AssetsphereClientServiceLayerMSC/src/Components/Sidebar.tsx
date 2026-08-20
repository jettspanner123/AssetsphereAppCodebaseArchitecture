import React from 'react';
import {
  LayoutDashboard,
  Box,
  Users,
  Key,
  Cloud,
  ShoppingCart,
  Wrench,
  Building2,
  ShieldAlert,
  QrCode,
  Sparkles,
  BarChart3,
  Settings,
  Layers,
  CheckCircle,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'inventory'
  | 'employees'
  | 'licenses'
  | 'cloud'
  | 'procurement'
  | 'servicedesk'
  | 'vendors'
  | 'compliance'
  | 'verification'
  | 'ai_assistant'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  assetCount: number;
  openTicketCount: number;
  nonCompliantCount: number;
  unverifiedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  assetCount,
  openTicketCount,
  nonCompliantCount,
  unverifiedCount,
}) => {
  const navSections = [
    {
      group: 'CORE ITAM MODULES',
      items: [
        { id: 'dashboard' as TabType, label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'inventory' as TabType, label: 'Asset Inventory', icon: Box, badge: assetCount },
        { id: 'employees' as TabType, label: 'Employees & Allocations', icon: Users },
        { id: 'licenses' as TabType, label: 'Software Licenses (SAM)', icon: Key },
        { id: 'cloud' as TabType, label: 'Cloud & Virtual Infra', icon: Cloud },
      ],
    },
    {
      group: 'SUPPLY & OPERATIONS',
      items: [
        { id: 'procurement' as TabType, label: 'Procurement & POs', icon: ShoppingCart },
        { id: 'servicedesk' as TabType, label: 'Service Desk & Repairs', icon: Wrench, badge: openTicketCount, badgeColor: 'bg-amber-950 text-amber-400 border border-amber-900' },
        { id: 'vendors' as TabType, label: 'Vendors & SLA', icon: Building2 },
      ],
    },
    {
      group: 'GOVERNANCE & AUDIT',
      items: [
        { id: 'compliance' as TabType, label: 'Security & Compliance', icon: ShieldAlert, badge: nonCompliantCount > 0 ? nonCompliantCount : undefined, badgeColor: 'bg-rose-950 text-rose-400 border border-rose-900' },
        { id: 'verification' as TabType, label: 'Asset Verification Campaign', icon: QrCode, badge: unverifiedCount > 0 ? unverifiedCount : undefined, badgeColor: 'bg-indigo-950 text-indigo-400 border border-indigo-900' },
        { id: 'ai_assistant' as TabType, label: 'Enterprise AI Assistant', icon: Sparkles, isAi: true },
        { id: 'analytics' as TabType, label: 'Reports & Depreciation', icon: BarChart3 },
        { id: 'settings' as TabType, label: 'Integrations & Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0f0f11] border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.group}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">
              {section.group}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? item.isAi
                          ? 'bg-indigo-600/30 text-white border border-indigo-500/40 font-semibold'
                          : 'bg-slate-800 text-white font-semibold border border-slate-700/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? (item.isAi ? 'text-amber-300' : 'text-indigo-400') : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-slate-800 text-slate-400 border border-slate-700/50'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* System Status Footbar */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 bg-[#0a0a0b]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Healthy
          </span>
          <span className="font-mono text-[10px] text-slate-500">99.99% Uptime</span>
        </div>
      </div>
    </aside>
  );
};
