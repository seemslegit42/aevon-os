
"use client";
import React, { useState, useEffect, Suspense, useCallback, lazy } from 'react';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Sparkles, AppWindow, Mic, MoreHorizontal, X, LoaderCircle, LayoutDashboard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import eventBus from '@/lib/event-bus';
import CommandPalette from '@/components/command-palette';

// Async load card content components
const AiAssistantCardContent = lazy(() => import('@/components/dashboard/ai-assistant-card-content'));
const ApplicationViewCardContent = lazy(() => import('@/components/dashboard/application-view-card-content'));


export interface CardLayoutInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface CardConfig {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.LazyExoticComponent<React.FC<any>>;
  contentProps?: any;
  defaultLayout: { x: number; y: number; width: number; height: number; zIndex: number };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
}


const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
    content: AiAssistantCardContent,
    contentProps: {
      placeholderInsight: "Analyze product sales, compare revenue, or ask for insights."
    },
    defaultLayout: { x: 20, y: 20, width: 580, height: 300, zIndex: 1 },
    minWidth: 400, minHeight: 280, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
    content: ApplicationViewCardContent,
    defaultLayout: { x: 20, y: 340, width: 580, height: 330, zIndex: 1 },
    minWidth: 400, minHeight: 200,
  },
];

const DEFAULT_ACTIVE_CARD_IDS = ['aiAssistant', 'applicationView'];


