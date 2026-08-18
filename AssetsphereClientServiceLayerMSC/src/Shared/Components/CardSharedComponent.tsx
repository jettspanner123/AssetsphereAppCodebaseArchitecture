import React from 'react';

export interface CardSharedComponentProps {
  children: React.ReactNode;
  variant?: 'card' | 'elevated' | 'deep';
  glow?: 'none' | 'orange' | 'blue' | 'green' | 'red';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  key?: React.Key;
}

export default function CardSharedComponent({
  children,
  variant = 'card',
  className = '',
  onClick,
  hoverable = false,
}: CardSharedComponentProps): React.JSX.Element {
  let surfaceStyle = '';
  if (variant === 'elevated') {
    surfaceStyle = 'bg-white dark:bg-[#121215] border border-slate-200/60 dark:border-zinc-800/60 shadow-xs';
  } else if (variant === 'deep') {
    surfaceStyle = 'bg-slate-50 dark:bg-[#08080a] border border-slate-200/40 dark:border-zinc-800/40';
  } else {
    surfaceStyle = 'bg-white dark:bg-[#0d0d10] border border-slate-200/50 dark:border-zinc-800/50 shadow-2xs';
  }

  const hoverClass = hoverable
    ? 'hover:border-slate-300/80 dark:hover:border-zinc-700/80 hover:shadow-md transition-all cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 relative transition-all duration-200 ${surfaceStyle} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
