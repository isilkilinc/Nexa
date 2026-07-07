'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, translations, TranslationKey } from '@/lib/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function safeGet(key: string): string | null {
  try { return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null; }
  catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); }
  catch { /* ignore */ }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = safeGet('nexa-language') as Language | null;
    if (saved === 'en' || saved === 'tr') setLanguageState(saved);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    safeSet('nexa-language', lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return (translations[language] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>');
  return ctx;
}
