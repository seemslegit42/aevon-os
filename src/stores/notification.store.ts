
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
  id: string;
  task: string;
  status: 'success' | 'failure';
  details: string;
  time: string;
  read: boolean;
  targetId?: string;
}

interface NotificationStoreState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (logData: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NOTIFICATION_STORAGE_KEY = 'aevon_notifications_v1';
const MAX_NOTIFICATIONS = 50;

export const useNotificationStore = create<NotificationStoreState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (logData) => {
        const newNotification: Notification = {
          ...logData,
          id: crypto.randomUUID(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, MAX_NOTIFICATIONS),
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        const notification = get().notifications.find(n => n.id === id);
        if (notification && !notification.read) {
          set(state => ({
            notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        }
      },

      markAllAsRead: () => {
        set(state => ({
            notifications: state.notifications.map(n => ({...n, read: true})),
            unreadCount: 0,
        }));
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: NOTIFICATION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            const rehydratedUnreadCount = state.notifications.filter(n => !n.read).length;
            state.unreadCount = rehydratedUnreadCount;
        }
      }
    }
  )
);
