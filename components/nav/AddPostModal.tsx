'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, Users, Clock, Monitor, Rocket, Sparkles } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';

interface AddPostModalProps {
  onClose: () => void;
}

const GAMES = [
  'Valorant', 'League of Legends', 'Stardew Valley', 'Minecraft',
  'Elden Ring', 'CS2', 'Fortnite', 'Apex Legends', 'Detroit: Become Human',
  'Overwatch 2', 'GTA V', 'Other',
];

const PLATFORMS = ['PC', 'PS5', 'PS4', 'Xbox Series X', 'Xbox One', 'Switch', 'Mobile'];

export function AddPostModal({ onClose }: AddPostModalProps) {
  const { t } = useLanguage();
  const [selectedGame, setSelectedGame] = useState('');
  const [description, setDescription] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [players, setPlayers] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['PC']);
  const [playtime, setPlaytime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handlePost = () => {
    setIsSubmitted(true);
    setTimeout(onClose, 1800);
  };

  const canPost = selectedGame && description;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60"
        style={{ backdropFilter: 'blur(8px)' }}
      />

      {/* Modal sheet */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center"
      >
        <div
          className="w-full rounded-t-[32px] overflow-hidden"
          style={{
            maxWidth: '480px',
            maxHeight: '90dvh',
            background: 'var(--bg-secondary)',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(var(--neon-color-rgb), 0.2)',
            borderTop: '1px solid rgba(var(--neon-color-rgb), 0.15)',
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div
              className="w-10 h-1 rounded-full"
              style={{ background: 'rgba(var(--neon-color-rgb), 0.35)' }}
            />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 20px)' }}>
            <div className="px-5 pb-8 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="font-orbitron font-bold text-lg"
                    style={{ color: 'var(--neon-color)', textShadow: '0 0 10px rgba(var(--neon-color-rgb), 0.5)' }}
                  >
                    {t('modal_title')}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {t('modal_sub')}
                  </p>
                </div>
                <button
                  id="close-add-post-modal"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <X size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{
                      background: 'rgba(var(--neon-color-rgb), 0.12)',
                      border: '2px solid var(--neon-color)',
                      boxShadow: '0 0 24px rgba(var(--neon-color-rgb), 0.4)',
                    }}
                  >
                    🎮
                  </div>
                  <p className="font-orbitron font-bold text-lg neon-text">{t('modal_success_title')}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('modal_success_sub')}</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-5">

                  {/* ── Game Selector ── */}
                  <div>
                    <label
                      className="text-xs font-semibold tracking-widest font-rajdhani mb-2 block"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('modal_game')}
                    </label>
                    <div className="relative">
                      <select
                        id="post-game-select"
                        value={selectedGame}
                        onChange={e => setSelectedGame(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm appearance-none outline-none cursor-pointer"
                        style={{
                          color: selectedGame ? 'var(--text-primary)' : 'var(--text-muted)',
                          background: 'var(--glass-bg)',
                          border: `1px solid ${selectedGame ? 'rgba(var(--neon-color-rgb), 0.4)' : 'var(--glass-border)'}`,
                        }}
                      >
                        <option value="" disabled style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {t('modal_game_placeholder')}
                        </option>
                        {GAMES.map(g => (
                          <option
                            key={g}
                            value={g}
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                          >
                            {g === 'Other' ? t('post_other') : g}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>

                  {/* ── Description ── */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="text-xs font-semibold tracking-widest font-rajdhani block"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {t('modal_description')}
                      </label>
                      {/* AI Generate button */}
                      <button
                        id="ai-generate-btn"
                        onClick={() => {
                          setIsGeneratingAI(true);
                          setTimeout(() => {
                            setDescription('Sakin ve eğlenceli bir maç için chill duo arıyorum, mikrofon şart değil. Birlikte rank atlayalım!');
                            setIsGeneratingAI(false);
                          }, 1000);
                        }}
                        disabled={isGeneratingAI}
                        className="flex items-center gap-1.5 text-xs font-rajdhani font-bold px-2.5 py-1 rounded-lg transition-all"
                        style={{
                          background: 'rgba(168,85,247,0.12)',
                          color: '#a855f7',
                          border: '1px solid rgba(168,85,247,0.3)',
                          boxShadow: '0 0 10px rgba(168,85,247,0.25)',
                          opacity: isGeneratingAI ? 0.7 : 1,
                        }}
                      >
                        {isGeneratingAI ? (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="inline-block"
                            style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid #a855f7',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                          />
                        ) : (
                          <Sparkles size={12} />
                        )}
                        <span>AI ile Yazdır</span>
                      </button>
                    </div>
                    <textarea
                      id="post-description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder={t('modal_description_placeholder')}
                      rows={3}
                      maxLength={280}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'var(--glass-bg)',
                        border: `1px solid ${description ? 'rgba(var(--neon-color-rgb), 0.4)' : 'var(--glass-border)'}`,
                      }}
                    />
                    <p className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {description.length}/280
                    </p>
                  </div>

                  {/* ── Looking For ── */}
                  <div>
                    <label
                      className="text-xs font-semibold tracking-widest font-rajdhani mb-2 flex items-center gap-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Users size={12} /> {t('modal_looking_for')}
                    </label>
                    <input
                      id="post-looking-for"
                      type="text"
                      value={lookingFor}
                      onChange={e => setLookingFor(e.target.value)}
                      placeholder={t('modal_looking_for_placeholder')}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'var(--glass-bg)',
                        border: `1px solid ${lookingFor ? 'rgba(var(--neon-color-rgb), 0.4)' : 'var(--glass-border)'}`,
                      }}
                    />
                  </div>

                  {/* ── Players Needed ── */}
                  <div>
                    <label
                      className="text-xs font-semibold tracking-widest font-rajdhani mb-3 flex items-center gap-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Users size={12} /> {t('modal_players_needed')}:{' '}
                      <span style={{ color: 'var(--neon-color)' }}>{players}</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setPlayers(n)}
                          className="flex-1 h-10 rounded-xl text-sm font-bold font-rajdhani transition-all duration-150"
                          style={{
                            background: players === n ? 'var(--neon-color)' : 'var(--glass-bg)',
                            color: players === n ? '#000' : 'var(--text-secondary)',
                            border: `1px solid ${players === n ? 'var(--neon-color)' : 'var(--glass-border)'}`,
                            boxShadow: players === n ? '0 0 12px rgba(var(--neon-color-rgb), 0.45)' : 'none',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Platforms ── */}
                  <div>
                    <label
                      className="text-xs font-semibold tracking-widest font-rajdhani mb-3 flex items-center gap-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Monitor size={12} /> {t('modal_platform')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map(p => (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium font-rajdhani transition-all duration-150"
                          style={{
                            background: selectedPlatforms.includes(p)
                              ? 'rgba(var(--neon-color-rgb), 0.12)'
                              : 'var(--glass-bg)',
                            color: selectedPlatforms.includes(p) ? 'var(--neon-color)' : 'var(--text-secondary)',
                            border: `1px solid ${selectedPlatforms.includes(p) ? 'rgba(var(--neon-color-rgb), 0.5)' : 'var(--glass-border)'}`,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Playtime ── */}
                  <div>
                    <label
                      className="text-xs font-semibold tracking-widest font-rajdhani mb-2 flex items-center gap-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Clock size={12} /> {t('modal_when')}
                    </label>
                    <input
                      id="post-playtime"
                      type="text"
                      value={playtime}
                      onChange={e => setPlaytime(e.target.value)}
                      placeholder={t('modal_when_placeholder')}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        color: 'var(--text-primary)',
                        background: 'var(--glass-bg)',
                        border: `1px solid ${playtime ? 'rgba(var(--neon-color-rgb), 0.4)' : 'var(--glass-border)'}`,
                      }}
                    />
                  </div>

                  {/* ── Submit Button ── */}
                  <motion.button
                    id="submit-post-btn"
                    onClick={handlePost}
                    disabled={!canPost}
                    whileTap={canPost ? { scale: 0.97 } : {}}
                    whileHover={canPost ? { scale: 1.01 } : {}}
                    className="relative w-full rounded-2xl overflow-hidden font-orbitron font-bold tracking-widest text-sm mt-1 py-4 flex items-center justify-center gap-2.5"
                    style={{
                      background: canPost
                        ? `linear-gradient(135deg, var(--neon-color) 0%, rgba(var(--neon-color-rgb), 0.7) 100%)`
                        : 'var(--glass-bg)',
                      color: canPost ? '#000' : 'var(--text-muted)',
                      border: canPost
                        ? '1px solid rgba(var(--neon-color-rgb), 0.6)'
                        : '1px solid var(--glass-border)',
                      boxShadow: canPost
                        ? '0 0 24px rgba(var(--neon-color-rgb), 0.4), 0 4px 16px rgba(0,0,0,0.2)'
                        : 'none',
                      cursor: canPost ? 'pointer' : 'not-allowed',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {/* Shimmer sweep */}
                    {canPost && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{ backgroundPosition: ['200% center', '-200% center'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                    <Rocket size={16} strokeWidth={2.5} />
                    <span>{t('modal_submit')}</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
