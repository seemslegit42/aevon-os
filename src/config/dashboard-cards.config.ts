
import type { LazyExoticComponent, FC, ElementType } from 'react';

// Lazy loaded components (ensure paths are correct)
const AiAssistantCardContent = (() => import('@/components/dashboard/ai-assistant-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const ApplicationViewCardContent = (() => import('@/components/dashboard/application-view-card-content')) as unknown as LazyExoticComponent<FC<any>>;

// Icons (ensure paths are correct)
import { Sparkles, AppWindow } from 'lucide-react';

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
  icon: ElementType;
  content: LazyExoticComponent<FC<any>>;
  contentProps?: any;
  defaultLayout: { x: number; y: number; width: number; height: number; zIndex: number };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
}

export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
    content: AiAssistantCardContent,
    contentProps: {
      placeholderInsight: "Analyze product sales, compare revenue, or ask for insights."
    },
    defaultLayout: { x: 20, y: 20, width: 580, height: 300, zIndex: 1 },
    minWidth: 320, minHeight: 280, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
    content: ApplicationViewCardContent,
    defaultLayout: { x: 20, y: 340, width: 580, height: 330, zIndex: 1 },
    minWidth: 320, minHeight: 200,
  },
];

export const DEFAULT_ACTIVE_CARD_IDS = ['aiAssistant', 'applicationView'];
