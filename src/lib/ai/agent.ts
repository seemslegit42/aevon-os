
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicTool, type DynamicToolInput } from '@langchain/core/tools';
import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import eventBus from '../event-bus';

import * as SalesDataService from '@/services/sales-data.service';
import * as BillingService from '@/services/billing.service';

import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import type { LayoutItem } from '@/types/dashboard';
import { 
    AegisSecurityAnalysisSchema, 
    AiInsightsSchema, 
    ContentGenerationSchema, 
    InvoiceDataSchema, 
    KnowledgeBaseSearchResultSchema, 
    SalesMetricsSchema, 
    SubscriptionStatusSchema, 
    TextCategorySchema 
} from '../ai-schemas';

// =================================================================
// Agent State Definition (Modern LangGraph Standard)
// =================================================================
export interface AgentState extends MessagesState {
  layout: LayoutItem[];
}

// =================================================================
// Robust Tool Creation & Error Handling
// =================================================================
/**
 * A robust wrapper for creating DynamicTools. It adds standardized error
 * handling and ensures the output is always a stringified JSON, which
 * is what the LangChain agent framework expects. It also differentiates
 * between server-side and client-side tools.
 * @param input The tool definition, with an added `isClientSide` flag.
 * @returns A new DynamicTool instance.
 */
const createTool = (input: DynamicToolInput & { isClientSide?: boolean }) => new DynamicTool({
  ...input,
  func: async (args) => {
    // For client-side tools, we just pass the arguments through.
    // The client-side `onToolCall` handler will execute the logic.
    if (input.isClientSide) {
      return JSON.stringify({ success: true, message: `Client-side tool ${input.name} called.` });
    }
    // For server-side tools, we execute the function and handle errors.
    try {
      const result = await input.func(args);
      // Emit successful results to the event bus for decoupled UI updates
      if (input.name === 'analyzeSecurityAlert') eventBus.emit('aegis:analysis-result', result);
      if (input.name === 'generateWorkspaceInsights') eventBus.emit('insights:result', result);
      if (input.name === 'generateMarketingContent') eventBus.emit('content:result', result);

      return JSON.stringify(result);
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred in the tool.";
      console.error(`Error in tool '${input.name}':`, errorMessage);
      // Emit errors to the event bus
      if (input.name === 'analyzeSecurityAlert') eventBus.emit('aegis:analysis-error', errorMessage);
      if (input.name === 'generateWorkspaceInsights') eventBus.emit('insights:error', errorMessage);
      if (input.name === 'generateMarketingContent') eventBus.emit('content:error', errorMessage);
      
      return JSON.stringify({ error: true, message: errorMessage });
    }
  }
});

// =================================================================
// SERVER-SIDE TOOLS (Business Logic, Data Fetching, AI Generation)
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
    description: "Searches the AEVON OS internal knowledge base for information about its features. Use this first for any 'what is' or 'how to' questions.",
    schema: z.object({ query: z.string().describe("The user's question about an OS feature.") }),
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
    func: async () => await BillingService.getSubscriptionStatus()
});

const analyzeSecurityAlertTool = createTool({
    name: "analyzeSecurityAlert",
    description: "Performs a security analysis on a given alert, providing a structured response.",
    schema: z.object({ alertDetails: z.string().describe("The stringified JSON of the security alert.") }),
    func: async ({ alertDetails }) => {
        const { object: analysis } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: AegisSecurityAnalysisSchema,
            prompt: `You are a senior security analyst for the Aegis defense system. Your role is to analyze security alerts, determine their severity, identify the threats, and recommend clear, actionable steps for mitigation. Analyze the following security alert data: ${alertDetails}`
        });
        return analysis;
    }
});

