
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Cpu, Activity, Hash, Layers } from 'lucide-react';
import { getRecentActionLogs, getActionLogStats, type ActionLogStats } from '@/services/system-monitor.service';
import type { ActionLog, Agent } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import eventBus from '@/lib/event-bus';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const SystemMonitorComponent: React.FC<{ itemId?: string }> = ({ itemId }) => {
    const [stats, setStats] = useState<ActionLogStats | null>(null);
    const [logs, setLogs] = useState<Array<ActionLog & { agent: Agent }> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [fetchedStats, fetchedLogs] = await Promise.all([
                getActionLogStats(),
                getRecentActionLogs(20)
            ]);
            setStats(fetchedStats);
            setLogs(fetchedLogs as Array<ActionLog & { agent: Agent }>);
        } catch (error) {
            console.error("Failed to fetch system monitor data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        if (!itemId) return; // Only listen for events if this is an instantiated component

        const eventName = `control:click:${itemId}:system-monitor-refresh`;
        const handleRefresh = () => {
            setIsLoading(true);
            fetchData();
        };

        eventBus.on(eventName as any, handleRefresh);

        return () => {
            eventBus.off(eventName as any, handleRefresh);
        };
    }, [itemId, fetchData]);


    if (isLoading && !stats) {
        return (
            <div className="p-4 h-full space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-full" />
            </div>
        );
    }
    
    return (
        <TooltipProvider>
            <div className="p-4 h-full flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Actions (24h)" value={stats?.actionsToday.toLocaleString() ?? '...'} icon={Activity} />
                    <StatCard title="Total Actions" value={stats?.totalActions.toLocaleString() ?? '...'} icon={Layers} />
                    <StatCard title="Success Rate" value={`${stats?.successRate.toFixed(1) ?? '...'}%`} icon={CheckCircle} />
                    <StatCard title="Avg. Tokens/Action" value={stats?.avgTokens.toFixed(0) ?? '...'} icon={Hash} />
                </div>
                
                <Card className="glassmorphism-panel flex-grow flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle className="font-headline text-primary">Recent Agent Actions</CardTitle>
                        <CardDescription>A live feed of the most recent actions taken by agents.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden p-0">
                        <ScrollArea className="h-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Agent</TableHead>
                                        <TableHead>Tool</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs && logs.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.agent.name}</TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">{log.toolName}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs break-all" side="top">
                                                        <pre className="text-xs p-2 bg-background rounded-md">
                                                            {JSON.stringify(log.arguments, null, 2)}
                                                        </pre>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className={cn('border-none', log.status === 'success' ? 'badge-success' : 'badge-failure')}>
                                                    {log.status === 'success' ? <CheckCircle className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground text-xs">
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {!logs || logs.length === 0 && (
                                <div className="text-center p-8 text-muted-foreground">
                                    No agent actions logged yet.
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
};

export default SystemMonitorComponent;
