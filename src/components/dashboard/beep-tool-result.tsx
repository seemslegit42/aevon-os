
"use client";

import React, { type ElementType } from 'react';
import type { Message } from 'ai/react';
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
  message: Message;
}

const BeepToolResult: React.FC<BeepToolResultProps> = ({ message }) => {
  try {
    const content = JSON.parse(message.content);
    const { toolName, message: resultMessage } = content;

    const Icon = toolIcons[toolName] || GearIcon;

    return (
      <div className="flex justify-center items-center my-3">
        <div className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-full",
            "border border-dashed border-border/50 bg-card/50"
        )}>
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span>{resultMessage}</span>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback for non-JSON or malformed tool results
    return (
      <div className="flex justify-center items-center my-3">
         <div className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-full",
            "border border-dashed border-border/50 bg-card/50"
        )}>
          <GearIcon className="w-3.5 h-3.5 text-primary" />
          <span>Tool action completed.</span>
        </div>
      </div>
    );
  }
};

export default BeepToolResult;
