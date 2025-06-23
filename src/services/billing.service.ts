
'use server';

// This file simulates a backend service for fetching billing and subscription data.
// In a real-world application, this would interact with a payment provider like Lemon Squeezy or Stripe.

import { SubscriptionStatusSchema, type SubscriptionStatus } from '@/lib/ai-schemas';

const mockSubscriptionData: SubscriptionStatus = {
    planName: 'Pro',
    status: 'active',
    renewsOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ~30 days from now
    manageUrl: 'https://aevon.lemonsqueezy.com/billing',
};

/**
 * Simulates fetching the current user's subscription status.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // In a real app, you would fetch this based on the authenticated user's ID.
    // We add a small delay to simulate network latency.
    await new Promise(resolve => setTimeout(resolve, 350));
    // Validate the data against the schema before returning
    return SubscriptionStatusSchema.parse(mockSubscriptionData);
}

/**
 * Simulates fetching a Lemon Squeezy checkout URL for upgrading.
 */
export async function getCheckoutURL(planId: 'pro' | 'team'): Promise<{ url: string }> {
     await new Promise(resolve => setTimeout(resolve, 500));
     return { url: `https://aevon.lemonsqueezy.com/buy/12345?checkout[plan]=${planId}` };
}
