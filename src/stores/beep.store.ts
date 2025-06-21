
"use client";

import { create } from 'zustand';
import { toast } from "@/hooks/use-toast";
import { generateBriefing } from '@/ai/flows/generate-briefing';

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
    const userPrompt = get().aiPrompt;
    if (!userPrompt.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a prompt for BEEP." });
      return;
    }

    set({ isAiLoading: true, aiResponse: null }); 

    try {
      const response = await generateBriefing({ prompt: userPrompt, systemSnapshotData: systemSnapshotData || 'Not available' });
      set({ aiResponse: response });
    } catch (error) {
      console.error("Error submitting prompt to BEEP:", error);
      let errorMessage = "Failed to get response from BEEP.";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      set({ aiResponse: `Error: ${errorMessage}` });
      toast({ variant: "destructive", title: "AI Error", description: errorMessage });
    } finally {
      set({ isAiLoading: false });
    }
  },
}));
