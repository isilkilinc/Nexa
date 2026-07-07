'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { LFGPost, Message, MOCK_MESSAGES } from '@/lib/mockData';

export interface ChatMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
  time: string;
}

export interface Conversation extends Message {
  history: ChatMessage[];
}

export type RequestStatus = 'none' | 'requested' | 'accepted';

interface SocialContextValue {
  conversations: Conversation[];
  getRequestStatus: (postId: string) => RequestStatus;
  sendJoinRequest: (post: LFGPost) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

const SocialContext = createContext<SocialContextValue | undefined>(undefined);

const INITIAL_CONVERSATIONS: Conversation[] = MOCK_MESSAGES.map(m => ({
  ...m,
  history: [
    { id: 1, from: 'them', text: m.lastMessage, time: m.timestamp },
  ],
}));

export function SocialProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [requests, setRequests] = useState<Record<string, RequestStatus>>({});

  const getRequestStatus = useCallback((postId: string) => {
    return requests[postId] || 'none';
  }, [requests]);

  const sendJoinRequest = useCallback((post: LFGPost) => {
    if (requests[post.id]) return;

    // Set status to requested immediately
    setRequests(prev => ({ ...prev, [post.id]: 'requested' }));

    // Simulate owner accepting after 3 seconds
    setTimeout(() => {
      setRequests(prev => ({ ...prev, [post.id]: 'accepted' }));
      
      setConversations(prev => {
        // If we already have a conversation with this user, just add a message
        const existing = prev.find(c => c.user.id === post.user.id);
        const autoReplyMsg = `Hey! I accepted your request for ${post.game}. Ready to play?`;

        if (existing) {
          // Remove old instance to bump to top
          const filtered = prev.filter(c => c.id !== existing.id);
          const updated: Conversation = { 
            ...existing, 
            unread: existing.unread + 1, 
            lastMessage: autoReplyMsg, 
            timestamp: 'Now',
            history: [
              ...existing.history, 
              { id: Date.now(), from: 'them', text: autoReplyMsg, time: 'Now' }
            ] 
          };
          return [updated, ...filtered];
        }

        // Otherwise create a new conversation
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          user: post.user,
          lastMessage: autoReplyMsg,
          timestamp: 'Now',
          unread: 1,
          history: [
            { id: Date.now(), from: 'them', text: autoReplyMsg, time: 'Now' }
          ]
        };
        return [newConv, ...prev];
      });
    }, 3000);
  }, [requests]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          timestamp: 'Now',
          history: [...c.history, { id: Date.now(), from: 'me', text, time: 'Now' }]
        };
      }
      return c;
    }));
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c));
  }, []);

  return (
    <SocialContext.Provider value={{ conversations, getRequestStatus, sendJoinRequest, sendMessage, markAsRead }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
}
