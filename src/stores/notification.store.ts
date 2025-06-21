
import { create } from 'zustand';

export interface Notification {
  id: string;
  task: string;
  status: 'success' | 'failure';
  details: string;
  time: string;
  read: boolean;
}

interface NotificationStoreState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (logData: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const MAX_NOTIFICATIONS = 20;

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
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
    set(state => {
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        return {
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }
      return state;
    });
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
}));
