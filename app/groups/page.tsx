'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Lock, TrendingUp } from 'lucide-react';
import { MOCK_GROUPS } from '@/lib/mockData';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

const ACTIVITY_COLOR = {
  'very active': '#22c55e',
  'active': 'var(--neon-color)',
  'moderate': '#f59e0b',
};

export default function GroupsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_GROUPS.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.game.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-12 pb-4"
        style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-orbitron font-black text-xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
              GROUPS
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Find your clan & lobby
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl glass flex items-center justify-center"
            style={{ border: '1px solid rgba(var(--neon-color-rgb), 0.3)' }}
          >
            <TrendingUp size={16} style={{ color: 'var(--neon-color)' }} />
          </div>
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            id="groups-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search groups, games..."
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
            style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3 pb-4">
        {/* My Groups */}
        <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
          MY GROUPS
        </h2>
        <GlassCard className="p-4 flex items-center gap-3" style={{ border: '1px solid rgba(var(--neon-color-rgb), 0.3)', background: 'rgba(var(--neon-color-rgb), 0.05)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(var(--neon-color-rgb), 0.15)', border: '1px solid rgba(var(--neon-color-rgb), 0.4)' }}
          >
            🔫
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-orbitron font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Neon Vanguard</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>47/50 members · Very Active</p>
          </div>
          <NeonButton size="sm" variant="outline" className="font-rajdhani">Open</NeonButton>
        </GlassCard>

        {/* Discover */}
        <h2 className="font-orbitron font-bold text-sm tracking-wider mt-2" style={{ color: 'var(--text-primary)' }}>
          DISCOVER
        </h2>

        {filtered.map((group, i) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard hover className="p-4 relative overflow-hidden">
              {/* Banner accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(to right, ${group.banner}, transparent)` }}
              />

              <div className="flex items-start gap-3">
                {/* Group icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: `${group.banner}22`,
                    border: `1px solid ${group.banner}55`,
                    boxShadow: `0 0 12px ${group.banner}33`,
                  }}
                >
                  {group.gameEmoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-orbitron font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {group.name}
                    </p>
                    <span
                      className="text-[10px] font-bold font-rajdhani px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
                    >
                      [{group.tag}]
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {group.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Users size={10} />
                      <span className="font-rajdhani">{group.members}/{group.maxMembers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: ACTIVITY_COLOR[group.activity],
                          boxShadow: `0 0 4px ${ACTIVITY_COLOR[group.activity]}`,
                        }}
                      />
                      <span className="text-xs font-rajdhani capitalize" style={{ color: ACTIVITY_COLOR[group.activity] }}>
                        {group.activity}
                      </span>
                    </div>
                    {!group.isOpen && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#f59e0b' }}>
                        <Lock size={10} />
                        <span className="font-rajdhani">Invite only</span>
                      </div>
                    )}
                  </div>
                </div>

                <NeonButton
                  id={`join-group-${group.id}`}
                  size="sm"
                  variant={group.isOpen ? 'primary' : 'outline'}
                  className="font-orbitron tracking-widest flex-shrink-0"
                >
                  {group.isOpen ? 'JOIN' : 'APPLY'}
                </NeonButton>
              </div>

              {/* Rank badge */}
              <div
                className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-rajdhani font-semibold"
                style={{
                  background: 'rgba(var(--neon-color-rgb), 0.08)',
                  border: '1px solid rgba(var(--neon-color-rgb), 0.2)',
                  color: 'var(--neon-color)',
                }}
              >
                🏆 {group.rank}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
