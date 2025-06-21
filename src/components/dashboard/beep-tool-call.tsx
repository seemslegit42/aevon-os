
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
import { TextCategorySchema, InvoiceDataSchema, type TextCategory, type InvoiceData } from '@/lib/ai-schemas';

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

const toolFriendlyNames: Record<string, string> = {
  focusItem: 'Focus Item',
  addItem: 'Add Item',
  moveItem: 'Move Item',
  removeItem: 'Remove Item',
  resetLayout: 'Reset Layout',
  categorizeText: 'Categorize Text',
  extractInvoiceData: 'Extract Invoice Data',
};


/**
 * A component that formats the JSON result of a server-side tool call
 * into a more human-readable format.
 */
const ToolResultContent: React.FC<{ toolName: string; result: any }> = ({ toolName, result }) => {
  try {
    const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

    switch (toolName) {
      case 'categorizeText':
        const { category, isMatch } = TextCategorySchema.parse(parsedResult);
        return (
          <div className="text-foreground font-sans text-xs space-y-1">
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Is Match:</strong> {isMatch ? 'Yes' : 'No'}</p>
          </div>
        );
      case 'extractInvoiceData':
        const data = InvoiceDataSchema.parse(parsedResult);
        return (
          <div className="text-foreground font-sans text-xs space-y-1">
            {data.invoiceNumber && <p><strong>Invoice #:</strong> {data.invoiceNumber}</p>}
            {data.amount && <p><strong>Amount:</strong> ${data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
            {data.dueDate && <p><strong>Due Date:</strong> {data.dueDate}</p>}
            {data.summary && <p className="pt-1 italic text-muted-foreground">{data.summary}</p>}
          </div>
        );
      default:
        // Fallback for other tools (e.g. client-side simple messages) or unknown tools
        return <code className="text-xs">{JSON.stringify(parsedResult, null, 2)}</code>;
    }
  } catch (e) {
    // If parsing fails, just show the raw string
    return <code>{String(result)}</code>;
  }
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
            // Server-side tools return stringified JSON. Client-side tools return an object.
            result = typeof resultMessage.content === 'string' 
              ? JSON.parse(resultMessage.content) 
              : resultMessage.content;
        } catch (e) {
            result = { error: 'Failed to parse tool result.' };
        }
    }
    
    const isLoading = !result;
    const isError = result && (result.error || result.success === false);
    const friendlyName = toolFriendlyNames[toolName] || toolName;
    const Icon = toolIcons[toolName] || toolIcons.default;


    const getTitle = () => {
        if (isLoading) return `Running: ${friendlyName}`;
        if (isError) return `Error: ${friendlyName}`;
        return `Success: ${friendlyName}`;
    };

    const getDetails = () => {
        if (isLoading) {
            return <code>Arguments: {JSON.stringify(args, null, 2)}</code>
        }
        if (isError) {
            return <code>Details: {result?.error || 'An unknown error occurred.'}</code>;
        }
        if (result) {
            // For client-side tools with a predefined message
            if (result.message) return <code>{result.message}</code>;
            // For server-side tools with structured data, use the formatter component
            return <ToolResultContent toolName={toolName} result={result} />;
        }
        return <code>Tool execution completed.</code>;
    };

    return (
      <div className={cn(
        "my-3 mx-auto w-full max-w-md border rounded-lg p-3 text-xs shadow-md transition-all",
        isLoading && "border-accent/50 bg-accent/10",
        !isLoading && isError && "border-destructive/50 bg-destructive/10",
        !isLoading && !isError && "border-chart-4/50 bg-chart-4/10",
      )}>
        <div className="flex items-center gap-3 font-semibold mb-2">
            {isLoading ? <LoaderIcon className="w-4 h-4 text-accent animate-spin"/> 
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
        <div className="bg-background/30 p-2 rounded-md max-h-60 overflow-auto pretty-scrollbar">
            {getDetails()}
        </div>
      </div>
    );
};

export default BeepToolCallDisplay;
