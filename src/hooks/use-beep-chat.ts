
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { shallow } from 'zustand/shallow';

/**
 * A lightweight hook to access the global BEEP chat state from any component.
 * The actual chat logic is managed by the BeepChatProvider.
 */
export function useBeepChat() {
  const state = useBeepChatStore(s => ({
    messages: s.messages,
    append: s.append,
    isLoading: s.isLoading,
    error: s.error,
    setMessages: s.setMessages,
  }), shallow);
  
  return state;
}
