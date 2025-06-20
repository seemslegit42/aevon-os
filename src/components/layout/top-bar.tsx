
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Home, type LucideIcon, ChevronDown, BrainCircuit } from 'lucide-react'; // Removed LayoutGrid
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  showDropdown?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home Dashboard', icon: Home, showDropdown: true },
  // Other nav items like Loom Studio, Aegis Security, Armory can be added here
  // Example:
  // { href: '/loom-studio', label: 'Loom Studio', icon: Settings /* Or other relevant icon */ },
  // { href: '/aegis-security', label: 'Aegis Security', icon: Shield },
  // { href: '/armory', label: 'Armory', icon: ShoppingCart },
];

const TopBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full topbar-custom-bg font-headline text-gray-800 dark:text-primary-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <BrainCircuit className="w-7 h-7 mr-2 text-white" />
               <span className="text-accent dark:text-white">ΛΞVON OS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10",
                      (pathname === item.href || (item.href === '/' && pathname.startsWith('/dashboard'))) && "active-nav-link-dark font-semibold" 
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.showDropdown && <ChevronDown className="w-4 h-4 ml-1 opacity-70" />}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full h-9 pl-10 pr-16 bg-background/50 dark:bg-white/5 border-border/50 dark:border-white/20 text-sm text-primary-foreground dark:text-primary-foreground placeholder-muted-foreground dark:placeholder-neutral-400 focus:ring-primary focus:border-primary"
                aria-label="Command or search input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-muted/50 bg-muted/20 px-1.5 font-mono text-[10px] font-medium text-primary-foreground opacity-100">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
          
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
    
