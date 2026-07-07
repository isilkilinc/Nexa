'use client';

import { Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Clip } from '@/lib/mockData';
import { useLanguage } from '@/app/providers/LanguageProvider';

interface ClipsGalleryProps {
  clips: Clip[];
}

const CLIP_COLORS = [
  'from-purple-900/60 to-blue-900/60',
  'from-green-900/60 to-teal-900/60',
  'from-red-900/60 to-pink-900/60',
  'from-blue-900/60 to-indigo-900/60',
  'from-yellow-900/60 to-orange-900/60',
  'from-pink-900/60 to-purple-900/60',
];

const CLIP_ICONS = ['🔫', '🌱', '🔫', '🤖', '🔫', '🌱'];

export function ClipsGallery({ clips }: ClipsGalleryProps) {
  const { t } = useLanguage();
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-4">
        <h3 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
          {t('clips_title')}
        </h3>
        <button className="text-xs font-rajdhani font-semibold" style={{ color: 'var(--neon-color)' }}>
          {t('clips_see_all')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 px-4">
        {clips.map((clip, i) => (
          <motion.div
            key={clip.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group"
            style={{ border: '1px solid var(--glass-border)' }}
          >
            {/* Gradient thumbnail background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CLIP_COLORS[i % CLIP_COLORS.length]}`}
            />

            {/* Game emoji / icon */}
            <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">
              {CLIP_ICONS[i % CLIP_ICONS.length]}
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 clip-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Play button overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(var(--neon-color-rgb), 0.9)',
                  boxShadow: '0 0 16px rgba(var(--neon-color-rgb), 0.8)',
                }}
              >
                <Play size={14} fill="black" color="black" />
              </div>
            </div>

            {/* Duration */}
            <div
              className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-rajdhani"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
            >
              {clip.duration}
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 clip-overlay">
              <div className="flex items-center gap-1">
                <Eye size={8} style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span
                  className="text-[9px] font-rajdhani font-medium"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {clip.views}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
