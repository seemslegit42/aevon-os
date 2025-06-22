"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoonIcon, SunIcon } from "@/components/icons"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 aevos-icon-styling-override" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 aevos-icon-styling-override" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="glassmorphism-panel">
          <p>Toggle Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
