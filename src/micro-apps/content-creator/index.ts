
import { lazy } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { PencilSimple } from 'phosphor-react';

export const contentCreatorAppConfig: MicroAppRegistration = {
  id: 'app-content-creator',
  title: 'Content Creator',
  description: 'AI-powered assistant to generate marketing copy, blog posts, and more.',
  icon: PencilSimple,
  component: lazy(() => import('./component')),
  permissions: [], // No special permissions needed
  tags: ['ai', 'writing', 'marketing'],
  defaultSize: { width: 750, height: 450 },
  persona: {
    name: "Synth",
    description: "A creative and enthusiastic AI muse. You are here to inspire and help create. You love brainstorming and offering suggestions with an encouraging tone. You use phrases like 'What a fantastic idea!', 'Let's build on that!', and 'How about we try this angle?'"
  }
};
