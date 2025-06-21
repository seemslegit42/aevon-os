
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserIcon, MicIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import eventBus from '@/lib/event-bus';
import BeepAvatar3D from './beep-avatar-3d';
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useTTS } from '@/hooks/use-tts';
import { useBeepChat } from '@/hooks/use-beep-chat';
import BeepToolCallDisplay from './beep-tool-call';

const BeepCardContent: React.FC = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Audio nodes for visualization
  const audioContextRef = useRef<AudioContext | null>(null);
  const [inputNode, setInputNode] = useState<GainNode | null>(null);
  const [outputNode, setOutputNode] = useState<GainNode | null>(null);

  // Initialize audio context and nodes
  useEffect(() => {
    if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            const context = new AudioContext();
            audioContextRef.current = context;
            const inputGain = context.createGain();
            const outputGain = context.createGain();
            outputGain.connect(context.destination);
            setInputNode(inputGain);
            setOutputNode(outputGain);
        } else {
             toast({ variant: "destructive", title: "Audio Error", description: "Browser does not support Web Audio API." });
        }
    }
  }, [toast]);
  
  const { messages, append, isLoading, lastMessage } = useBeepChat();
  const { playAudio } = useTTS({ outputNode });
  const { isRecording, isTranscribing, startRecording, stopRecording } = useAudioRecorder({ 
    onTranscriptionComplete: (text) => {
      append({ role: 'user', content: text });
    },
    inputNode,
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    
    // Check if the last message is from the assistant, contains text, and no tool calls are being processed.
    if (lastMessage?.role === 'assistant' && lastMessage.content && !isLoading && !lastMessage.tool_calls) {
      const plainTextContent = lastMessage.content.replace(/`+/g, '');
      playAudio(plainTextContent);
    }
  }, [messages, isLoading, lastMessage, playAudio]);

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

  const isProcessing = isLoading || isTranscribing;

  return (
    <div className="flex flex-col h-full p-1">
      <div className="relative w-full h-40 md:h-56 mb-2 flex-shrink-0">
        <BeepAvatar3D 
            inputNode={inputNode} 
            outputNode={outputNode}
        />
      </div>

      <div className="flex-grow mb-2 min-h-0">
        <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map(m => {
                // We don't render the raw tool result messages. Their data is used inside BeepToolCallDisplay.
                if (m.role === 'tool') {
                  return null;
                }

                if (m.role === 'assistant' && m.tool_calls) {
                  // This message is a container for tool calls. Render each tool call.
                  return (
                    <div key={m.id} className="space-y-2">
                      {m.tool_calls.map(toolCall => (
                        <BeepToolCallDisplay
                          key={toolCall.toolCallId}
                          toolCall={toolCall}
                          allMessages={messages}
                        />
                      ))}
                    </div>
                  );
                }

                // This is a regular text message from user or assistant.
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
                );
              })
            ) : (
              <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
                <p className="text-sm">Hold the button to talk to BEEP.</p>
              </div>
            )}
            {isLoading && lastMessage?.role === 'user' && (
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
