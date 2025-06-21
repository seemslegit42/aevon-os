
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLinkIcon, AlertTriangleIcon, CheckCircleIcon, BrainCircuitIcon, UsersIcon } from '@/components/icons';
import { type SubscriptionStatus, getSubscriptionStatus } from '@/services/billing.service';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const UsageBar: React.FC<{ label: string; icon: React.ElementType; current: number; limit: number; unit?: string; }> = ({ label, icon: Icon, current, limit, unit = '' }) => {
    const percentage = Math.round((current / limit) * 100);
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                </span>
                <span className="text-xs font-semibold">
                    {current.toLocaleString()}{unit} / {limit.toLocaleString()}{unit}
                </span>
            </div>
            <Progress value={percentage} indicatorClassName={
                cn({
                    'bg-chart-4': percentage < 75,
                    'bg-accent': percentage >= 75 && percentage < 90,
                    'bg-chart-5': percentage >= 90,
                })
            } />
        </div>
    );
};

const ArmorySubscriptionsApp: React.FC = () => {
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setIsLoading(true);
                const status = await getSubscriptionStatus();
                setSubscription(status);
            } catch (err: any) {
                setError(err.message || "Failed to load subscription details.");
                toast({ variant: "destructive", title: "Loading Error", description: err.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [toast]);
    
    if (isLoading) {
        return (
            <div className="p-4 space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }
    
    if (error || !subscription) {
        return (
             <Alert variant="destructive">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error || "Could not load subscription information."}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="p-2 space-y-4">
            <Alert className={cn(
                subscription.status === 'active' && 'border-chart-4/50',
                subscription.status === 'trialing' && 'border-accent/50',
            )}>
                 {subscription.status === 'active' ? <CheckCircleIcon className="h-4 w-4" /> : <AlertTriangleIcon className="h-4 w-4" />}
                 <AlertTitle className="font-headline">
                    You are on the <span className="text-primary">{subscription.planName}</span> plan.
                 </AlertTitle>
                <AlertDescription>
                    Your subscription is currently {subscription.status} and will renew on {new Date(subscription.renewsOn).toLocaleDateString()}.
                </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
                 <UsageBar label="AI Queries" icon={BrainCircuitIcon} {...subscription.usage.aiQueries} />
                 <UsageBar label="Team Members" icon={UsersIcon} {...subscription.usage.teamMembers} />
            </div>

            <Button asChild className="w-full btn-gradient-primary-accent mt-4">
                <a href={subscription.manageUrl} target="_blank" rel="noopener noreferrer">
                    Manage Subscription
                    <ExternalLinkIcon className="ml-2" />
                </a>
            </Button>
        </div>
    );
};

export default ArmorySubscriptionsApp;
