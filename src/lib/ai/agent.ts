
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { generateObject } from 'ai';
import { DynamicTool } from '@langchain/core/tools';
import { z } from 'zod';
import {
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

// === 1. DEFINE TOOLS ===

// -- KNOWLEDGE BASE SIMULATION --
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


// -- SERVER-SIDE TOOLS --
const categorizeTextTool = new DynamicTool({
  name: 'categorizeText',
  description:
    'Analyzes a piece of text and determines its category. This should be the first step for any text analysis.',
  schema: z.object({
    text: z.string().describe('The text content to be categorized.'),
  }),
  func: async ({ text }) => {
    const { object: category } = await generateObject({
      model: new ChatGoogleGenerativeAI({ model: 'gemini-1.5-flash-latest' }).client,
      schema: TextCategorySchema,
      prompt: `You are an expert text classification agent. Analyze the following text and determine if it is an invoice.
      If it is an invoice, set 'isMatch' to true and 'category' to 'Invoice'.
      Otherwise, set 'isMatch' to false and provide a general category like 'General Inquiry', 'Spam', or 'Order Confirmation'.
      Text to analyze:
      ---
      ${text}
      ---
      `,
    });
    return JSON.stringify(category);
  },
});

const extractInvoiceDataTool = new DynamicTool({
  name: 'extractInvoiceData',
  description:
    'Extracts structured data (invoice number, amount, due date) from a text that has been identified as an invoice. Should only be used AFTER categorizeText confirms the text is an invoice.',
  schema: z.object({
    text: z.string().describe('The full text of the invoice to extract data from.'),
  }),
  func: async ({ text }) => {
    const { object: invoiceData } = await generateObject({
      model: new ChatGoogleGenerativeAI({ model: 'gemini-1.5-flash-latest' }).client,
      schema: InvoiceDataSchema,
      prompt: `You are a data extraction expert. Analyze the following invoice text and extract the required information into a structured JSON object.
      If a field is not present, omit it from the output.
      The due date should be in YYYY-MM-DD format if possible.
      Invoice text to analyze:
      ---
      ${text}
      ---
      `,
    });
    return JSON.stringify(invoiceData);
  },
});

const logAndAlertAegisTool = new DynamicTool({
    name: 'logAndAlertAegis',
    description: 'Logs the result of a workflow and prepares an alert for the security system. This is the final step after all analysis is complete.',
    schema: z.object({
        analysisSummary: z.string().describe('A brief summary of what was processed, e.g., "Invoice #123 extracted."'),
    }),
    func: async ({ analysisSummary }) => {
        // This function runs on the server. It could log to a database or other service.
        console.log(`WORKFLOW LOG & ALERT: ${analysisSummary}`);
        // The return value confirms to the agent that the step is complete.
        // The client-side component will see this and trigger the actual UI alert.
        return JSON.stringify({ status: "Logged OK", summary: analysisSummary });
    },
});

const getSalesMetricsTool = new DynamicTool({
    name: "getSalesMetrics",
    description: "Retrieves key sales metrics, such as total revenue and top-selling products.",
    schema: z.object({}), // No parameters needed for this summary tool
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

const serverTools = [
    categorizeTextTool,
    extractInvoiceDataTool,
    logAndAlertAegisTool,
    searchKnowledgeBaseTool,
    getSalesMetricsTool,
    getSubscriptionStatusTool,
];
const toolExecutor = new ToolNode(serverTools);

// -- CLIENT-SIDE TOOLS --
const staticItemIds = [
  ...ALL_CARD_CONFIGS.map((p) => p.id),
  ...ALL_MICRO_APPS.map((a) => a.id),
];

const focusItemTool = new DynamicTool({
    name: 'focusItem',
    description: "Brings a specific window into focus on the user's canvas. Use the 'instanceId' from the list of open windows.",
    schema: z.object({
        instanceId: z.string().describe("The unique instance ID of the window to focus on."),
    }),
    func: async () => '' // Dummy function, handled by client
});

const addItemTool = new DynamicTool({
    name: 'addItem',
    description: 'Adds a new Panel or launches a new Micro-App on the user\'s canvas. Use the static `itemId` for this.',
    schema: z.object({
        itemId: z.string().enum(staticItemIds as [string, ...string[]]).describe('The unique static ID of the item to add or launch.'),
    }),
    func: async () => ''
});

const moveItemTool = new DynamicTool({
    name: 'moveItem',
    description: "Moves a specific window to new coordinates. Use the 'instanceId' from the list of open windows.",
    schema: z.object({
        instanceId: z.string().describe("The unique instance ID of the window to move."),
        x: z.number().describe('The new x-coordinate for the top-left corner of the item.'),
        y: z.number().describe('The new y-coordinate for the top-left corner of the item.'),
    }),
    func: async () => ''
});

const removeItemTool = new DynamicTool({
    name: 'removeItem',
    description: "Closes a single, specific window. Use the 'instanceId' from the list of open windows.",
    schema: z.object({
        instanceId: z.string().describe("The unique instance ID of the window to remove or close."),
    }),
    func: async () => ''
});

const closeAllInstancesOfAppTool = new DynamicTool({
    name: 'closeAllInstancesOfApp',
    description: "Closes ALL open windows of a specific Micro-App. Use this when the user wants to remove an app entirely. Use the static 'appId'.",
    schema: z.object({
        appId: z.string().describe("The static ID of the app to close all instances of (e.g., 'app-analytics')."),
    }),
    func: async () => ''
})

const resetLayoutTool = new DynamicTool({
    name: 'resetLayout',
    description: 'Resets the entire dashboard layout to its default configuration.',
    schema: z.object({}),
    func: async () => ''
});

// === 2. DEFINE THE AGENT'S BRAIN ===
const allTools = [
  ...serverTools,
  focusItemTool,
  addItemTool,
  moveItemTool,
  removeItemTool,
  resetLayoutTool,
  closeAllInstancesOfAppTool,
];

const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availableApps = ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n');

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

**RULES FOR QUESTION ANSWERING & DATA ANALYSIS**
- For general questions about OS features (e.g., "What is Loom Studio?"), you MUST use the \`searchKnowledgeBase\` tool to find the answer.
- For questions about sales data (e.g., "how are sales?", "show me revenue"), you MUST use the \`getSalesMetrics\` tool.
- For questions about the user's subscription or billing (e.g., "what's my plan?", "manage subscription"), you MUST use the \`getSubscriptionStatus\` tool.
- For simple, conversational questions (e.g., "How are you?"), just respond directly without calling any tools.

**RULES FOR UI MANIPULATION**
1.  **Check Open Windows First:** Before taking any action, review the 'Open Windows' list below.
2.  **Use Instance IDs vs. Item IDs:** For any action on a specific, *already open* window (focus, move, remove), you MUST use the unique 'instanceId' from the list. To add a *new* item, you must use its static 'itemId' from the "Available Items" list.
3.  **Handle Ambiguity:** If a user's command is ambiguous (e.g., "close the sales app" when multiple are open), you MUST ask for clarification. Provide the instance IDs from the list so the user can specify which one to act on.
4.  **Single vs. All:** To close one window, use 'removeItem' with its 'instanceId'. To close all windows of an app, use 'closeAllInstancesOfApp' with its static 'appId'.
5.  **Confirm Your Actions:** After you call a UI tool (like 'addItem'), also generate a brief, confirmatory message for the user. E.g., "Done. I've added the Loom Studio." You can generate text and call tools in the same turn.

**RULES FOR TEXT ANALYSIS (INVOICE WORKFLOW)**
1.  When given text to analyze, your first step is ALWAYS to use the 'categorizeText' tool.
2.  Review the category result.
    - If it's **not** an invoice, your job is done. Respond with a message confirming the category you identified (e.g., "I've categorized that text as a General Inquiry."). Do not use any more tools.
    - If it **is** an invoice, continue to the next step.
3.  After confirming it's an invoice, use the 'extractInvoiceData' tool on the original text.
4.  After extracting data, your final tool call should be to 'logAndAlertAegis'.
5.  After all tools have run for the invoice workflow, you MUST provide a final summary message to the user. For example: "I've processed the invoice for Quantum Supplies. The total is $10,825.00, due on August 14, 2024. This event has been logged."

---
**CONTEXT: AVAILABLE ITEMS**
Here are the items you can add to the workspace. Use the static 'id' with the 'addItem' tool.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}

---
**CONTEXT: CURRENT WORKSPACE**
Here are the windows currently open on the user's dashboard.

Open Windows:
${openWindowsSummary}
---
`;
}

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  model: 'gemini-1.5-flash-latest',
}).bindTools(allTools);


