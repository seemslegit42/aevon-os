
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User } from 'phosphor-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import BeepToolCallDisplay from '@/components/beep/beep-tool-call';
import type { Message } from 'ai';

interface BeepChatHistoryProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
  isLoading: boolean;
  isTranscribing: boolean;
}

const BeepChatHistory: React.FC<BeepChatHistoryProps> = ({
  scrollAreaRef,
  messages,
  isLoading,
  isTranscribing,
}) => {
  const lastMessage = messages[messages.length - 1];
  return (
    <ScrollArea className="h-full p-2" ref={scrollAreaRef}>
      <div className="space-y-4 pb-4">
        <AnimatePresence>
          {messages.length > 0 ? (
            messages.map((m) => {
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
                      {m.tool_calls.map((toolCall) => (
                        <BeepToolCallDisplay
                          key={toolCall.toolCallId}
                          toolCall={toolCall}
                          allMessages={messages}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'flex items-start gap-3',
                        m.role === 'user' ? 'justify-end' : ''
                      )}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
                      )}
                      <div
                        className={cn(
                          'p-3 rounded-lg max-w-sm whitespace-pre-wrap text-sm shadow-md',
                          m.role === 'user'
                            ? 'btn-gradient-primary-accent text-primary-foreground'
                            : 'glassmorphism-panel border-none bg-card/70 text-foreground'
                        )}
                      >
                        {m.content}
                      </div>
                      {m.role === 'user' && (
                        <User className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      )}
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
              <p className="text-sm p-4">
                This is the chat history for BEEP. Interact with the floating
                avatar to start a conversation.
              </p>
            </motion.div>
          )}
          {isLoading && lastMessage?.role === 'user' && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 px-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0" />
              <div className="p-3 rounded-lg glassmorphism-panel border-none bg-card/70 text-foreground text-sm">
                ...
              </div>
            </motion.div>
          )}
          {isTranscribing && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 justify-end px-2"
            >
              <div className="p-3 rounded-lg glassmorphism-panel border-none bg-card/70 text-foreground text-sm">
                ... transcribing
              </div>
              <User className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

export default BeepChatHistory;
