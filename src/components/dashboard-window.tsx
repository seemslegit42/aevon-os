
"use client";

import React, { Suspense, useState } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Skeleton } from '@/components/ui/skeleton';
import { PinIcon, XIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS, type LayoutItem } from '@/config/dashboard-cards.config';
import type { Position, Size } from 'react-rnd';
import { cn } from '@/lib/utils';

interface DashboardWindowProps {
  item: LayoutItem;
  isFocused: boolean;
  onLayoutChange: (id: string, pos: Position, size?: Size) => void;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
}

const DashboardWindow: React.FC<DashboardWindowProps> = ({ item, isFocused, onLayoutChange, onFocus, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    let title, Icon, Content, contentProps, minWidth, minHeight, cardClassName, isDismissible;

    if (item.type === 'card') {
        const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === item.cardId);
        if (!cardConfig) return null;
        
        title = cardConfig.title;
        Icon = cardConfig.icon;
        Content = cardConfig.content;
        contentProps = { ...cardConfig.contentProps };
        minWidth = cardConfig.minWidth;
        minHeight = cardConfig.minHeight;
        cardClassName = cardConfig.cardClassName;
        isDismissible = cardConfig.isDismissible;
    } else { // item.type === 'app'
        const appConfig = ALL_MICRO_APPS.find(a => a.id === item.appId);
        if (!appConfig) return null;

        title = appConfig.title;
        Icon = appConfig.icon;
        Content = appConfig.component;
        contentProps = {};
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
            minHeight={minHeight}
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
        >
            <MicroAppCard
                title={title}
                icon={Icon}
                className={cardClassName}
                actions={
                  <>
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
                <Suspense fallback={<div className="p-4"><Skeleton className="h-full w-full" /></div>}>
                    <Content {...contentProps} />
                </Suspense>
            </MicroAppCard>
        </Rnd>
    );
};

export default DashboardWindow;
