
import { create } from 'zustand';
import { toast } from "@/hooks/use-toast";

interface BeepState {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  aiResponse: string | null;
  isAiLoading: boolean;
  setIsAiLoading: (loading: boolean) => void;
  submitPrompt: (systemSnapshotData?: string) => Promise<void>;
  clearResponse: () => void;
}

export const useBeepStore = create<BeepState>((set, get) => ({
  aiPrompt: '',
  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),
  aiResponse: null,
  isAiLoading: false,
  setIsAiLoading: (loading) => set({ isAiLoading: loading }),
  clearResponse: () => set({ aiResponse: null, aiPrompt: '' }),
  submitPrompt: async (systemSnapshotData) => {
    const prompt = get().aiPrompt;
    if (!prompt.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a prompt for BEEP." });
      return;
    }

    set({ isAiLoading: true, aiResponse: null });

    // BEEP functionality is disabled.
    const featureUnavailableMessage = "BEEP feature is currently unavailable.";
    set({ aiResponse: featureUnavailableMessage });
    toast({ variant: "destructive", title: "Feature Unavailable", description: featureUnavailableMessage });
   
    set({ isAiLoading: false });
  },
}));
