
"use client";

import React from 'react';
import type { Message, ToolCall } from 'ai';
import {
  EyeIcon,
  PlusCircleIcon,
  TrashIcon,
  RefreshIcon,
  SettingsIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AIProcessingIcon,
  FileIcon,
  FinancialReportIcon,
  CreditCardIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icon';
import { TextCategorySchema, InvoiceDataSchema, KnowledgeBaseSearchResultSchema, SalesMetricsSchema, SubscriptionStatusSchema } from '@/lib/ai-schemas';

const toolIcons: Record<string, React.ElementType<IconProps>> = {
  focusItem: EyeIcon,
  addItem: PlusCircleIcon,
  moveItem: RefreshIcon, // Substitute for ArrowRightLeftIcon
  removeItem: TrashIcon,
  resetLayout: RefreshIcon,
  categorizeText: SettingsIcon,
  extractInvoiceData: SettingsIcon,
  default: SettingsIcon,
  closeAllInstancesOfApp: TrashIcon,
  logAndAlertAegis: CheckCircleIcon,
  searchKnowledgeBase: FileIcon, // Substitute for BookOpenIcon
  getSalesMetrics: FinancialReportIcon, // Substitute for DollarSignIcon
  getSubscriptionStatus: CreditCardIcon,
};

const toolFriendlyNames: Record<string, string> = {
  focusItem: 'Focus Item',
  addItem: 'Add Item',
  moveItem: 'Move Item',
  removeItem: 'Remove Item',
  resetLayout: 'Reset Layout',
  categorizeText: 'Categorize Text',
  extractInvoiceData: 'Extract Invoice Data',
  closeAllInstancesOfApp: 'Close All',
  logAndAlertAegis: 'Log Event',
  searchKnowledgeBase: 'Search Knowledge Base',
  getSalesMetrics: 'Get Sales Metrics',
  getSubscriptionStatus: 'Get Subscription Status',
};


/**
 * A component that formats the JSON result of a server-side tool call
 * into a more human-readable format.
 */
const ToolResultContent: React.FC<{ toolName: string; result: any }> = ({ toolName, result }) => {
  try {
    switch (toolName) {
      case 'categorizeText': {
        const { category, isMatch } = TextCategorySchema.parse(result);
        return (
          <div className="text-foreground font-sans text-xs space-y-1">
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Is Match:</strong> {isMatch ? 'Yes' : 'No'}</p>
          </div>
        );
      }
      case 'extractInvoiceData': {
        const data = InvoiceDataSchema.parse(result);
        return (
          <div className="text-foreground font-sans text-xs space-y-1">
            {data.invoiceNumber && <p><strong>Invoice #:</strong> {data.invoiceNumber}</p>}
            {data.amount && <p><strong>Amount:</strong> ${data.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
            {data.dueDate && <p><strong>Due Date:</strong> {data.dueDate}</p>}
            {data.summary && <p className="pt-1 italic text-muted-foreground">{data.summary}</p>}
          </div>
        );
      }
      case 'searchKnowledgeBase': {
          const { answer } = KnowledgeBaseSearchResultSchema.parse(result);
           return (
            <div className="text-foreground font-sans text-xs space-y-1">
                <p>{answer}</p>
            </div>
           );
      }
      case 'getSalesMetrics': {
        const data = SalesMetricsSchema.parse(result);
        return (
          <div className="text-foreground font-sans text-xs space-y-2">
            <p className="text-sm">
                <strong>Total Revenue:</strong> 
                <span className="font-bold text-chart-4"> ${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
            <div>
              <p className="font-semibold">Top Products:</p>
              <ul className="list-disc pl-4 text-muted-foreground">
                {data.topProducts.map((p) => (
                  <li key={p.name}>
                    {p.name}: ${p.revenue.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            {data.trend && <p className="text-xs italic text-muted-foreground">{data.trend}</p>}
          </div>
        );
      }
      case 'getSubscriptionStatus': {
        const data = SubscriptionStatusSchema.parse(result);
        return (
          <div className="text-foreground font-sans text-xs space-y-1">
              <p><strong>Plan:</strong> {data.planName}</p>
              <p><strong>Status:</strong> <span className="capitalize">{data.status}</span></p>
              <p><strong>Renews:</strong> {new Date(data.renewsOn).toLocaleDateString()}</p>
              <a href={data.manageUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline">Manage Billing</a>
          </div>
        );
      }
      default:
        // Fallback for other tools (e.g. client-side simple messages) or unknown tools
        return <code className="text-xs">{JSON.stringify(result, null, 2)}</code>;
    }
  } catch (e) {
    // If parsing fails, just show the raw string
    console.error("Failed to parse tool result content:", e);
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
        "glassmorphism-panel my-3 mx-auto w-full max-w-md p-3 text-xs transition-all",
        isLoading && "border-accent/50 bg-accent/10",
        !isLoading && isError && "border-destructive/50 bg-destructive/10",
        !isLoading && !isError && "border-chart-4/50 bg-chart-4/10",
      )}>
        <div className="flex items-center gap-3 font-semibold mb-2">
            {isLoading ? <AIProcessingIcon className="w-4 h-4 text-accent animate-spin"/> 
             : isError ? <AlertTriangleIcon className="w-4 h-4 text-destructive"/> 
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
