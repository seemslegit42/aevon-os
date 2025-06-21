
"use client";

import React, { type ElementType } from 'react';
import type { ToolCall } from 'ai';
import {
  TargetIcon,
  PlusCircleIcon,
  ArrowRightLeftIcon,
  Trash2Icon,
  RefreshCwIcon,
  GearIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icon';

// Map tool names to their corresponding icons for visual representation
const toolIcons: Record<string, ElementType<IconProps>> = {
  focusItem: TargetIcon,
  addItem: PlusCircleIcon,
  moveItem: ArrowRightLeftIcon,
  removeItem: Trash2Icon,
  resetLayout: RefreshCwIcon,
};

interface BeepToolResultProps {
  toolCall: ToolCall;
}

const BeepToolResult: React.FC<BeepToolResultProps> = ({ toolCall }) => {
    const { toolName, args } = toolCall;
    const Icon = toolIcons[toolName] || GearIcon;
    let message = `Executing ${toolName}...`;

    // Create more user-friendly messages based on tool and args
    switch (toolName) {
        case 'focusItem': message = `Focusing on ${args.itemId}`; break;
        case 'addItem': message = `Adding ${args.itemId}`; break;
        case 'moveItem': message = `Moving ${args.itemId}`; break;
        case 'removeItem': message = `Removing ${args.itemId}`; break;
        case 'resetLayout': message = 'Resetting workspace layout'; break;
    }

    return (
      <div className="flex justify-center items-center my-3">
        <div className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-full",
            "border border-dashed border-border/50 bg-card/50"
        )}>
          <Icon className="w-3.5 h-3.5 text-primary animate-spin" />
          <span>{message}</span>
        </div>
      </div>
    );
};

export default BeepToolResult;
