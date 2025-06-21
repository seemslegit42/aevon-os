
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicTool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  AegisSecurityAnalysisSchema,
  ContentGenerationSchema,
  AiInsightsSchema,
  TextCategorySchema,
  InvoiceDataSchema,
  KnowledgeBaseSearchResultSchema,
  SalesMetricsSchema,
  SubscriptionStatusSchema,
} from '@/lib/ai-schemas';
import * as SalesDataService from '@/services/sales-data.service';
import * as BillingService from '@/services/billing.service';
import {
  ALL_CARD_CONFIGS,
  ALL_MICRO_APPS,
} from '@/config/dashboard-cards.config';
import type { LayoutItem } from '@/types/dashboard';


// =================================================================
// SERVER-SIDE BUSINESS LOGIC & KNOWLEDGE TOOLS
// =================================================================

const KNOWLEDGE_BASE = {
    'loom studio': 'Loom Studio is a visual workspace for designing, testing, and orchestrating complex AI workflows and prompt chains.',
    'aegis': 'Aegis is the security command center for AEVON OS. It provides a real-time overview of your security posture, including phishing resilience, cloud security, and endpoint detection.',
    'beep': 'BEEP (Behavioral Event & Execution Processor) is your natural language interface for tasking, information retrieval, and personalized briefings.',
    'micro-apps': 'Micro-apps are small, single-purpose applications that can be launched into the workspace for specific tasks, like sales analytics or content creation.',
    'armory': 'The Armory is your portal for managing your AEVON OS subscription and exploring add-ons.',
};

const searchKnowledgeBaseTool = new DynamicTool({
    name: 'searchKnowledgeBase',
    description: 'Searches the AEVON OS internal knowledge base for information about its features.',
    schema: z.object({
        query: z.string().describe("The user's question about an OS feature."),
    }),
    func: async ({ query }) => {
        const lowerQuery = query.toLowerCase();
        for (const key in KNOWLEDGE_BASE) {
            if (lowerQuery.includes(key)) {
                return JSON.stringify({ found: true, answer: KNOWLEDGE_BASE[key as keyof typeof KNOWLEDGE_BASE] });
            }
        }
        return JSON.stringify({ found: false, answer: "I couldn't find any information on that topic in the knowledge base." });
    }
});

const getSalesMetricsTool = new DynamicTool({
    name: "getSalesMetrics",
    description: "Retrieves key sales metrics, such as total revenue and top-selling products.",
    schema: z.object({}),
    func: async () => {
        const totalRevenue = await SalesDataService.getTotalRevenue();
        const topProducts = await SalesDataService.getTopProducts(3);
        const result: z.infer<typeof SalesMetricsSchema> = {
            totalRevenue,
            topProducts,
            trend: "Sales are showing a positive upward trend over the last several months.",
        };
        return JSON.stringify(result);
    },
});

const getSubscriptionStatusTool = new DynamicTool({
    name: "getSubscriptionStatus",
    description: "Retrieves the user's current subscription plan, status, and renewal date.",
    schema: z.object({}),
    func: async () => {
        const status = await BillingService.getSubscriptionStatus();
        const result: z.infer<typeof SubscriptionStatusSchema> = {
            planName: status.planName,
            status: status.status,
            renewsOn: status.renewsOn,
            manageUrl: status.manageUrl,
        };
        return JSON.stringify(result);
    }
});

const categorizeTextTool = new DynamicTool({
  name: 'categorizeText',
  description: 'Analyzes a piece of text and determines its category. This should be the first step for any text analysis.',
  schema: TextCategorySchema,
  func: async ({ text }: { text: string }) => {
      // This tool is now primarily handled client-side by the agent's reasoning,
      // but the server implementation is kept for direct calls if needed.
      return JSON.stringify({ category: 'Not Implemented on Server', isMatch: false });
  },
});

const extractInvoiceDataTool = new DynamicTool({
  name: 'extractInvoiceData',
  description: 'Extracts structured data from invoice text.',
  schema: InvoiceDataSchema,
  func: async ({ text }: { text: string }) => {
     return JSON.stringify({ summary: 'Not Implemented on Server' });
  },
});

const logAndAlertAegisTool = new DynamicTool({
    name: 'logAndAlertAegis',
    description: 'Logs the result of a workflow and prepares an alert for the security system.',
    schema: z.object({ analysisSummary: z.string() }),
    func: async ({ analysisSummary }) => {
        console.log(`WORKFLOW LOG & ALERT: ${analysisSummary}`);
        return JSON.stringify({ status: "Logged OK", summary: analysisSummary });
    },
});


// =================================================================
// CLIENT-SIDE UI MANIPULATION TOOLS
// =================================================================

