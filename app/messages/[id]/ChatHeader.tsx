'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Bell, BellOff, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleMute, deleteConversation, markConversationAsRead } from '@/app/actions/messages';

export default function ChatHeader({ 
  conversationId, 
  otherName, 
  otherInitial, 
  initialIsMuted 
}: { 
  conversationId: string;
  otherName: string;
  otherInitial: string;
  initialIsMuted: boolean;
}) {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    markConversationAsRead(conversationId);
  }, [conversationId]);

  const handleToggleMute = async () => {
    setIsLoading(true);
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    await toggleMute(conversationId, newMutedState);
    setIsLoading(false);
    setMenuOpen(false);
  };

  const handleDeleteChat = async () => {
    if (confirm("Are you sure you want to delete this chat?")) {
      setIsLoading(true);
      const res = await deleteConversation(conversationId);
      if (res.success) {
        router.push('/messages');
      } else {
        setIsLoading(false);
        setMenuOpen(false);
        alert(res.error || "Failed to delete chat.");
      }
    }
  };

  return (
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
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black font-orbitron" style={{ background: 'var(--neon-color)' }}>
            {otherInitial}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] bg-green-500" />
        </div>
        <div>
          <h2 className="font-semibold">{otherName}</h2>
          <p className="text-xs opacity-70 font-rajdhani flex items-center gap-1">
            Online {isMuted && <BellOff size={10} className="text-red-400" />}
          </p>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 overflow-hidden z-50 glass"
                style={{ background: 'rgba(20,20,20,0.95)' }}
              >
                <button
                  onClick={handleToggleMute}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  {isMuted ? (
                    <>
                      <Bell size={16} className="text-white" />
                      <span className="text-white">Unmute chat</span>
                    </>
                  ) : (
                    <>
                      <BellOff size={16} className="text-red-400" />
                      <span className="text-red-400">Mute notifications</span>
                    </>
                  )}
                </button>
                <div className="h-px w-full bg-white/10" />
                <button
                  onClick={handleDeleteChat}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-red-500/10 transition-colors group"
                >
                  <Trash2 size={16} className="text-red-500 group-hover:text-red-400" />
                  <span className="text-red-500 group-hover:text-red-400">Delete chat</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
