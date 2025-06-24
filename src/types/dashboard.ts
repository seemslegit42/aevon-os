
import type { ElementType, LazyExoticComponent } from 'react';

/** Describes a UI control that a micro-app can expose. */
export interface UIControl {
  id: string;
  label: string;
  icon: ElementType;
  tooltip?: string;
  // Note: The action for this control is handled by the micro-app's internal logic,
  // typically by listening for a namespaced event (e.g., `control:click:${appInstanceId}:${controlId}`).
}

/** Describes a sub-route within a micro-app. */
export interface MicroAppRoute {
  path: string; // Relative to the app's baseRoute, e.g., "details/:id"
  component: LazyExoticComponent<ElementType>; // The component to render for this route.
}

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
