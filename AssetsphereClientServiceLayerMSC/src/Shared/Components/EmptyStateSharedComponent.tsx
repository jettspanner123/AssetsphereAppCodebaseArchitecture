import React from 'react';
import { motion } from 'motion/react';

export interface EmptyStateSharedComponentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
  className?: string;
}

export default function EmptyStateSharedComponent({
  icon,
  title,
  description,
  actionButton,
  className = '',
}: EmptyStateSharedComponentProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`py-10 px-6 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Muted Large Icon Container */}
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs flex items-center justify-center mb-3 text-slate-400 dark:text-zinc-500 shrink-0">
        {icon}
      </div>

      {/* Muted Heading */}
      <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 font-serif-headline tracking-tight">
        {title}
      </h3>

      {/* Muted Description */}
      <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed mt-1.5 font-sans">
        {description}
      </p>

      {/* Optional Action Button */}
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </motion.div>
  );
}
