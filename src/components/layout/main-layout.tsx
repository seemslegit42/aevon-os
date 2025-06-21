
"use client";

import React from 'react';
import CanvasWrapper from './canvas-wrapper';
import TopBar from './top-bar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <TopBar />
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
    </div>
  );
};

export default MainLayout;
