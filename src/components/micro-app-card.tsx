import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface MicroAppCardProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const MicroAppCard: React.FC<MicroAppCardProps> = ({ title, description, icon: Icon, children, className, actions }) => {
  return (
    <Card className={`glassmorphism-panel overflow-hidden flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/20 bg-primary/5 dark:bg-primary/10">
        <div className="flex items-center">
          {Icon && <Icon className="h-6 w-6 text-primary mr-3" />}
          <CardTitle className="text-xl font-headline text-primary">{title}</CardTitle>
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        {description && typeof description === 'string' ? (
          <CardDescription className="text-foreground/80 mb-4">{description}</CardDescription>
        ) : (
          description
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default MicroAppCard;
