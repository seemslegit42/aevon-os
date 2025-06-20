
"use client";
import React, { Suspense, useCallback, useState, lazy } from 'react';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Mic, MoreHorizontal, X, LoaderCircle, LayoutDashboard } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import eventBus from '@/lib/event-bus';
import CommandPalette from '@/components/command-palette';
import { useIsMobile } from '@/hooks/use-mobile';
import { ALL_CARD_CONFIGS, DEFAULT_ACTIVE_CARD_IDS, type CardConfig } from '@/config/dashboard-cards.config';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';


export default function DashboardPage() {
  const isMobile = useIsMobile();
  const {
    activeCardIds,
    cardLayouts,
    isInitialized,
    updateCardLayout,
    handleBringToFront,
    handleRemoveCard,
    handleAddCard,
    handleResetLayout,
    getMaxZIndex,
  } = useDashboardLayout(ALL_CARD_CONFIGS, DEFAULT_ACTIVE_CARD_IDS);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const CardActions = useCallback((cardId: string, isDismissible?: boolean) => (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground dark:text-neutral-200 hover:text-primary dark:hover:text-white"> <Mic className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>Voice Command</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground dark:text-neutral-200 hover:text-primary dark:hover:text-white"> <MoreHorizontal className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>More Options</p></TooltipContent>
        </Tooltip>
        {isDismissible && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground dark:text-neutral-200 hover:text-destructive dark:hover:text-red-400" onClick={() => handleRemoveCard(cardId)}>
                <X className="w-4 h-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Remove Zone</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  ), [handleRemoveCard]);

  const cardsToRender = ALL_CARD_CONFIGS.filter(card => activeCardIds.includes(card.id));

  const getMergedContentProps = (cardConfig: CardConfig) => {
    return {
      ...cardConfig.contentProps,
      eventBusInstance: eventBus,
    };
  };

  const cardLoadingFallback = (
    <div className="p-4 h-full flex flex-col">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="flex-grow w-full" />
    </div>
  );

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4 md:p-0">
      {cardsToRender.map(cardConfig => {
        const currentLayout = cardLayouts.find(l => l.id === cardConfig.id);
        // Fallback to default layout if somehow not found, though useDashboardLayout should ensure it.
        const layoutToUse = currentLayout || cardConfig.defaultLayout; 

        if (!layoutToUse) {
            console.warn(`No layout or default layout found for card ${cardConfig.id}. Skipping render.`);
            return null;
        }
        // Ensure zIndex is set, defaulting if necessary using getMaxZIndex
        const finalLayout = {
          ...layoutToUse,
          id: cardConfig.id, // Ensure id is part of finalLayout
          zIndex: layoutToUse.zIndex || (getMaxZIndex() + 1)
        };
        
        const CardSpecificContent = cardConfig.content;

        const effectiveMinWidth = Math.min(cardConfig.minWidth, isMobile ? 280 : 300);
        const effectiveMinHeight = Math.min(cardConfig.minHeight, isMobile ? 120 : 150);

        return (
          <Rnd
            key={cardConfig.id}
            size={{ width: finalLayout.width, height: finalLayout.height }}
            position={{ x: finalLayout.x, y: finalLayout.y }}
            onDragStart={() => handleBringToFront(cardConfig.id)}
            onDragStop={(e, d) => {
              updateCardLayout(cardConfig.id, { x: d.x, y: d.y });
            }}
            onResizeStart={() => handleBringToFront(cardConfig.id)}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateCardLayout(cardConfig.id, position, { width: ref.offsetWidth, height: ref.offsetHeight });
            }}
            minWidth={effectiveMinWidth}
            minHeight={effectiveMinHeight}
            bounds="parent"
            dragHandleClassName="drag-handle"
            enableResizing={isMobile ? {
                top:false, right:false, bottom:false, left:false,
                topRight:false, bottomRight:false, bottomLeft:false, topLeft:false
            } : {
                top:true, right:true, bottom:true, left:true,
                topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
            }}
            dragAxis={isMobile ? 'y' : 'both'}
            style={{ zIndex: finalLayout.zIndex }}
            className={cn(
              "border-transparent hover:border-primary/20 focus-within:border-primary/40",
            )}
            dragGrid={[10, 10]}
            resizeGrid={[10, 10]}
          >
            <MicroAppCard
              title={cardConfig.title}
              icon={cardConfig.icon}
              actions={CardActions(cardConfig.id, cardConfig.isDismissible)}
              className={cn("h-full w-full", cardConfig.cardClassName)}
            >
                <Suspense fallback={cardLoadingFallback}>
                  <CardSpecificContent {...getMergedContentProps(cardConfig)} />
                </Suspense>
            </MicroAppCard>
          </Rnd>
        );
      })}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        allPossibleCards={ALL_CARD_CONFIGS}
        activeCardIds={activeCardIds}
        cardLayouts={cardLayouts}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
        onResetLayout={handleResetLayout}
      />
      <Button
        size="icon"
        className="fixed bottom-6 left-6 z-50 rounded-full shadow-xl bg-accent hover:bg-accent/80 text-accent-foreground w-12 h-12 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setIsCommandPaletteOpen(true)}
      >
        <LayoutDashboard className="h-6 w-6" />
        <span className="sr-only">Manage Dashboard Zones</span>
      </Button>
      <div className="fixed bottom-4 right-4 text-xs text-foreground/90 dark:text-foreground/80 backdrop-blur-sm bg-background/50 dark:bg-black/50 px-2 py-1 rounded-md shadow-lg z-[45]">
        <span>ΛΞVON OS v1.2 </span>
        <span className="font-semibold">ZUSTAND</span>
      </div>
    </div>
  );
}
