'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Zap } from 'lucide-react';
import { MOCK_LFG_POSTS } from '@/lib/mockData';
import { LFGCard } from '@/components/feed/LFGCard';
import { AIDuoRecommendations } from '@/components/feed/AIDuoRecommendations';
import { NexaLogo } from '@/components/ui/NexaLogo';
import { useLanguage } from '@/app/providers/LanguageProvider';

const FILTER_TABS = ['All', 'Valorant', 'Stardew', 'Minecraft', 'Elden Ring', 'LoL'];

export default function HomePage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_LFG_POSTS.filter(post => {
    const matchesFilter = activeFilter === 'All' || post.game.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesSearch = !searchQuery || post.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-12 pb-4"
        style={{
          background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <NexaLogo size="md" />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <Zap size={20} style={{ color: 'var(--neon-color)', filter: 'drop-shadow(0 0 6px rgba(var(--neon-color-rgb), 0.8))' }} />
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            id="home-search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('home_search_placeholder')}
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              id={`filter-${tab.toLowerCase()}`}
              onClick={() => setActiveFilter(tab)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold font-rajdhani tracking-wide transition-all duration-200"
              style={{
                background: activeFilter === tab ? 'var(--neon-color)' : 'var(--glass-bg)',
                color: activeFilter === tab ? '#000' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === tab ? 'var(--neon-color)' : 'var(--glass-border)'}`,
                boxShadow: activeFilter === tab ? '0 0 10px rgba(var(--neon-color-rgb), 0.5)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 flex flex-col gap-3 pb-4">
        {/* Live banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-4 flex items-center gap-3"
          style={{ border: '1px solid rgba(var(--neon-color-rgb), 0.3)', background: 'rgba(var(--neon-color-rgb), 0.05)' }}
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(var(--neon-color-rgb), 0.2)' }}
            >
              🎮
            </div>
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full status-online"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-orbitron font-bold text-sm" style={{ color: 'var(--neon-color)' }}>
              {t('home_live_title')}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {t('home_live_sub')}
            </p>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <AIDuoRecommendations />

        {/* Section header */}
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {t('home_lfg_feed')}
          </h2>
          <button className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Filter size={12} />
            <span className="font-rajdhani">{t('home_filter')}</span>
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <span className="text-4xl">🔍</span>
            <p className="font-rajdhani font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {t('home_no_posts')}
            </p>
          </div>
        ) : (
          filtered.map((post, i) => (
            <div key={post.id} className="relative">
              <LFGCard post={post} index={i} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
