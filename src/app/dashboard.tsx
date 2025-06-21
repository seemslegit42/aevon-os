
"use client";

import React from 'react';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';
import CommandPalette from '@/components/command-palette';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { useLayoutStore } from '@/stores/layout.store';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardWindow from '@/components/dashboard-window';
import { shallow } from 'zustand/shallow';

const Dashboard: React.FC = () => {
  // The useDashboardLayout hook now acts as a controller,
  // initializing the layout and setting up event listeners.
  useDashboardLayout();

  // We select the state needed for rendering directly from the store.
  const {
    layoutItems,
    isInitialized,
    updateItemLayout,
    bringToFront,
    closeItem,
    toggleMinimizeItem,
    focusedItemId,
    setFocusedItemId
  } = useLayoutStore(
    (state) => ({
      layoutItems: state.layoutItems,
      isInitialized: state.isInitialized,
      updateItemLayout: state.updateItemLayout,
      bringToFront: state.bringToFront,
      closeItem: state.closeItem,
      toggleMinimizeItem: state.toggleMinimizeItem,
      focusedItemId: state.focusedItemId,
      setFocusedItemId: state.setFocusedItemId,
    }),
    shallow
  );
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the canvas itself and not a child element (a window)
    if (e.target === e.currentTarget) {
        setFocusedItemId(null);
    }
  };

  if (!isInitialized) {
    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="h-full w-full relative" onClick={handleCanvasClick}>
      {layoutItems.map(item => (
          <DashboardWindow
            key={item.id}
            item={item}
            isFocused={item.id === focusedItemId}
            onLayoutChange={updateItemLayout}
            onFocus={bringToFront}
            onClose={closeItem}
            onToggleMinimize={toggleMinimizeItem}
          />
      ))}
       <CommandPalette />
    </div>
  );
};

export default Dashboard;
