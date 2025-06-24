
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

interface BasePanelProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export function BasePanel({
  title,
  icon,
  children,
  className,
  contentClassName,
  onClose,
}: BasePanelProps) {
  return (
    <Card
      className={cn(
        'h-full flex flex-col bg-card/80 backdrop-blur-lg border-border shadow-xl relative',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border/50 select-none">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-sm font-medium font-headline">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive" onClick={onClose} title="Close Panel">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(
        "p-3 overflow-auto flex-grow", 
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  );
}
