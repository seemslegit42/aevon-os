
"use client";
import React, { useState, useEffect, type ElementType } from 'react';
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
import { PlusCircleIcon, Trash2Icon, SearchIcon, XIcon, GearIcon } from '@/components/icons';
import type { CardConfig } from '@/config/dashboard-cards.config';
import type { CardLayoutInfo } from '@/hooks/use-dashboard-layout';
import { useCommandPaletteStore } from '@/stores/command-palette.store';

interface CommandPaletteProps {
  allPossibleCards: CardConfig[];
  activeCardIds: string[];
  cardLayouts: CardLayoutInfo[];
  onAddCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onResetLayout: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  allPossibleCards,
  activeCardIds,
  cardLayouts,
  onAddCard,
  onRemoveCard,
  onResetLayout,
}) => {
  const { isOpen, setOpen } = useCommandPaletteStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = allPossibleCards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b border-border/30">
          <DialogTitle className="font-headline text-primary flex items-center gap-2"><GearIcon /> Manage Dashboard Zones</DialogTitle>
          <DialogDescription>Add, remove, or rearrange dashboard zones.</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search zones by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-input"
            />
             {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
          </div>
        </div>

        <ScrollArea className="flex-grow px-4 pb-4">
          <div className="space-y-3">
            {filteredCards.map(card => {
              const isActive = activeCardIds.includes(card.id);
              const Icon = card.icon as ElementType;
              return (
                <div
                  key={card.id}
                  className="flex items-start justify-between p-3 rounded-md bg-card/70 dark:bg-card/80 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1 mr-4">
                    <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{card.title}</span>
                      {card.description && (
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveCard(card.id)}
                        className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-[90px]"
                      >
                        <Trash2Icon className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddCard(card.id)}
                        className="text-primary border-primary/50 hover:bg-primary/10 w-[90px]"
                      >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    )}
                  </div>
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
          <Button onClick={() => setOpen(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
