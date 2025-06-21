
"use client";

import React, { Suspense } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Skeleton } from '@/components/ui/skeleton';
import { PinIcon, XIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import CommandPalette from '@/components/command-palette';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { useDashboardStore } from '@/stores/dashboard.store';

const Dashboard: React.FC = () => {
  const {
    layoutItems,
    isInitialized,
    updateItemLayout,
    handleBringToFront,
    closeItem,
    addCard,
    launchApp,
    handleResetLayout,
  } = useDashboardLayout();

  const { isOpen: isCommandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPaletteStore();
  const { setFocusedCardId } = useDashboardStore();
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        setFocusedCardId(null);
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
      {layoutItems.map(item => {
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
            minWidth = 300;
            minHeight = 250;
            cardClassName = "";
            isDismissible = true;
          }

          return (
            <Rnd
              key={item.id}
              size={{ width: item.width, height: item.height }}
              position={{ x: item.x, y: item.y }}
              onDragStart={() => handleBringToFront(item.id)}
              onDragStop={(e, d) => updateItemLayout(item.id, { x: d.x, y: d.y })}
              onResizeStart={() => handleBringToFront(item.id)}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateItemLayout(
                  item.id,
                  position,
                  { width: ref.style.width, height: ref.style.height }
                );
              }}
              minWidth={minWidth}
              minHeight={minHeight}
              style={{ zIndex: item.zIndex }}
              className="react-draggable"
              dragHandleClassName="drag-handle"
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
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => closeItem(item.id)}>
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
      })}
       <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        allPossibleCards={ALL_CARD_CONFIGS}
        layoutItems={layoutItems}
        onAddCard={addCard}
        onLaunchApp={launchApp}
        onCloseItem={closeItem}
        onResetLayout={handleResetLayout}
      />
    </div>
  );
};

export default Dashboard;
