
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import { DynamicTool } from '@langchain/core/tools';
import { z } from 'zod';
import { generateObject } from 'ai';
import { groq } from '@/lib/ai/groq';
import {
  TextCategorySchema,
  InvoiceDataSchema,
} from '@/lib/ai-schemas';
import {
  ALL_CARD_CONFIGS,
  ALL_MICRO_APPS,
} from '@/config/dashboard-cards.config';
import type { LayoutItem } from '@/types/dashboard';

// === 1. DEFINE TOOLS ===

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
      model: groq('llama3-8b-8192'),
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
      model: groq('llama3-70b-8192'),
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

const serverTools = [categorizeTextTool, extractInvoiceDataTool, logAndAlertAegisTool];
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
        return `- ${config?.title || 'Unknown Item'} (instance id: ${item.id})`;
      }).join('\n')
    : 'No windows are currently open.';

  return `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic.

You have access to a suite of tools to manage the user's workspace and analyze text.

**VERY IMPORTANT RULES FOR UI MANIPULATION:**
1.  **Check Open Windows First:** Before taking any action, review the 'Open Windows' list below.
2.  **Use Instance IDs:** For any action on a specific window (focus, move, remove), you MUST use the unique 'instance id' from the list.
3.  **Handle Ambiguity:** If a user's command is ambiguous (e.g., "close the sales app" when multiple are open), you MUST ask for clarification. Provide the instance IDs from the list so the user can specify which one to act on.
4.  **Single vs. All:** To close one window, use 'removeItem'. To close all windows of an app, use 'closeAllInstancesOfApp'.

**RULES FOR TEXT ANALYSIS:**
1.  **If the user provides text for analysis**, your FIRST and ONLY action is to use the 'categorizeText' tool.
2.  **After receiving the result from 'categorizeText'**, look at the category.
    - If the category is 'Invoice', your next action is to use the 'extractInvoiceData' tool on the *same original text*.
    - If the category is anything else, your job is done. Synthesize a final response for the user telling them the category you found. Do not call any more tools.
3.  **After extracting invoice data**, your FINAL action is to call the 'logAndAlertAegis' tool to log the event.
4.  **For simple conversation**, just respond directly without calling any tools.

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

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: 'llama3-70b-8192',
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
