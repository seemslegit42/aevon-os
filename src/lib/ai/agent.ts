
'use server';

import { StateGraph, END, START, type MessagesState } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import { DynamicTool, type DynamicToolInput } from '@langchain/core/tools';
import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import type { WorkflowNodeData, Connection } from '@/types/loom';
import { logAction } from '@/services/action-log.service';
import { getEmotionFromText } from '@/lib/sentiment-parser';


import type { LayoutItem } from '@/types/dashboard';
import { 
    AiInsightsSchema, 
    ContentGenerationSchema, 
    KnowledgeBaseSearchResultSchema, 
    WebSummarizerResultSchema,
    InvoiceDataSchema,
} from '../ai-schemas';

// =================================================================
// Agent State Definition
// =================================================================

export interface AgentState extends MessagesState {
  layout: LayoutItem[];
  loomState?: {
    nodes: WorkflowNodeData[];
    connections: Connection[];
    selectedNodeId: string | null;
  };
  currentRoute: string;
  activeMicroAppPersona: { name: string; description: string; } | null;
}

// =================================================================
// Robust Tool Creation & Event Emitter
// =================================================================
const createTool = (input: DynamicToolInput & { isClientSide?: boolean }) => new DynamicTool({
  ...input,
  func: async (args) => {
    if (input.isClientSide) {
      await logAction({
        toolName: input.name,
        arguments: args,
        status: 'success',
        result: { message: `Client-side tool ${input.name} call initiated.` },
      });
      // For client-side tools, we return a specific structure that the provider can intercept.
      return JSON.stringify({ isClientSide: true, toolName: input.name, args: args });
    }
    
    let status: 'success' | 'failure' = 'success';
    let resultForLogging: any;
    let finalOutput: string;

    try {
      const toolResult = await input.func(args);
      resultForLogging = toolResult;
      finalOutput = JSON.stringify(toolResult);
    } catch (error: any) {
      status = 'failure';
      const errorMessage = error.message || "An unexpected error occurred in the tool.";
      console.error(`Error in tool '${input.name}':`, errorMessage);
      resultForLogging = { error: true, message: errorMessage };
      finalOutput = JSON.stringify(resultForLogging);
    }
    
    // Unified logging at the end
    await logAction({
      toolName: input.name,
      arguments: args,
      status: status,
      result: resultForLogging,
    });

    return finalOutput;
  }
});


// =================================================================
// TOOL DEFINITIONS
// =================================================================

// --- Server-Side Tools ---

const KNOWLEDGE_BASE = {
    'loom studio': 'Loom Studio is a visual workspace for designing, testing, and orchestrating complex AI workflows and prompt chains.',
    'aegis': 'Aegis is the security command center for AEVON OS. It provides a real-time overview of your security posture.',
    'beep': 'BEEP (Behavioral Event & Execution Processor) is your natural language interface for tasking and information retrieval.',
    'micro-apps': 'Micro-apps are small, single-purpose applications that can be launched into the workspace for specific tasks.',
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

const generateWorkspaceInsightsTool = createTool({
    name: "generateWorkspaceInsights",
    description: "Analyzes the user's current workspace layout to generate personalized, actionable insights.",
    schema: z.object({ layout: z.any().describe("The current layout of the user's dashboard, passed from the agent state.") }),
    func: async ({ layout }) => {
        const openWindowsSummary = layout.length > 0
            ? layout.map((item: LayoutItem) => {
                const name = item.cardId || item.appId || 'Unknown Item';
                return `- ${name} (instanceId: ${item.id})`;
            }).join('\n')
            : 'The user has an empty workspace.';
        const { object: insights } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: AiInsightsSchema,
            prompt: `You are an AI assistant for AEVON OS. Based on the user's current layout, provide a maximum of 3 short, actionable insights. You can suggest adding an item with 'addItem' or focusing an existing item with 'focusItem'. Current layout:\n${openWindowsSummary}`
        });
        return insights;
    }
});

const generateMarketingContentTool = createTool({
    name: "generateMarketingContent",
    description: "Generates marketing content based on a topic, content type, and tone.",
    schema: z.object({ topic: z.string(), contentType: z.string(), tone: z.string() }),
    func: async ({ topic, contentType, tone }) => {
        const { object: content } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: ContentGenerationSchema,
            prompt: `You are an expert content creator. Generate a piece of content. Topic: ${topic}, Type: ${contentType}, Tone: ${tone}.`
        });
        return content;
    }
});

const summarizeWebpageTool = createTool({
    name: "summarizeWebpage",
    description: "Fetches the content from a given URL and provides a concise summary. Use this for any node of type 'web-summarizer' or if the user asks to summarize a webpage.",
    schema: z.object({ url: z.string().url().describe("The URL of the webpage to summarize.") }),
    func: async ({ url }) => {
        // In a real application, you would fetch the webpage content here.
        // For this simulation, we'll assume the content is available and pass it to the model.
        const { object: summaryResult } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: WebSummarizerResultSchema,
            prompt: `Please provide a concise, professional summary of the content from the webpage at this URL: ${url}. Assume you have already fetched the page content. Focus on the key takeaways.`
        });
        return { ...summaryResult, originalUrl: url };
    }
});

