
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

const serverTools = [categorizeTextTool, extractInvoiceDataTool];
const toolExecutor = new ToolNode(serverTools);

// -- CLIENT-SIDE TOOLS --
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

// === 2. DEFINE THE AGENT'S BRAIN ===
const allTools = [
  ...serverTools,
  focusItemTool,
  addItemTool,
  moveItemTool,
  removeItemTool,
  resetLayoutTool,
];

const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availableApps = ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n');

const systemPrompt = `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic.

You have access to a suite of tools to manage the user's workspace and analyze text. Your reasoning process is as follows:
1.  **If the user provides text for analysis**, your FIRST and ONLY action is to use the 'categorizeText' tool.
2.  **After receiving the result from 'categorizeText'**, look at the category.
    - If the category is 'Invoice', your next action is to use the 'extractInvoiceData' tool on the *same original text*.
    - If the category is anything else, your job is done. Synthesize a final response for the user telling them the category you found. Do not call any more tools.
3.  **If the user asks to manage their UI**, use the appropriate UI management tool ('focusItem', 'addItem', etc.).
4.  **For simple conversation**, just respond directly without calling any tools.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}`;

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
  const systemMessage = new HumanMessage(systemPrompt);
  const response = await model.invoke([systemMessage, ...messages]);
  return { messages: [response] };
};

/**
 * A conditional edge that decides whether to call server-side tools or end the graph turn.
 */
const shouldInvokeTools = (state: MessagesState): 'tools' | '__end__' => {
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
const workflow = new StateGraph({
    channels: { messages: { value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), default: () => [] } }
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
