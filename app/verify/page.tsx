import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export const metadata = {
  title: 'Verify Email — Nexa',
  description: 'Verify your Nexa account email address.',
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyClient />
    </Suspense>
  );
}

function VerifyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center space-bg">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full border-4 border-t-transparent mx-auto mb-4 animate-spin"
          style={{ borderColor: 'rgba(var(--neon-color-rgb),0.4)', borderTopColor: 'transparent' }}
        />
        <p className="font-rajdhani" style={{ color: 'var(--text-secondary)' }}>
          Verifying…
        </p>
      </div>
    </div>
  );
}
