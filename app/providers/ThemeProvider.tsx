'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ─── Theme Color Presets ───────────────────────────────────────────────────
export interface NeonPreset {
  id: string;
  name: string;
  color: string;
  rgb: string; // "r, g, b" format for CSS rgba()
  label: string;
}

export const NEON_PRESETS: NeonPreset[] = [
  { id: 'purple',   name: 'Neon Purple',     color: '#a855f7', rgb: '168, 85, 247',  label: 'Default'   },
  { id: 'cyan',     name: 'Cyber Cyan',      color: '#06b6d4', rgb: '6, 182, 212',   label: 'Cyber'     },
  { id: 'yellow',   name: 'Cyberpunk Gold',  color: '#eab308', rgb: '234, 179, 8',   label: 'Cyberpunk' },
  { id: 'green',    name: 'Toxic Green',     color: '#22c55e', rgb: '34, 197, 94',   label: 'Toxic'     },
  { id: 'pink',     name: 'Holo Pink',       color: '#ec4899', rgb: '236, 72, 153',  label: 'Holo'      },
  { id: 'orange',   name: 'Sunset Blaze',    color: '#f97316', rgb: '249, 115, 22',  label: 'Blaze'     },
  { id: 'red',      name: 'Crimson Pulse',   color: '#ef4444', rgb: '239, 68, 68',   label: 'Crimson'   },
  { id: 'teal',     name: 'Teal Matrix',     color: '#14b8a6', rgb: '20, 184, 166',  label: 'Matrix'    },
  { id: 'blue',     name: 'Electric Blue',   color: '#3b82f6', rgb: '59, 130, 246',  label: 'Electric'  },
  { id: 'white',    name: 'Pure White',      color: '#f0f0f0', rgb: '240, 240, 240', label: 'Pure'      },
];

// Logo and Color Mode options
export type LogoStyle = 'minimalist' | 'cyberpunk';
export type ColorMode = 'dark' | 'light';

// ─── Theme Context ─────────────────────────────────────────────────────────
interface ThemeContextValue {
  neonColor: string;
  neonRgb: string;
  activePreset: NeonPreset;
  setNeonPreset: (preset: NeonPreset) => void;
  setCustomColor: (hex: string) => void;
  logoStyle: LogoStyle;
  setLogoStyle: (style: LogoStyle) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '168, 85, 247';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// Safe wrappers — silently ignore if storage is blocked by browser policy
function safeGet(key: string): string | null {
  try { return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null; }
  catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); }
  catch { /* storage blocked — ignore */ }
}

// ─── ThemeProvider Component ───────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activePreset, setActivePreset] = useState<NeonPreset>(NEON_PRESETS[0]);
  const [neonColor,    setNeonColorState] = useState(NEON_PRESETS[0].color);
  const [neonRgb,      setNeonRgb]        = useState(NEON_PRESETS[0].rgb);
  const [logoStyle,    setLogoStyleState] = useState<LogoStyle>('cyberpunk');
  const [colorMode,    setColorModeState] = useState<ColorMode>('dark');

  // Apply CSS variables to :root whenever color changes
  const applyCssVars = useCallback((color: string, rgb: string) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--neon-color', color);
      document.documentElement.style.setProperty('--neon-color-rgb', rgb);
    }
  }, []);

  // Hydrate from storage on mount (client-only)
  useEffect(() => {
    const savedId    = safeGet('nexa-neon-preset-id');
    const savedColor = safeGet('nexa-neon-color');
    const savedRgb   = safeGet('nexa-neon-rgb');
    const savedLogo  = safeGet('nexa-logo-style') as LogoStyle | null;
    const savedMode  = safeGet('nexa-color-mode') as ColorMode | null;

    if (savedId) {
      const preset = NEON_PRESETS.find(p => p.id === savedId);
      if (preset) {
        setActivePreset(preset);
        setNeonColorState(preset.color);
        setNeonRgb(preset.rgb);
        applyCssVars(preset.color, preset.rgb);
      } else if (savedColor && savedRgb) {
        // Custom color
        const custom: NeonPreset = { id: 'custom', name: 'Custom', color: savedColor, rgb: savedRgb, label: 'Custom' };
        setActivePreset(custom);
        setNeonColorState(savedColor);
        setNeonRgb(savedRgb);
        applyCssVars(savedColor, savedRgb);
      }
    } else {
      applyCssVars(NEON_PRESETS[0].color, NEON_PRESETS[0].rgb);
    }

    if (savedLogo) setLogoStyleState(savedLogo);
    
    if (savedMode) {
      setColorModeState(savedMode);
      document.documentElement.setAttribute('data-theme', savedMode);
    }
  }, [applyCssVars]);

  const setNeonPreset = useCallback((preset: NeonPreset) => {
    setActivePreset(preset);
    setNeonColorState(preset.color);
    setNeonRgb(preset.rgb);
    applyCssVars(preset.color, preset.rgb);
    safeSet('nexa-neon-preset-id', preset.id);
    safeSet('nexa-neon-color', preset.color);
    safeSet('nexa-neon-rgb', preset.rgb);
  }, [applyCssVars]);

  const setCustomColor = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    const custom: NeonPreset = { id: 'custom', name: 'Custom', color: hex, rgb, label: 'Custom' };
    setActivePreset(custom);
    setNeonColorState(hex);
    setNeonRgb(rgb);
    applyCssVars(hex, rgb);
    safeSet('nexa-neon-preset-id', 'custom');
    safeSet('nexa-neon-color', hex);
    safeSet('nexa-neon-rgb', rgb);
  }, [applyCssVars]);

  const setLogoStyle = useCallback((style: LogoStyle) => {
    setLogoStyleState(style);
    safeSet('nexa-logo-style', style);
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
    safeSet('nexa-color-mode', mode);
  }, []);

  return (
    <ThemeContext.Provider value={{
      neonColor,
      neonRgb,
      activePreset,
      setNeonPreset,
      setCustomColor,
      logoStyle,
      setLogoStyle,
      colorMode,
      setColorMode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── useTheme Hook ─────────────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
