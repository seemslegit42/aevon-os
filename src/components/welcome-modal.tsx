
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Puzzle, Settings, RotateCw, Zap } from 'lucide-react';

const WELCOME_MODAL_KEY = 'aevon_welcome_modal_shown_v1';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    const hasBeenShown = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!hasBeenShown) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(WELCOME_MODAL_KEY, 'true');
    } catch (error) {
      console.error("Could not save to localStorage:", error);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg glassmorphism-panel">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary flex items-center gap-2">
             <Zap className="w-6 h-6 text-accent"/> Welcome to ΛΞVON OS
          </DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Your intelligent workspace is ready. Here are a few tips to get you started:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="flex items-start gap-4">
            <RotateCw className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">A Dynamic Canvas</h4>
              <p className="text-muted-foreground">All panels on your dashboard are draggable and resizable. Arrange your workspace exactly how you like it.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Settings className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Customize Your Layout</h4>
              <p className="text-muted-foreground">Click the <span className="inline-flex items-center justify-center bg-muted/50 rounded-sm p-0.5 align-middle"><Settings className="w-3 h-3"/></span> icon in the top bar to add, remove, or launch micro-apps.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Puzzle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Start Fresh</h4>
              <p className="text-muted-foreground">If things get messy, you can always restore the default layout from the settings panel.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full btn-gradient-primary-accent">
            Got It, Let's Begin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
