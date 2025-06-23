
"use client";

import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { CaretDown } from 'phosphor-react';
import { useAvatarPresetStore } from '@/stores/avatar-preset.store';

const UserMenu: React.FC = () => {
    const { presets, activePresetId, setActivePresetId } = useAvatarPresetStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2.5 hover:bg-primary/10">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                        <AvatarFallback className="text-xs bg-primary/50 text-primary-foreground">AU</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start leading-tight">
                        <span className="text-xs font-semibold text-foreground">Admin User</span>
                        <span className="text-xs text-muted-foreground">Pro Plan</span>
                    </div>
                    <CaretDown className="h-4 w-4 opacity-80 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glassmorphism-panel mt-2">
              <DropdownMenuLabel className="font-headline text-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/30"/>
              <DropdownMenuItem className="font-body text-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Profile</DropdownMenuItem>
              <DropdownMenuItem className="font-body text-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Billing</DropdownMenuItem>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="font-body text-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">
                    <span>Avatar Preset</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={activePresetId} onValueChange={(value) => setActivePresetId(value as any)}>
                    {presets.map(preset => (
                      <DropdownMenuRadioItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem className="font-body text-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30"/>
              <DropdownMenuItem className="font-body text-destructive hover:!bg-destructive/10 focus:text-destructive-foreground focus:bg-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
