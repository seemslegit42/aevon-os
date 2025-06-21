
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserIcon, MicIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import eventBus from '@/lib/event-bus';
import { useToast } from '@/hooks/use-toast';
import BeepAvatar3D from './beep-avatar-3d';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';

const BeepCardContent: React.FC = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Audio nodes for visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<GainNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const micSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const ttsSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize audio context and nodes
  useEffect(() => {
    if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const context = new AudioContext();
            audioContextRef.current = context;
            inputNodeRef.current = context.createGain();
            outputNodeRef.current = context.createGain();
            // Connect output node to destination to hear TTS
            outputNodeRef.current.connect(context.destination);
        } else {
             toast({ variant: "destructive", title: "Audio Error", description: "Browser does not support Web Audio API." });
        }
    }
  }, [toast]);


  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/ai/chat',
    experimental_onToolCall: async (toolCalls, appendToolCallMessage) => {
      let hasHandledTool = false;

      for (const toolCall of toolCalls) {
        let resultMessage = `Tool ${toolCall.toolName} called successfully.`;
        hasHandledTool = true;

        switch (toolCall.toolName) {
            case 'focusItem': {
                const { itemId } = toolCall.args;
                const isApp = ALL_MICRO_APPS.some(app => app.id === itemId);
                if (isApp) {
                    eventBus.emit('app:focusLatest', itemId);
                } else {
                    eventBus.emit('panel:focus', itemId);
                }
                resultMessage = `Item "${itemId}" has been brought into focus.`;
                break;
            }
            case 'addItem': {
                const { itemId } = toolCall.args;
                const appToAdd = ALL_MICRO_APPS.find(app => app.id === itemId);
                if (appToAdd) {
                    eventBus.emit('app:launch', appToAdd);
                    resultMessage = `Launched Micro-App "${appToAdd.title}".`;
                } else {
                    eventBus.emit('panel:add', itemId);
                    const card = ALL_CARD_CONFIGS.find(c => c.id === itemId);
                    resultMessage = `Added Panel "${card?.title || itemId}".`;
                }
                break;
            }
            case 'removeItem': {
                const { itemId } = toolCall.args;
                const isApp = ALL_MICRO_APPS.some(app => app.id === itemId);
                if (isApp) {
                    eventBus.emit('app:closeAll', itemId);
                    resultMessage = `Closing all instances of "${itemId}".`;
                } else {
                    eventBus.emit('panel:remove', itemId);
                    resultMessage = `Removed Panel "${itemId}".`;
                }
                break;
            }
            case 'resetLayout': {
                eventBus.emit('layout:reset');
                resultMessage = `The workspace layout has been reset to default.`;
                break;
            }
            default:
                resultMessage = `Tool ${toolCall.toolName} not implemented.`;
        }

        appendToolCallMessage({
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            result: resultMessage,
        });
      }
      return hasHandledTool;
    },
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages[messages.length - 1];

  const playAudio = async (text: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (!audioContextRef.current || !outputNodeRef.current) return;

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
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNodeRef.current);
      source.start(0);

      ttsSourceNodeRef.current = source;
      
    } catch (error) {
      console.error("Error playing TTS audio:", error);
      toast({ variant: "destructive", title: "Audio Error", description: "Failed to play AI response." });
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    
    if (lastMessage?.role === 'assistant' && lastMessage.content && !isLoading) {
      const plainTextContent = lastMessage.content.replace(/`+/g, '');
      playAudio(plainTextContent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading]); // Rerun on messages change

  useEffect(() => {
    const handleQuerySubmit = (query: string) => {
      if (query) {
        append({ role: 'user', content: query });
      }
    };
    eventBus.on('beep:submitQuery', handleQuerySubmit);
    return () => {
      eventBus.off('beep:submitQuery', handleQuerySubmit);
    };
  }, [append]);

  const startRecording = async () => {
    if (!audioContextRef.current || !inputNodeRef.current) {
        toast({ variant: "destructive", title: "Audio Error", description: "Audio context not initialized." });
        return;
    }

    try {
      await audioContextRef.current.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect mic stream to input node for visualization
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(inputNodeRef.current);
      micSourceNodeRef.current = source;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        micSourceNodeRef.current?.disconnect();
        micSourceNodeRef.current = null;
        handleTranscription(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({ variant: "destructive", title: "Microphone Error", description: "Could not access microphone." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }

      const { text } = await response.json();
      if (text) {
        append({ role: 'user', content: text });
      } else {
        toast({ variant: "destructive", title: "Transcription Failed", description: "Could not understand audio. Please try again." });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      let errorMessage = "Failed to transcribe audio.";
      if (error instanceof Error) errorMessage = error.message;
      toast({ variant: "destructive", title: "Transcription Error", description: errorMessage });
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const isProcessing = isLoading || isTranscribing;

  return (
    <div className="flex flex-col h-full p-1">
      <div className="relative w-full h-40 md:h-56 mb-2 flex-shrink-0">
        <BeepAvatar3D 
            inputNode={inputNodeRef.current} 
            outputNode={outputNodeRef.current}
            isThinking={isProcessing || isRecording} 
        />
      </div>

      <div className="flex-grow mb-2 min-h-0">
        <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map(m => {
                if (m.role === 'tool') return null;
                return (
                  <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : '')}>
                    {m.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                    )}
                    <div className={cn(
                      "p-3 rounded-lg max-w-sm whitespace-pre-wrap text-sm",
                      m.role === 'user' ? 'btn-gradient-primary-accent text-primary-foreground' : 'bg-muted/50 text-foreground'
                    )}>
                      {m.content}
                    </div>
                    {m.role === 'user' && <UserIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                  </div>
                )
              })
            ) : (
              <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
                <p className="text-sm">Hold the button to talk to BEEP.</p>
              </div>
            )}
            {isProcessing && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                <div className="p-3 rounded-lg bg-muted/50 text-foreground text-sm">...</div>
              </div>
            )}
             {isTranscribing && (
               <div className="flex items-start gap-3 justify-end">
                <div className="p-3 rounded-lg bg-primary/50 text-foreground text-sm">... transcribing</div>
                <UserIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 flex justify-center items-center pt-2">
         <Button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isProcessing}
            className={cn(
              "h-16 w-16 rounded-full transition-all duration-200 ease-in-out",
              isRecording ? "bg-destructive scale-110" : "btn-gradient-primary-accent",
              isProcessing && !isRecording ? "animate-pulse" : ""
            )}
          >
            <MicIcon className="w-8 h-8" />
            <span className="sr-only">Hold to talk</span>
        </Button>
      </div>
    </div>
  );
};

export default BeepCardContent;
