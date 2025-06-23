import { useRef, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseTTSProps {
  // outputNode is now optional. The hook can manage its own context.
  outputNode?: GainNode | null;
}

export function useTTS({ outputNode }: UseTTSProps) {
  const { toast } = useToast();
  const ttsSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  // These refs will manage the hook's own audio context if one isn't provided.
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const localOutputNodeRef = useRef<GainNode | null>(null);

  const initializeLocalAudio = useCallback(() => {
    // This function can only run on the client.
    // It initializes a local AudioContext if an external one wasn't provided.
    if (typeof window !== 'undefined' && !outputNode && !localAudioContextRef.current) {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const context = new AudioContext();
            localAudioContextRef.current = context;
            const gainNode = context.createGain();
            gainNode.connect(context.destination);
            localOutputNodeRef.current = gainNode;
        } catch (e) {
            console.error("Failed to create local AudioContext for TTS", e);
            // Don't toast here, as it might be noisy. Fail silently.
        }
    }
  }, [outputNode]);

  // Ensure local audio is initialized when the hook mounts.
  useEffect(() => {
    initializeLocalAudio();
  }, [initializeLocalAudio]);

  const playAudio = useCallback(async (text: string) => {
    // Ensure we have an audio context to work with, initializing if needed.
    if (!outputNode && !localAudioContextRef.current) {
        initializeLocalAudio();
    }
    
    const targetOutputNode = outputNode || localOutputNodeRef.current;
    
    if (!targetOutputNode) {
        // Can't proceed without an audio context.
        toast({ variant: "destructive", title: "Audio Error", description: "TTS audio context is not available." });
        return;
    }

    const audioContext = targetOutputNode.context as AudioContext;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `TTS request failed with status ${response.status}`);
      }
      
      const audioData = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      
      if (ttsSourceNodeRef.current) {
        ttsSourceNodeRef.current.stop();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(targetOutputNode);
      source.start(0);

      ttsSourceNodeRef.current = source;
      
    } catch (error) {
      console.error("Error playing TTS audio:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to play AI response.";
      toast({ variant: "destructive", title: "Audio Error", description: errorMessage });
    }
  }, [outputNode, toast, initializeLocalAudio]);

  return { playAudio };
}
