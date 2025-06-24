
"use client";

import React, { useState, memo } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { X, Minus, Square, ArrowsOut, ArrowsIn } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import type { CardConfig } from '@/types/dashboard';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import type { LayoutItem } from '@/types/dashboard';
import type { Position, Size } from 'react-rnd';
import { cn } from '@/lib/utils';
import { WindowContent } from './dashboard-window-content';
import { useLayoutStore } from '@/stores/layout.store';
import { ErrorBoundary } from './error-boundary';

interface DashboardWindowProps {
  item: LayoutItem;
  config: CardConfig | MicroAppRegistration; // Receive the pre-fetched config
  isFocused: boolean;
}

const DashboardWindowComponent: React.FC<DashboardWindowProps> = ({ item, config, isFocused }) => {
    const { 
        updateItemLayout, 
        bringToFront, 
        closeItem, 
        toggleMinimizeItem,
        toggleMaximizeItem
    } = useLayoutStore.getState();

    const [isClosing, setIsClosing] = useState(false);

    // Extract props directly from the config object
    const title = config.title;
    const Icon = config.icon;
    const ContentComponent = 'content' in config ? config.content : config.component;
    const contentProps = 'contentProps' in config ? config.contentProps : {};
    const minWidth = 'minWidth' in config ? config.minWidth : config.defaultSize.width;
    const minHeight = 'minHeight' in config ? config.minHeight : config.defaultSize.height;
    const cardClassName = 'cardClassName' in config ? cardClassName : "";
    const isDismissible = 'isDismissible' in config ? config.isDismissible : true;

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
        }, 200); // Corresponds to animation duration
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
            bounds="parent" // Constrain to canvas
        >
            <MicroAppCard
                title={title || 'Aevon Window'}
                icon={Icon}
                className={cardClassName}
                actions={
                  <>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimizeItem(item.id)}>
                        {item.isMinimized ? <Square /> : <Minus />}
                    </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMaximizeItem(item.id)}>
                        {isMaximized ? <ArrowsIn /> : <ArrowsOut />}
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
                      isMinimized={item.isMinimized}
                      ContentComponent={ContentComponent}
                      contentProps={contentProps}
                 />
              </ErrorBoundary>
            </MicroAppCard>
        </Rnd>
    );
};

const DashboardWindow = memo(DashboardWindowComponent);

export default DashboardWindow;
