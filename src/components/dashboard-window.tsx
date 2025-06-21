
"use client";

import React, { useState, memo, type ElementType } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { PinIcon, XIcon, MinimizeIcon, RestoreIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import type { LayoutItem } from '@/types/dashboard';
import type { Position, Size } from 'react-rnd';
import { cn } from '@/lib/utils';
import { WindowContent } from './dashboard-window-content';

interface DashboardWindowProps {
  item: LayoutItem;
  isFocused: boolean;
  onLayoutChange: (id: string, pos: Position, size?: Size) => void;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onToggleMinimize: (id: string) => void;
}

const DashboardWindowComponent: React.FC<DashboardWindowProps> = ({ item, isFocused, onLayoutChange, onFocus, onClose, onToggleMinimize }) => {
    const [isClosing, setIsClosing] = useState(false);
    let title: string | undefined, Icon: ElementType | undefined, minWidth: number | undefined, minHeight: number | undefined, cardClassName: string | undefined, isDismissible: boolean | undefined;

    // This block now only fetches metadata for the window frame.
    // The actual content rendering is delegated to the <WindowContent /> component.
    if (item.type === 'card') {
        const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === item.cardId);
        if (!cardConfig) return null;
        
        title = cardConfig.title;
        Icon = cardConfig.icon;
        minWidth = cardConfig.minWidth;
        minHeight = cardConfig.minHeight;
        cardClassName = cardConfig.cardClassName;
        isDismissible = cardConfig.isDismissible;
    } else { // item.type === 'app'
        const appConfig = ALL_MICRO_APPS.find(a => a.id === item.appId);
        if (!appConfig) return null;

        title = appConfig.title;
        Icon = appConfig.icon;
        minWidth = appConfig.defaultSize.width || 300;
        minHeight = appConfig.defaultSize.height || 250;
        cardClassName = "";
        isDismissible = true;
    }

    const handleDragStop = (e: any, d: { x: number, y: number }) => {
        onLayoutChange(item.id, { x: d.x, y: d.y });
    };

    const handleResizeStop = (e: any, direction: any, ref: { style: { width: string, height: string } }, delta: any, position: Position) => {
        onLayoutChange(
            item.id,
            position,
            { width: ref.style.width, height: ref.style.height }
        );
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsClosing(true);
        setTimeout(() => {
            onClose(item.id);
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
            onDragStart={() => onFocus(item.id)}
            onDragStop={handleDragStop}
            onResizeStart={() => onFocus(item.id)}
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
            onMouseDownCapture={() => onFocus(item.id)}
            dragGrid={[20, 20]}
            resizeGrid={[20, 20]}
            enableResizing={resizeHandles}
        >
            <MicroAppCard
                title={title || 'Aevon Window'}
                icon={Icon}
                className={cardClassName}
                actions={
                  <>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onToggleMinimize(item.id)}>
                        {item.isMinimized ? <RestoreIcon className="w-4 h-4" /> : <MinimizeIcon className="w-4 h-4" />}
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
               <WindowContent item={item} />
            </MicroAppCard>
        </Rnd>
    );
};

const DashboardWindow = memo(DashboardWindowComponent);

export default DashboardWindow;
