'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, Users, Clock, Monitor, Rocket, Sparkles } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { CreateListingForm } from '@/components/CreateListingForm';

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

              <div className="pt-2">
                <CreateListingForm />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
