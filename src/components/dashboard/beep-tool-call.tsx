
"use client";

import React from 'react';
import type { Message, ToolCall } from 'ai';
import {
  TargetIcon,
  PlusCircleIcon,
  ArrowRightLeftIcon,
  Trash2Icon,
  RefreshCwIcon,
  GearIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icon';

const toolIcons: Record<string, React.ElementType<IconProps>> = {
  focusItem: TargetIcon,
  addItem: PlusCircleIcon,
  moveItem: ArrowRightLeftIcon,
  removeItem: Trash2Icon,
  resetLayout: RefreshCwIcon,
  categorizeText: GearIcon,
  extractInvoiceData: GearIcon,
  default: GearIcon,
};

interface BeepToolCallDisplayProps {
  toolCall: ToolCall;
  allMessages: Message[];
}

const BeepToolCallDisplay: React.FC<BeepToolCallDisplayProps> = ({ toolCall, allMessages }) => {
    const { toolName, args, toolCallId } = toolCall;

    // Find the corresponding tool result message in the chat history
    const resultMessage = allMessages.find(msg => msg.role === 'tool' && msg.tool_call_id === toolCallId);

    let result: { success?: boolean; error?: string; message?: string; [key: string]: any } | null = null;
    if (resultMessage?.content) {
        try {
            result = JSON.parse(resultMessage.content);
        } catch (e) {
            result = { error: 'Failed to parse tool result.' };
        }
    }
    
    const isLoading = !result;
    const isError = result && (result.error || result.success === false);

    const Icon = toolIcons[toolName] || toolIcons.default;
    
    const getTitle = () => {
        if (isLoading) return `Running: ${toolName}`;
        if (isError) return `Error: ${toolName}`;
        return `Success: ${toolName}`;
    };

    const getDetails = () => {
        if (isLoading) {
            // Show a friendly version of the arguments
            return `Arguments: ${JSON.stringify(args, null, 2)}`;
        }
        if (isError) {
            return `Details: ${result?.error || 'An unknown error occurred.'}`;
        }
        if (result) {
            // For client-side tools with a predefined message
            if (result.message) return result.message;
            // For server-side tools (like text categorization), pretty-print the whole result
            return JSON.stringify(result, null, 2);
        }
        return 'Tool execution completed.';
    };

    return (
      <div className={cn(
        "my-3 mx-auto w-full max-w-md border rounded-lg p-3 text-xs shadow-md transition-all",
        isLoading && "border-accent/50 bg-accent/10",
        !isLoading && isError && "border-destructive/50 bg-destructive/10",
        !isLoading && !isError && "border-chart-4/50 bg-chart-4/10",
      )}>
        <div className="flex items-center gap-3 font-semibold mb-2">
            {isLoading ? <LoaderIcon className="w-4 h-4 text-accent"/> 
             : isError ? <AlertCircleIcon className="w-4 h-4 text-destructive"/> 
             : <CheckCircleIcon className="w-4 h-4 text-chart-4"/>
            }
            <Icon className="w-4 h-4 text-muted-foreground"/>
            <span className={cn(
                "font-headline",
                isError && "text-destructive", 
                !isError && "text-foreground"
            )}>{getTitle()}</span>
        </div>
        <pre className="text-muted-foreground bg-background/30 p-2 rounded-md whitespace-pre-wrap font-mono text-[11px] max-h-40 overflow-auto">
            <code>
                {getDetails()}
            </code>
        </pre>
      </div>
    );
};

export default BeepToolCallDisplay;
