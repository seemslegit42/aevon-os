
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SystemMonitorComponent: React.FC = () => {
    // In a real app, this data would come from a backend service.
    const cpuUsage = 28;
    const memoryUsage = 54;
    const diskUsage = 76;

    return (
        <div className="p-4 h-full">
            <Card className="glassmorphism-panel h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">System Monitor</CardTitle>
                    <CardDescription>Live view of system resource utilization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><Cpu /> CPU Usage</span>
                            <span className="font-semibold">{cpuUsage}%</span>
                        </div>
                        <Progress value={cpuUsage} indicatorClassName="bg-chart-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><MemoryStick /> Memory</span>
                            <span className="font-semibold">{memoryUsage}%</span>
                        </div>
                        <Progress value={memoryUsage} indicatorClassName="bg-chart-4" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground flex items-center gap-2"><HardDrive /> Disk</span>
                             <span className="font-semibold">{diskUsage}%</span>
                        </div>
                        <Progress value={diskUsage} indicatorClassName="bg-accent" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemMonitorComponent;
