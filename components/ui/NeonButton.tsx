'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function NeonButton({ children, variant = 'primary', size = 'md', className = '', ...props }: NeonButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: `
      text-[var(--bg-primary)] font-semibold
      rounded-xl cursor-pointer
      transition-all duration-150
      active:scale-95
    `,
    outline: `
      text-[var(--neon-color)] font-semibold
      border border-[var(--neon-color)]
      rounded-xl cursor-pointer
      transition-all duration-150
      active:scale-95
      hover:bg-[rgba(var(--neon-color-rgb),0.1)]
    `,
    ghost: `
      text-[var(--text-secondary)] font-medium
      rounded-xl cursor-pointer
      transition-all duration-150
      active:scale-95
      hover:text-[var(--text-primary)]
      hover:bg-[rgba(255,255,255,0.05)]
    `,
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'var(--neon-color)',
    boxShadow: '0 0 12px rgba(var(--neon-color-rgb), 0.5), 0 0 28px rgba(var(--neon-color-rgb), 0.25)',
  } : {};

  return (
    <button
      style={primaryStyle}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
