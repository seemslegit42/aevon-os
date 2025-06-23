
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
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

// =================================================================
// Agent State Definition
// =================================================================
export interface AgentState extends MessagesState {
  layout: LayoutItem[];
  task?: 'analyze_text' | 'ui_operation' | 'knowledge_search' | 'data_query';
  data?: any;
}

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
  schema: z.object({
    text: z.string().describe("The user-provided text to be analyzed."),
  }),
  func: async ({ text }: { text: string }) => {
      const isLikelyInvoice = /invoice|due date|amount|total/i.test(text);
      if (isLikelyInvoice) {
        return JSON.stringify({ isMatch: true, category: 'Invoice' });
      }
      return JSON.stringify({ isMatch: false, category: 'General' });
  },
});

const extractInvoiceDataTool = new DynamicTool({
  name: 'extractInvoiceData',
  description: 'Extracts structured data from invoice text.',
  schema: z.object({
    text: z.string().describe("The user-provided text containing the invoice information."),
  }),
  func: async ({ text }: { text: string }) => {
     const invoiceNumber = text.match(/Invoice #: (.*)/)?.[1] || 'N/A';
     const amountMatch = text.match(/Total Amount Due: \$(.*)/)?.[1];
     const amount = amountMatch ? parseFloat(amountMatch.replace(/,/g, '')) : 0;
     const dueDate = text.match(/Due Date: (.*)/)?.[1] || 'N/A';
     const summary = `Extracted invoice ${invoiceNumber} for $${amount}.`;

     return JSON.stringify({ invoiceNumber, amount, dueDate, summary });
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
const focusItemTool = new DynamicTool({ name: 'focusItem', description: "Brings a specific window into focus on the user's canvas.", schema: z.object({ instanceId: z.string() }), func: async () => JSON.stringify({ success: true, message: "Focusing item." }) });
const addItemTool = new DynamicTool({ name: 'addItem', description: 'Adds a new Panel or launches a new Micro-App.', schema: z.object({ itemId: z.string().enum(staticItemIds as [string, ...string[]]) }), func: async () => JSON.stringify({ success: true, message: "Adding item." }) });
const moveItemTool = new DynamicTool({ name: 'moveItem', description: "Moves a specific window to new coordinates.", schema: z.object({ instanceId: z.string(), x: z.number(), y: z.number() }), func: async () => JSON.stringify({ success: true, message: "Moving item." }) });
const removeItemTool = new DynamicTool({ name: 'removeItem', description: "Closes a single, specific window.", schema: z.object({ instanceId: z.string() }), func: async () => JSON.stringify({ success: true, message: "Removing item." }) });
const closeAllInstancesOfAppTool = new DynamicTool({ name: 'closeAllInstancesOfApp', description: "Closes ALL open windows of a specific Micro-App.", schema: z.object({ appId: z.string() }), func: async () => JSON.stringify({ success: true, message: "Closing all instances." }) });
const resetLayoutTool = new DynamicTool({ name: 'resetLayout', description: 'Resets the entire dashboard layout to its default configuration.', schema: z.object({}), func: async () => JSON.stringify({ success: true, message: "Resetting layout." }) });

// =================================================================
// AGENT SETUP
// =================================================================
const serverTools = [ getSalesMetricsTool, getSubscriptionStatusTool, searchKnowledgeBaseTool, logAndAlertAegisTool, categorizeTextTool, extractInvoiceDataTool ];
const allTools = [ ...serverTools, focusItemTool, addItemTool, moveItemTool, removeItemTool, resetLayoutTool, closeAllInstancesOfAppTool ];
const toolNode = new ToolNode(serverTools);

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
    : 'No windows are currently open.';

  return `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic.

**CONTEXT: CURRENT WORKSPACE**
Here are the windows currently open on the user's dashboard. Use the 'instanceId' to manipulate them.
${openWindowsSummary}
---
**CONTEXT: AVAILABLE ITEMS**
Here are the items you can add. Use the static 'id' with the 'addItem' tool.
Available Panels:
${ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n')}
Available Micro-Apps:
${ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n')}
---
**RULES FOR UI MANIPULATION**
1.  Check open windows before acting.
2.  Use 'instanceId' for open windows, 'id' for new items.
3.  If a user asks to perform an action on text (e.g. "analyze this", "process this invoice"), DO NOT call the tools like \`categorizeText\` yourself. Instead, your ONLY action should be to respond with a single tool call to a special tool named \`startAnalysisWorkflow\` with the user's text as the argument. This will trigger a managed, multi-step workflow.
4.  For all other tasks (UI manipulation, knowledge search, data queries), you can call the other tools as needed.
5.  After calling a UI tool, also generate a brief, confirmatory message for the user. E.g., "Done. I've added the Loom Studio." You can generate text and call tools in the same turn.
`;
}

// =================================================================
// AGENT GRAPH NODES
// =================================================================

const callModelNode = async (state: AgentState) => {
  const { messages, layout } = state;
  const systemPrompt = getSystemPrompt(layout || []);
  const response = await model.invoke([new HumanMessage(systemPrompt), ...messages]);
  return { messages: [response] };
};

const callCategorizeNode = async (state: AgentState) => {
  const { data } = state;
  const toolCall: any = await categorizeTextTool.invoke({ text: data.text });
  const toolMessage = new ToolMessage({
    content: toolCall,
    tool_call_id: 'categorize_text_call',
    name: 'categorizeText'
  });
  return { messages: [toolMessage] };
}

const callExtractionNode = async (state: AgentState) => {
  const { data } = state;
  const toolCall: any = await extractInvoiceDataTool.invoke({ text: data.text });
  const toolMessage = new ToolMessage({
    content: toolCall,
    tool_call_id: 'extract_invoice_data_call',
    name: 'extractInvoiceData'
  });
  return { messages: [toolMessage] };
};

const callFinalizeNode = async (state: AgentState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  const summary = `Finalized workflow. Last message content: ${lastMessage.content}`;
  await logAndAlertAegisTool.invoke({ analysisSummary: summary });

  const finalResponse = new AIMessage({
    content: `Workflow complete. I've logged the results. Summary: ${JSON.parse(lastMessage.content as string).summary}`
  });
  return { messages: [finalResponse] };
};

// =================================================================
// AGENT GRAPH ROUTING LOGIC
// =================================================================

const shouldInvokeToolsRouter = (state: AgentState): 'tools' | '__end__' => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // The model can call a special tool 'startAnalysisWorkflow' to trigger our graph.
  if (lastMessage.tool_calls?.some(tc => tc.name === 'startAnalysisWorkflow')) {
      const textToAnalyze = lastMessage.tool_calls.find(tc => tc.name === 'startAnalysisWorkflow')?.args.text;
      // We don't actually execute this tool. We use it as a signal to start our graph.
      // We manually add its result so the agent knows it was "called".
      const toolMessage = new ToolMessage({
          content: `Starting analysis on text.`,
          tool_call_id: lastMessage.tool_calls.find(tc => tc.name === 'startAnalysisWorkflow')!.id!,
          name: 'startAnalysisWorkflow',
      });
      // By putting the text in the 'data' state, we make it available to the next nodes.
      state.data = { text: textToAnalyze };
      state.messages.push(toolMessage);
      return 'categorize';
  }

  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return '__end__';
  }
  
  const hasServerToolCall = lastMessage.tool_calls.some(call => 
    serverTools.some(tool => tool.name === call.name)
  );

  return hasServerToolCall ? 'tools' : '__end__';
};

const categorizationRouter = (state: AgentState): 'extract' | 'finalize' => {
    const lastMessage = state.messages[state.messages.length - 1] as ToolMessage;
    const { category } = JSON.parse(lastMessage.content as string);
    if (category === 'Invoice') {
        return 'extract';
    }
    return 'finalize';
}

// =================================================================
// GRAPH DEFINITION & COMPILATION
// =================================================================

const workflow = new StateGraph<AgentState>({
    channels: { 
        messages: { 
            value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y), 
            default: () => [] 
        },
        layout: {
            value: (x, y) => y ?? x,
            default: () => []
        },
        task: {
            value: (x,y) => y ?? x,
            default: () => undefined
        },
        data: {
            value: (x,y) => y ?? x,
            default: () => undefined
        }
    }
});

workflow.addNode('agent', callModelNode);
workflow.addNode('tools', toolNode);
workflow.addNode('categorize', callCategorizeNode);
workflow.addNode('extract', callExtractionNode);
workflow.addNode('finalize', callFinalizeNode);

workflow.addConditionalEdges('agent', shouldInvokeToolsRouter, {
  tools: 'tools',
  categorize: 'categorize',
  __end__: END,
});
workflow.addEdge('tools', 'agent');
workflow.addConditionalEdges('categorize', categorizationRouter, {
    extract: 'extract',
    finalize: 'finalize',
});
workflow.addEdge('extract', 'finalize');
workflow.addEdge('finalize', END);

workflow.addEntryPoint(START);

export const agentGraph = workflow.compile();
