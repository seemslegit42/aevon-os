
import type { ElementType, LazyExoticComponent } from 'react';

export interface CardConfig {
  id: string;
  title: string;
  icon: ElementType;
  description?: string;
  content: LazyExoticComponent<any>;
  contentProps?: any;
  defaultLayout: { x: number; y: number; width: number; height: number; };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
}

export type LayoutItem = {
    id: string; // Unique ID for the item on the dashboard (can be card ID or app instance ID)
    type: 'card' | 'app';
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized?: boolean;
    lastHeight?: number;
} & ({
    type: 'card';
    cardId: string; // The ID from ALL_CARD_CONFIGS
} | {
    type: 'app';
    appId: string; // The ID from ALL_MICRO_APPS
});
