"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useTTS } from '@/hooks/use-tts';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { useAvatarTelemetry } from '@/hooks/use-avatar-telemetry';
import { useAgentConfigStore } from '@/stores/agent-config.store';
import { getIdleQuip, getToolSuccessQuip, getToolErrorQuip } from '@/lib/humor-module';
import eventBus from '@/lib/event-bus';
import type { AvatarState } from '@/types/dashboard';
import type { Position } from 'react-rnd';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmotionFromTextByKeywords } from '@/lib/sentiment-parser.shared';
import { BeepEmotion } from '@/types/loom';

const BeepAvatar3D = dynamic(() => import('@/components/beep/beep-avatar-3d'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-full" />,
});


const FloatingBeepAvatar: React.FC = () => {
  const { toast } = useToast();
  const { logEvent } = useAvatarTelemetry();
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [inputNode, setInputNode] = useState<GainNode | null>(null);
  const [outputNode, setOutputNode] = useState<GainNode | null>(null);
  const stateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { avatarState, setAvatarState, append, isLoading } = useBeepChatStore();
  const isProcessing = useBeepChatStore(state => state.isLoading);
  const { isHumorEnabled, humorFrequency, isWhisperModeEnabled, toggleWhisperMode } = useAgentConfigStore();

  const [isMounted, setIsMounted] = useState(false);
  const [rndBounds, setRndBounds] = useState({ width: 180, height: 180, x: 5000, y: 5000 });
  const lastNormalBounds = useRef({ width: 180, height: 180, x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const initialBounds = {
        width: 180,
        height: 180,
        x: window.innerWidth - 220,
        y: window.innerHeight - 220,
    };
    setRndBounds(initialBounds);
    lastNormalBounds.current = initialBounds;
  }, []);

  const updateBounds = (newBounds: { width: number, height: number, x: number, y: number }) => {
    setRndBounds(newBounds);
    if (!isWhisperModeEnabled) {
        lastNormalBounds.current = newBounds;
    }
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    updateBounds({ ...rndBounds, x: d.x, y: d.y });
  };

  const handleResizeStop = (e: any, dir: any, ref: HTMLElement, delta: any, pos: Position) => {
      updateBounds({
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          ...pos,
      });
  };

  useEffect(() => {
    if (!isMounted) return;

    if (isWhisperModeEnabled) {
        // Entering whisper mode, shrink and move to corner
        setRndBounds({
            width: 100,
            height: 100,
            x: window.innerWidth - 120,
            y: window.innerHeight - 120,
        });
    } else {
        // Exiting whisper mode, restore last known normal position
        setRndBounds(lastNormalBounds.current);
    }
  }, [isWhisperModeEnabled, isMounted]);

  useEffect(() => {
      if (outputNode) {
          outputNode.gain.value = isWhisperModeEnabled ? 0.4 : 1.0;
      }
  }, [isWhisperModeEnabled, outputNode]);


  const initializeAudio = useCallback(() => {
    if (audioContext) return;
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        setAudioContext(context);
        const inputGain = context.createGain();
        const outputGain = context.createGain();
        outputGain.connect(context.destination);
        setInputNode(inputGain);
        setOutputNode(outputGain);
    } catch (e) {
        toast({ variant: "destructive", title: "Audio Error", description: "Browser does not support Web Audio API." });
    }
  }, [toast, audioContext]);

  useEffect(() => {
    document.addEventListener('click', initializeAudio, { once: true });
    return () => document.removeEventListener('click', initializeAudio);
  }, [initializeAudio]);

  const { playAudio, isSpeaking } = useTTS({ outputNode });
  const { isRecording, isTranscribing, startRecording, stopRecording } = useAudioRecorder({ 
    onTranscriptionComplete: (text) => {
      append({ role: 'user', content: text });
    },
    inputNode,
  });

  const isBusy = isLoading || isSpeaking || isRecording || isTranscribing;
  
  const setAndLogAvatarState = useCallback((state: AvatarState, metadata?: Record<string, any>) => {
    setAvatarState(state);
    logEvent('avatarStateChange', { emotionSignature: state, metadata });
  }, [setAvatarState, logEvent]);

  const setTemporaryState = useCallback((state: AvatarState, duration: number, metadata?: Record<string, any>) => {
    setAndLogAvatarState(state, metadata);
    if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    stateTimeoutRef.current = setTimeout(() => {
        const nextState = isLoading ? 'thinking' : 'idle';
        setAndLogAvatarState(nextState);
    }, duration);
  }, [isLoading, setAndLogAvatarState]);

  useEffect(() => {
    if (stateTimeoutRef.current) return;
    let newState: AvatarState;
    if (isRecording) {
      newState = 'listening';
    } else if (isSpeaking) {
      // The speaking state is now set by the provider, so we don't need to default it here.
      // If we are speaking, we just maintain the current speaking_* state.
      if (avatarState.startsWith('speaking_')) return;
      newState = 'speaking_neutral'; // Fallback if somehow isSpeaking is true but state is not.
    } else if (isLoading || isTranscribing) {
      newState = 'thinking';
    } else {
      newState = 'idle';
    }
    if (avatarState !== newState) {
      setAndLogAvatarState(newState);
    }
  }, [isRecording, isSpeaking, isLoading, isTranscribing, setAndLogAvatarState, avatarState]);

  useEffect(() => {
    const lastMessage = useBeepChatStore.getState().messages.slice(-1)[0];
    if (lastMessage?.role === 'assistant' && lastMessage.tool_calls) {
        setTemporaryState('tool_call', 1500, { messageId: lastMessage.id });
    }
  }, [useBeepChatStore.getState().messages, setTemporaryState]);
  
   useEffect(() => {
    const handleSetEmotion = (emotion: BeepEmotion) => {
      const state: AvatarState = `speaking_${emotion}`;
      setTemporaryState(state, 5000, { reason: 'Loom node override' });
    }
    eventBus.on('beep:setEmotion', handleSetEmotion);

    return () => {
        eventBus.off('beep:setEmotion', handleSetEmotion);
        if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    };
  }, [setTemporaryState]);

  useEffect(() => {
    // This effect now ONLY listens for the signal to play audio.
    // The emotional state is set by the BeepChatProvider via the store.
    const handlePlayResponse = (text: string) => {
      playAudio(text);
    };
    eventBus.on('beep:response', handlePlayResponse);
    return () => {
      eventBus.off('beep:response', handlePlayResponse);
    };
  }, [playAudio]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isHumorEnabled && !isBusy) {
        const idleTimeout = humorFrequency === 'high' ? 20000 : humorFrequency === 'medium' ? 45000 : 90000;
        idleTimerRef.current = setTimeout(() => {
            if (useAgentConfigStore.getState().isWhisperModeEnabled) {
                const quip = getIdleQuip(humorFrequency);
                if (quip) {
                    const emotion = getEmotionFromTextByKeywords(quip);
                    setAndLogAvatarState(emotion);
                    playAudio(quip);
                }
            }
        }, idleTimeout);
    }
  }, [isHumorEnabled, isBusy, humorFrequency, playAudio, setAndLogAvatarState]);

  useEffect(() => {
      resetIdleTimer();
      return () => {
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      }
  }, [resetIdleTimer]);

  useEffect(() => {
    const handleToolSuccess = ({ toolName }: { toolName: string }) => {
        if (isHumorEnabled && !isBusy) {
            const quip = getToolSuccessQuip(humorFrequency);
            if (quip) {
                const emotion = getEmotionFromTextByKeywords(quip);
                setAndLogAvatarState(emotion);
                playAudio(quip);
            }
        }
    };

    const handleToolError = ({ toolName }: { toolName: string }) => {
        if (isHumorEnabled && !isBusy) {
            const quip = getToolErrorQuip(humorFrequency);
            if (quip) {
                const emotion = getEmotionFromTextByKeywords(quip);
                setAndLogAvatarState(emotion);
                playAudio(quip);
            }
        }
    };

    eventBus.on('tool:success', handleToolSuccess);
    eventBus.on('tool:error', handleToolError);

    return () => {
        eventBus.off('tool:success', handleToolSuccess);
        eventBus.off('tool:error', handleToolError);
    };
  }, [isHumorEnabled, isBusy, humorFrequency, playAudio, setAndLogAvatarState]);


  if (!isMounted) {
      return null; // Don't render on server or until mounted
  }

  return (
    <Rnd
      size={{ width: rndBounds.width, height: rndBounds.height }}
      position={{ x: rndBounds.x, y: rndBounds.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={100}
      minHeight={100}
      maxWidth={300}
      maxHeight={300}
      bounds="window"
      className="z-[100] group"
    >
      <div className="relative w-full h-full rounded-full cursor-grab active:cursor-grabbing focus:outline-none">
        <BeepAvatar3D
          inputNode={inputNode}
          outputNode={outputNode}
          avatarState={avatarState}
          isWhisperModeEnabled={isWhisperModeEnabled}
        />
        <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
           <Button
              onClick={toggleWhisperMode}
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full transition-all duration-200 ease-in-out shadow-lg bg-card/60 hover:bg-primary/10",
                isWhisperModeEnabled && "border-accent text-accent"
              )}
           >
              {isWhisperModeEnabled ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
           </Button>
           <Button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isProcessing || !inputNode}
              className={cn(
                "h-14 w-14 rounded-full transition-all duration-200 ease-in-out shadow-2xl",
                isRecording ? "bg-destructive scale-110" : "btn-gradient-primary-accent",
                isProcessing && !isRecording ? "animate-pulse" : ""
              )}
          >
            <Mic className="w-7 h-7"/>
          </Button>
        </div>
      </div>
    </Rnd>
  );
};

export default FloatingBeepAvatar;
