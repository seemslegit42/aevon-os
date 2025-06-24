"use client";
import React, { useEffect, useRef } from 'react';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import BeepChatHistory from '@/components/beep-chat-history';

/**
 * This component now serves as a dedicated view for the BEEP chat history.
 * The interactive avatar has been moved to a persistent, floating component.
 */
const BeepCardContent: React.FC = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messages = useBeepChatStore((state) => state.messages);
  const isLoading = useBeepChatStore((state) => state.isLoading);
  const isTranscribing = false; // This logic is now in the floating avatar

  useEffect(() => {
    // Auto-scroll logic remains to keep the chat view up-to-date.
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages, isLoading]);

  return (
    <div className="h-80 md:h-full flex flex-col p-0 bg-background/20 overflow-hidden">
      <BeepChatHistory
        scrollAreaRef={scrollAreaRef}
        messages={messages}
        isLoading={isLoading}
        isTranscribing={isTranscribing}
      />
    </div>
  );
};

export default BeepCardContent;
