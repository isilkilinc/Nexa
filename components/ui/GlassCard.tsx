'use client';

import { ReactNode } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  neonBorder?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className = '', neonBorder = false, onClick, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        glass rounded-2xl
        ${neonBorder ? 'neon-border' : ''}
        ${hover ? 'glass-hover cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer glass-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
