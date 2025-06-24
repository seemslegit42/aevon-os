
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { Cpu } from 'phosphor-react';

export const agentConfigAppConfig: MicroAppRegistration = {
  id: 'app-agent-config',
  title: 'Agent Configuration',
  description: 'Tune the personality and behavior of your BEEP AI assistant.',
  icon: Cpu,
  permissions: [],
  tags: ['ai', 'settings', 'personalization'],
  defaultSize: { width: 450, height: 400 },
};