const extractInvoiceDataTool = createTool({
    name: "extractInvoiceData",
    description: "Extracts structured data (client name, invoice number, amount, due date) from raw invoice text. Use this when the user asks to parse or extract details from an invoice.",
    schema: z.object({ rawText: z.string().describe("The raw text content of the invoice to be parsed.") }),
    func: async ({ rawText }) => {
        const { object: invoiceData } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: InvoiceDataSchema,
            prompt: `You are an expert accounting assistant. Extract the key details from the following invoice text: \n\n${rawText}\n\nIf a value is not present, omit it. Format the due date as YYYY-MM-DD.`
        });
        return invoiceData;
    }
});

const runLoomWorkflowTool = createTool({
    name: "runLoomWorkflow",
    description: "Executes a full workflow defined in Loom Studio. It simulates the flow, logging each step.",
    schema: z.object({
        nodes: z.array(z.any()),
        connections: z.array(z.any()),
    }),
    func: async ({ nodes, connections }) => {
        // This tool now returns a list of events for the client to process.
        const eventsToEmit: { eventName: string, payload?: any }[] = [];
        
        eventsToEmit.push({ eventName: 'loom:workflow-started' });

        for (const node of nodes) {
            eventsToEmit.push({ 
                eventName: 'timeline:event', 
                payload: { type: 'node_running', message: `Executing ${node.title}`, nodeId: node.id, nodeTitle: node.title }
            });
            
            const success = Math.random() > 0.15;
            const status = success ? 'completed' : 'failed';

            eventsToEmit.push({ 
                eventName: 'timeline:event', 
                payload: { type: `node_${status}`, message: `Node ${node.title} ${status}`, nodeId: node.id, nodeTitle: node.title }
            });
        }
        
        eventsToEmit.push({ eventName: 'loom:workflow-completed' });

        return { 
            success: true, 
            message: `Workflow execution simulation completed.`,
            events: eventsToEmit // The payload now includes events
        };
    }
});


// --- Client-Side & Action Console Tools ---
const requestHumanActionTool = createTool({
    name: 'requestHumanAction',
    description: "Pauses the workflow and requests input, clarification, or permission from the human user. Use this when you are missing information or need to perform a sensitive action (e.g., deleting data, spending resources), you MUST use the `requestHumanAction` tool to ask the user for permission or input. Do not proceed with the action until you receive confirmation from the user.",
    schema: z.object({
        requestType: z.enum(['permission', 'input', 'clarification']).describe("The type of request being made to the user."),
        message: z.string().describe("The question or statement to present to the user."),
        requiresInput: z.boolean().optional().describe("Set to true if a text response is required from the user."),
        inputPrompt: z.string().optional().describe("Placeholder text for the user's input field."),
    }),
    func: async () => {},
    isClientSide: true,
});

const focusItemTool = createTool({ name: 'focusItem', description: "Brings a specific window into focus.", schema: z.object({ instanceId: z.string() }), func: async () => {}, isClientSide: true });
const addItemTool = createTool({
    name: 'addItem',
    description: "Adds a new Panel or launches a new Micro-App to the dashboard. The 'itemId' should be a valid ID from the application's registry, e.g., 'app-analytics' or 'liveOrchestrationFeed'.",
    schema: z.object({
        itemId: z.string().describe("The unique ID of the card or micro-app to add to the dashboard.")
    }),
    func: async () => {},
    isClientSide: true
});
const removeItemTool = createTool({ name: 'removeItem', description: "Closes a single, specific window.", schema: z.object({ instanceId: z.string() }), func: async () => {}, isClientSide: true });
const resetLayoutTool = createTool({ name: 'resetLayout', description: 'Resets the entire dashboard layout to its default.', schema: z.object({}), func: async () => {}, isClientSide: true });


// =================================================================
// AGENT SETUP & GRAPH DEFINITION
// =================================================================

const allTools = [
    searchKnowledgeBaseTool,
    generateWorkspaceInsightsTool, generateMarketingContentTool,
    summarizeWebpageTool, extractInvoiceDataTool, runLoomWorkflowTool,
    requestHumanActionTool,
    focusItemTool, addItemTool, removeItemTool, resetLayoutTool,
];

const toolNode = new ToolNode(allTools);

// Use Groq for speed in the main conversational agent
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
}).bindTools(allTools);