const generateWorkspaceInsightsTool = createTool({
    name: "generateWorkspaceInsights",
    description: "Analyzes the user's current workspace layout to generate personalized, actionable insights.",
    schema: z.object({ layout: z.any().describe("The current layout of the user's dashboard, passed from the agent state.") }),
    func: async ({ layout }) => {
        const openWindowsSummary = layout.length > 0
            ? layout.map((item: LayoutItem) => {
                const config = item.type === 'card' ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId) : ALL_MICRO_APPS.find(a => a.id === item.appId);
                return `- ${config?.title || 'Unknown Item'} (instanceId: ${item.id})`;
            }).join('\n')
            : 'The user has an empty workspace.';

        const { object: insights } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: AiInsightsSchema,
            prompt: `You are an AI assistant for AEVON OS. Based on the user's current layout, provide a maximum of 3 short, actionable insights. You may suggest adding an item with the 'addItem' tool or focusing an existing item with the 'focusItem' tool. Current layout:\n${openWindowsSummary}`
        });
        return insights;
    }
});

const generateMarketingContentTool = createTool({
    name: "generateMarketingContent",
    description: "Generates marketing content based on a topic, content type, and tone.",
    schema: z.object({
        topic: z.string(),
        contentType: z.string(),
        tone: z.string()
    }),
    func: async ({ topic, contentType, tone }) => {
        const { object: content } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: ContentGenerationSchema,
            prompt: `You are an expert content creator. Generate a piece of content. Topic: ${topic}, Type: ${contentType}, Tone: ${tone}.`
        });
        return content;
    }
});

// =================================================================
// CLIENT-SIDE UI MANIPULATION TOOLS
// =================================================================
const staticItemIds = [...ALL_CARD_CONFIGS.map((p) => p.id), ...ALL_MICRO_APPS.map((a) => a.id)];

const focusItemTool = createTool({ name: 'focusItem', description: "Brings a specific window into focus on the user's canvas.", schema: z.object({ instanceId: z.string() }), func: async () => {}, isClientSide: true });
const addItemTool = createTool({ name: 'addItem', description: 'Adds a new Panel or launches a new Micro-App.', schema: z.object({ itemId: z.string().enum(staticItemIds as [string, ...string[]]) }), func: async () => {}, isClientSide: true });
const moveItemTool = createTool({ name: 'moveItem', description: "Moves a specific window to new coordinates.", schema: z.object({ instanceId: z.string(), x: z.number(), y: z.number() }), func: async () => {}, isClientSide: true });
const removeItemTool = createTool({ name: 'removeItem', description: "Closes a single, specific window.", schema: z.object({ instanceId: z.string() }), func: async () => {}, isClientSide: true });
const closeAllInstancesOfAppTool = createTool({ name: 'closeAllInstancesOfApp', description: "Closes ALL open windows of a specific Micro-App.", schema: z.object({ appId: z.string() }), func: async () => {}, isClientSide: true });
const resetLayoutTool = createTool({ name: 'resetLayout', description: 'Resets the entire dashboard layout to its default configuration.', schema: z.object({}), func: async () => {}, isClientSide: true });


// =================================================================
// AGENT SETUP & GRAPH DEFINITION
// =================================================================

const allTools = [
    // Server-side tools
    searchKnowledgeBaseTool,
    getSalesMetricsTool,
    getSubscriptionStatusTool,
    analyzeSecurityAlertTool,
    generateWorkspaceInsightsTool,
    generateMarketingContentTool,
    // Client-side tools
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
2.  If the request requires information about the workspace, use the 'generateWorkspaceInsights' tool.
3.  Select the most appropriate tool(s) to accomplish the task. You can call multiple tools in parallel.
4.  If a tool fails, explain the error to the user.
5.  After successfully calling a UI tool, also generate a brief, natural language confirmation for the user. E.g., "Done. I've added the Loom Studio to your workspace."
6.  If the user asks a general question, use the 'searchKnowledgeBase' tool first.
`;
}

// Node that calls the AI model
const callModelNode = async (state: AgentState) => {
  const { messages, layout } = state;
  const systemPrompt = getSystemPrompt(layout || []);
  const messagesWithSystemPrompt = [new HumanMessage(systemPrompt), ...messages];
  const response = await model.invoke(messagesWithSystemPrompt);
  return { messages: [response] };
};

// Router that decides whether to call tools or end
const shouldInvokeToolsRouter = (state: AgentState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage instanceof AIMessage && lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return 'tools';
  }
  return END;
};

// Define the graph
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

workflow.addEdge(START, 'agent');
workflow.addEdge('tools', 'agent');

// Compile the graph into a runnable object
export const agentGraph = workflow.compile();
