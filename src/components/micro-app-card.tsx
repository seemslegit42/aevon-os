
"use client";

import React, { type ElementType } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { UIControl } from '@/types/dashboard';
import eventBus from '@/lib/event-bus';

interface MicroAppCardProps {
  title: string;
  icon?: ElementType;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  controls?: UIControl[];
}

const MicroAppCardComponent: React.FC<MicroAppCardProps> = ({ title, icon: Icon, children, className, actions, controls }) => {
  const handleControlClick = (controlId: string) => {
    const eventName = `control:click:${controlId}`;
    eventBus.emit(eventName as any);
  };

  return (
    <Card className={cn("h-full w-full glassmorphism-panel overflow-hidden flex flex-col", className)}>
      <CardHeader className="drag-handle flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b border-border/10 dark:border-white/5 bg-card/[.03] dark:bg-card/80 cursor-grab active:cursor-grabbing">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-primary mr-3" />}
          <CardTitle className="text-base font-headline text-foreground">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-1 text-muted-foreground">
          {controls && controls.length > 0 && (
            <TooltipProvider>
              <div className="flex items-center gap-1 border-r border-border/30 pr-2 mr-1">
                {controls.map(control => {
                  const ControlIcon = control.icon;
                  return (
                    <Tooltip key={control.id}>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleControlClick(control.id)}>
                          <ControlIcon />
                        </Button>
                      </TooltipTrigger>
                      {control.tooltip && (
                        <TooltipContent side="bottom" className="glassmorphism-panel">
                          <p>{control.tooltip}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
          {actions}
        </div>
      </CardHeader>
      <CardContent className={cn("p-0 flex-grow overflow-hidden text-foreground")}>
        {children}
      </CardContent>
    </Card>
  );
};

const MicroAppCard = React.memo(MicroAppCardComponent);
export default MicroAppCard;