export default function DashboardPage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [activeCardIds, setActiveCardIds] = useState<string[]>([]);
  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboardCardLayouts_v4_minimal');
    const savedActiveIds = localStorage.getItem('dashboardActiveCardIds_v4_minimal');

    let currentActiveIds = DEFAULT_ACTIVE_CARD_IDS;
    if (savedActiveIds) {
      try {
        const parsedActiveIds = JSON.parse(savedActiveIds);
        currentActiveIds = parsedActiveIds.filter((id: string) => ALL_CARD_CONFIGS.some(c => c.id === id));
        if (currentActiveIds.length === 0 && ALL_CARD_CONFIGS.length > 0) {
             currentActiveIds = DEFAULT_ACTIVE_CARD_IDS;
        }
      } catch (e) {
        console.error("Failed to parse active card IDs from localStorage", e);
        currentActiveIds = DEFAULT_ACTIVE_CARD_IDS;
      }
    }
    setActiveCardIds(currentActiveIds);

    if (savedLayouts) {
      try {
        const parsedLayouts = JSON.parse(savedLayouts);
        const layoutsWithDefaults = currentActiveIds.map(id => {
          const existing = parsedLayouts.find((l: CardLayoutInfo) => l.id === id);
          if (existing) return existing;
          const defaultConfig = ALL_CARD_CONFIGS.find(c => c.id === id);
          return defaultConfig ? { ...defaultConfig.defaultLayout, id: id } : null;
        }).filter(Boolean) as CardLayoutInfo[];
        setCardLayouts(layoutsWithDefaults);

      } catch (e) {
        console.error("Failed to parse layouts from localStorage", e);
        setCardLayouts(ALL_CARD_CONFIGS.filter(c => currentActiveIds.includes(c.id)).map(c => ({ ...c.defaultLayout, id: c.id })));
      }
    } else {
       setCardLayouts(ALL_CARD_CONFIGS.filter(c => currentActiveIds.includes(c.id)).map(c => ({ ...c.defaultLayout, id: c.id })));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('dashboardCardLayouts_v4_minimal', JSON.stringify(cardLayouts.filter(l => activeCardIds.includes(l.id))));
  }, [cardLayouts, activeCardIds, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
     localStorage.setItem('dashboardActiveCardIds_v4_minimal', JSON.stringify(activeCardIds));
  }, [activeCardIds, isInitialized]);

  const getMaxZIndex = useCallback(() => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(0, ...cardLayouts.map(card => card.zIndex || 0).filter(z => typeof z === 'number'));
  }, [cardLayouts]);

  const updateCardLayout = useCallback((id: string, newPos: Position, newSize?: Size) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? {
              ...layout,
              x: newPos.x,
              y: newPos.y,
              width: newSize ? parseInt(String(newSize.width)) : layout.width,
              height: newSize ? parseInt(String(newSize.height)) : layout.height,
              zIndex: getMaxZIndex() + 1,
            }
          : layout
      )
    );
  }, [getMaxZIndex]);

  const handleBringToFront = useCallback((id: string) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: getMaxZIndex() + 1 }
          : layout
      )
    );
  }, [getMaxZIndex]);

  const handleRemoveCard = useCallback((cardId: string) => {
    setActiveCardIds(prev => prev.filter(id => id !== cardId));
    toast({ title: "Zone Removed", description: `The zone has been removed from your dashboard.`});
  }, [toast]);

  const handleAddCard = useCallback((cardId: string) => {
    if (!activeCardIds.includes(cardId)) {
      setActiveCardIds(prev => [...prev, cardId]);
      if (!cardLayouts.find(l => l.id === cardId)) {
        const defaultConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
        if (defaultConfig) {
          setCardLayouts(prev => [...prev, { ...defaultConfig.defaultLayout, id: cardId, zIndex: getMaxZIndex() + 1 }]);
        }
      } else {
        handleBringToFront(cardId);
      }
      toast({ title: "Zone Added", description: `The zone has been added to your dashboard.`});
    }
  }, [activeCardIds, cardLayouts, getMaxZIndex, handleBringToFront, toast]);

  const handleResetLayout = useCallback(() => {
    setActiveCardIds(DEFAULT_ACTIVE_CARD_IDS);
    setCardLayouts(ALL_CARD_CONFIGS.filter(c => DEFAULT_ACTIVE_CARD_IDS.includes(c.id)).map(c => ({ ...c.defaultLayout, id: c.id })));
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default."});
  }, [toast]);

  const CardActions = (cardId: string, isDismissible?: boolean) => (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <Mic className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>Voice Command</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <MoreHorizontal className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>More Options</p></TooltipContent>
        </Tooltip>
        {isDismissible && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveCard(cardId)}>
                <X className="w-4 h-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Remove Zone</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );

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
    <div className="relative w-full h-full"> {/* Changed from min-h-[calc(100vh-4rem)] overflow-auto p-4 */}
      {isMobile ? (
        <div className="flex flex-col space-y-4 p-4"> {/* Added p-4 here for mobile consistency */}
          {cardsToRender.map(cardConfig => {
            const CardSpecificContent = cardConfig.content;
            return (
              <div key={cardConfig.id} className="w-full">
                <MicroAppCard
                  title={cardConfig.title}
                  icon={cardConfig.icon}
                  actions={CardActions(cardConfig.id, cardConfig.isDismissible)}
                  className={cn("!rounded-lg", cardConfig.cardClassName)}
                >
                  <Suspense fallback={cardLoadingFallback}>
                    <CardSpecificContent {...getMergedContentProps(cardConfig)} />
                  </Suspense>
                </MicroAppCard>
              </div>
            );
          })}
        </div>
      ) : (
        cardsToRender.map(cardConfig => {
          const currentLayout = cardLayouts.find(l => l.id === cardConfig.id);
          const layoutToUse = currentLayout ||
                             ALL_CARD_CONFIGS.find(c => c.id === cardConfig.id)?.defaultLayout;

          if (!layoutToUse) {
             console.warn(`No layout or default layout found for card ${cardConfig.id}. Skipping render.`);
             return null;
          }
          const finalLayout = {...layoutToUse, id: cardConfig.id, zIndex: layoutToUse.zIndex || (getMaxZIndex() + 1) };

          const CardSpecificContent = cardConfig.content;

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
              minWidth={cardConfig.minWidth}
              minHeight={cardConfig.minHeight}
              bounds="parent"
              dragHandleClassName="drag-handle"
              enableResizing={{
                  top:true, right:true, bottom:true, left:true,
                  topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
              }}
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
                className={cn("h-full w-full !rounded-lg", cardConfig.cardClassName)}
              >
                 <Suspense fallback={cardLoadingFallback}>
                    <CardSpecificContent {...getMergedContentProps(cardConfig)} />
                 </Suspense>
              </MicroAppCard>
            </Rnd>
          );
        })
      )}
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
        variant="outline"
        size="icon"
        className="fixed bottom-6 left-6 z-50 rounded-full shadow-xl bg-accent hover:bg-accent/80 text-accent-foreground w-12 h-12"
        onClick={() => setIsCommandPaletteOpen(true)}
      >
        <LayoutDashboard className="h-6 w-6" />
        <span className="sr-only">Manage Dashboard Zones</span>
      </Button>
       <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/70 font-code z-[9999]">
        <span>ΛΞVON OS v1.2 </span>
        <span className="font-semibold">ZUSTAND</span>
      </div>
    </div>
  );
}
