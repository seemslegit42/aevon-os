
import { create } from 'zustand';
import type { FeedItem } from '@/components/dashboard/live-orchestration-feed-card-content';

interface LiveFeedState {
  feedItems: FeedItem[];
  initializeFeedItems: (items: FeedItem[]) => void;
  addFeedItem: (item: FeedItem) => void; // For agent interaction
}

export const useLiveFeedStore = create<LiveFeedState>((set, get) => ({
  feedItems: [],
  initializeFeedItems: (items) => set({ feedItems: items }),
  addFeedItem: (item) => set(state => ({ feedItems: [item, ...state.feedItems].slice(0, 50) })), // Keep last 50 items
}));
