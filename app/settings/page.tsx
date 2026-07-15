'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Palette, Monitor, Bell, Shield, HelpCircle, LogOut, CheckCircle, Pipette, Globe, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme, NEON_PRESETS, NeonPreset, LogoStyle } from '@/app/providers/ThemeProvider';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { GlassCard } from '@/components/ui/GlassCard';
import { NexaLogo } from '@/components/ui/NexaLogo';

export default function SettingsPage() {
  const router = useRouter();
  const { activePreset, setNeonPreset, setCustomColor, logoStyle, setLogoStyle, neonColor, colorMode, setColorMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const customColorRef = useRef<HTMLInputElement>(null);

  const handleLogoToggle = (style: LogoStyle) => setLogoStyle(style);

  const handleColorModeChange = (mode: 'light' | 'dark') => {
    if (mode === 'light' && activePreset.id === 'white') {
      const defaultPreset = NEON_PRESETS.find(p => p.id === 'purple') || NEON_PRESETS[0];
      setNeonPreset(defaultPreset);
    }
    setColorMode(mode);
  };

  const settingsSections = [
    {
      title: t('settings_account'),
      items: [
        { icon: Monitor,    label: t('settings_manage_profile'), action: () => router.push('/profile') },
        { icon: Shield,     label: t('settings_privacy'),        action: () => {} },
        { icon: Bell,       label: t('settings_notifications'),  toggle: true, value: notifications, onToggle: () => setNotifications(!notifications) },
        { icon: Shield,     label: t('settings_private_mode'),   toggle: true, value: privateMode,   onToggle: () => setPrivateMode(!privateMode) },
      ],
    },
    {
      title: t('settings_support'),
      items: [
        { icon: HelpCircle, label: t('settings_help'),      action: () => {} },
        { icon: LogOut,     label: t('settings_sign_out'),  action: () => router.push('/signup'), danger: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-12 pb-4"
        style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            id="settings-back-btn"
            onClick={() => router.push('/profile')}
            className="w-9 h-9 glass rounded-full flex items-center justify-center glass-hover"
          >
            <ChevronLeft size={16} style={{ color: 'var(--text-primary)' }} />
          </button>
          <h1 className="font-orbitron font-black text-xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {t('settings_title')}
          </h1>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6">

        {/* ─── Language Toggle ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} style={{ color: 'var(--neon-color)' }} />
            <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {t('settings_language')}
            </h2>
          </div>
          
          <div
            className="flex p-1 rounded-2xl glass"
            style={{ border: '1px solid var(--glass-border)' }}
          >
            {/* English */}
            <button
              id="lang-en"
              onClick={() => setLanguage('en')}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 relative"
              style={{
                background: language === 'en' ? 'rgba(var(--neon-color-rgb), 0.15)' : 'transparent',
                border: language === 'en' ? '1px solid var(--neon-color)' : '1px solid transparent',
                boxShadow: language === 'en' ? '0 0 16px rgba(var(--neon-color-rgb), 0.4)' : 'none',
              }}
            >
              <span className="text-lg" style={{ filter: language !== 'en' ? 'grayscale(100%) opacity(50%)' : 'none', transition: 'all 0.3s' }}>🇬🇧</span>
              <span className="font-orbitron font-bold text-xs" style={{ color: language === 'en' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                ENGLISH
              </span>
            </button>

            {/* Turkish */}
            <button
              id="lang-tr"
              onClick={() => setLanguage('tr')}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 relative"
              style={{
                background: language === 'tr' ? 'rgba(var(--neon-color-rgb), 0.15)' : 'transparent',
                border: language === 'tr' ? '1px solid var(--neon-color)' : '1px solid transparent',
                boxShadow: language === 'tr' ? '0 0 16px rgba(var(--neon-color-rgb), 0.4)' : 'none',
              }}
            >
              <span className="text-lg" style={{ filter: language !== 'tr' ? 'grayscale(100%) opacity(50%)' : 'none', transition: 'all 0.3s' }}>🇹🇷</span>
              <span className="font-orbitron font-bold text-xs" style={{ color: language === 'tr' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                TÜRKÇE
              </span>
            </button>
          </div>
        </div>

        {/* ─── Neon Theme Color ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={14} style={{ color: 'var(--neon-color)' }} />
            <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {t('settings_neon_theme')}
            </h2>
          </div>

          <GlassCard className="p-4">
            {/* Current color preview */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${neonColor}, ${neonColor}88)`,
                  boxShadow: `0 0 20px rgba(var(--neon-color-rgb), 0.6)`,
                  border: '1px solid rgba(var(--neon-color-rgb), 0.5)',
                }}
              />
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{activePreset.name}</p>
                <p className="text-xs font-rajdhani" style={{ color: 'var(--text-secondary)' }}>{neonColor.toUpperCase()}</p>
              </div>
              <div className="ml-auto drop-shadow-none">
                <NexaLogo hideText={true} className="w-16 h-16 text-[color:var(--neon-color)]" style={{ color: 'var(--neon-color)' }} />
              </div>
            </div>

            {/* Preset palette grid */}
            {(() => {
              const visibleColors = NEON_PRESETS.filter(p => !(colorMode === 'light' && p.id === 'white'));

              const renderPreset = (preset: NeonPreset) => {
                const isActive = activePreset.id === preset.id;
                return (
                  <motion.button
                    key={preset.id}
                    id={`theme-preset-${preset.id}`}
                    onClick={() => setNeonPreset(preset)}
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.08 }}
                    className="flex flex-col items-center gap-1 w-12"
                    title={preset.name}
                  >
                    <div
                      className="w-full aspect-square rounded-xl relative flex-shrink-0"
                      style={{
                        background: preset.color,
                        boxShadow: isActive ? `0 0 14px ${preset.color}, 0 0 28px ${preset.color}66` : `0 0 6px ${preset.color}66`,
                        border: isActive ? `2px solid white` : `2px solid ${preset.color}44`,
                      }}
                    >
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle size={16} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-rajdhani font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {preset.label}
                    </span>
                  </motion.button>
                );
              };

              return (
                <div className="flex flex-col gap-3 items-center w-full mb-4">
                  <div className="flex flex-row gap-3 justify-center">
                    {visibleColors.slice(0, 5).map(renderPreset)}
                  </div>
                  {visibleColors.length > 5 && (
                    <div className="flex flex-row gap-3 justify-center">
                      {visibleColors.slice(5).map(renderPreset)}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <input
                ref={customColorRef}
                id="custom-color-picker"
                type="color"
                defaultValue={neonColor}
                onChange={e => setCustomColor(e.target.value)}
                className="sr-only"
              />
              <motion.button
                onClick={() => customColorRef.current?.click()}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 flex-1 glass glass-hover rounded-xl px-4 py-3"
                style={{ border: activePreset.id === 'custom' ? '1px solid var(--neon-color)' : '1px solid var(--glass-border)' }}
              >
                <Pipette size={15} style={{ color: 'var(--neon-color)' }} />
                <div>
                  <p className="text-sm font-semibold text-left" style={{ color: 'var(--text-primary)' }}>{t('settings_custom_color')}</p>
                  <p className="text-xs font-rajdhani text-left" style={{ color: 'var(--text-secondary)' }}>{t('settings_custom_color_sub')}</p>
                </div>
                {activePreset.id === 'custom' && (
                  <CheckCircle size={14} className="ml-auto" style={{ color: 'var(--neon-color)' }} />
                )}
              </motion.button>
            </div>
          </GlassCard>
        </div>

        {/* ─── Color Mode (Light/Dark) ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {colorMode === 'dark' ? <Moon size={14} style={{ color: 'var(--neon-color)' }} /> : <Sun size={14} style={{ color: 'var(--neon-color)' }} />}
            <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: 'var(--text-primary)' }}>
              {t('settings_color_mode')}
            </h2>
          </div>
          
          <div
            className="flex p-1 rounded-2xl glass"
            style={{ border: '1px solid var(--glass-border)' }}
          >
            {/* Dark Mode */}
            <button
              id="color-dark"
              onClick={() => handleColorModeChange('dark')}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 relative"
              style={{
                background: colorMode === 'dark' ? 'rgba(var(--neon-color-rgb), 0.15)' : 'transparent',
                border: colorMode === 'dark' ? '1px solid var(--neon-color)' : '1px solid transparent',
                boxShadow: colorMode === 'dark' ? '0 0 16px rgba(var(--neon-color-rgb), 0.4)' : 'none',
              }}
            >
              <Moon size={16} style={{ color: colorMode === 'dark' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
              <span className="font-orbitron font-bold text-xs" style={{ color: colorMode === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {t('settings_dark_mode').toUpperCase()}
              </span>
            </button>

            {/* Light Mode */}
            <button
              id="color-light"
              onClick={() => handleColorModeChange('light')}
              className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 relative"
              style={{
                background: colorMode === 'light' ? 'rgba(var(--neon-color-rgb), 0.15)' : 'transparent',
                border: colorMode === 'light' ? '1px solid var(--neon-color)' : '1px solid transparent',
                boxShadow: colorMode === 'light' ? '0 0 16px rgba(var(--neon-color-rgb), 0.4)' : 'none',
              }}
            >
              <Sun size={16} style={{ color: colorMode === 'light' ? 'var(--text-primary)' : 'var(--text-muted)' }} />
              <span className="font-orbitron font-bold text-xs" style={{ color: colorMode === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {t('settings_light_mode').toUpperCase()}
              </span>
            </button>
          </div>
        </div>



        {/* ─── Other settings sections ─── */}
        {settingsSections.map(section => (
          <div key={section.title}>
            <h2 className="font-orbitron font-bold text-sm tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
              {section.title}
            </h2>
            <GlassCard className="overflow-hidden">
              {section.items.map((item, i) => (
                <div key={item.label}>
                  <button
                    id={`settings-${item.label.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-4 glass-hover"
                  >
                    <item.icon size={16} style={{ color: (item as { danger?: boolean }).danger ? '#ef4444' : 'var(--neon-color)' }} />
                    <p
                      className="flex-1 text-sm font-medium text-left"
                      style={{ color: (item as { danger?: boolean }).danger ? '#ef4444' : 'var(--text-primary)' }}
                    >
                      {item.label}
                    </p>
                    {'toggle' in item ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); if ('onToggle' in item) item.onToggle?.(); }}
                        className="w-12 h-6 rounded-full relative transition-all duration-300"
                        style={{
                          background: item.value ? 'var(--neon-color)' : 'rgba(255,255,255,0.1)',
                          boxShadow: item.value ? '0 0 10px rgba(var(--neon-color-rgb), 0.5)' : 'none',
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                          style={{ left: item.value ? '26px' : '2px' }}
                        />
                      </button>
                    ) : (
                      <ChevronLeft size={14} className="rotate-180" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>
                  {i < section.items.length - 1 && (
                    <div className="mx-4 h-px" style={{ background: 'var(--glass-border)' }} />
                  )}
                </div>
              ))}
            </GlassCard>
          </div>
        ))}

        {/* Version footer */}
        <p className="text-center text-xs font-rajdhani" style={{ color: 'var(--text-muted)' }}>
          {t('settings_version')}
        </p>
      </div>
    </div>
  );
}
