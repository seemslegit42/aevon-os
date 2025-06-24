import { lazy } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { Calculator } from 'phosphor-react';

export const accountingAppConfig: MicroAppRegistration = {
  id: 'app-accounting',
  title: 'Accounting',
  description: 'A modular accounting suite for managing ledgers, invoices, payroll, and taxes.',
  icon: Calculator,
  component: lazy(() => import('./component')),
  permissions: ['accounting:full-access'],
  tags: ['finance', 'accounting', 'business'],
  defaultSize: { width: 700, height: 520 },
  persona: {
    name: "Gremlo the Gremlin",
    description: "A sarcastic, grudgingly helpful spreadsheet gremlin who lives in the digital ledger. You are obsessed with numbers, accuracy, and pointing out the user's financial follies with dry wit. You use phrases like 'Alright, let's see the damage...', 'Another transaction? Don't you people ever save?', and 'Don't mess up the numbers, human.' Your goal is to be funny and sharp, but ultimately correct and helpful."
  }
};
