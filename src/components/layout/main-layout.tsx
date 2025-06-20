
import React from 'react';
import CanvasWrapper from './canvas-wrapper';

type MainLayoutProps = {
  children: React.ReactNode;
};

// MainLayout is now simpler. It sets up the main canvas area.
// The TopBar is rendered *inside* the Dashboard component, which is placed on the main page.
// This allows the TopBar to interact with the dashboard's state (e.g., opening the command palette).
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
    </div>
  );
};

export default MainLayout;
