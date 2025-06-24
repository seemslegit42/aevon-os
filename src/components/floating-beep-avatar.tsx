"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { Mic } from 'phosphor-react';
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
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmotionFromText } from '@/lib/sentiment-parser';
import { BeepEmotion } from '@/types/loom';

const BeepAvatar3D = dynamic(() => import('@/app/dashboard/beep-avatar-3d'), {
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

  // Get state and actions from the global store
  const { avatarState, setAvatarState, append, isLoading, lastMessage } = useBeepChatStore();
  const isProcessing = useBeepChatStore(state => state.isLoading);
  const { isHumorEnabled, humorFrequency } = useAgentConfigStore();

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
      if (avatarState.startsWith('speaking_')) return;
      newState = 'speaking_neutral';
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
      if (lastMessage?.role === 'assistant' && lastMessage.tool_calls) {
          setTemporaryState('tool_call', 1500, { messageId: lastMessage.id });
      }
  }, [lastMessage, setTemporaryState]);
  
   useEffect(() => {
    const handleSecurityAlert = (details: string) => {
        setTemporaryState('security_alert', 5000, { details });
    };
    eventBus.on('aegis:new-alert', handleSecurityAlert);
    
    const handleSetEmotion = (emotion: BeepEmotion) => {
      const state: AvatarState = `speaking_${emotion}`;
      setTemporaryState(state, 5000, { reason: 'Loom node override' });
    }
    eventBus.on('beep:setEmotion', handleSetEmotion);

    return () => {
        eventBus.off('aegis:new-alert', handleSecurityAlert);
        eventBus.off('beep:setEmotion', handleSetEmotion);
        if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    };
  }, [setTemporaryState]);

  useEffect(() => {
    if (lastMessage?.role === 'assistant' && lastMessage.content && !isLoading && !lastMessage.tool_calls) {
      const plainTextContent = lastMessage.content.replace(/`+/g, '');
      const emotion = getEmotionFromText(plainTextContent);
      setAndLogAvatarState(emotion);
      playAudio(plainTextContent);
    }
  }, [lastMessage, isLoading, playAudio, setAndLogAvatarState]);

  // --- Humor Module Integration ---
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isHumorEnabled && !isBusy) {
        const idleTimeout = humorFrequency === 'high' ? 20000 : humorFrequency === 'medium' ? 45000 : 90000;
        idleTimerRef.current = setTimeout(() => {
            const quip = getIdleQuip(humorFrequency);
            if (quip) {
                const emotion = getEmotionFromText(quip);
                setAndLogAvatarState(emotion);
                playAudio(quip);
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


  // Event-based quip logic
  useEffect(() => {
    const handleToolSuccess = ({ toolName }: { toolName: string }) => {
        if (isHumorEnabled && !isBusy) {
            const quip = getToolSuccessQuip(humorFrequency);
            if (quip) {
                // Add a small delay to not talk over the agent's main response
                setTimeout(() => {
                    const emotion = getEmotionFromText(quip);
                    setAndLogAvatarState(emotion);
                    playAudio(quip);
                }, 750);
            }
        }
    };

    const handleToolError = ({ toolName }: { toolName: string }) => {
        if (isHumorEnabled && !isBusy) {
            const quip = getToolErrorQuip(humorFrequency);
            if (quip) {
                setTimeout(() => {
                    const emotion = getEmotionFromText(quip);
                    setAndLogAvatarState(emotion);
                    playAudio(quip)
                }, 750);
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
  // --- End Humor Module ---


  return (
    <Rnd
      default={{
        x: (typeof window !== 'undefined' ? window.innerWidth : 1024) - 220,
        y: (typeof window !== 'undefined' ? window.innerHeight : 768) - 220,
        width: 180,
        height: 180,
      }}
      bounds="window"
      enableResizing={false}
      className="z-[100] group"
    >
      <div className="relative w-full h-full rounded-full cursor-grab active:cursor-grabbing focus:outline-none">
        <BeepAvatar3D
          inputNode={inputNode}
          outputNode={outputNode}
          avatarState={avatarState}
        />
        <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
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
