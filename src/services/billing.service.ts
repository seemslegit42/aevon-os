
'use server';

// This file simulates a backend service for fetching billing and subscription data.
// In a real-world application, this would interact with a payment provider like Lemon Squeezy or Stripe.

import type { SubscriptionStatus } from '@/types/dashboard';

const mockSubscriptionData: SubscriptionStatus = {
    planName: 'Pro',
    status: 'active',
    renewsOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ~30 days from now
    manageUrl: 'https://aevon.lemonsqueezy.com/billing',
    usage: {
      aiQueries: { current: 1250, limit: 10000 },
      teamMembers: { current: 3, limit: 5 },
    }
};

/**
 * Simulates fetching the current user's subscription status.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // In a real app, you would fetch this based on the authenticated user's ID.
    // We add a small delay to simulate network latency.
    await new Promise(resolve => setTimeout(resolve, 350));
    return mockSubscriptionData;
}

/**
 * Simulates fetching a Lemon Squeezy checkout URL for upgrading.
 */
export async function getCheckoutURL(planId: 'pro' | 'team'): Promise<{ url: string }> {
     await new Promise(resolve => setTimeout(resolve, 500));
     return { url: `https://aevon.lemonsqueezy.com/buy/12345?checkout[plan]=${planId}` };
}
