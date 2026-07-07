'use client';

import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { SocialProvider } from './SocialProvider';
import { NextAuthProvider } from './NextAuthProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextAuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SocialProvider>
            {children}
          </SocialProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NextAuthProvider>
  );
}
