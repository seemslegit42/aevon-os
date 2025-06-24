
"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CloudCog, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CloudSecurityMetric } from '@/services/security.service';

interface CloudSecurityPanelProps {
  data: CloudSecurityMetric[];
}

const CloudSecurityPanel: React.FC<CloudSecurityPanelProps> = ({ data }) => {
    const totalRisks = data.filter(d => d.value < 90).length;

  return (
    <TooltipProvider>
      <Card className="glassmorphism-panel h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2">
          <CloudCog className="w-6 h-6 text-secondary" />
          <div className="flex-1">
            <CardTitle className="font-headline text-lg">Cloud Security</CardTitle>
            <CardDescription className="text-xs">Infrastructure monitoring</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {data.map((item) => (
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
                    <ShieldAlert /> {totalRisks} Risk{totalRisks > 1 ? 's' : ''} Found
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
