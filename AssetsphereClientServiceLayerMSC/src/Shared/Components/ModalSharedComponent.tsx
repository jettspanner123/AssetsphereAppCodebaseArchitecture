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
}: ModalSharedComponentProps): React.JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [internalExitDirection, setInternalExitDirection] = useState<'down' | 'up'>('down');

  // Sync internal exit direction from parent prop (used by Cancel/Submit to force a direction)
  useEffect(() => {
    setInternalExitDirection(exitDirectionProp);
  }, [exitDirectionProp]);

  // Reset exit direction to 'down' when modal opens
  useEffect(() => {
    if (isOpen) {
      setInternalExitDirection('down');
    }
  }, [isOpen]);

  /**
   * Determines exit direction based on the backdrop scroll position.
   * If scrollMode is 'backdrop' and the container has been scrolled (scrollTop > 0),
   * the modal exits upward. Otherwise it exits downward.
   */
  const getScrollAwareDirection = (): 'down' | 'up' => {
    if (scrollMode === 'backdrop' && scrollContainerRef.current) {
      return scrollContainerRef.current.scrollTop > 0 ? 'up' : 'down';
    }
    return 'down';
  };

  const handleBackdropClick = () => {
    const direction = getScrollAwareDirection();
    setInternalExitDirection(direction);
    // Use setTimeout(0) so the state update is committed before AnimatePresence reads exit variant
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
    setInternalExitDirection('down');
    onClose();
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

  const modalVariants = {
    initial: {
      y: isSlideUp ? '100vh' : 8,
      opacity: isSlideUp ? 1 : 0,
      scale: isSlideUp ? 1 : 0.96,
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      y: isSlideUp ? (internalExitDirection === 'up' ? '-100vh' : '100vh') : 8,
      opacity: isSlideUp ? 1 : 0,
      scale: isSlideUp ? 1 : 0.96,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={scrollContainerRef}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog content */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
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
