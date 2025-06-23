import { create } from 'zustand';
import type { Message } from 'ai';
import type { AvatarState } from '@/types/dashboard';

// This mirrors the state provided by the Vercel useChat hook
// and adds our custom avatarState
interface BeepChatState {
  messages: Message[];
  error: undefined | Error;
  isLoading: boolean;
  input: string;
  avatarState: AvatarState;
  setInput: (input: string) => void;
  setAvatarState: (state: AvatarState) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  append: (message: Message, options?: any) => Promise<string | null | undefined>;
  setMessages: (messages: Message[]) => void;
  reload: () => void;
  stop: () => void;
}

// We initialize with a dummy state. The BeepChatProvider will overwrite these
// with the real functions and state from the useChat hook.
export const useBeepChatStore = create<BeepChatState>((set) => ({
  messages: [],
  error: undefined,
  isLoading: false,
  input: '',
  avatarState: 'idle',
  setAvatarState: (state) => set({ avatarState: state }),
  setInput: () => { console.warn("BeepChatProvider not yet initialized"); },
  handleInputChange: () => { console.warn("BeepChatProvider not yet initialized"); },
  handleSubmit: () => { console.warn("BeepChatProvider not yet initialized"); },
  append: async () => { console.warn("BeepChatProvider not yet initialized"); return null; },
  setMessages: () => { console.warn("BeepChatProvider not yet initialized"); },
  reload: () => { console.warn("BeepChatProvider not yet initialized"); },
  stop: () => { console.warn("BeepChatProvider not yet initialized"); },
}));