const staticItemIds = [...ALL_CARD_CONFIGS.map((p) => p.id), ...ALL_MICRO_APPS.map((a) => a.id)];
const focusItemTool = new DynamicTool({ name: 'focusItem', description: "Brings a specific window into focus on the user's canvas.", schema: z.object({ instanceId: z.string() }), func: async () => '' });
const addItemTool = new DynamicTool({ name: 'addItem', description: 'Adds a new Panel or launches a new Micro-App.', schema: z.object({ itemId: z.string().enum(staticItemIds as [string, ...string[]]) }), func: async () => '' });
const moveItemTool = new DynamicTool({ name: 'moveItem', description: "Moves a specific window to new coordinates.", schema: z.object({ instanceId: z.string(), x: z.number(), y: z.number() }), func: async () => '' });
const removeItemTool = new DynamicTool({ name: 'removeItem', description: "Closes a single, specific window.", schema: z.object({ instanceId: z.string() }), func: async () => '' });
const closeAllInstancesOfAppTool = new DynamicTool({ name: 'closeAllInstancesOfApp', description: "Closes ALL open windows of a specific Micro-App.", schema: z.object({ appId: z.string() }), func: async () => '' });
const resetLayoutTool = new DynamicTool({ name: 'resetLayout', description: 'Resets the entire dashboard layout to its default configuration.', schema: z.object({}), func: async () => '' });

// =================================================================
// AGENT SETUP
// =================================================================

const serverTools = [ getSalesMetricsTool, getSubscriptionStatusTool, searchKnowledgeBaseTool, logAndAlertAegisTool, categorizeTextTool, extractInvoiceDataTool ];
const allTools = [ ...serverTools, focusItemTool, addItemTool, moveItemTool, removeItemTool, resetLayoutTool, closeAllInstancesOfAppTool ];
const toolExecutor = new ToolNode(serverTools);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  model: 'gemini-1.5-flash-latest',
}).bindTools(allTools);

const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availableApps = ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n');

// =================================================================
// AGENT STATE & GRAPH
// =================================================================

interface AgentState extends MessagesState {
  layout?: LayoutItem[];
  task?: string;
  data?: any;
}

const getSystemPrompt = (layout: LayoutItem[]) => {
  const openWindowsSummary = layout.length > 0
    ? layout.map(item => {
        const config = item.type === 'card' 
          ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
          : ALL_MICRO_APPS.find(a => a.id === item.appId);
        return `- ${config?.title || 'Unknown Item'} (instanceId: ${item.id})`;
      }).join('\n')
    : 'No windows are currently open.';

  return `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You have access to a suite of tools to manage the user's workspace and analyze text and data.

**CONTEXT: CURRENT WORKSPACE**
Here are the windows currently open on the user's dashboard. Use the 'instanceId' to manipulate them.
${openWindowsSummary}
---
**CONTEXT: AVAILABLE ITEMS**
Here are the items you can add. Use the static 'id' with the 'addItem' tool.
Available Panels:
${availablePanels}
Available Micro-Apps:
${availableApps}
---
**RULES FOR UI MANIPULATION**
1.  **Check Open Windows First:** Before taking any action, review the 'Open Windows' list.
2.  **Use Instance IDs vs. Item IDs:** For any action on an *already open* window (focus, move, remove), you MUST use the unique 'instanceId'. To add a *new* item, use its static 'itemId'.
3.  **Handle Ambiguity:** If a user's command is ambiguous (e.g., "close sales"), you MUST ask for clarification.
4.  **Confirm Actions:** After you call a UI tool, also generate a brief, confirmatory message for the user. E.g., "Done. I've added the Loom Studio." You can generate text and call tools in the same turn.

**RULES FOR DATA & KNOWLEDGE**
- For questions about OS features (e.g., "what is loom"), use \`searchKnowledgeBase\`.
- For questions about sales data or revenue, use \`getSalesMetrics\`.
- For questions about billing or subscriptions, use \`getSubscriptionStatus\`.
- For simple, conversational questions, just respond directly.
`;
}


const callModel = async (state: AgentState) => {
  const { messages, layout, task, data } = state;
  const systemPrompt = getSystemPrompt(layout || []);
  const response = await model.invoke([new HumanMessage(systemPrompt), ...messages]);
  return { messages: [response] };
};

const shouldInvokeTools = (state: AgentState): 'tools' | '__end__' => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return '__end__';
  }

  // Only invoke the tool executor node if there's a server-side tool call.
  // Client-side tools are handled by the 'onToolCall' callback in the useChat hook.
  const hasServerToolCall = lastMessage.tool_calls.some(call => 
    serverTools.some(tool => tool.name === call.name)
  );

  return hasServerToolCall ? 'tools' : '__end__';
};


const workflow = new StateGraph<AgentState>({
    channels: { 
        messages: { 
            value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), 
            default: () => [] 
        },
        layout: {
            value: (x, y) => y ?? x, // Update layout if provided, otherwise keep existing
            default: () => []
        },
        task: {
            value: (x,y) => y,
            default: () => undefined
        },
        data: {
            value: (x,y) => y,
            default: () => undefined
        }
    }
});

workflow.addNode('agent', callModel);
workflow.addNode('tools', toolExecutor);

workflow.addEdge(START, 'agent');
workflow.addConditionalEdges('agent', shouldInvokeTools, {
  tools: 'tools',
  __end__: END,
});
workflow.addEdge('tools', 'agent');

export const agentGraph = workflow.compile();
