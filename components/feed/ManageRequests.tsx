'use client';

import { useEffect, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getRequestsForListing,
  updateRequestStatus,
  type RequestWithSender,
} from '@/app/actions/requests';

interface ManageRequestsProps {
  listingId: string;
}

function SenderAvatar({ name }: { name: string }) {
  const colors = ['#a855f7', '#06b6d4', '#ec4899', '#22c55e', '#f97316', '#eab308'];
  const color = colors[(name.charCodeAt(0) || 65) % colors.length];
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black font-orbitron flex-shrink-0 text-xs"
      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
    >
      {(name[0] || '?').toUpperCase()}
    </div>
  );
}

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string; border: string }> = {
  PENDING:  { label: 'Pending',  bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.3)' },
  ACCEPTED: { label: 'Accepted', bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  REJECTED: { label: 'Rejected', bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
};

export function ManageRequests({ listingId }: ManageRequestsProps) {
  const [requests, setRequests] = useState<RequestWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionStates, setActionStates] = useState<Record<string, 'loading' | null>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRequestsForListing(listingId).then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error);
      else setRequests(res.data ?? []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [listingId]);

  const handleAction = (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setActionStates((prev) => ({ ...prev, [requestId]: 'loading' }));
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, status);
      if (result.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status } : r))
        );
      } else {
        setError(result.error ?? 'Failed to update request');
      }
      setActionStates((prev) => ({ ...prev, [requestId]: null }));
    });
  };

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div
      className="mt-0 rounded-b-2xl overflow-hidden"
      style={{
        borderTop: '1px solid rgba(var(--neon-color-rgb), 0.15)',
        background: 'rgba(var(--neon-color-rgb), 0.03)',
      }}
    >
      {/* Section header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group"
        style={{ outline: 'none' }}
      >
        <div className="flex items-center gap-2">
          <Users size={13} style={{ color: 'var(--neon-color)' }} />
          <span
            className="font-orbitron text-xs font-bold tracking-wider"
            style={{ color: 'var(--neon-color)' }}
          >
            Incoming Requests
          </span>
          {pendingCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-orbitron"
              style={{
                background: 'rgba(var(--neon-color-rgb), 0.2)',
                color: 'var(--neon-color)',
                border: '1px solid rgba(var(--neon-color-rgb), 0.4)',
              }}
            >
              {pendingCount}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              {error && (
                <p className="text-xs font-rajdhani" style={{ color: '#ef4444' }}>
                  {error}
                </p>
              )}

              {loading && (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 size={14} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs font-rajdhani" style={{ color: 'var(--text-muted)' }}>
                    Loading requests…
                  </span>
                </div>
              )}

              {!loading && !error && requests.length === 0 && (
                <p className="text-xs font-rajdhani py-2" style={{ color: 'var(--text-muted)' }}>
                  No requests yet.
                </p>
              )}

              {!loading &&
                requests.map((req) => {
                  const senderName = req.sender.name || req.sender.email || 'Unknown';
                  const style = STATUS_STYLES[req.status];
                  const isActing = actionStates[req.id] === 'loading';

                  return (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      <SenderAvatar name={senderName} />

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold leading-tight truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {senderName}
                        </p>
                        {req.sender.email && req.sender.name && (
                          <p
                            className="text-[10px] leading-tight truncate font-rajdhani"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {req.sender.email}
                          </p>
                        )}
                      </div>

                      {req.status !== 'PENDING' ? (
                        <span
                          className="text-[10px] font-bold font-orbitron px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          {style.label}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => handleAction(req.id, 'ACCEPTED')}
                            disabled={isActing || isPending}
                            title="Accept"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: 'rgba(34,197,94,0.15)',
                              border: '1px solid rgba(34,197,94,0.35)',
                              color: '#22c55e',
                            }}
                          >
                            {isActing ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Check size={12} strokeWidth={2.5} />
                            )}
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => handleAction(req.id, 'REJECTED')}
                            disabled={isActing || isPending}
                            title="Reject"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: 'rgba(239,68,68,0.15)',
                              border: '1px solid rgba(239,68,68,0.35)',
                              color: '#ef4444',
                            }}
                          >
                            {isActing ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <X size={12} strokeWidth={2.5} />
                            )}
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
