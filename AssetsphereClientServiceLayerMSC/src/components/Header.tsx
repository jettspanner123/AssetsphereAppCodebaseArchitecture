import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  QrCode,
  Bell,
  Sparkles,
  Server,
  Cloud,
  ChevronDown,
  Building,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

interface HeaderProps {
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  onOpenQRScanner: () => void;
  onOpenAIAssistant: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  setDeploymentMode: (m: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync') => void;
  unreadAlertCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  globalSearch,
  setGlobalSearch,
  onOpenQRScanner,
  onOpenAIAssistant,
  deploymentMode,
  setDeploymentMode,
  unreadAlertCount,
  onOpenNotifications,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-[#0a0a0b] border-b border-slate-800 text-slate-100 sticky top-0 z-30 px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-md">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-white font-sans leading-tight">
              AssetSphere <span className="text-indigo-400 font-semibold">Enterprise</span>
            </h1>
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-mono border border-indigo-500/20">
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Enterprise ITAM & Governance Platform
          </p>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-2 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search Assets, Serial #, or Employees..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-3">
        {/* Deployment Mode Toggle */}
        <div className="hidden lg:flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setDeploymentMode('Self-Hosted Air-Gapped')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-medium text-[11px] ${
              deploymentMode === 'Self-Hosted Air-Gapped'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-xs'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Air-Gapped On-Premises Mode"
          >
            <Server className="w-3.5 h-3.5" />
            Air-Gapped
          </button>
          <button
            onClick={() => setDeploymentMode('Enterprise Cloud Sync')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-medium text-[11px] ${
              deploymentMode === 'Enterprise Cloud Sync'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Multi-Cloud Sync Mode"
          >
            <Cloud className="w-3.5 h-3.5" />
            Cloud Sync
          </button>
        </div>

        {/* Systems Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-400 font-medium">SYSTEMS: ONLINE</span>
        </div>

        {/* QR Scanner Trigger */}
        <button
          onClick={onOpenQRScanner}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/60 transition-all"
          title="Scan Asset QR Code or Barcode"
        >
          <QrCode className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Scan QR</span>
        </button>

        {/* AI Assistant Trigger */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg border border-slate-700/60 transition-all"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4 text-slate-400" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="User"
              className="w-7 h-7 rounded-full border border-indigo-500/50 object-cover"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white">Alexander Wright</div>
              <div className="text-[10px] text-slate-500">CTO Access</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#161618] border border-slate-800 rounded-xl shadow-2xl z-50 p-4 text-slate-300 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500"
                />
                <div>
                  <div className="font-bold text-sm text-white">Alexander Wright</div>
                  <div className="text-slate-500 text-[11px]">a.wright@enterprise.com</div>
                  <div className="text-indigo-400 text-[10px] font-semibold mt-0.5">Admin & CTO Access</div>
                </div>
              </div>
              <div className="py-2 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 py-1">
                  <span>Organization</span>
                  <span className="font-semibold text-white">Enterprise HQ</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 py-1">
                  <span>Deployment</span>
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                    {deploymentMode}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
