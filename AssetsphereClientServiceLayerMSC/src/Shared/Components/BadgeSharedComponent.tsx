import React from 'react';

export interface BadgeSharedComponentProps {
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function BadgeSharedComponent({
  children,
  variant = 'neutral',
  showDot = false,
  size = 'md',
  className = '',
}: BadgeSharedComponentProps): React.JSX.Element {
  let badgeStyle = '';
  let dotStyle = '';

  if (variant === 'success') {
    badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20';
    dotStyle = 'bg-emerald-500';
  } else if (variant === 'warning') {
    badgeStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20';
    dotStyle = 'bg-amber-500';
  } else if (variant === 'danger') {
    badgeStyle = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20';
    dotStyle = 'bg-rose-500';
  } else if (variant === 'info') {
    badgeStyle = 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20';
    dotStyle = 'bg-sky-500';
  } else {
    badgeStyle = 'bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hairline-border';
    dotStyle = 'bg-slate-400 dark:bg-zinc-500';
  }

  const paddingStyle = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${paddingStyle} ${badgeStyle} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle}`} />
      )}
      {children}
    </span>
  );
}
