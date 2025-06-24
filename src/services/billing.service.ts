
'use server';

// This file simulates a backend service for fetching billing and subscription data.
// In a real-world application, this would interact with a payment provider like Lemon Squeezy or Stripe.

import { type SubscriptionStatus } from '@/lib/ai-schemas';
import { getActionLogStats } from './system-monitor.service';

/**
 * Simulates fetching the current user's subscription status.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // In a real app, you would fetch this based on the authenticated user's ID.
    
    // Fetch live action log stats to populate usage data
    const stats = await getActionLogStats();

    const mockSubscriptionData: SubscriptionStatus = {
        planName: 'Pro',
        status: 'active',
        renewsOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ~30 days from now
        manageUrl: 'https://aevon.lemonsqueezy.com/billing',
        usage: {
          aiQueries: { current: Math.round(stats.totalActions), limit: 10000 },
          teamMembers: { current: 3, limit: 5 },
        }
    };
    
    return mockSubscriptionData;
}

/**
 * Simulates fetching a Lemon Squeezy checkout URL for upgrading.
 */
export async function getCheckoutURL(planId: 'pro' | 'team' | 'enterprise'): Promise<{ url: string }> {
     // In a real app, this would generate a unique checkout URL.
     const planIds = {
        pro: '12345-pro',
        team: '67890-team',
        enterprise: '54321-enterprise',
     }
     return { url: `https://aevon.lemonsqueezy.com/buy/${planIds[planId]}` };
}
