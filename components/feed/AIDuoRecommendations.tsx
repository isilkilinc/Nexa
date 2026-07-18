'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Sparkles, Shield, TrendingUp, Gamepad2, CheckCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface Recommendation {
  id: number;
  name: string;
  initial: string;
  color: string;
  match: number;
  rank: string;
  winRate: string;
  game: string;
  gameEmoji: string;
  reason: string;
  level: number;
  tags: string[];
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    name: 'JettMain',
    initial: 'J',
    color: '#06b6d4',
    match: 98,
    rank: 'Diamond II',
    winRate: '67%',
    game: 'Valorant',
    gameEmoji: '🔫',
    reason: 'Aynı saatlerde aktif, tamamlayıcı rol',
    level: 55,
    tags: ['Duelist', 'Comms', 'Ranked'],
  },
  {
    id: 2,
    name: 'HealerPro',
    initial: 'H',
    color: '#22c55e',
    match: 92,
    rank: 'Platinum I',
    winRate: '61%',
    game: 'Valorant',
    gameEmoji: '🔫',
    reason: 'Support/Duelist sinerji yüksek',
    level: 42,
    tags: ['Support', 'Chill', 'Ranked'],
  },
  {
    id: 3,
    name: 'ClutchKing',
    initial: 'C',
    color: '#f97316',
    match: 85,
    rank: 'Gold III',
    winRate: '54%',
    game: 'Elden Ring',
    gameEmoji: '⚔️',
    reason: 'Benzer oynama tarzı ve saatler',
    level: 38,
    tags: ['PvE', 'Chill', 'Co-op'],
  },
];

export function AIDuoRecommendations() {
  const [added, setAdded] = useState<Set<number>>(new Set());

  const handleAdd = (id: number) => {
    setAdded(prev => new Set(prev).add(id));
  };

  return (
    <div className="mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.3)' }}
          >
            <Sparkles size={12} style={{ color: '#a855f7' }} />
          </div>
          <div>
            <h3
              className="font-orbitron font-bold text-xs"
              style={{ color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.5)' }}
            >
              AI Duo Önerileri
            </h3>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Oynama stiline göre eşleştirildi
            </p>
          </div>
        </div>
        {/* AI badge */}
        <div
          className="flex items-center gap-1 text-[9px] font-bold font-rajdhani px-2 py-1 rounded-full"
          style={{
            background: 'rgba(168,85,247,0.1)',
            color: '#c084fc',
            border: '1px solid rgba(168,85,247,0.25)',
          }}
        >
          <Shield size={9} />
          NEXA AI
        </div>
      </div>

      {/* Cards row */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {RECOMMENDATIONS.map((rec, i) => {
          const isAdded = added.has(rec.id);
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-44"
            >
              <GlassCard className="flex flex-col relative overflow-hidden group" style={{ padding: 0 }}>
                {/* Top color bar */}
                <div
                  className="h-1 w-full rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${rec.color}, transparent)` }}
                />

                {/* Glow ambient */}
                <div
                  className="absolute top-0 left-0 right-0 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: `radial-gradient(ellipse at top, ${rec.color}, transparent 70%)` }}
                />

                <div className="p-3 flex flex-col gap-2 relative z-10">
                  {/* Match % badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-1 text-[9px] font-bold font-rajdhani px-1.5 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(168,85,247,0.15)',
                        color: '#d8b4fe',
                        border: '1px solid rgba(168,85,247,0.35)',
                        boxShadow: '0 0 6px rgba(168,85,247,0.3)',
                      }}
                    >
                      ✦ {rec.match}% Uyum
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Lv.{rec.level}
                    </span>
                  </div>

                  {/* Avatar + name */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black font-orbitron flex-shrink-0 text-sm"
                      style={{ background: rec.color, boxShadow: `0 0 14px ${rec.color}66` }}
                    >
                      {rec.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                        {rec.name}
                      </p>
                      <p className="text-[10px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                        {rec.rank}
                      </p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div
                    className="flex items-center justify-between rounded-lg px-2 py-1.5"
                    style={{ background: 'rgba(var(--neon-color-rgb), 0.05)', border: '1px solid var(--glass-border)' }}
                  >
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      <TrendingUp size={10} style={{ color: rec.color }} />
                      <span className="font-rajdhani font-bold" style={{ color: rec.color }}>
                        {rec.winRate}
                      </span>
                      <span className="font-rajdhani">WR</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      <Gamepad2 size={10} />
                      <span className="font-rajdhani">{rec.gameEmoji} {rec.game.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* AI reason */}
                  <p
                    className="text-[10px] leading-snug font-rajdhani italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    &quot;{rec.reason}&quot;
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {rec.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-rajdhani font-bold"
                        style={{
                          background: `${rec.color}18`,
                          color: rec.color,
                          border: `1px solid ${rec.color}40`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Add button */}
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div
                        key="added"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold font-rajdhani"
                        style={{
                          background: 'rgba(34,197,94,0.12)',
                          color: '#22c55e',
                          border: '1px solid rgba(34,197,94,0.3)',
                        }}
                      >
                        <CheckCircle size={12} />
                        EKLENDİ
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAdd(rec.id)}
                        className="w-full py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold font-rajdhani transition-all"
                        style={{
                          background: `${rec.color}18`,
                          color: rec.color,
                          border: `1px solid ${rec.color}50`,
                        }}
                      >
                        <UserPlus size={12} />
                        EKLE
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
