import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Clock,
  Check,
} from 'lucide-react';
import BadgeSharedComponent from '../../../../Shared/Components/BadgeSharedComponent';
import { TabType } from '../../../../types';

export interface NotificationItem {
  id: string;
  type: 'security' | 'maintenance' | 'procurement' | 'warranty' | 'audit';
  severity: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  subtitle: string;
  assetTag?: string;
  timestamp: string;
  targetTab: TabType;
  isRead: boolean;
}

export interface NotificationsDropdownStaticComponentProps {
  isOpen: boolean;
  onClose: () => void;
  nonCompliantCount: number;
  openTicketCount: number;
  onNavigateTab?: (tab: TabType) => void;
}

export default function NotificationsDropdownStaticComponent({
  isOpen,
  onClose,
  nonCompliantCount,
  openTicketCount,
  onNavigateTab,
}: NotificationsDropdownStaticComponentProps): React.JSX.Element | null {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Real operational enterprise notification feed items
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'security',
      severity: 'critical',
      title: 'ISO 27001 Security Policy Violation',
      subtitle: 'Unencrypted backup volume pool #2 detected on Storage SAN/NAS array.',
      assetTag: 'AST-1008',
      timestamp: '12m ago',
      targetTab: 'compliance',
      isRead: false,
    },
    {
      id: 'notif-2',
      type: 'maintenance',
      severity: 'high',
      title: 'Thermal Throttling & Battery Warning',
      subtitle: 'Elena Rostova (Finance) reported rapid battery drain & overheating under load.',
      assetTag: 'AST-1006',
      timestamp: '45m ago',
      targetTab: 'servicedesk',
      isRead: false,
    },
    {
      id: 'notif-3',
      type: 'procurement',
      severity: 'info',
      title: 'Purchase Order PO-2024-0041 Approved',
      subtitle: '5x Dell UltraSharp 32" 4K Hub Monitors ($14,500) cleared by Finance.',
      assetTag: 'PO-2024-0041',
      timestamp: '3h ago',
      targetTab: 'procurement',
      isRead: true,
    },
    {
      id: 'notif-4',
      type: 'warranty',
      severity: 'medium',
      title: 'AppleCare+ Coverage Expiring Soon',
      subtitle: 'Executive Studio Display 27" warranty expires in 14 days.',
      assetTag: 'AST-1005',
      timestamp: 'Yesterday',
      targetTab: 'inventory',
      isRead: true,
    },
    {
      id: 'notif-5',
      type: 'audit',
      severity: 'info',
      title: 'Q1 Physical Asset Barcode Audit',
      subtitle: '112 of 148 assets verified. 3 physical location discrepancies flagged.',
      assetTag: 'CMP-2024-Q1',
      timestamp: '2d ago',
      targetTab: 'verification',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Click-Outside Dismissal Listener
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  const filteredItems = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    return true;
  });

  const getSeverityBadge = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-zinc-400 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'procurement':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'warranty':
        return <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'audit':
        return <FileCheck2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const unreadNotifications = notifications.filter((item) => !item.isRead);
  const readNotifications = notifications.filter((item) => item.isRead);

  const renderNotificationCard = (item: NotificationItem) => (
    <div
      key={item.id}
      onClick={() => markAsRead(item.id)}
      className={`p-3 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
        !item.isRead
          ? 'bg-slate-50/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-700/80 shadow-xs'
          : 'bg-white/40 dark:bg-zinc-900/30 border-slate-100 dark:border-zinc-800/60 opacity-85'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {getTypeIcon(item.type)}
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs truncate leading-snug">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
            {item.timestamp}
          </span>
          {!item.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Subtitle Body */}
      <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed font-sans pl-5">
        {item.subtitle}
      </p>

      {/* Footer Tag & Action Button */}
      <div className="flex items-center justify-between pt-1 pl-5">
        {item.assetTag && (
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(item.severity)}`}>
            {item.assetTag}
          </span>
        )}

        {onNavigateTab && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(item.id);
              onClose();
              onNavigateTab(item.targetTab);
            }}
            className="flex items-center gap-1 text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-auto"
          >
            <span>Action</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-12 w-80 sm:w-96 z-50 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 text-xs select-none space-y-3"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white font-serif-headline text-sm leading-none">
                  Activity & Operational Alerts
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 font-mono">
                  Enterprise Infrastructure Activity
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-semibold text-[11px] border transition-all cursor-pointer shadow-2xs ${
                unreadCount > 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                  : 'bg-slate-100 dark:bg-zinc-800/40 text-slate-400 dark:text-zinc-600 border-slate-200/50 dark:border-zinc-800/40 opacity-60 cursor-not-allowed'
              }`}
              title={unreadCount > 0 ? "Mark all unread notifications as read" : "All notifications already cleared"}
            >
              <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 font-bold" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              {nonCompliantCount + openTicketCount} Action Needed
            </span>
          </div>

          {/* Notifications List Split By Section Headers */}
          <div className="space-y-3 max-h-84 overflow-y-auto pr-0.5">
            {/* New Alerts Section */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 block px-1">
                  New Alerts ({unreadNotifications.length})
                </span>
                <div className="space-y-2">
                  {unreadNotifications.map(renderNotificationCard)}
                </div>
              </div>
            )}

            {/* Earlier Section (only when filter is 'all') */}
            {filter === 'all' && readNotifications.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 block px-1 pt-1">
                  Earlier ({readNotifications.length})
                </span>
                <div className="space-y-2">
                  {readNotifications.map(renderNotificationCard)}
                </div>
              </div>
            )}

            {/* Empty State */}
            {((filter === 'unread' && unreadNotifications.length === 0) ||
              (filter === 'all' && notifications.length === 0)) && (
              <div className="py-8 text-center space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  No Unread Notifications
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                  All enterprise operational alerts have been cleared.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
