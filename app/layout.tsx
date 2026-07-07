import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/nav/BottomNav';

export const metadata: Metadata = {
  title: 'Nexa — Find Your Gaming Squad',
  description: 'Nexa is the futuristic social matchmaking app for gamers. Find teammates, join groups, and connect with your perfect gaming squad.',
  keywords: ['gaming', 'LFG', 'matchmaking', 'gamer social', 'squad finder', 'Nexa'],
  openGraph: {
    title: 'Nexa — Find Your Gaming Squad',
    description: 'Connect with gamers. Build your squad. Dominate together.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#05050a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          {/* Space / grid background */}
          <div className="fixed inset-0 space-bg grid-bg pointer-events-none z-0" />

          {/* Stars decoration */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${(i * 37 + 11) % 100}%`,
                  top: `${(i * 53 + 7) % 100}%`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 page-container">
            {children}
            
            {/* Bottom Navigation */}
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}

