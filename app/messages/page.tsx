'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, ArrowLeft, MoreVertical, Phone } from 'lucide-react';
import { useSocial } from '@/app/providers/SocialProvider';

function Avatar({ username, size = 'md' }: { username: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-9 h-9 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-11 h-11 text-sm';
  const colors = ['#a855f7', '#06b6d4', '#ec4899', '#22c55e', '#f97316', '#eab308'];
  const color = colors[username.charCodeAt(0) % colors.length];
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-bold text-black font-orbitron flex-shrink-0`}
      style={{ background: color, boxShadow: `0 0 10px ${color}70` }}
    >
      {username[0].toUpperCase()}
    </div>
  );
}

export default function MessagesPage() {
  const { conversations, sendMessage, markAsRead } = useSocial();
  const [search, setSearch] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showToxicWarning, setShowToxicWarning] = useState(false);

  const activeChat = conversations.find(c => c.id === activeChatId) || null;

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatId) return;

    const toxicWords = ['noob', 'toxic', 'küfür'];
    const isToxic = toxicWords.some(word => messageInput.toLowerCase().includes(word));
    
    if (isToxic) {
      setShowToxicWarning(true);
      setTimeout(() => setShowToxicWarning(false), 3000);
      return;
    }

    sendMessage(activeChatId, messageInput.trim());
    setMessageInput('');
  };

  const handleOpenChat = (id: string) => {
    setActiveChatId(id);
    markAsRead(id);
  };

  const filtered = conversations.filter(m =>
    !search || m.user.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatePresence>
        {showToxicWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
          >
            <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 w-full max-w-sm" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(0,0,0,0.8)' }}>
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-semibold text-red-400">Mesajınız AI tarafından uygunsuz bulundu.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeChat ? (
          /* ─── Inbox List ─── */
          <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            {/* Header */}
            <div
              className="sticky top-0 z-40 px-4 pt-12 pb-4"
              style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)', backdropFilter: 'blur(10px)' }}
            >
              <h1 className="font-orbitron font-black text-xl tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
                MESSAGES
              </h1>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="messages-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
                  style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
            </div>

            {/* Message List */}
            <div className="px-4 flex flex-col gap-2 pb-4">
              {filtered.map((msg, i) => (
                <motion.button
                  key={msg.id}
                  id={`chat-${msg.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleOpenChat(msg.id)}
                  className="glass glass-hover rounded-2xl p-3.5 flex items-center gap-3 text-left w-full relative overflow-hidden"
                >
                  <div className="relative">
                    <Avatar username={msg.user.username} />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] status-${msg.user.status}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: msg.unread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {msg.user.displayName}
                      </p>
                      <p className="text-xs" style={{ color: msg.unread > 0 ? 'var(--neon-color)' : 'var(--text-muted)' }}>{msg.timestamp}</p>
                    </div>
                    <p className="text-xs truncate font-rajdhani" style={{ color: msg.unread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: msg.unread > 0 ? 600 : 400 }}>
                      {msg.lastMessage}
                    </p>
                  </div>
                  {msg.unread > 0 && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0"
                      style={{ background: 'var(--neon-color)', boxShadow: '0 0 12px rgba(var(--neon-color-rgb), 0.8)' }}
                    >
                      {msg.unread}
                    </div>
                  )}
                  {msg.unread > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'var(--neon-color)' }} />
                  )}
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center mt-10 text-sm" style={{ color: 'var(--text-muted)' }}>No conversations found.</p>
              )}
            </div>
          </motion.div>
        ) : (
          /* ─── Chat View ─── */
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="flex flex-col h-screen"
          >
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-4 pt-12 pb-3 sticky top-0 z-40"
              style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 60%, transparent)', backdropFilter: 'blur(10px)' }}
            >
              <button
                id="back-to-inbox"
                onClick={() => setActiveChatId(null)}
                className="w-9 h-9 glass rounded-full flex items-center justify-center glass-hover"
              >
                <ArrowLeft size={16} style={{ color: 'var(--text-primary)' }} />
              </button>
              <Avatar username={activeChat.user.username} size="sm" />
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {activeChat.user.displayName}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full status-${activeChat.user.status}`} />
                  <span className="text-xs capitalize" style={{ color: activeChat.user.status === 'online' ? '#22c55e' : 'var(--text-secondary)' }}>
                    {activeChat.user.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 glass rounded-full flex items-center justify-center glass-hover">
                  <Phone size={15} style={{ color: 'var(--text-secondary)' }} />
                </button>
                <button className="w-9 h-9 glass rounded-full flex items-center justify-center glass-hover">
                  <MoreVertical size={15} style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ paddingBottom: '80px' }}>
              {activeChat.history.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                    style={{
                      background: m.from === 'me'
                        ? 'var(--neon-color)'
                        : 'var(--glass-bg)',
                      color: m.from === 'me' ? '#000' : 'var(--text-primary)',
                      border: m.from === 'me' ? 'none' : '1px solid var(--glass-border)',
                      boxShadow: m.from === 'me' ? '0 0 12px rgba(var(--neon-color-rgb), 0.4)' : 'none',
                      borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}
                  >
                    {m.text}
                    <p
                      className="text-[10px] mt-1 font-rajdhani text-right"
                      style={{ opacity: 0.6 }}
                    >
                      {m.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div
              className="sticky bottom-20 px-4 pb-4 pt-2"
              style={{ background: 'linear-gradient(to top, var(--bg-primary) 70%, transparent)' }}
            >
              <div className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5"
                style={{ border: '1px solid rgba(var(--neon-color-rgb), 0.3)' }}
              >
                <input
                  id="chat-input"
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  id="send-message-btn"
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: messageInput.trim() ? 'var(--neon-color)' : 'rgba(var(--text-primary), 0.08)',
                    boxShadow: messageInput.trim() ? '0 0 10px rgba(var(--neon-color-rgb), 0.5)' : 'none',
                  }}
                >
                  <Send size={14} color={messageInput.trim() ? '#000' : 'var(--text-muted)'} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
