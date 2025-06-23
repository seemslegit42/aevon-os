
import { useRef, useCallback, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAvatarTelemetry } from '@/hooks/use-avatar-telemetry';
import type { AvatarState } from '@/types/dashboard';

interface UseTTSProps {
  outputNode?: GainNode | null;
}

// This utility function is a simplified version of the one in the TTS API route.
// It helps predict the emotion on the client-side for immediate logging.
function getEmotionFromTextForLogging(text: string): AvatarState {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('security alert') || lowerText.includes('threat detected')) {
        return 'security_alert';
    }
    if (lowerText.startsWith('analyzing') || lowerText.startsWith('generating insights')) {
        return 'thinking';
    }
    if (lowerText.startsWith('done.') || lowerText.startsWith('okay, i have') || lowerText.startsWith('alright,')) {
        return 'tool_call';
    }
    return 'speaking'; // Neutral/default state
}


export function useTTS({ outputNode }: UseTTSProps) {
  const { toast } = useToast();
  const { logEvent } = useAvatarTelemetry();
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
    
    // Log the intended emotion before making the API call
    const predictedEmotion = getEmotionFromTextForLogging(text);
    logEvent('ttsEmotionSet', {
      emotionSignature: predictedEmotion,
      metadata: { details: `Requesting TTS with predicted tone: ${predictedEmotion}` }
    });

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
  }, [outputNode, toast, initializeLocalAudio, logEvent]);

  return { playAudio, isSpeaking };
}

    