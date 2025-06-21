
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CloudCogIcon, AlertTriangleIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const initialCloudSecurityData = [
  { id: 'iam', title: 'IAM Hygiene', value: 92, status: 'Optimized', details: 'Identity and Access Management policies are well-configured.' },
  { id: 's3', title: 'S3 Bucket Exposure', value: 100, status: 'Secure', details: 'No public-facing S3 buckets found.' },
  { id: 'misconfig', title: 'Misconfigured Resources', value: 75, status: 'Action Required', details: '3 resources have non-standard configurations.' },
  { id: 'network', title: 'Network Security', value: 80, status: 'Good', details: 'Firewall rules are mostly compliant.' },
];

const CloudSecurityPanel: React.FC = () => {
    const [cloudSecurityData, setCloudSecurityData] = useState(initialCloudSecurityData);

    useEffect(() => {
        const interval = setInterval(() => {
            setCloudSecurityData(prevData =>
                prevData.map(item => ({
                    ...item,
                    value: Math.min(100, Math.max(70, item.value + Math.floor(Math.random() * 5) - 2)),
                }))
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const totalRisks = cloudSecurityData.filter(d => d.value < 90).length;

  return (
    <TooltipProvider>
      <Card className="glassmorphism-panel h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2">
          <CloudCogIcon className="w-6 h-6 text-secondary" />
          <div className="flex-1">
            <CardTitle className="font-headline text-lg">Cloud Security</CardTitle>
            <CardDescription className="text-xs">Infrastructure monitoring</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {cloudSecurityData.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                    <span className="text-xs font-semibold">{item.status}</span>
                  </div>
                  <Progress value={item.value} indicatorClassName={
                      cn({
                          'bg-chart-4': item.value >= 90,
                          'bg-accent': item.value >= 75 && item.value < 90,
                          'bg-chart-5': item.value < 75,
                      })
                  } />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="glassmorphism-panel">
                <p>{item.details}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </CardContent>
        <CardFooter className="justify-center">
            {totalRisks > 0 ? (
                <p className="text-sm font-semibold text-accent flex items-center gap-2">
                    <AlertTriangleIcon /> {totalRisks} Risk{totalRisks > 1 ? 's' : ''} Found
                </p>
            ) : (
                <p className="text-sm font-semibold text-chart-4">No outstanding risks found.</p>
            )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default CloudSecurityPanel;
