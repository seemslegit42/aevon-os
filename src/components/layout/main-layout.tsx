
"use client";

import React from 'react';
import CanvasWrapper from './canvas-wrapper';
import TopBar from './top-bar';
import { BeepChatProvider } from '../beep-chat-provider';

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
    </div>
  );
};

export default MainLayout;
