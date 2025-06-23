
import { useRef, useCallback, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseTTSProps {
  outputNode?: GainNode | null;
}

export function useTTS({ outputNode }: UseTTSProps) {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ttsSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const localOutputNodeRef = useRef<GainNode | null>(null);

  const initializeLocalAudio = useCallback(() => {
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
        }
    }
  }, [outputNode]);

  useEffect(() => {
    initializeLocalAudio();
  }, [initializeLocalAudio]);

  const playAudio = useCallback(async (text: string) => {
    if (!outputNode && !localAudioContextRef.current) {
        initializeLocalAudio();
    }
    
    const targetOutputNode = outputNode || localOutputNodeRef.current;
    
    if (!targetOutputNode) {
        toast({ variant: "destructive", title: "Audio Error", description: "TTS audio context is not available." });
        return;
    }

    const audioContext = targetOutputNode.context as AudioContext;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    setIsSpeaking(true);
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
      source.onended = () => {
        setIsSpeaking(false);
      };

      ttsSourceNodeRef.current = source;
      
    } catch (error) {
      console.error("Error playing TTS audio:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to play AI response.";
      toast({ variant: "destructive", title: "Audio Error", description: errorMessage });
      setIsSpeaking(false);
    }
  }, [outputNode, toast, initializeLocalAudio]);

  return { playAudio, isSpeaking };
}
