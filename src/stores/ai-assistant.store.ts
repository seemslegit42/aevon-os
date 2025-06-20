
import { create } from 'zustand';
import type { GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { generatePersonalizedBriefing } from '@/ai/flows/generate-personalized-briefings';
import { toast } from "@/hooks/use-toast";

interface AiAssistantState {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  aiResponse: string | null;
  isAiLoading: boolean;
  setIsAiLoading: (loading: boolean) => void;
  submitPrompt: (systemSnapshotData?: string) => Promise<void>;
  clearResponse: () => void;
}

export const useAiAssistantStore = create<AiAssistantState>((set, get) => ({
  aiPrompt: '',
  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),
  aiResponse: null,
  isAiLoading: false,
  setIsAiLoading: (loading) => set({ isAiLoading: loading }),
  clearResponse: () => set({ aiResponse: null, aiPrompt: '' }),
  submitPrompt: async (systemSnapshotData) => {
    const prompt = get().aiPrompt;
    if (!prompt.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a prompt for the AI assistant." });
      return;
    }

    set({ isAiLoading: true, aiResponse: null });

    try {
      const input: GeneratePersonalizedBriefingInput = {
        userName: "Dashboard User", // This could be made dynamic in a more complex app
        operationalMetrics: systemSnapshotData || "No system data available.",
        relevantInformation: `User asked: "${prompt}". Provide a concise, helpful response.`,
      };
      const result = await generatePersonalizedBriefing(input);
      set({ aiResponse: result.briefing });
    } catch (error) {
      console.error("Error with AI Assistant:", error);
      set({ aiResponse: "Sorry, I encountered an error trying to respond. Please try again." });
      toast({ variant: "destructive", title: "AI Assistant Error", description: "Could not process your request." });
    } finally {
      set({ isAiLoading: false });
    }
  },
}));
