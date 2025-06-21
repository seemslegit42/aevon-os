
"use client";

import React from 'react';
import CanvasWrapper from './canvas-wrapper';
import TopBar from './top-bar';
import { useCommandPaletteStore } from '@/stores/command-palette.store';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { toggle } = useCommandPaletteStore();

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar onSettingsClick={toggle} />
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
    </div>
  );
};

export default MainLayout;
