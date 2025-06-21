
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { RocketIcon } from '@/components/icons';
import { useMicroApps } from '@/hooks/use-micro-apps';

const ArmoryCardContent: React.FC = () => {
  const { setOpen: setCommandPaletteOpen } = useCommandPaletteStore();
  const apps = useMicroApps();

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-6">
        <div className="text-center">
            <h3 className="font-headline text-lg text-primary dark:text-primary-foreground mt-2 mb-2">Welcome to the Λrmory</h3>
            <p className="text-sm text-muted-foreground">
                Discover, acquire, and manage AI micro-apps and intelligent agents for your ΛΞVON OS.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <RocketIcon className="w-4 h-4 mr-2" />
              Launch Apps via Command Palette
            </Button>
        </div>

        <div>
          <h4 className="font-headline text-md text-primary dark:text-primary-foreground mb-3">Featured Apps</h4>
          {apps.length === 0 ? (
            <Card className="glassmorphism-panel">
              <CardContent className="pt-4">
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No micro-apps currently featured.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {apps.slice(0, 2).map(app => { // Show up to 2 featured apps
                    const AppIcon = app.icon;
                    return (
                        <Card key={app.id} className="glassmorphism-panel">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <AppIcon className="w-8 h-8 text-secondary mb-3" />
                                <h5 className="font-semibold text-foreground">{app.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ArmoryCardContent;
