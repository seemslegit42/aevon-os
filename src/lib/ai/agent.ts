
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
} from './ai-schemas';
import {
  ALL_CARD_CONFIGS,
  ALL_MICRO_APPS,
} from '@/config/dashboard-cards.config';

// === 1. DEFINE TOOLS ===

// -- SERVER-SIDE TOOLS --
// These tools have a real implementation on the server.

const categorizeTextTool = new DynamicTool({
  name: 'categorizeText',
  description:
    'Analyzes a piece of text and determines its category, such as Invoice, General Inquiry, or Spam.',
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
    'Extracts structured data (invoice number, amount, due date) from a text that has been identified as an invoice.',
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

// List of tools the server can execute.
const serverTools = [categorizeTextTool, extractInvoiceDataTool];
const toolExecutor = new ToolNode(serverTools);


// -- CLIENT-SIDE TOOLS --
// These tools are for the AI model to be aware of. Their schemas are defined,
// but they are executed by the client in use-beep-chat.ts's `onToolCall`.

const availableItemIds = [
  ...ALL_CARD_CONFIGS.map((p) => p.id),
  ...ALL_MICRO_APPS.map((a) => a.id),
];

const focusItemTool = new DynamicTool({
    name: 'focusItem',
    description: 'Brings a specific Panel or Micro-App into focus on the user\'s canvas. Use this when the user asks to see or open an item that might already be present.',
    schema: z.object({
        itemId: z.string().describe(`The unique ID of the item to focus on. Available IDs are: ${availableItemIds.join(', ')}`),
    }),
    func: async () => '' // Dummy function
});

const addItemTool = new DynamicTool({
    name: 'addItem',
    description: 'Adds a new Panel or launches a new Micro-App on the user\'s canvas.',
    schema: z.object({
        itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to add or launch.'),
    }),
    func: async () => ''
});

const moveItemTool = new DynamicTool({
    name: 'moveItem',
    description: 'Moves a specific Panel or Micro-App to a new position (x, y coordinates) on the user\'s canvas.',
    schema: z.object({
        itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to move.'),
        x: z.number().describe('The new x-coordinate for the top-left corner of the item.'),
        y: z.number().describe('The new y-coordinate for the top-left corner of the item.'),
    }),
    func: async () => ''
});

const removeItemTool = new DynamicTool({
    name: 'removeItem',
    description: 'Removes a Panel or closes all instances of a Micro-App from the user\'s canvas.',
    schema: z.object({
        itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to remove or close.'),
    }),
    func: async () => ''
});

const resetLayoutTool = new DynamicTool({
    name: 'resetLayout',
    description: 'Resets the entire dashboard layout to its default configuration.',
    schema: z.object({}),
    func: async () => ''
});


// List of ALL tools for the model's awareness.
const allTools = [
  ...serverTools,
  focusItemTool,
  addItemTool,
  moveItemTool,
  removeItemTool,
  resetLayoutTool,
];

// === 2. DEFINE THE AGENT'S BRAIN ===

const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availableApps = ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n');
const systemPrompt = `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You are aware of the OS's components and can control the user interface AND analyze text by using the tools provided.

Your purpose is to manage the user's workspace and process information. This includes "Panels" (core OS components) and "Micro-Apps".

To manage the UI, use the following tools:
- To show, open, or focus on an item, use the 'focusItem' tool.
- To add, create, or launch something new, use the 'addItem' tool.
- To move an item, use the 'moveItem' tool.
- To remove, delete, or close something, use the 'removeItem' tool.
- To reset the workspace or layout, use the 'resetLayout' tool.

To analyze text provided by the user:
1. First, ALWAYS use the 'categorizeText' tool to determine what the text is.
2. After you get the category, respond to the user with the category.
3. If AND ONLY IF the category is 'Invoice', then you should ALSO use the 'extractInvoiceData' tool on the *same text* and include the extracted details in your final response.
Do not try to extract invoice data from text that is not an invoice.

If the user is asking about an app, use the app's ID. If they are asking about a panel, use the panel's ID.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}`;

// Model with all tools bound to it.
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: 'llama3-70b-8192',
}).bindTools(allTools);


// === 3. DEFINE THE GRAPH ===

/**
 * The primary node for the agent. It receives the current state of the conversation
 * and calls the AI model to decide on the next action.
 */
const callModel = async (state: MessagesState) => {
  const { messages } = state;
  // LangGraph works best when the system prompt is a HumanMessage
  const systemMessage = new HumanMessage(systemPrompt);
  const response = await model.invoke([systemMessage, ...messages]);
  return { messages: [response] };
};

/**
 * A conditional edge that decides the next step in the graph.
 * - If the model's last response included tool calls, it routes to the 'tools' node.
 * - Otherwise, it ends the execution for this turn.
 */
const shouldInvokeTools = (state: MessagesState): 'tools' | '__end__' => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  
  // If the last message is not an AIMessage or has no tool calls, end.
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return '__end__';
  }

  // The 'tools' node will handle executing server-side tools.
  // Client-side tools will be passed through to the client.
  return 'tools';
};

// Define the graph structure.
const workflow = new StateGraph({
    // The 'messages' channel is the core state of our graph.
    channels: { messages: { value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), default: () => [] } }
});

// Add the nodes to the graph.
workflow.addNode('agent', callModel);
workflow.addNode('tools', toolExecutor); // The ToolNode is pre-built to execute tools and return ToolMessages.

// Define the edges of the graph.
workflow.addEdge(START, 'agent'); // The entry point is the agent node.
workflow.addConditionalEdges('agent', shouldInvokeTools); // After the agent runs, decide where to go next.
workflow.addEdge('tools', 'agent'); // After tools are executed, return to the agent for another turn.

// Compile the graph into an executable object.
export const agentGraph = workflow.compile();
