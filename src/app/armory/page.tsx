"use client";

import React, { useState } from 'react';
import { useMicroApps } from '@/hooks/use-micro-apps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLayoutStore } from '@/stores/layout.store';
import Link from 'next/link';
import IconDetailModal from '@/components/IconDetailModal';
import type { MicroApp } from '@/stores/micro-app.store';

export default function ArmoryPage() {
  const allApps = useMicroApps();
  const { toast } = useToast();
  const { launchApp } = useLayoutStore.getState();
  const [selectedApp, setSelectedApp] = useState<MicroApp | null>(null);

  const handleLaunch = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation(); // Prevent card click from firing
    const appToLaunch = allApps.find(app => app.id === appId);
    if (appToLaunch) {
        launchApp(appToLaunch);
        toast({
            title: "App Launched",
            description: (
              <div>
                <p>{appToLaunch.title} has been launched.</p>
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="/">Go to Dashboard</Link>
                </Button>
              </div>
            ),
        });
    }
  };

  const formatAppForModal = (app: MicroApp | null) => {
      if (!app) return null;
      return {
          component: app.icon,
          name: app.title,
          tags: app.tags,
          defaultStrokeWidth: 1.8 // A sensible default
      };
  };

  return (
    <div className="h-full p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline text-primary mb-2">ΛΞVON Λrmory</h1>
      <p className="text-muted-foreground mb-6">Discover and launch powerful micro-apps to extend your OS capabilities.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allApps.map(app => {
          const AppIcon = app.icon;
          return (
            <Card 
                key={app.id} 
                className="glassmorphism-panel flex flex-col hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedApp(app)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <AppIcon className="w-10 h-10 text-primary" />
                  <div className="flex-1">
                    <CardTitle className="font-headline text-lg">{app.title}</CardTitle>
                    <CardDescription className="text-xs">{app.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {app.tags && app.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {app.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs capitalize bg-secondary/20 text-secondary-foreground border-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full btn-gradient-primary-secondary" onClick={(e) => handleLaunch(e, app.id)}>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Launch App
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <IconDetailModal 
        icon={formatAppForModal(selectedApp)}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        onTagClick={() => {}}
      />
    </div>
  );
}
