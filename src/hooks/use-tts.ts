
import { useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseTTSProps {
  outputNode: GainNode | null;
}

export function useTTS({ outputNode }: UseTTSProps) {
  const { toast } = useToast();
  const ttsSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const playAudio = useCallback(async (text: string) => {
    if (!outputNode) return;
    const audioContext = outputNode.context as AudioContext;
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
        throw new Error(`TTS request failed with status ${response.status}`);
      }
      
      const audioData = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(audioData);
      
      if (ttsSourceNodeRef.current) {
        ttsSourceNodeRef.current.stop();
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNode);
      source.start(0);

      ttsSourceNodeRef.current = source;
      
    } catch (error) {
      console.error("Error playing TTS audio:", error);
      toast({ variant: "destructive", title: "Audio Error", description: "Failed to play AI response." });
    }
  }, [outputNode, toast]);

  return { playAudio };
}
