'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { NexaLogo } from '@/components/ui/NexaLogo';

type UIState = 'idle' | 'loading' | 'email_sent' | 'error';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Registration ──────────────────────────────────────────────────────
  const handleRegister = async () => {
    setUiState('loading');
    setErrorMsg('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setUiState('error');
      setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
    } else {
      setUiState('email_sent');
    }
  };

  // ── Login ─────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setUiState('loading');
    setErrorMsg('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setUiState('error');
      // NextAuth wraps authorize errors as "CredentialsSignin" — show a friendlier message
      setErrorMsg(
        result.error === 'CredentialsSignin'
          ? 'Login failed. Check your credentials or verify your email first.'
          : result.error
      );
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handlePlaceholderLogin = (e: React.MouseEvent, provider: string) => {
    e.preventDefault();
    alert(`${provider} integration coming soon! / Yakında eklenecek!`);
  };

  // ── Email sent confirmation state ─────────────────────────────────────
  if (uiState === 'email_sent') {
    return (
      <div className="min-h-screen flex items-center justify-center space-bg p-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <GlassCard className="p-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle size={64} style={{ color: '#22c55e' }} />
            </motion.div>
            <NexaLogo size="sm" className="mb-4" />
            <h2
              className="font-orbitron font-bold text-2xl mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Check Your Inbox
            </h2>
            <p
              className="font-rajdhani text-base leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              We've sent a verification link to{' '}
              <strong style={{ color: 'var(--neon-color)' }}>{email}</strong>.
              Click the link in that email to activate your account.
            </p>
            <p className="text-xs font-rajdhani" style={{ color: 'var(--text-muted)' }}>
              The link expires in 24 hours. Check your spam folder if you don't see it.
            </p>
            <button
              onClick={() => {
                setUiState('idle');
                setIsLogin(true);
              }}
              className="mt-8 text-sm font-rajdhani font-bold hover:underline"
              style={{ color: 'var(--neon-color)' }}
            >
              Already verified? Log in →
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center space-bg p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 pb-10 flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <NexaLogo size="lg" className="mb-3" />
            <p className="text-sm text-center font-rajdhani" style={{ color: 'var(--text-secondary)' }}>
              {isLogin
                ? 'Welcome back to the ultimate gaming network.'
                : 'Join the ultimate gaming network. Find your perfect duo.'}
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {uiState === 'error' && (
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
                  {errorMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="relative origin-top"
                >
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm font-rajdhani outline-none transition-all"
                    style={{
                      background: 'var(--glass-bg)',
                      color: 'var(--text-primary)',
                      border: `1px solid ${username ? 'rgba(var(--neon-color-rgb), 0.5)' : 'var(--glass-border)'}`,
                      boxShadow: username ? '0 0 12px rgba(var(--neon-color-rgb), 0.2)' : 'none',
                    }}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm font-rajdhani outline-none transition-all"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  border: `1px solid ${email ? 'rgba(var(--neon-color-rgb), 0.5)' : 'var(--glass-border)'}`,
                  boxShadow: email ? '0 0 12px rgba(var(--neon-color-rgb), 0.2)' : 'none',
                }}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm font-rajdhani outline-none transition-all"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  border: `1px solid ${password ? 'rgba(var(--neon-color-rgb), 0.5)' : 'var(--glass-border)'}`,
                  boxShadow: password ? '0 0 12px rgba(var(--neon-color-rgb), 0.2)' : 'none',
                }}
                required
              />
            </div>

            {isLogin && (
              <div className="w-full flex justify-end">
                <button type="button" className="text-xs font-rajdhani hover:underline" style={{ color: 'var(--neon-color)' }}>
                  Forgot Password?
                </button>
              </div>
            )}

            <NeonButton
              type="submit"
              disabled={uiState === 'loading'}
              className="w-full mt-2 py-4 font-orbitron font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2"
            >
              {uiState === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isLogin ? 'Logging in…' : 'Creating account…'}
                </>
              ) : isLogin ? 'Log In' : 'Create Account'}
            </NeonButton>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
            <span className="px-4 text-xs font-rajdhani font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>
              OR CONNECT WITH
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          </div>

          {/* Social Logins */}
          <div className="w-full flex justify-center gap-4">
            <button
              title="Steam"
              onClick={(e) => handlePlaceholderLogin(e, 'Steam')}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ background: 'rgba(102,192,244,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(102,192,244,0.3)', boxShadow: '0 4px 12px rgba(102,192,244,0.2)' }}
            >
              <img src="/steam.png" alt="Steam" className="w-5 h-5 object-contain" />
            </button>

            <button
              title="Discord"
              onClick={(e) => handlePlaceholderLogin(e, 'Discord')}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ background: 'rgba(88,101,242,0.1)', color: '#5865F2', border: '1px solid rgba(88,101,242,0.3)', boxShadow: '0 4px 12px rgba(88,101,242,0.2)' }}
            >
              <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.15ZM42.56,65.36c-5.36,0-9.8-4.83-9.8-10.74s4.36-10.74,9.8-10.74,9.85,4.83,9.8,10.74-4.4,10.74-9.8,10.74Zm42,0c-5.36,0-9.8-4.83-9.8-10.74s4.36-10.74,9.8-10.74,9.85,4.83,9.8,10.74-4.4,10.74-9.8,10.74Z"/></svg>
            </button>

            <button
              title="Epic Games"
              onClick={(e) => handlePlaceholderLogin(e, 'Epic Games')}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ background: 'rgba(204,204,204,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(204,204,204,0.3)', boxShadow: '0 4px 12px rgba(204,204,204,0.2)' }}
            >
              <img src="/epicgames.png" alt="Epic Games" className="w-5 h-5 object-contain" />
            </button>

            <button
              title="Google"
              onClick={() => signIn('google')}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ background: 'rgba(234,67,53,0.1)', color: '#EA4335', border: '1px solid rgba(234,67,53,0.3)', boxShadow: '0 4px 12px rgba(234,67,53,0.2)' }}
            >
              <img src="/google.png" alt="Google" className="w-5 h-5 object-contain" />
            </button>
          </div>

          <p className="mt-8 text-xs font-rajdhani" style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setUiState('idle');
                setErrorMsg('');
              }}
              className="font-bold hover:underline transition-all"
              style={{ color: 'var(--neon-color)' }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
