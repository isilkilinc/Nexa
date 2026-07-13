'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

type Status = 'loading' | 'success' | 'error';

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  // Guard against React Strict Mode double-invoking useEffect.
  // Without this, the verify API is called twice: the first call succeeds and
  // deletes the token; the second call finds null and shows a false error.
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the URL.');
      return;
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('error');
          setMessage(data.error);
        } else {
          setStatus('success');
          setMessage(data.message ?? 'Your email has been verified!');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center space-bg p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl p-10 flex flex-col items-center text-center"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(var(--neon-color-rgb), 0.12)',
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            {status === 'loading' && (
              <Loader2
                size={64}
                className="animate-spin"
                style={{ color: 'var(--neon-color)' }}
              />
            )}
            {status === 'success' && (
              <CheckCircle size={64} style={{ color: '#22c55e' }} />
            )}
            {status === 'error' && (
              <XCircle size={64} style={{ color: '#ef4444' }} />
            )}
          </motion.div>

          {/* Logo */}
          <p
            className="font-orbitron font-black text-xl tracking-widest mb-2"
            style={{ color: 'var(--neon-color)' }}
          >
            NEXA
          </p>

          {/* Heading */}
          <h1
            className="font-orbitron font-bold text-2xl mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {status === 'loading' && 'Verifying…'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p
            className="font-rajdhani text-base mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {status === 'loading'
              ? 'Please wait while we verify your email address.'
              : message}
          </p>

          {/* CTA */}
          {status === 'success' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push('/signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--neon-color), rgba(var(--neon-color-rgb),0.7))',
                color: '#ffffff',
                boxShadow: '0 0 24px rgba(var(--neon-color-rgb), 0.4)',
              }}
            >
              Go to Login <ArrowRight size={16} />
            </motion.button>
          )}

          {status === 'error' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push('/signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-105"
              style={{
                background: 'rgba(var(--neon-color-rgb), 0.1)',
                color: 'var(--neon-color)',
                border: '1px solid rgba(var(--neon-color-rgb), 0.3)',
              }}
            >
              Back to Sign Up <ArrowRight size={16} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
