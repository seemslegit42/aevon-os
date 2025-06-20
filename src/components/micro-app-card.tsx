
import React, { type ElementType } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MicroAppCardProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: ElementType;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const MicroAppCardComponent: React.FC<MicroAppCardProps> = ({ title, description, icon: Icon, children, className, actions }) => {
  return (
    <Card className={cn("glassmorphism-panel overflow-hidden flex flex-col", className)}>
      <CardHeader className="drag-handle flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b border-border/10 dark:border-white/5 bg-foreground/[.02] dark:bg-card/90 cursor-grab active:cursor-grabbing">
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-primary dark:text-white mr-3" />}
          <CardTitle className="text-base font-headline text-primary dark:text-white">{title}</CardTitle>
        </div>
        {actions && <div className="flex items-center space-x-1">{actions}</div>}
      </CardHeader>
      <CardContent className={cn("pt-4 px-4 pb-4 flex-grow overflow-y-auto text-foreground")}>
        {description && typeof description === 'string' ? (
          <CardDescription className="text-muted-foreground mb-4 text-sm">{description}</CardDescription>
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
