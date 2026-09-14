import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

export interface RefreshButtonSharedComponentProps {
  onRefresh: () => void | Promise<void>;
  title?: string;
  className?: string;
}

export default function RefreshButtonSharedComponent({
  onRefresh,
  title = 'Refresh',
  className = '',
}: RefreshButtonSharedComponentProps): React.JSX.Element {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = async () => {
    setIsSpinning(true);
    try {
      await onRefresh();
    } finally {
      // Keep the spin visible for a minimum beat even when the invalidation
      // resolves instantly, so the tap always reads as having done something.
      setTimeout(() => setIsSpinning(false), 500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      className={`h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 rounded-lg border border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-[#0a0a0c] text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white max-sm:active:bg-slate-200 dark:max-sm:active:bg-zinc-800 transition-colors cursor-pointer ${className}`}
    >
      <RotateCw className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
    </button>
  );
}
