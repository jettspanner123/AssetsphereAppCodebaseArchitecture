import React from 'react';
import { motion } from 'motion/react';

export interface ButtonSharedComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function ButtonSharedComponent({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonSharedComponentProps): React.JSX.Element {
  let baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md cursor-pointer select-none transition-colors duration-200 focus:outline-none';

  let sizeStyles = '';
  if (size === 'sm') {
    sizeStyles = 'px-3 py-1.5 text-xs h-8 gap-1.5';
  } else if (size === 'lg') {
    sizeStyles = 'px-5 py-2.5 text-sm h-11 gap-2.5';
  } else {
    sizeStyles = 'px-4 py-2 text-sm h-9 gap-2';
  }

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm';
  } else if (variant === 'ghost') {
    variantStyles =
      'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 hairline-border';
  } else if (variant === 'outline') {
    variantStyles =
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60 hairline-border-strong';
  } else if (variant === 'danger') {
    variantStyles = 'bg-red-600 text-white hover:bg-red-700 shadow-sm';
  }

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${disabledStyle} ${className}`}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
