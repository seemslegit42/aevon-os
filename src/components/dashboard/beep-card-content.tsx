
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserIcon, MicIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import eventBus from '@/lib/event-bus';
import type { Message } from 'ai';
import { useToast } from '@/hooks/use-toast';
import BeepAvatar from './beep-avatar';

const BeepCardContent: React.FC = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/ai/chat',
    experimental_onToolCall: async (toolCalls, appendToolCallMessage) => {
      for (const toolCall of toolCalls) {
        if (toolCall.toolName === 'focusPanel') {
          const { cardId } = toolCall.args;
          eventBus.emit('panel:focus', cardId);
          appendToolCallMessage({
            toolCallId: toolCall.toolCallId,
            toolName: 'focusPanel',
            result: `Panel "${cardId}" has been brought into focus.`,
          });
        }
      }
    },
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
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
      <div className="relative w-full h-32 md:h-40 mb-2 flex-shrink-0">
        <BeepAvatar isThinking={isProcessing || isRecording} />
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
