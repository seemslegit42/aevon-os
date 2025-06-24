
"use client";

import React, { useEffect } from 'react';
import CanvasWrapper from './canvas-wrapper';
import TopBar from './top-bar';
import { BeepChatProvider } from '../beep-chat-provider';
import FloatingBeepAvatar from '../floating-beep-avatar';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { ALL_MICRO_APPS } from '@/config/dashboard-cards.config';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Initialize the micro-app registry when the application mounts.
  // This ensures all hooks and components have access to the app list.
  useEffect(() => {
    useMicroAppStore.getState().initializeApps(ALL_MICRO_APPS);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <BeepChatProvider />
      <TopBar />
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
      <FloatingBeepAvatar />
    </div>
  );
};

export default MainLayout;
