'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Share2, Trophy, Edit3, BarChart2, X, Check, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MY_PROFILE, MOCK_CLIPS } from '@/lib/mockData';
import { GlassCard } from '@/components/ui/GlassCard';
import { GameBadge } from '@/components/ui/GameBadge';
import { NeonButton } from '@/components/ui/NeonButton';
import { ClipsGallery } from '@/components/profile/ClipsGallery';
import { GamingIdentity } from '@/components/profile/GamingIdentity';
import { useLanguage } from '@/app/providers/LanguageProvider';

const RANK_COLORS: Record<string, string> = {
  'Radiant': '#ff4655',
  'Immortal': '#bd45d4',
  'Diamond': '#4fc3f7',
  'Platinum': '#4db6ac',
  'Gold': '#ffd700',
  'Silver': '#b0bec5',
};

const RANKS = ['Radiant', 'Immortal', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'];

const BANNER_GRADIENTS = [
  'from-purple-900 via-blue-900 to-indigo-900',
  'from-red-900 via-pink-900 to-purple-900',
  'from-green-900 via-teal-900 to-blue-900',
  'from-orange-900 via-red-900 to-pink-900',
];

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
interface ProfileData {
  displayName: string;
  username: string;
  bio: string;
  rank: string;
  level: number;
}

interface EditProfileModalProps {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
  onClose: () => void;
}

function EditProfileModal({ data, onSave, onClose }: EditProfileModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<ProfileData>({ ...data });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  const isChanged =
    form.displayName !== data.displayName ||
    form.username !== data.username ||
    form.bio !== data.bio ||
    form.rank !== data.rank ||
    form.level !== data.level;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/75"
        style={{ backdropFilter: 'blur(10px)' }}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center"
      >
        <div
          className="w-full glass-strong rounded-t-[32px] overflow-hidden"
          style={{
            maxWidth: '480px',
            maxHeight: '92dvh',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(var(--neon-color-rgb), 0.25)',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(var(--neon-color-rgb), 0.4)' }} />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 20px)' }}>
            <div className="px-5 pb-8 pt-2">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-orbitron font-bold text-lg"
                  style={{ color: 'var(--neon-color)', textShadow: '0 0 10px rgba(var(--neon-color-rgb), 0.6)' }}
                >
                  {t('edit_title')}
                </h2>
                <button
                  id="close-edit-profile-modal"
                  onClick={onClose}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center glass-hover"
                >
                  <X size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

              {saved ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-12"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(var(--neon-color-rgb), 0.15)',
                      border: '2px solid var(--neon-color)',
                      boxShadow: '0 0 24px rgba(var(--neon-color-rgb), 0.5)',
                    }}
                  >
                    <Check size={36} style={{ color: 'var(--neon-color)' }} />
                  </div>
                  <p className="font-orbitron font-bold text-lg neon-text">{t('edit_saved')}</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-5">

                  {/* Display Name */}
                  <div>
                    <label className="text-xs font-semibold tracking-widest font-rajdhani mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                      {t('edit_display_name')}
                    </label>
                    <input
                      id="edit-display-name"
                      type="text"
                      value={form.displayName}
                      onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                      maxLength={32}
                      className="w-full glass rounded-xl px-4 py-3 text-sm outline-none font-orbitron font-bold"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(var(--neon-color-rgb), 0.35)',
                      }}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="text-xs font-semibold tracking-widest font-rajdhani mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                      {t('edit_username')}
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-rajdhani font-bold"
                        style={{ color: 'var(--neon-color)' }}
                      >@</span>
                      <input
                        id="edit-username"
                        type="text"
                        value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                        maxLength={24}
                        className="w-full glass rounded-xl pl-8 pr-4 py-3 text-sm outline-none font-rajdhani"
                        style={{
                          color: 'var(--text-primary)',
                          background: 'rgba(255,255,255,0.04)',
                          borderColor: 'rgba(var(--neon-color-rgb), 0.35)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-xs font-semibold tracking-widest font-rajdhani mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                      {t('edit_bio')}
                    </label>
                    <textarea
                      id="edit-bio"
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder={t('edit_bio_placeholder')}
                      rows={3}
                      maxLength={160}
                      className="w-full glass rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(var(--neon-color-rgb), 0.35)',
                      }}
                    />
                    <p className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {form.bio.length}/160
                    </p>
                  </div>

                  {/* Rank + Level row */}
                  <div className="flex gap-3">
                    {/* Rank */}
                    <div className="flex-1">
                      <label className="text-xs font-semibold tracking-widest font-rajdhani mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <Trophy size={11} /> {t('edit_rank')}
                      </label>
                      <div className="relative">
                        <select
                          id="edit-rank"
                          value={form.rank}
                          onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}
                          className="w-full glass rounded-xl px-4 py-3 text-sm appearance-none outline-none cursor-pointer font-bold font-orbitron"
                          style={{
                            color: RANK_COLORS[form.rank] || 'var(--text-primary)',
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: 'rgba(var(--neon-color-rgb), 0.35)',
                          }}
                        >
                          {RANKS.map(r => (
                            <option key={r} value={r} style={{ background: '#0f0f1e', color: RANK_COLORS[r] || '#fff' }}>{r}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    {/* Level */}
                    <div className="w-28">
                      <label className="text-xs font-semibold tracking-widest font-rajdhani mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                        {t('edit_level')}
                      </label>
                      <input
                        id="edit-level"
                        type="number"
                        min={1}
                        max={999}
                        value={form.level}
                        onChange={e => setForm(f => ({ ...f, level: Math.max(1, Math.min(999, Number(e.target.value))) }))}
                        className="w-full glass rounded-xl px-4 py-3 text-sm outline-none font-orbitron font-bold text-center"
                        style={{
                          color: 'var(--neon-color)',
                          background: 'rgba(255,255,255,0.04)',
                          borderColor: 'rgba(var(--neon-color-rgb), 0.35)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Action buttons - Sticky at bottom */}
                  <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 mt-4 flex gap-3" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-border)', boxShadow: '0 -10px 20px var(--bg-primary)' }}>
                    <button
                      id="cancel-edit-profile"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl font-orbitron font-bold text-sm tracking-wider glass glass-hover"
                      style={{ color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
                    >
                      {t('edit_cancel')}
                    </button>

                    <motion.button
                      id="save-edit-profile"
                      onClick={handleSave}
                      disabled={!isChanged}
                      whileTap={isChanged ? { scale: 0.97 } : {}}
                      className="flex-[2] py-3 rounded-2xl font-orbitron font-bold text-sm tracking-wider relative overflow-hidden"
                      style={{
                        background: isChanged
                          ? `linear-gradient(135deg, var(--neon-color) 0%, rgba(var(--neon-color-rgb), 0.65) 100%)`
                          : 'rgba(255,255,255,0.06)',
                        color: isChanged ? '#000' : 'var(--text-muted)',
                        border: isChanged ? '1px solid rgba(var(--neon-color-rgb), 0.5)' : '1px solid var(--glass-border)',
                        boxShadow: isChanged ? '0 0 20px rgba(var(--neon-color-rgb), 0.4)' : 'none',
                        cursor: isChanged ? 'pointer' : 'not-allowed',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {isChanged && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                          }}
                          animate={{ backgroundPosition: ['200% center', '-200% center'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      <span className="relative z-10">{t('edit_save')}</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState({
    displayName: MY_PROFILE.displayName,
    username: MY_PROFILE.username,
    bio: MY_PROFILE.bio,
    rank: MY_PROFILE.rank ?? 'Diamond',
    level: MY_PROFILE.level,
  });

  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'clips' | 'identity' | 'games'>('clips');
  const [editOpen, setEditOpen] = useState(false);

  const rankColor = RANK_COLORS[profile.rank] || 'var(--neon-color)';

  const TABS = [
    { key: 'clips' as const,    emoji: '🎬', label: t('profile_clips')    },
    { key: 'identity' as const, emoji: '🎮', label: t('profile_identity') },
    { key: 'games' as const,    emoji: '⭐', label: t('profile_games')    },
  ];

  const STAT_LABELS: Record<string, string> = {
    Posts:   t('profile_posts'),
    Matches: t('profile_matches'),
    Friends: t('profile_friends'),
    Groups:  t('profile_groups'),
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Banner */}
      <div className="relative h-44">
        <div className={`absolute inset-0 bg-gradient-to-br ${BANNER_GRADIENTS[bannerIndex]}`} />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(var(--neon-color-rgb), 0.4) 0%, transparent 70%)',
          }}
        />

        {/* Top controls */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4">
          <button
            id="change-banner-btn"
            onClick={() => setBannerIndex((bannerIndex + 1) % BANNER_GRADIENTS.length)}
            className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 glass-hover"
          >
            <Edit3 size={11} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-rajdhani font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {t('profile_banner')}
            </span>
          </button>
          <div className="flex gap-2">
            <button
              id="share-profile-btn"
              className="glass rounded-full w-8 h-8 flex items-center justify-center glass-hover"
            >
              <Share2 size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button
              id="go-to-settings"
              onClick={() => router.push('/settings')}
              className="glass rounded-full w-8 h-8 flex items-center justify-center glass-hover"
            >
              <Settings size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="flex items-end justify-between mb-4">
          {/* Avatar */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black font-orbitron"
              style={{
                background: `linear-gradient(135deg, rgba(var(--neon-color-rgb), 0.3) 0%, rgba(var(--neon-color-rgb), 0.1) 100%)`,
                border: '3px solid var(--neon-color)',
                boxShadow: '0 0 24px rgba(var(--neon-color-rgb), 0.6), 0 0 48px rgba(var(--neon-color-rgb), 0.2)',
                color: 'var(--neon-color)',
              }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </motion.div>
            {/* Online dot */}
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full status-online"
              style={{ border: '2px solid var(--bg-primary)' }}
            />
          </div>

          {/* Edit button */}
          <NeonButton
            id="edit-profile-btn"
            size="sm"
            variant="outline"
            className="font-orbitron tracking-widest mb-1"
            onClick={() => setEditOpen(true)}
          >
            {t('profile_edit')}
          </NeonButton>
        </div>

        {/* Username + rank */}
        <div className="mb-2">
          <h1 className="font-orbitron font-black text-2xl" style={{ color: 'var(--text-primary)' }}>
            {profile.displayName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-rajdhani" style={{ color: 'var(--text-secondary)' }}>
              @{profile.username}
            </p>
            <span
              className="text-xs font-bold font-orbitron px-2 py-0.5 rounded-full"
              style={{
                background: `${rankColor}22`,
                border: `1px solid ${rankColor}55`,
                color: rankColor,
                boxShadow: `0 0 8px ${rankColor}44`,
              }}
            >
              <Trophy size={9} className="inline mr-1" />
              {profile.rank}
            </span>
            <span
              className="text-xs font-bold font-orbitron px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(var(--neon-color-rgb), 0.12)',
                border: '1px solid rgba(var(--neon-color-rgb), 0.3)',
                color: 'var(--neon-color)',
              }}
            >
              LV.{profile.level}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {profile.bio === MY_PROFILE.bio ? t('my_bio') : profile.bio}
        </p>

        {/* Stats */}
        <GlassCard className="p-4 mb-4">
          <div className="grid grid-cols-4 divide-x" style={{ borderColor: 'var(--glass-border)' }}>
            {MY_PROFILE.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5"
                style={{ borderRight: i < 3 ? '1px solid var(--glass-border)' : 'none' }}
              >
                <p className="font-orbitron font-black text-lg" style={{ color: 'var(--neon-color)', textShadow: '0 0 8px rgba(var(--neon-color-rgb), 0.6)' }}>
                  {stat.value}
                </p>
                <p className="text-[10px] font-rajdhani tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                  {STAT_LABELS[stat.label] ?? stat.label}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tabs */}
        <div
          className="flex mb-4 glass rounded-2xl p-1"
          style={{ border: '1px solid var(--glass-border)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              id={`profile-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold font-orbitron tracking-wider transition-all duration-200"
              style={{
                background: activeTab === tab.key ? 'var(--neon-color)' : 'transparent',
                color: activeTab === tab.key ? '#000' : 'var(--text-secondary)',
                boxShadow: activeTab === tab.key ? '0 0 12px rgba(var(--neon-color-rgb), 0.5)' : 'none',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'clips' && <ClipsGallery clips={MOCK_CLIPS} />}
        {activeTab === 'identity' && <GamingIdentity accounts={MY_PROFILE.accounts} />}
        {activeTab === 'games' && (
          <div className="px-4">
            <h3 className="font-orbitron font-bold text-sm tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('profile_favorite_games')}
            </h3>
            <div className="flex flex-col gap-3">
              {MY_PROFILE.favoriteGames.map((game, i) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard hover className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          background: 'rgba(var(--neon-color-rgb), 0.1)',
                          border: '1px solid rgba(var(--neon-color-rgb), 0.25)',
                        }}
                      >
                        {game.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                          {game.name}
                        </p>
                        <GameBadge
                          name={`${game.hours.toLocaleString()}h played`}
                          badgeClass={game.badge}
                        />
                      </div>
                      <BarChart2 size={18} style={{ color: 'var(--neon-color)', opacity: 0.7 }} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            data={profile}
            onSave={(updated) => setProfile(updated)}
            onClose={() => setEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
