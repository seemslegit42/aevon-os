
import type { ElementType, LazyExoticComponent } from 'react';
import type { AppRegistration } from '@/config/app-registry';

/** Describes a UI control that a micro-app can expose. */
export interface UIControl {
  id: string;
  label: string;
  icon: ElementType;
  tooltip?: string;
}

/** Describes a sub-route within a micro-app. */
export interface MicroAppRoute {
  path: string; // Relative to the app's baseRoute, e.g., "details/:id"
  component: LazyExoticComponent<ElementType>;
}

// This defines the METADATA for a card, not its component.
export interface CardConfig {
  id: string;
  title: string;
  icon: ElementType;
  description?: string;
  defaultSize: { x:number, y:number, width: number; height: number; };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
  contentProps?: any;
}

export type LayoutItem = {
    id: string;
    type: 'card' | 'app';
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized?: boolean;
    lastHeight?: number;
    isMaximized?: boolean;
    lastX?: number;
    lastY?: number;
    lastWidth?: number;
    cardId?: string; // The ID from ALL_CARD_CONFIGS
    appId?: string; // The ID from ALL_MICRO_APPS
};

export type AvatarState =
  | 'idle'
  | 'listening'
  | 'speaking_neutral'
  | 'speaking_helpful'
  | 'speaking_insightful'
  | 'speaking_cautious'
  | 'thinking'
  | 'tool_call'
  | 'security_alert';
