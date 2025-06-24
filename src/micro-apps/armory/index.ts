
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { ShoppingCart } from 'phosphor-react';

export const armoryAppConfig: MicroAppRegistration = {
  id: 'app-armory',
  title: 'ΛEVON Λrmory',
  description: 'Discover and launch powerful micro-apps to extend your OS capabilities.',
  icon: ShoppingCart,
  permissions: [],
  tags: ['system', 'apps', 'marketplace'],
  defaultSize: { width: 800, height: 600 }, // Not used for page-level apps, but good for consistency
  baseRoute: '/armory',
};
