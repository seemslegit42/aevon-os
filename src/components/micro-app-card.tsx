
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicroAppCardProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode; 
}

const MicroAppCardComponent: React.FC<MicroAppCardProps> = ({ title, description, icon: Icon, children, className, actions }) => {
  return (
    <Card className={cn("glassmorphism-panel overflow-hidden flex flex-col", className)}>
      <CardHeader className="drag-handle flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b border-border/20 dark:border-white/10 bg-foreground/[.03] cursor-grab active:cursor-grabbing">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-primary mr-2.5" />}
          <CardTitle className="text-base font-headline text-primary">{title}</CardTitle>
        </div>
        {actions && <div className="flex items-center space-x-1">{actions}</div>}
      </CardHeader>
      <CardContent className="pt-4 px-4 pb-4 flex-grow overflow-y-auto">
        {description && typeof description === 'string' ? (
          <CardDescription className="text-foreground/80 mb-4 text-sm">{description}</CardDescription>
        ) : (
          description
        )}
        {children}
      </CardContent>
    </Card>
  );
};

const MicroAppCard = React.memo(MicroAppCardComponent);
export default MicroAppCard;
    