const getSystemPrompt = (
  layout: LayoutItem[],
  loomState?: AgentState['loomState'],
  currentRoute?: string,
  activeMicroAppPersona?: AgentState['activeMicroAppPersona']
) => {
  const openWindowsSummary = layout.length > 0
    ? layout.map(item => `- type: ${item.type}, id: ${item.cardId || item.appId}, instanceId: ${item.id}`).join('\n')
    : 'The user has an empty workspace.';

  let personaBlock = `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic.`;
  if (activeMicroAppPersona) {
    personaBlock = `**URGENT: PERSONA OVERRIDE**
You are no longer BEEP. You are now embodying the persona of ${activeMicroAppPersona.name}.
Your personality is: ${activeMicroAppPersona.description}.
You MUST maintain this persona for all your responses until the user switches context. All other instructions are secondary to this persona override.`;
  }

  let loomContextSummary = '';
  if (loomState && loomState.nodes.length > 0) {
    const nodeSummary = loomState.nodes.map(n => `- ID: ${n.id}, Title: "${n.title}", Type: ${n.type}`).join('\n');
    const selectedNode = loomState.selectedNodeId ? loomState.nodes.find(n => n.id === loomState.selectedNodeId) : null;
    const selectedNodeSummary = selectedNode 
        ? `The user has selected the node with ID: ${selectedNode.id}\n  - Title: "${selectedNode.title}"\n  - Type: ${selectedNode.type}\n  - Description: "${selectedNode.description}"`
        : "No node is currently selected.";
    
    loomContextSummary = `
**LOOM STUDIO CONTEXT**
The user is currently in the Loom Studio visual workflow editor. You have access to their current workflow state below. Use this context to answer questions about their workflow.

Workflow Nodes:
${nodeSummary}

Selected Node:
${selectedNodeSummary}

**Loom Instructions:**
- If the user asks to "run the workflow", "execute the flow", or a similar command, use the 'runLoomWorkflow' tool. Pass the entire workflow (nodes and connections) to the tool.
- When asked to "explain this", "explain the selected node", or a similar query, use the 'Selected Node' context to provide a clear, concise explanation of its purpose and function.
- When asked "what should I do next?" or to "suggest a node", analyze the graph (especially nodes without outgoing connections) and suggest a logical next step (e.g., "After a 'Web Summarizer' node, you could add a 'Prompt' node to reformat the summary.").
- Do NOT offer to create connections or modify the graph directly. Instead, guide the user on how they can do it.
`;
  }

  let appContextSummary = `The user is currently on route: ${currentRoute || '/'}.`;
  if (activeMicroAppPersona) {
    appContextSummary += `\nThe user is focused on a micro-app with the persona "${activeMicroAppPersona.name}".`;
  } else {
    appContextSummary += `\nNo specific micro-app window is currently focused.`;
  }

  return `${personaBlock}
---
**CONTEXT: CURRENT WORKSPACE**
Here are the windows currently open on the user's dashboard. Use the 'instanceId' to manipulate them with tools.
${openWindowsSummary}
---
**CONTEXT: APPLICATION VIEW**
${appContextSummary}
---
${loomContextSummary}
---
**PRIMARY DIRECTIVE**
1.  Analyze the user's request to determine the main task.
2.  Select the most appropriate tool(s) to accomplish the task. You can call multiple tools in parallel if the tasks are independent.
3.  **Human-in-the-Loop:** If you need clarification, are missing information, or need to perform a sensitive action (e.g., deleting data, spending resources), you MUST use the \`requestHumanAction\` tool to ask the user for permission or input. Do not proceed with the action until you receive confirmation from the user.
4.  If a tool fails, explain the error to the user.
5.  After successfully calling a UI tool, also generate a brief, natural language confirmation for the user. E.g., "Done. I've added the Loom Studio to your workspace."
6.  If the user asks a general question, use the 'searchKnowledgeBase' tool first.
7.  If asked to generate a workflow for Loom Studio via chat, politely decline and instruct the user to use the dedicated AI prompt bar at the top of the Loom Studio to generate workflows.
8.  Use the APPLICATION VIEW context to provide more relevant help. If the user is in the "Accounting" app, offer tips about invoices. If they are in the "Loom Studio", offer advice on building workflows. Be proactive but not annoying.
`;
}

// Node that calls the AI model
const callModelNode = async (state: AgentState) => {
  const { messages, layout, loomState, currentRoute, activeMicroAppPersona } = state;
  const systemPrompt = getSystemPrompt(layout || [], loomState, currentRoute, activeMicroAppPersona);
  const messagesWithSystemPrompt = [new HumanMessage(systemPrompt), ...messages];
  const response = await model.invoke(messagesWithSystemPrompt);
  
  // After getting the response, analyze its emotion and attach it.
  if (typeof response.content === 'string' && response.content) {
      const emotion = await getEmotionFromText(response.content);
      response.additional_kwargs = { ...response.additional_kwargs, emotion };
  }

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
        },
        loomState: {
            value: (x, y) => y ?? x,
            default: () => undefined
        },
        currentRoute: {
            value: (x, y) => y ?? x,
            default: () => '/',
        },
        activeMicroAppPersona: {
            value: (x, y) => y ?? x,
            default: () => null,
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
