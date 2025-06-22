
"use client";

import React, { useState, memo } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { PinIcon, XIcon, MinimizeIcon, MaximizeIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { CardConfig } from '@/types/dashboard';
import type { MicroApp } from '@/stores/micro-app.store';
import type { LayoutItem } from '@/types/dashboard';
import type { Position, Size } from 'react-rnd';
import { cn } from '@/lib/utils';
import { WindowContent } from './dashboard-window-content';
import { useLayoutStore } from '@/stores/layout.store';

interface DashboardWindowProps {
  item: LayoutItem;
  config: CardConfig | MicroApp; // Receive the pre-fetched config
  isFocused: boolean;
}

const DashboardWindowComponent: React.FC<DashboardWindowProps> = ({ item, config, isFocused }) => {
    const { 
        updateItemLayout, 
        bringToFront, 
        closeItem, 
        toggleMinimizeItem 
    } = useLayoutStore.getState();

    const [isClosing, setIsClosing] = useState(false);

    // Extract props directly from the config object
    const title = config.title;
    const Icon = config.icon;
    const ContentComponent = 'content' in config ? config.content : config.component;
    const contentProps = 'contentProps' in config ? config.contentProps : {};
    const minWidth = 'minWidth' in config ? config.minWidth : config.defaultSize.width;
    const minHeight = 'minHeight' in config ? config.minHeight : config.defaultSize.height;
    const cardClassName = 'cardClassName' in config ? config.cardClassName : "";
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

    const resizeHandles = {
        top: !item.isMinimized, right: !item.isMinimized, bottom: !item.isMinimized, left: !item.isMinimized,
        topRight: !item.isMinimized, bottomRight: !item.isMinimized, bottomLeft: !item.isMinimized, topLeft: !item.isMinimized,
    };

    return (
        <Rnd
            key={item.id}
            size={{ width: item.width, height: item.height }}
            position={{ x: item.x, y: item.y }}
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
            bounds="parent" // Constrain to canvas
        >
            <MicroAppCard
                title={title || 'Aevon Window'}
                icon={Icon}
                className={cardClassName}
                actions={
                  <>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleMinimizeItem(item.id)}>
                        {item.isMinimized ? <MaximizeIcon className="w-4 h-4" /> : <MinimizeIcon className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <PinIcon className="w-4 h-4" />
                    </Button>
                    {isDismissible && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCloseClick}>
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                }
            >
               <WindowContent 
                    isMinimized={item.isMinimized}
                    ContentComponent={ContentComponent}
                    contentProps={contentProps}
               />
            </MicroAppCard>
        </Rnd>
    );
};

const DashboardWindow = memo(DashboardWindowComponent);

export default DashboardWindow;
