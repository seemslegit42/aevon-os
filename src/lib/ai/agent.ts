
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicTool, type DynamicToolInput } from '@langchain/core/tools';
import { z } from 'zod';
import * as SalesDataService from '@/services/sales-data.service';
import * as BillingService from '@/services/billing.service';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import type { LayoutItem } from '@/types/dashboard';

// =================================================================
// Agent State Definition
// =================================================================
export interface AgentState extends MessagesState {
  layout: LayoutItem[];
}

// =================================================================
// HELPER FOR CREATING TOOLS
// =================================================================
// This helper standardizes tool creation and adds error handling.
const createTool = (input: DynamicToolInput) => new DynamicTool({
  ...input,
  func: async (args) => {
    try {
      // Execute the original function
      const result = await input.func(args);
      // Ensure the result is always a string as the agent expects.
      return typeof result === 'string' ? result : JSON.stringify(result);
    } catch (error: any) {
      console.error(`Error in tool '${input.name}':`, error);
      // Return a structured error message for the agent to process.
      return JSON.stringify({ error: true, message: error.message || "An unexpected error occurred in the tool." });
    }
  }
});


// =================================================================
// SERVER-SIDE TOOLS (Business Logic, Data Fetching)
// =================================================================

const KNOWLEDGE_BASE = {
    'loom studio': 'Loom Studio is a visual workspace for designing, testing, and orchestrating complex AI workflows and prompt chains.',
    'aegis': 'Aegis is the security command center for AEVON OS. It provides a real-time overview of your security posture, including phishing resilience, cloud security, and endpoint detection.',
    'beep': 'BEEP (Behavioral Event & Execution Processor) is your natural language interface for tasking, information retrieval, and personalized briefings.',
    'micro-apps': 'Micro-apps are small, single-purpose applications that can be launched into the workspace for specific tasks, like sales analytics or content creation.',
    'armory': 'The Armory is your portal for managing your AEVON OS subscription and exploring add-ons.',
};

const searchKnowledgeBaseTool = createTool({
    name: 'searchKnowledgeBase',
    description: 'Searches the AEVON OS internal knowledge base for information about its features.',
    schema: z.object({
        query: z.string().describe("The user's question about an OS feature."),
    }),
    func: async ({ query }) => {
        const lowerQuery = query.toLowerCase();
        for (const key in KNOWLEDGE_BASE) {
            if (lowerQuery.includes(key)) {
                return { found: true, answer: KNOWLEDGE_BASE[key as keyof typeof KNOWLEDGE_BASE] };
            }
        }
        return { found: false, answer: "I couldn't find any information on that topic in the knowledge base." };
    }
});

const getSalesMetricsTool = createTool({
    name: "getSalesMetrics",
    description: "Retrieves key sales metrics, such as total revenue and top-selling products.",
    schema: z.object({}),
    func: async () => {
        const totalRevenue = await SalesDataService.getTotalRevenue();
        const topProducts = await SalesDataService.getTopProducts(3);
        return {
            totalRevenue,
            topProducts,
            trend: "Sales are showing a positive upward trend over the last several months.",
        };
    },
});

const getSubscriptionStatusTool = createTool({
    name: "getSubscriptionStatus",
    description: "Retrieves the user's current subscription plan, status, and renewal date.",
    schema: z.object({}),
    func: async () => {
        return await BillingService.getSubscriptionStatus();
    }
});

// =================================================================
// CLIENT-SIDE TOOLS (UI Manipulation)
// These tools have placeholder functions on the server. The agent calls them,
// but the actual execution happens on the client in `use-beep-chat.ts`.
// =================================================================
const staticItemIds = [...ALL_CARD_CONFIGS.map((p) => p.id), ...ALL_MICRO_APPS.map((a) => a.id)];
const createClientTool = (name: string, description: string, schema: z.ZodObject<any>) => createTool({
    name,
    description,
    schema,
    func: async (args) => ({ success: true, message: `Client-side tool '${name}' called with arguments: ${JSON.stringify(args)}` })
});

