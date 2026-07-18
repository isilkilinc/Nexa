'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { createListing } from '@/app/actions/listings';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

export function CreateListingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    const result = await createListing(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <GlassCard className="p-6 md:p-8 w-full max-w-xl mx-auto">
      <div className="mb-6 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: 'rgba(var(--neon-color-rgb), 0.1)', border: '1px solid var(--neon-color)', boxShadow: '0 0 15px rgba(var(--neon-color-rgb), 0.3)' }}>
          <Plus size={20} style={{ color: 'var(--neon-color)' }} />
        </div>
        <h2 className="font-orbitron font-bold text-2xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Create Listing
        </h2>
        <p className="font-rajdhani text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Find your perfect squad
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-4 flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
            <p className="text-sm font-rajdhani" style={{ color: '#fca5a5' }}>
              {error}
            </p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-4 flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
          >
            <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: '#22c55e' }} />
            <p className="text-sm font-rajdhani" style={{ color: '#86efac' }}>
              Listing created successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Need 2 for Ranked Push"
            className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
            }}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Game
          </label>
          <select
            name="game"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
            }}
            required
          >
            <option value="" disabled>Select a game</option>
            <option value="Valorant">Valorant</option>
            <option value="CS2">Counter-Strike 2</option>
            <option value="League of Legends">League of Legends</option>
            <option value="Apex Legends">Apex Legends</option>
            <option value="Overwatch 2">Overwatch 2</option>
            <option value="Minecraft">Minecraft</option>
            <option value="Other">Other</option>
          </select>
          
          <AnimatePresence>
            {selectedGame === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <input
                  type="text"
                  name="customGame"
                  placeholder="Type the game name..."
                  className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                  }}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
            Description
          </label>
          <textarea
            name="description"
            placeholder="Tell us what you're looking for..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all resize-none"
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
            }}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Gender Pref.
            </label>
            <select
              name="genderPreference"
              defaultValue=""
              className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <option value="">Any</option>
              <option value="Male Only">Male Only</option>
              <option value="Female Only">Female Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Playtime
            </label>
            <select
              name="playtime"
              defaultValue=""
              className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <option value="">Flexible</option>
              <option value="Now">Now</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="Weekend">Weekend</option>
            </select>
            <input
              type="text"
              name="specificTime"
              placeholder="Or specific time (e.g. 8:00 PM PST)"
              className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all mt-3"
              style={{
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-rajdhani font-bold mb-1 tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Experience
            </label>
            <select
              name="experience"
              defaultValue=""
              className="w-full rounded-xl px-4 py-3 text-sm font-rajdhani outline-none transition-all"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <option value="">Any</option>
              <option value="Casual / Chill">Casual / Chill</option>
              <option value="Ranked / Sweat">Ranked / Sweat</option>
              <option value="Pro / Comp">Pro / Comp</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 mt-5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="micRequired"
                name="micRequired"
                value="true"
                className="w-5 h-5 rounded accent-[var(--neon-color)] bg-white/10"
              />
              <label htmlFor="micRequired" className="text-sm font-rajdhani font-bold cursor-pointer select-none" style={{ color: 'var(--text-primary)' }}>
                Mic Required
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is18Plus"
                name="is18Plus"
                value="true"
                className="w-5 h-5 rounded accent-red-500 bg-white/10"
              />
              <label htmlFor="is18Plus" className="text-sm font-rajdhani font-bold cursor-pointer select-none" style={{ color: '#fca5a5' }}>
                18+ Only
              </label>
            </div>
          </div>
        </div>

        <NeonButton
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 font-orbitron font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Posting...
            </>
          ) : 'Post Listing'}
        </NeonButton>
      </form>
    </GlassCard>
  );
}
