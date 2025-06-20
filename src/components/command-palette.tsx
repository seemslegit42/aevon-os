
"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Trash2, Search, X } from 'lucide-react';
import type { CardConfig, CardLayoutInfo } from '@/app/page'; // Adjust path as necessary

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPossibleCards: CardConfig[];
  activeCardIds: string[];
  cardLayouts: CardLayoutInfo[];
  onAddCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onResetLayout: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onOpenChange,
  allPossibleCards,
  activeCardIds,
  cardLayouts,
  onAddCard,
  onRemoveCard,
  onResetLayout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = allPossibleCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b border-border/30">
          <DialogTitle className="font-headline text-primary">Manage Dashboard Zones</DialogTitle>
          <DialogDescription>Add, remove, or rearrange dashboard zones.</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 dark:bg-black/30 border-primary/30"
            />
             {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
          </div>
        </div>

        <ScrollArea className="flex-grow px-4 pb-4">
          <div className="space-y-3">
            {filteredCards.map(card => {
              const isActive = activeCardIds.includes(card.id);
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 rounded-md bg-card/70 dark:bg-black/20 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{card.title}</span>
                  </div>
                  {isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveCard(card.id)}
                      className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddCard(card.id)}
                      className="text-primary border-primary/50 hover:bg-primary/10"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
             {filteredCards.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No zones match your search.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-4 border-t border-border/30">
          <Button variant="outline" onClick={onResetLayout}>Reset Layout</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
