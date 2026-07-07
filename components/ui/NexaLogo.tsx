'use client';

import { useTheme } from '@/app/providers/ThemeProvider';

interface NexaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NexaLogo({ size = 'md', className = '' }: NexaLogoProps) {
  const { logoStyle } = useTheme();

  const sizes = {
    sm: { text: 'text-lg', icon: 'w-6 h-6 text-xs' },
    md: { text: 'text-2xl', icon: 'w-8 h-8 text-sm' },
    lg: { text: 'text-4xl', icon: 'w-12 h-12 text-xl' },
  };

  if (logoStyle === 'minimalist') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizes[size].icon} rounded-lg flex items-center justify-center font-orbitron font-bold`}
          style={{ background: 'var(--neon-color)', color: '#000' }}
        >
          N
        </div>
        <span
          className={`font-orbitron font-bold tracking-widest ${sizes[size].text}`}
          style={{ color: 'var(--text-primary)' }}
        >
          nexa
        </span>
      </div>
    );
  }

  // Cyberpunk style
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizes[size].icon} rounded-xl flex items-center justify-center font-orbitron font-black relative overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, rgba(var(--neon-color-rgb), 0.3) 0%, rgba(var(--neon-color-rgb), 0.1) 100%)`,
          border: '1px solid var(--neon-color)',
          boxShadow: '0 0 12px rgba(var(--neon-color-rgb), 0.5)',
          color: 'var(--neon-color)',
        }}
      >
        ✦
      </div>
      <span
        className={`font-orbitron font-black tracking-widest uppercase ${sizes[size].text}`}
        style={{
          color: 'var(--neon-color)',
          textShadow: '0 0 12px rgba(var(--neon-color-rgb), 0.8)',
        }}
      >
        NEXA
      </span>
    </div>
  );
}
