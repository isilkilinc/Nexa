'use client';

interface GameBadgeProps {
  name: string;
  emoji?: string;
  badgeClass?: string;
  size?: 'sm' | 'md';
}

export function GameBadge({ name, emoji, badgeClass = 'badge-default', size = 'sm' }: GameBadgeProps) {
  const sizeClass = size === 'sm'
    ? 'text-xs px-2.5 py-1'
    : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border font-medium
        font-rajdhani tracking-wide
        ${sizeClass}
        ${badgeClass}
      `}
    >
      {emoji && <span>{emoji}</span>}
      {name}
    </span>
  );
}