const focusItemTool = createClientTool('focusItem', "Brings a specific window into focus on the user's canvas.", z.object({ instanceId: z.string() }));
const addItemTool = createClientTool('addItem', 'Adds a new Panel or launches a new Micro-App.', z.object({ itemId: z.string().enum(staticItemIds as [string, ...string[]]) }));
const moveItemTool = createClientTool('moveItem', "Moves a specific window to new coordinates.", z.object({ instanceId: z.string(), x: z.number(), y: z.number() }));
const removeItemTool = createClientTool('removeItem', "Closes a single, specific window.", z.object({ instanceId: z.string() }));
const closeAllInstancesOfAppTool = createClientTool('closeAllInstancesOfApp', "Closes ALL open windows of a specific Micro-App.", z.object({ appId: z.string() }));
const resetLayoutTool = createClientTool('resetLayout', 'Resets the entire dashboard layout to its default configuration.', z.object({}));

// =================================================================
// AGENT SETUP
// =================================================================
const allTools = [
    searchKnowledgeBaseTool,
    getSalesMetricsTool,
    getSubscriptionStatusTool,
    focusItemTool,
    addItemTool,
    moveItemTool,
    removeItemTool,
    closeAllInstancesOfAppTool,
    resetLayoutTool,
];

const toolNode = new ToolNode(allTools);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  model: 'gemini-1.5-flash-latest',
}).bindTools(allTools);

const getSystemPrompt = (layout: LayoutItem[]) => {
  const openWindowsSummary = layout.length > 0
    ? layout.map(item => {
        const config = item.type === 'card' 
          ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
          : ALL_MICRO_APPS.find(a => a.id === item.appId);
        return `- ${config?.title || 'Unknown Item'} (instanceId: ${item.id})`;
      }).join('\n')
    : 'The user has an empty workspace.';

  return `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic.

**CONTEXT: CURRENT WORKSPACE**
Here are the windows currently open on the user's dashboard. Use the 'instanceId' to manipulate them with tools like 'focusItem' or 'removeItem'.
${openWindowsSummary}
---
**CONTEXT: AVAILABLE ITEMS**
Here are the items you can add to the workspace. Use the static 'id' with the 'addItem' tool.
Available Panels:
${ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n')}
Available Micro-Apps:
${ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n')}
---
**PRIMARY DIRECTIVE**
1.  Analyze the user's request to determine the main task.
2.  Select the most appropriate tool(s) to accomplish the task. You can call multiple tools in parallel.
3.  If a tool fails, explain the error to the user and ask for clarification if needed.
4.  After successfully calling a UI tool (like adding or moving a window), also generate a brief, natural language confirmation for the user. E.g., "Done. I've added the Loom Studio to your workspace."
5.  If the user asks a general question, use the knowledge base tool first before attempting to answer from your own knowledge.
`;
}

// =================================================================
// AGENT GRAPH
// =================================================================

// Node that calls the model
const callModelNode = async (state: AgentState) => {
  const { messages, layout } = state;
  const systemPrompt = getSystemPrompt(layout || []);
  // Insert the system prompt at the beginning of the conversation.
  const messagesWithSystemPrompt = [new HumanMessage(systemPrompt), ...messages];
  const response = await model.invoke(messagesWithSystemPrompt);
  return { messages: [response] };
};

// Router that decides whether to call tools or end the turn.
const shouldInvokeToolsRouter = (state: AgentState) => {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return END;
  }
  return 'tools';
};

const workflow = new StateGraph<AgentState>({
    channels: { 
        messages: { 
            value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), 
            default: () => [] 
        },
        layout: {
            value: (x, y) => y ?? x,
            default: () => []
        }
    }
});

workflow.addNode('agent', callModelNode);
workflow.addNode('tools', toolNode);

workflow.addConditionalEdges('agent', shouldInvokeToolsRouter, {
  tools: 'tools',
  [END]: END,
});
workflow.addEdge('tools', 'agent');

workflow.addEntryPoint(START);

export const agentGraph = workflow.compile();
