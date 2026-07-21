'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Bell, BellOff, Trash2, X, ShieldAlert, UserX, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleMute, deleteConversation, markConversationAsRead } from '@/app/actions/messages';
import { blockUser, reportUser } from '@/app/actions/user';

export default function ChatHeader({ 
  conversationId, 
  otherName, 
  otherInitial, 
  initialIsMuted,
  otherId,
  otherImage
}: { 
  conversationId: string;
  otherName: string;
  otherInitial: string;
  initialIsMuted: boolean;
  otherId: string;
  otherImage: string | null;
}) {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalState, setModalState] = useState<'none' | 'delete' | 'block' | 'report'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    markConversationAsRead(conversationId);
  }, [conversationId]);

  // Actions
  const handleDeleteChat = async () => {
    setIsLoading(true);
    const res = await deleteConversation(conversationId);
    if (res.success) {
      router.push('/messages');
    } else {
      setIsLoading(false);
      setModalState('none');
      alert(res.error || "Failed to delete chat.");
    }
  };

  const handleBlockUser = async () => {
    setIsLoading(true);
    const res = await blockUser(otherId);
    if (res.success) {
      router.push('/messages');
    } else {
      setIsLoading(false);
      setModalState('none');
      alert(res.error || "Failed to block user.");
    }
  };

  const handleReportUser = async () => {
    setIsLoading(true);
    const res = await reportUser(otherId, 'Inappropriate behavior in chat');
    if (res.success) {
      setIsLoading(false);
      setModalState('none');
      setDrawerOpen(false);
      alert('User reported successfully.');
    } else {
      setIsLoading(false);
      setModalState('none');
      alert(res.error || "Failed to report user.");
    }
  };

  return (
    <>
      <div 
        className="flex items-center justify-between px-4 pt-12 pb-3 sticky top-0 z-40 w-full" 
        style={{ 
          background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/messages" className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          {/* Clickable Header Area */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setDrawerOpen(true)}
          >
            <div className="relative">
              {otherImage ? (
                <img src={otherImage} alt={otherName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black font-orbitron" style={{ background: 'var(--neon-color)' }}>
                  {otherInitial}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] bg-green-500" />
            </div>
            <div>
              <h2 className="font-semibold">{otherName}</h2>
              <p className="text-xs opacity-70 font-rajdhani flex items-center gap-1">
                Online {isMuted && <BellOff size={10} className="text-red-400" />}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm glass-strong z-50 flex flex-col border-l border-[var(--glass-border)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
                <h3 className="font-orbitron text-lg font-semibold tracking-wider text-[var(--text-primary)]">Details</h3>
                <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-[var(--glass-bg-hover)] rounded-full transition-colors text-[var(--text-primary)]">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center p-6 border-b border-[var(--glass-border)]">
                {otherImage ? (
                  <img src={otherImage} alt={otherName} className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg border border-[var(--glass-border)]" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-black font-orbitron mb-4 shadow-lg" style={{ background: 'var(--neon-color)' }}>
                    {otherInitial}
                  </div>
                )}
                <h2 className="font-semibold text-xl mb-1 text-[var(--text-primary)]">{otherName}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                <Link href={`/profile/${otherId}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--glass-bg-hover)] transition-colors text-[var(--text-primary)]">
                  <User size={18} className="text-[var(--text-secondary)]" />
                  <span>View Profile</span>
                </Link>
                <button
                  onClick={async () => {
                    const newMutedState = !isMuted;
                    setIsMuted(newMutedState);
                    await toggleMute(conversationId, newMutedState);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--glass-bg-hover)] transition-colors text-left text-[var(--text-primary)]"
                >
                  {isMuted ? <Bell size={18} className="text-[var(--text-primary)]" /> : <BellOff size={18} className="text-[var(--text-secondary)]" />}
                  <span>{isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
                </button>
                <button
                  onClick={() => setModalState('delete')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left group mt-4"
                >
                  <Trash2 size={18} className="text-red-500 group-hover:text-red-400" />
                  <span className="text-red-500 group-hover:text-red-400">Delete Chat</span>
                </button>
                <button
                  onClick={() => setModalState('block')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
                >
                  <UserX size={18} className="text-red-500 group-hover:text-red-400" />
                  <span className="text-red-500 group-hover:text-red-400">Block User</span>
                </button>
                <button
                  onClick={() => setModalState('report')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--glass-bg-hover)] transition-colors text-left"
                >
                  <ShieldAlert size={18} className="text-red-500" />
                  <span className="text-red-500">Report User</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {modalState !== 'none' && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalState('none')}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="glass-strong relative w-full max-w-sm rounded-3xl p-6 border-[var(--glass-border)] shadow-2xl flex flex-col items-center text-center"
            >
              {modalState === 'delete' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500"><Trash2 size={24} /></div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Delete Chat?</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">Are you sure you want to delete this conversation? This cannot be undone.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setModalState('none')} className="flex-1 py-3 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] transition-colors font-semibold text-sm text-[var(--text-primary)]">Cancel</button>
                    <button onClick={handleDeleteChat} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-semibold text-sm disabled:opacity-50 flex justify-center items-center">
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                    </button>
                  </div>
                </>
              )}
              {modalState === 'block' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500"><UserX size={24} /></div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Block {otherName}?</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">They won't be able to message you, and this chat will be hidden.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setModalState('none')} className="flex-1 py-3 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] transition-colors font-semibold text-sm text-[var(--text-primary)]">Cancel</button>
                    <button onClick={handleBlockUser} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-semibold text-sm disabled:opacity-50 flex justify-center items-center">
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Block'}
                    </button>
                  </div>
                </>
              )}
              {modalState === 'report' && (
                <>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500"><ShieldAlert size={24} /></div>
                  <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Report {otherName}?</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">Flag this user for inappropriate behavior. Our team will review the chat history.</p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setModalState('none')} className="flex-1 py-3 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] transition-colors font-semibold text-sm text-[var(--text-primary)]">Cancel</button>
                    <button onClick={handleReportUser} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-semibold text-sm disabled:opacity-50 flex justify-center items-center">
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Report'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
