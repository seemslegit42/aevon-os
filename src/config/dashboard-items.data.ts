
// This file is server-safe and contains only data, no component imports.

export const MICRO_APP_IDS = {
  ACCOUNTING: 'app-accounting',
  ANALYTICS: 'app-analytics',
  CONTENT_CREATOR: 'app-content-creator',
  SUBSCRIPTIONS: 'app-subscriptions',
  AGENT_CONFIG: 'app-agent-config',
} as const;

export const CARD_IDS = {
  BEEP: 'beep',
  ORCHESTRATION: 'liveOrchestrationFeed',
  PRESENCE: 'agentPresence',
  APPS: 'microApps',
  INSIGHTS: 'aiInsights',
  DEV_HUD: 'dev-hud',
} as const;

export const ALL_ITEM_IDS = [
    ...Object.values(MICRO_APP_IDS),
    ...Object.values(CARD_IDS)
];
