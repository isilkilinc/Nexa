'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, MessageCircle, User, Plus } from 'lucide-react';
import { AddPostModal } from './AddPostModal';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (pathname === '/signup') return null;

  const NAV_ITEMS = [
    { id: 'home',     label: t('nav_home'),     icon: Home,          path: '/'         },
    { id: 'groups',   label: t('nav_groups'),   icon: Users,         path: '/groups'   },
    { id: 'add',      label: t('nav_post'),     icon: Plus,          path: '/add'      },
    { id: 'messages', label: t('nav_messages'), icon: MessageCircle, path: '/messages' },
    { id: 'profile',  label: t('nav_profile'),  icon: User,          path: '/profile'  },
  ];

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.id === 'add') {
      setAddModalOpen(true);
    } else {
      router.push(item.path);
    }
  };

  return (
    <>
      {/* Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
          className="glass-strong rounded-[28px] px-2 py-2 flex items-center gap-1"
          style={{
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px var(--glass-strong-border)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.id !== 'add' && (
              item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
            );
            const isAdd = item.id === 'add';

            if (isAdd) {
              return (
                <div key={item.id} className="flex-1 flex justify-center">
                  <motion.button
                    id="nav-add-post"
                    aria-label="Create new post"
                    onClick={() => setAddModalOpen(true)}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'var(--neon-color)',
                      boxShadow: '0 0 20px rgba(var(--neon-color-rgb), 0.7), 0 0 40px rgba(var(--neon-color-rgb), 0.3)',
                      marginTop: '-20px',
                    }}
                  >
                    {/* Animated ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        border: '2px solid var(--neon-color)',
                        boxShadow: '0 0 16px rgba(var(--neon-color-rgb), 0.6)',
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <Plus size={24} color="#000" strokeWidth={2.5} />
                  </motion.button>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                aria-label={item.label}
                onClick={() => handleNavClick(item)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-2xl relative group"
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'rgba(var(--neon-color-rgb), 0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}

                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                  color: isActive ? 'var(--neon-color)' : 'var(--nav-icon-inactive)',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(var(--neon-color-rgb), 0.8))' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
                <span
                  className="text-[10px] font-medium font-rajdhani tracking-wide leading-none"
                  style={{
                    color: isActive ? 'var(--neon-color)' : 'var(--nav-label-inactive)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.label}
                </span>

                {/* Unread dot for messages */}
                {item.id === 'messages' && (
                  <span
                    className="absolute top-2 right-4 w-2 h-2 rounded-full bg-red-500"
                    style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }}
                  />
                )}
              </button>
            );
          })}
        </motion.nav>
      </div>

      {/* Add Post Modal */}
      <AnimatePresence>
        {addModalOpen && <AddPostModal onClose={() => setAddModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
