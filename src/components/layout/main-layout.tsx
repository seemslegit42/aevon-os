import React from 'react';
import TopBar from './top-bar';
import CanvasWrapper from './canvas-wrapper';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
    </div>
  );
};

export default MainLayout;
