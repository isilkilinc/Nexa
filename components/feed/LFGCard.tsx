'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Monitor, Clock, CheckCircle } from 'lucide-react';
import { LFGPost } from '@/lib/mockData';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useSocial } from '@/app/providers/SocialProvider';

interface LFGCardProps {
  post: LFGPost;
  index?: number;
}

function Avatar({ username }: { username: string }) {
  const colors = ['#a855f7', '#06b6d4', '#ec4899', '#22c55e', '#f97316', '#eab308'];
  const color = colors[username.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black font-orbitron flex-shrink-0 text-sm"
      style={{ background: color, boxShadow: `0 0 10px ${color}80` }}
    >
      {username[0].toUpperCase()}
    </div>
  );
}

export function LFGCard({ post, index = 0 }: LFGCardProps) {
  const { t } = useLanguage();
  const { getRequestStatus, sendJoinRequest } = useSocial();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const requestStatus = getRequestStatus(post.id);
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <GlassCard hover className="relative overflow-hidden p-0">

        {/* ── Toxicity Shield ── */}
        {post.behaviorScore < 5 && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ background: 'rgba(239,68,68,0.2)' }}>
              <span className="text-xl">⚠️</span>
            </div>
            <p className="font-orbitron font-bold text-sm text-red-400 mb-1">Gizlendi</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              AI tarafından gizlendi (Düşük Davranış Puanı)
            </p>
          </div>
        )}

        <div style={{
          filter: post.behaviorScore < 5 ? 'blur(4px)' : 'none',
          opacity: post.behaviorScore < 5 ? 0.5 : 1,
          pointerEvents: post.behaviorScore < 5 ? 'none' : 'auto',
        }}>

          {/* ── Game Cover Banner ── */}
          <div className="relative w-full overflow-hidden" style={{ height: '144px', backgroundColor: '#0a0a0a' }}>
            {/* Real game cover — absolute fill, behind everything */}
            {post.gameCover && (
              <img
                src={post.gameCover}
                alt={post.game}
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ objectPosition: 'center' }}
              />
            )}

            {/* Transparent → dark gradient overlay (image stays visible) */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 45%, transparent 100%)',
              }}
            />

            {/* Game name — sits on top of the gradient */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 z-20">
              <span
                className="font-orbitron font-bold tracking-wide"
                style={{
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  textShadow: '0 1px 6px rgba(0,0,0,0.9)',
                }}
              >
                {post.game}
              </span>
            </div>

            {/* Game-colour accent line at very top */}
            <div
              className="absolute top-0 left-0 right-0 z-20"
              style={{
                height: '3px',
                background: `linear-gradient(to right, ${post.gameColor} 0%, ${post.gameColor}66 60%, transparent 100%)`,
              }}
            />
          </div>


          {/* ── Card Body ── */}
          <div className="p-4">

            {/* User row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar username={post.user.username} />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] status-${post.user.status}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {post.user.displayName}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  @{post.user.username} · {post.timestamp}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)', opacity: 0.85 }}>
              {post.description}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <UserPlus size={11} />
                <span className="font-rajdhani">{post.lookingFor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Monitor size={11} />
                <span className="font-rajdhani">{post.platform.join(' / ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={11} />
                <span className="font-rajdhani">{post.playtime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full font-rajdhani"
                  style={{
                    background: 'rgba(var(--neon-color-rgb), 0.08)',
                    border: '1px solid rgba(var(--neon-color-rgb), 0.2)',
                    color: 'rgba(var(--neon-color-rgb), 0.9)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center gap-4">
                <motion.button
                  id={`like-btn-${post.id}`}
                  onClick={handleLike}
                  whileTap={{ scale: 0.8 }}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: liked ? '#ec4899' : 'var(--text-secondary)' }}
                >
                  <Heart
                    size={15}
                    fill={liked ? '#ec4899' : 'none'}
                    strokeWidth={liked ? 0 : 1.8}
                    style={{ filter: liked ? 'drop-shadow(0 0 4px rgba(236,72,153,0.8))' : 'none' }}
                  />
                  <span className="font-rajdhani">{likeCount}</span>
                </motion.button>
                <button className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <MessageCircle size={15} strokeWidth={1.8} />
                  <span className="font-rajdhani">{post.comments}</span>
                </button>
              </div>
              <NeonButton
                id={`join-btn-${post.id}`}
                size="sm"
                onClick={() => sendJoinRequest(post)}
                disabled={requestStatus !== 'none'}
                variant={requestStatus !== 'none' ? 'outline' : 'primary'}
                className={`font-orbitron tracking-widest transition-all duration-300 ${requestStatus !== 'none' ? 'opacity-80' : ''}`}
              >
                {requestStatus === 'accepted' ? (
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} /> {t('card_accepted')}</span>
                ) : requestStatus === 'requested' ? (
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {t('card_requested')}</span>
                ) : (
                  t('card_join')
                )}
              </NeonButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
