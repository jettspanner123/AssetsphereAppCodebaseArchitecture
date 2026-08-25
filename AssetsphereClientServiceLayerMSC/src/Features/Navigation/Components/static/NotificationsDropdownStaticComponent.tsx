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
  UserPlus,
  UserCheck,
  UserX,
  Laptop,
} from 'lucide-react';
import { TabType } from '../../../../Types/NavigationType';
import { NotificationItemType } from '../../../../Types/NotificationType';
import TanstackQueryClientService from '../../../../Services/TanstackQueryClientService';
import useAuthenticationStateStore from '../../../../Store/AuthenticationStateStore';

export interface NotificationsDropdownStaticComponentProps {
  isOpen: boolean;
  onClose: () => void;
  nonCompliantCount?: number;
  openTicketCount?: number;
  onNavigateTab?: (tab: TabType) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}

export default function NotificationsDropdownStaticComponent({
  isOpen,
  onClose,
  onNavigateTab,
}: NotificationsDropdownStaticComponentProps): React.JSX.Element | null {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const currentUser = useAuthenticationStateStore((state) => state.user);

  // Fetch live notifications with 15s auto-poll
  const { data: notifications = [] } =
    TanstackQueryClientService.current.notifications.useNotificationsQuery(
      currentUser?.id,
      currentUser?.role
    );

  // Mutations
  const markAsReadMutation =
    TanstackQueryClientService.current.notifications.useMarkNotificationAsReadMutation();
  const markAllAsReadMutation =
    TanstackQueryClientService.current.notifications.useMarkAllNotificationsAsReadMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate({
      userId: currentUser?.id,
      role: currentUser?.role,
    });
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({
      id,
      userId: currentUser?.id,
    });
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

  const getPriorityBadge = (priority: NotificationItemType['priorityLevel']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'MID':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'LOW':
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  const getTypeIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'userplus':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'usercheck':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'userx':
        return <UserX className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'shieldalert':
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'wrench':
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'checkcircle2':
      case 'procurement':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'laptop':
      case 'asset':
        return <Laptop className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'filecheck2':
      case 'audit':
        return <FileCheck2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      case 'clock':
        return <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'alerttriangle':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    }
  };

  const unreadNotifications = notifications.filter((item) => !item.isRead);
  const readNotifications = notifications.filter((item) => item.isRead);

  const renderNotificationCard = (item: NotificationItemType) => (
    <div
      key={item.id}
      onClick={() => {
        if (!item.isRead) handleMarkAsRead(item.id);
      }}
      className={`p-3 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
        !item.isRead
          ? 'bg-slate-50/90 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-700/80 shadow-xs'
          : 'bg-white/40 dark:bg-zinc-900/30 border-slate-100 dark:border-zinc-800/60 opacity-85'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {getTypeIcon(item.icon)}
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs truncate leading-snug">
            {item.heading}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
            {formatRelativeTime(item.createdAt)}
          </span>
          {!item.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Description Body */}
      <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed font-sans pl-5.5">
        {item.description}
      </p>

      {/* Footer Tag & Action Button */}
      <div className="flex items-center justify-between pt-1 pl-5.5">
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(
            item.priorityLevel
          )}`}
        >
          {item.priorityLevel} Priority
        </span>

        {item.action?.direction && onNavigateTab && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!item.isRead) handleMarkAsRead(item.id);
              onClose();
              onNavigateTab(item.action.direction as TabType);
            }}
            className="flex items-center gap-1 text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-auto"
          >
            <span>Open</span>
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
                  Enterprise Infrastructure Feed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-semibold text-[11px] border transition-all cursor-pointer shadow-2xs ${
                unreadCount > 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                  : 'bg-slate-100 dark:bg-zinc-800/40 text-slate-400 dark:text-zinc-600 border-slate-200/50 dark:border-zinc-800/40 opacity-60 cursor-not-allowed'
              }`}
              title={unreadCount > 0 ? 'Mark all unread notifications as read' : 'All notifications already cleared'}
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
              {unreadCount} Unread
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

