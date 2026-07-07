'use client';

import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/providers/LanguageProvider';

interface Account {
  platform: string;
  id: string;
  verified: boolean;
  icon: string;
}

interface GamingIdentityProps {
  accounts: Account[];
}

const PLATFORM_COLORS: Record<string, string> = {
  'Steam':      '#1b2838',
  'Epic Games': '#2a2a2a',
  'Discord':    '#5865f2',
  'Riot ID':    '#ff4655',
};

const PLATFORM_GLOW: Record<string, string> = {
  'Steam':      'rgba(27,40,56,0.8)',
  'Epic Games': 'rgba(42,42,42,0.8)',
  'Discord':    'rgba(88,101,242,0.5)',
  'Riot ID':    'rgba(255,70,85,0.5)',
};

export function GamingIdentity({ accounts }: GamingIdentityProps) {
  const { t } = useLanguage();
  return (
    <div className="px-4">
      <h3 className="font-orbitron font-bold text-sm tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
        {t('identity_title')}
      </h3>

      <div className="flex flex-col gap-2.5">
        {accounts.map((acc, i) => (
          <motion.div
            key={acc.platform}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="glass glass-hover rounded-xl px-4 py-3 flex items-center justify-between"
            style={{
              borderColor: `${PLATFORM_GLOW[acc.platform] || 'var(--glass-border)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                style={{
                  background: PLATFORM_COLORS[acc.platform] || '#1a1a2e',
                  boxShadow: `0 0 10px ${PLATFORM_GLOW[acc.platform] || 'transparent'}`,
                }}
              >
                {acc.icon}
              </div>
              <div>
                <p className="text-xs font-semibold font-rajdhani tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {acc.platform.toUpperCase()}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {acc.id}
                </p>
              </div>
            </div>
            {acc.verified && (
              <div className="flex items-center gap-1">
                <CheckCircle size={14} style={{ color: '#22c55e', filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
                <span className="text-xs text-green-400 font-rajdhani font-semibold">{t('identity_verified')}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
