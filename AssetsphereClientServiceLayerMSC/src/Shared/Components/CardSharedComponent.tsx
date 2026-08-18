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
  glow = 'none',
  className = '',
  onClick,
  hoverable = false,
}: CardSharedComponentProps): React.JSX.Element {
  let surfaceStyle = '';
  if (variant === 'elevated') {
    surfaceStyle = 'bg-slate-100/90 dark:bg-[#101012] hairline-border-strong';
  } else if (variant === 'deep') {
    surfaceStyle = 'bg-slate-50 dark:bg-[#06060a] hairline-border-strong';
  } else {
    surfaceStyle = 'bg-slate-50/60 dark:bg-[#0a0a0c] hairline-border';
  }

  let glowClass = '';
  if (glow === 'orange') glowClass = 'glow-orange';
  if (glow === 'blue') glowClass = 'glow-blue';
  if (glow === 'green') glowClass = 'glow-green';
  if (glow === 'red') glowClass = 'glow-red';

  const hoverClass = hoverable
    ? 'hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 relative overflow-hidden transition-colors duration-200 ${surfaceStyle} ${glowClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}
