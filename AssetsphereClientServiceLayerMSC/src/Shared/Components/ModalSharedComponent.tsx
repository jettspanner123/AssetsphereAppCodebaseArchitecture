import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ModalSharedComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  minHeight?: string;
  scrollMode?: 'backdrop' | 'body';
  animationType?: 'scale' | 'slide-up';
  exitDirection?: 'down' | 'up';
  headerCloseDirection?: 'down' | 'up';
  zIndex?: number;
}

export default function ModalSharedComponent({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '2xl',
  minHeight,
  scrollMode = 'backdrop',
  animationType = 'slide-up',
  exitDirection: exitDirectionProp = 'down',
  headerCloseDirection = 'down',
  zIndex = 50,
}: ModalSharedComponentProps): React.JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dialogCardRef = useRef<HTMLDivElement>(null);
  const [internalExitDirection, setInternalExitDirection] = useState<'down' | 'up'>(exitDirectionProp);
  const prevOpenRef = useRef(isOpen);

  // Sync internal exit direction whenever exitDirectionProp changes
  useEffect(() => {
    setInternalExitDirection(exitDirectionProp);
  }, [exitDirectionProp]);

  // Reset exit direction to 'down' ONLY when transitioning from closed to open
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setInternalExitDirection(exitDirectionProp || 'down');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, exitDirectionProp]);

  /**
   * Determines exit direction based on the backdrop scroll position.
   * If scrollMode is 'backdrop' and the container has been scrolled (scrollTop > 40),
   * the modal exits upward. Otherwise it exits downward.
   */
  const getScrollAwareDirection = (): 'down' | 'up' => {
    if (scrollMode === 'backdrop' && scrollContainerRef.current) {
      return scrollContainerRef.current.scrollTop > 40 ? 'up' : 'down';
    }
    return 'down';
  };

  const handleBackdropClick = () => {
    const direction = getScrollAwareDirection();
    setInternalExitDirection(direction);
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleEscapeKey = () => {
    const direction = getScrollAwareDirection();
    setInternalExitDirection(direction);
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleHeaderClose = () => {
    setInternalExitDirection(headerCloseDirection);
    setTimeout(() => {
      onClose();
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleEscapeKey();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  let widthClass = 'max-w-2xl';
  if (maxWidth === 'sm') widthClass = 'max-w-sm';
  if (maxWidth === 'md') widthClass = 'max-w-md';
  if (maxWidth === 'lg') widthClass = 'max-w-lg';
  if (maxWidth === 'xl') widthClass = 'max-w-xl';
  if (maxWidth === '2xl') widthClass = 'max-w-2xl';
  if (maxWidth === '3xl') widthClass = 'max-w-3xl';
  if (maxWidth === '4xl') widthClass = 'max-w-4xl';
  if (maxWidth === '5xl') widthClass = 'max-w-5xl';

  const isSlideUp = animationType === 'slide-up';
  const activeExitDirection: 'down' | 'up' =
    exitDirectionProp === 'up' || internalExitDirection === 'up' ? 'up' : 'down';

  /**
   * Calculates the exact displacement needed to guarantee the modal dialog
   * completely clears the viewport regardless of modal height, window dimensions, or scroll position.
   */
  const getExitDistance = (dir: 'down' | 'up'): number => {
    if (typeof window === 'undefined') return dir === 'up' ? -1800 : 1800;
    const vh = window.innerHeight || 800;
    const cardHeight = dialogCardRef.current?.offsetHeight || 800;
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;

    if (dir === 'up') {
      return -(cardHeight + vh + scrollTop + 400);
    } else {
      return cardHeight + vh + 400;
    }
  };

  const modalVariants = {
    initial: {
      y: isSlideUp ? (typeof window !== 'undefined' ? window.innerHeight + 1000 : '150vh') : 8,
      opacity: isSlideUp ? 1 : 0,
      scale: isSlideUp ? 1 : 0.96,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (customDir?: 'down' | 'up') => {
      const dir = customDir || activeExitDirection;
      const distance = getExitDistance(dir);
      return {
        y: isSlideUp ? distance : 8,
        opacity: isSlideUp ? 1 : 0,
        scale: isSlideUp ? 1 : 0.96,
        transition: {
          duration: 0.55,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      };
    },
  };

  return (
    <AnimatePresence custom={activeExitDirection}>
      {isOpen && (
        <div
          ref={scrollContainerRef}
          style={{ zIndex }}
          className="fixed inset-0 flex items-start justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog content */}
          <motion.div
            ref={dialogCardRef}
            custom={activeExitDirection}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative w-full ${widthClass} bg-white dark:bg-[#0a0a0c] hairline-border-strong rounded-xl shadow-2xl z-10 my-auto sm:my-8 flex flex-col shrink-0`}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100 font-serif-headline">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleHeaderClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className={`p-6 flex-1 ${scrollMode === 'body' ? 'max-h-[85vh] overflow-y-auto' : ''} ${minHeight ? minHeight : ''}`}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-[#08080a] shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
