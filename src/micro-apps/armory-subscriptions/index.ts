
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { CreditCard } from 'phosphor-react';

export const armorySubscriptionsAppConfig: MicroAppRegistration = {
  id: 'app-subscriptions',
  title: 'Armory Subscriptions',
  description: 'View and manage your AEVON OS subscription plan.',
  icon: CreditCard,
  permissions: [],
  tags: ['billing', 'account'],
  defaultSize: { width: 400, height: 420 },
};