// === 3. DEFINE THE GRAPH ===
interface AgentState extends MessagesState {
    layout: LayoutItem[];
}

/**
 * The primary node for the agent. It receives the current state of the conversation
 * and calls the AI model to decide on the next action.
 */
const callModel = async (state: AgentState) => {
  const { messages, layout } = state;
  const systemPrompt = getSystemPrompt(layout);
  const response = await model.invoke([new HumanMessage(systemPrompt), ...messages]);
  return { messages: [response] };
};

/**
 * A conditional edge that decides whether to call server-side tools or end the graph turn.
 */
const shouldInvokeTools = (state: AgentState): 'tools' | '__end__' => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return '__end__';
  }

  // The 'tools' node will only execute server-side tools.
  // If the model calls a client-side tool, this edge will end the graph turn,
  // and the tool call will be passed to the client via the stream.
  const hasServerToolCall = lastMessage.tool_calls.some(call => 
    serverTools.some(tool => tool.name === call.name)
  );

  return hasServerToolCall ? 'tools' : '__end__';
};

// Define the graph structure.
const workflow = new StateGraph<AgentState>({
    channels: { 
        messages: { 
            value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), 
            default: () => [] 
        },
        layout: {
            value: (x, y) => y, // Always take the latest layout provided in the input
            default: () => []
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

// Compile the graph into an executable object.
export const agentGraph = workflow.compile();
