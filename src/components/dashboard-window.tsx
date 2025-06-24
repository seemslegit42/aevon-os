
"use client";

import React, { useState, memo } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { X, Minus, Square, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LayoutItem } from '@/types/dashboard';
import type { Position, Size } from 'react-rnd';
import { cn } from '@/lib/utils';
import { WindowContent } from './dashboard-window-content';
import { useLayoutStore } from '@/stores/layout.store';
import { ErrorBoundary } from './error-boundary';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/app-registry';

interface DashboardWindowProps {
  item: LayoutItem;
  isFocused: boolean;
}

const DashboardWindowComponent: React.FC<DashboardWindowProps> = ({ item, isFocused }) => {
    const { 
        updateItemLayout, 
        bringToFront, 
        closeItem, 
        toggleMinimizeItem,
        toggleMaximizeItem
    } = useLayoutStore.getState();

    const [isClosing, setIsClosing] = useState(false);

    const config = item.type === 'card'
      ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
      : ALL_MICRO_APPS.find(a => a.id === item.appId);

    if (!config) {
      // This fallback is crucial for stability if a config is missing.
      return (
         <Rnd
            default={{ x: item.x, y: item.y, width: 400, height: 200 }}
            style={{ zIndex: item.zIndex }}
            className={cn("react-draggable", isFocused && "is-focused")}
         >
             <ErrorBoundary itemId={item.id}>
              <div className="p-4 bg-destructive text-destructive-foreground h-full w-full rounded-lg flex flex-col">
                <h3 className="font-bold">Error: Component not found</h3>
                <p className="text-xs">The component with ID "{item.cardId || item.appId}" could not be found in the registry.</p>
                <Button variant="outline" size="sm" onClick={() => closeItem(item.id)} className="mt-auto">Close Window</Button>
              </div>
            </ErrorBoundary>
         </Rnd>
      );
    }
    
    const title = config.title;
    const Icon = config.icon;
    const minWidth = 'minWidth' in config ? config.minWidth : config.defaultSize.width;
    const minHeight = 'minHeight' in config ? config.minHeight : config.defaultSize.height;
    const cardClassName = 'cardClassName' in config ? config.cardClassName : "";
    const isDismissible = 'isDismissible' in config ? config.isDismissible : true;
    const controls = 'controls' in config ? config.controls : undefined;

    const handleDragStop = (e: any, d: { x: number, y: number }) => {
        updateItemLayout(item.id, { x: d.x, y: d.y });
    };

    const handleResizeStop = (e: any, direction: any, ref: { style: { width: string, height: string } }, delta: any, position: Position) => {
        updateItemLayout(
            item.id,
            position,
            { width: ref.style.width, height: ref.style.height }
        );
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsClosing(true);
        setTimeout(() => {
            closeItem(item.id);
        }, 200);
    };

    const isMaximized = !!item.isMaximized;

    const size = isMaximized 
        ? { width: '100%', height: '100%' }
        : { width: item.width, height: item.height };
    
    const position = isMaximized
        ? { x: 0, y: 0 }
        : { x: item.x, y: item.y };

    const resizeHandles = {
        top: !item.isMinimized && !isMaximized, right: !item.isMinimized && !isMaximized, bottom: !item.isMinimized && !isMaximized, left: !item.isMinimized && !isMaximized,
        topRight: !item.isMinimized && !isMaximized, bottomRight: !item.isMinimized && !isMaximized, bottomLeft: !item.isMinimized && !isMaximized, topLeft: !item.isMinimized && !isMaximized,
    };

    return (
        <Rnd
            key={item.id}
            size={size}
            position={position}
            onDragStart={() => bringToFront(item.id)}
            onDragStop={handleDragStop}
            onResizeStart={() => bringToFront(item.id)}
            onResizeStop={handleResizeStop}
            minWidth={minWidth}
            minHeight={item.isMinimized ? 44 : minHeight}
            style={{ zIndex: item.zIndex }}
            className={cn(
                "react-draggable animate-window-mount",
                isFocused && "is-focused",
                isClosing && "animate-window-unmount pointer-events-none"
            )}
            dragHandleClassName="drag-handle"
            onMouseDownCapture={() => bringToFront(item.id)}
            dragGrid={[20, 20]}
            resizeGrid={[20, 20]}
            enableResizing={resizeHandles}
            disableDragging={isMaximized}
            bounds="parent"
        >
            <MicroAppCard
                title={title || 'Aevon Window'}
                icon={Icon}
                className={cardClassName}
                controls={controls}
                actions={
                  <>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimizeItem(item.id)}>
                        {item.isMinimized ? <Square /> : <Minus />}
                    </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMaximizeItem(item.id)}>
                        {isMaximized ? <Minimize /> : <Maximize />}
                    </Button>
                    {isDismissible && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCloseClick}>
                        <X />
                      </Button>
                    )}
                  </>
                }
            >
              <ErrorBoundary itemId={item.id}>
                 <WindowContent 
                      itemId={item.id}
                      isMinimized={item.isMinimized}
                 />
              </ErrorBoundary>
            </MicroAppCard>
        </Rnd>
    );
};

const DashboardWindow = memo(DashboardWindowComponent);
export default DashboardWindow;
