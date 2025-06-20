
import { create } from 'zustand';
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
    const userPrompt = get().aiPrompt;
    if (!userPrompt.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a prompt for the AI assistant." });
      return;
    }

    set({ isAiLoading: true, aiResponse: "" }); // Initialize aiResponse to empty string for streaming

    try {
      const response = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, systemSnapshotData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        set((state) => ({ aiResponse: (state.aiResponse || "") + chunk }));
      }
    } catch (error) {
      console.error("Error submitting prompt to AI assistant:", error);
      let errorMessage = "Failed to get response from AI assistant.";
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
