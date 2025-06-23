
"use client";

import React from 'react';
import CanvasWrapper from './canvas-wrapper';
import TopBar from './top-bar';
import { BeepChatProvider } from '../beep-chat-provider';
import FloatingBeepAvatar from '../floating-beep-avatar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
