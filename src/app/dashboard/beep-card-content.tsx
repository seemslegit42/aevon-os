
"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Mic } from 'phosphor-react';
import { cn } from '@/lib/utils';
import BeepAvatar3D from './beep-avatar-3d';
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useTTS } from '@/hooks/use-tts';
import { useBeepChat } from '@/hooks/use-beep-chat';
import BeepToolCallDisplay from './beep-tool-call';
import { motion, AnimatePresence } from 'framer-motion';

const BeepCardContent: React.FC = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [inputNode, setInputNode] = useState<GainNode | null>(null);
  const [outputNode, setOutputNode] = useState<GainNode | null>(null);

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
    // Initialize audio context on user interaction to comply with browser policies
    document.addEventListener('click', initializeAudio, { once: true });
    return () => document.removeEventListener('click', initializeAudio);
  }, [initializeAudio]);
  
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
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
         viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth',
          });
      }
    }
    
    if (lastMessage?.role === 'assistant' && lastMessage.content && !isLoading && !lastMessage.tool_calls) {
      const plainTextContent = lastMessage.content.replace(/`+/g, '');
      playAudio(plainTextContent);
    }
  }, [messages, isLoading, lastMessage, playAudio]);

  const isProcessing = isLoading || isTranscribing;

  return (
    <div className="h-full flex flex-col p-0 bg-background/20 overflow-hidden">
      <div className="relative w-full aspect-video flex-shrink-0">
          <BeepAvatar3D 
              inputNode={inputNode} 
              outputNode={outputNode}
          />
      </div>
      
      <div className="flex-shrink-0 flex justify-center items-center py-3">
         <Button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isProcessing || !inputNode} // Disable if audio is not ready
            className={cn(
              "h-12 w-32 rounded-full transition-all duration-200 ease-in-out shadow-2xl text-base font-semibold",
              isRecording ? "bg-destructive scale-105" : "btn-gradient-primary-accent",
              isProcessing && !isRecording ? "animate-pulse" : ""
            )}
          >
            {isRecording ? <span className="flex items-center gap-2"><Mic /></span> : 'Talk to BEEP'}
        </Button>
      </div>

      <div className="flex-grow min-h-0 px-2">
        <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
             <AnimatePresence>
              {messages.length > 0 ? (
                messages.map(m => {
                  if (m.role === 'tool') return null;

                  return (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="px-2"
                    >
                      {m.role === 'assistant' && m.tool_calls ? (
                        <div className="space-y-2">
                          {m.tool_calls.map(toolCall => (
                            <BeepToolCallDisplay
                              key={toolCall.toolCallId}
                              toolCall={toolCall}
                              allMessages={messages}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : '')}>
                          {m.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                          )}
                          <div className={cn(
                            "p-3 rounded-lg max-w-sm whitespace-pre-wrap text-sm shadow-md",
                            m.role === 'user' 
                              ? 'btn-gradient-primary-accent text-primary-foreground' 
                              : 'glassmorphism-panel border-none bg-card/70 text-foreground'
                          )}>
                            {m.content}
                          </div>
                          {m.role === 'user' && <User className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center"
                >
                    <p className="text-sm p-4">This is BEEP, your AI co-pilot. Hold the button to speak, or type a command in the top bar to automate tasks, get insights, and manage your workspace.</p>
                </motion.div>
              )}
               {isLoading && lastMessage?.role === 'user' && (
                <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 px-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                  <div className="p-3 rounded-lg glassmorphism-panel border-none bg-card/70 text-foreground text-sm">...</div>
                </motion.div>
              )}
             {isTranscribing && (
               <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 justify-end px-2">
                <div className="p-3 rounded-lg glassmorphism-panel border-none bg-card/70 text-foreground text-sm">... transcribing</div>
                <User className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BeepCardContent;
