
"use client";

import React, { useEffect } from 'react';
import type { Message, ToolCall } from 'ai';
import { 
    Eye, PlusCircle, Trash, ArrowClockwise, Gear, CheckCircle, Warning, GearSix, File, ChartBar, CreditCard 
} from 'phosphor-react';
import { cn } from '@/lib/utils';
import type { IconProps } from '@/types/icon';
import { KnowledgeBaseSearchResultSchema, SalesMetricsSchema, SubscriptionStatusSchema } from '@/lib/ai-schemas';
import { useAvatarTelemetry } from '@/hooks/use-avatar-telemetry';

const toolIcons: Record<string, React.ElementType<IconProps>> = {
  focusItem: Eye,
  addItem: PlusCircle,
  moveItem: ArrowClockwise, 
  removeItem: Trash,
  resetLayout: ArrowClockwise,
  default: Gear,
  closeAllInstancesOfApp: Trash,
  analyzeSecurityAlert: CheckCircle,
  searchKnowledgeBase: File, 
  getSalesMetrics: ChartBar, 
  getSubscriptionStatus: CreditCard,
  generateMarketingContent: Gear,
  generateWorkspaceInsights: Gear,
  summarizeWebpage: File,
};

const toolFriendlyNames: Record<string, string> = {
  focusItem: 'Focus Item',
  addItem: 'Add Item',
  moveItem: 'Move Item',
  removeItem: 'Remove Item',
  resetLayout: 'Reset Layout',
  closeAllInstancesOfApp: 'Close All',
  analyzeSecurityAlert: 'Analyze Security Alert',
  searchKnowledgeBase: 'Search Knowledge Base',
  getSalesMetrics: 'Get Sales Metrics',
  getSubscriptionStatus: 'Get Subscription Status',
  generateMarketingContent: 'Generate Content',
  generateWorkspaceInsights: 'Generate Insights',
  summarizeWebpage: 'Summarize Webpage',
};


/**
 * A component that formats the JSON result of a server-side tool call
 * into a more human-readable format.
 */
const ToolResultContent: React.FC<{ toolName: string; result: any }> = ({ toolName, result }) => {
  try {
    switch (toolName) {
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
    const { logEvent } = useAvatarTelemetry();

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
    
    useEffect(() => {
        logEvent('toolExecution', {
          emotionSignature: 'tool:started',
          metadata: { toolName, toolCallId, args: JSON.stringify(args) }
        });
    }, [logEvent, toolName, toolCallId, args]);
    
    useEffect(() => {
        if (!isLoading) {
            logEvent('toolExecution', {
                emotionSignature: isError ? 'tool:error' : 'tool:success',
                metadata: { toolName, toolCallId, result: JSON.stringify(result) }
            });
        }
    }, [isLoading, isError, logEvent, toolName, toolCallId, result]);


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
            return <code>Details: {result?.error || result?.message || 'An unknown error occurred.'}</code>;
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
            {isLoading ? <GearSix className="w-4 h-4 text-accent animate-spin"/> 
             : isError ? <Warning className="w-4 h-4 text-destructive"/> 
             : <CheckCircle className="w-4 h-4 text-chart-4"/>
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
