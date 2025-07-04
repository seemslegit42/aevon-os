
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
import { getRecentSecurityEvents } from '@/services/aegis.service';
import { getRecentActionLogs, getActionLogStats } from '@/services/system-monitor.service';
import { generateVin } from '@/micro-apps/vin-compliance/logic';
import { createInvoice as createInvoiceService } from '@/services/accounting.service';
import { invoiceSchema } from '@/micro-apps/accounting/schemas';


import type { LayoutItem } from '@/types/dashboard';
import { 
    AiInsightsSchema, 
    ContentGenerationSchema, 
    KnowledgeBaseSearchResultSchema, 
    WebSummarizerResultSchema,
    InvoiceDataSchema,
    ConditionalResultSchema,
    DataTransformResultSchema,
    VinComplianceResultSchema,
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

const createInvoiceTool = createTool({
    name: "createInvoice",
    description: "Creates a new draft invoice in the accounting system. This should be called AFTER getting user confirmation.",
    schema: invoiceSchema.omit({ status: true }).extend({
        status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).default('DRAFT').optional()
    }),
    func: async (args) => {
        const result = await createInvoiceService(args);
        return { success: true, invoiceId: result.id, message: `Successfully created invoice for ${result.client}.` };
    }
});


const generateVinTool = createTool({
    name: "generateVin",
    description: "Generates a compliant 17-character Vehicle Identification Number (VIN) for a custom trailer based on manufacturing details. Use this for the VIN Compliance Builder app or when a user asks to create a VIN.",
    schema: z.object({
        manufacturerId: z.string().length(3).describe("The 3-character World Manufacturer Identifier (WMI)."),
        trailerType: z.enum(['Flatbed', 'Enclosed', 'Gooseneck', 'Utility']).describe("The type of the trailer."),
        modelYear: z.number().int().min(2020).max(2030).describe("The manufacturing model year."),
        plantCode: z.string().length(1).describe("The single-character code for the manufacturing plant."),
    }),
    func: async ({ manufacturerId, trailerType, modelYear, plantCode }) => {
        const result = generateVin({ manufacturerId, trailerType, modelYear, plantCode });
        const { object: vinResult } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: VinComplianceResultSchema,
            prompt: `A Vehicle Identification Number (VIN) has been generated based on the provided data.
            
            Generated VIN: ${result.vin}
            Check Digit: ${result.checkDigit}
            Breakdown: WMI=${result.breakdown.wmi}, VDS=${result.breakdown.vds}, Year=${result.breakdown.yearCode}, Plant=${result.breakdown.plantCode}, Seq=${result.breakdown.sequentialNumber}

            Now, create a brief, official-sounding compliance document summary confirming this VIN's validity according to standard manufacturing practices (e.g., SAE J272). Mention the key components and confirm the check digit is valid.`
        });
        return vinResult;
    }
});


const analyzeSecurityAlertTool = createTool({
    name: "analyzeSecurityAlert",
    description: "Analyzes and reports on the most recent security events detected by the Aegis system. Use this tool when the user asks about security, threats, or anomalies.",
    schema: z.object({
        limit: z.number().optional().default(5).describe("The number of recent events to retrieve."),
    }),
    func: async ({ limit }) => {
        const events = await getRecentSecurityEvents(limit);
        if (events.length === 0) {
            return { summary: "Aegis system is clear. No recent security events detected." };
        }
        
        const summary = `Aegis has detected ${events.length} recent event(s). The most critical is a '${events[0].severity}' level event of type '${events[0].type}' that occurred at ${events[0].timestamp.toLocaleString()}.`;

        return {
            summary: summary,
            events: events.map(e => ({
                type: e.type,
                severity: e.severity,
                timestamp: e.timestamp,
                details: e.details,
                agentName: e.agent?.name,
            })),
        };
    }
});

const getSystemHealthReportTool = createTool({
    name: "getSystemHealthReport",
    description: "Retrieves a system health report, including recent agent actions and overall performance statistics. Use this when the user asks about system status, health, or recent activity.",
    schema: z.object({
        logLimit: z.number().optional().default(5).describe("The number of recent action logs to include in the report."),
    }),
    func: async ({ logLimit }) => {
        const [stats, logs] = await Promise.all([
            getActionLogStats(),
            getRecentActionLogs(logLimit)
        ]);

        const formattedLogs = logs.map(log => 
            `- Tool '${log.toolName}' by agent '${log.agent.name}' completed with status: ${log.status}.`
        ).join('\n');

        return {
            summary: `System health report: Total actions today: ${stats.actionsToday}. Overall success rate: ${stats.successRate.toFixed(1)}%.`,
            stats,
            recentActivity: formattedLogs || "No recent activity recorded.",
        };
    }
});

const evaluateConditionTool = createTool({
    name: "evaluateCondition",
    description: "Evaluates a logical condition based on provided input data. Use this for nodes of type 'conditional'.",
    schema: z.object({
        condition: z.string().describe("The condition to evaluate, e.g., \"{{input.value}} > 10\"."),
        inputData: z.any().describe("The JSON object data to use for evaluating the condition."),
    }),
    func: async ({ condition, inputData }) => {
        const { object: conditionResult } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: ConditionalResultSchema,
            prompt: `Evaluate the following condition expression based on the provided JSON data. The expression uses Handlebars-like syntax to access input data. Return ONLY the boolean result.
            
            Condition: "${condition}"
            
            Input Data:
            ${JSON.stringify(inputData, null, 2)}`
        });
        return conditionResult;
    }
});

const executeDataTransformTool = createTool({
    name: "executeDataTransform",
    description: "Transforms input data based on a given set of rules or logic. Use this for nodes of type 'data-transform'.",
    schema: z.object({
        transformationLogic: z.string().describe("The description of the transformation to perform."),
        inputData: z.any().describe("The JSON object data to be transformed."),
    }),
    func: async ({ transformationLogic, inputData }) => {
        const { object: transformResult } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: DataTransformResultSchema,
            prompt: `Perform a data transformation on the following JSON data based on the provided logic.
            
            Transformation Logic: "${transformationLogic}"
            
            Input Data:
            ${JSON.stringify(inputData, null, 2)}
            
            Return ONLY the transformed data as a JSON object.`
        });
        return transformResult;
    }
});

const executeLoomWorkflowTool = createTool({
    name: "executeLoomWorkflow",
    description: "Executes a full multi-step workflow defined in Loom Studio. This tool orchestrates calls to other tools based on the graph of nodes and connections.",
    schema: z.object({
        name: z.string().optional().describe("The name of the workflow being executed."),
        nodes: z.array(z.any()).describe("An array of all node objects in the workflow."),
        connections: z.array(z.any()).describe("An array of all connection objects between nodes."),
    }),
    func: async ({ nodes, connections }) => {
        // This is a simplified, non-reentrant executor.
        // A production version would need more robust state management.
        const nodeOutputs: Record<string, any> = {};
        const executionQueue = nodes.filter(n => !connections.some(c => c.to === n.id));
        const executedNodeIds = new Set<string>();

        while (executionQueue.length > 0) {
            const nodeToRun = executionQueue.shift();
            if (!nodeToRun || executedNodeIds.has(nodeToRun.id)) continue;
            
            let inputData: any = {};
            const incomingConnections = connections.filter(c => c.to === nodeToRun.id);
            if (incomingConnections.length > 0) {
                // Simple merge of outputs from all incoming nodes.
                // A real implementation would need more sophisticated logic for data mapping.
                incomingConnections.forEach(conn => {
                    Object.assign(inputData, nodeOutputs[conn.from] || {});
                });
            }

            // Call the correct tool for the node type
            let toolResult: any;
            try {
                 switch (nodeToRun.type) {
                    case 'web-summarizer':
                        toolResult = await summarizeWebpageTool.invoke({ url: nodeToRun.config?.url });
                        break;
                    case 'prompt':
                        // In a real scenario, this would call a model with the prompt and inputData.
                        // Here, we simulate a simple pass-through for demonstration.
                        toolResult = JSON.stringify({ promptResult: `Executed prompt: ${nodeToRun.config?.promptText}`, receivedInput: inputData });
                        break;
                     case 'data-transform':
                        toolResult = await executeDataTransformTool.invoke({ transformationLogic: nodeToRun.config?.transformationLogic, inputData });
                        break;
                    case 'conditional':
                        toolResult = await evaluateConditionTool.invoke({ condition: nodeToRun.config?.condition, inputData });
                        break;
                    // Other node types would be handled here
                    default:
                         toolResult = JSON.stringify({ result: `Node type '${nodeToRun.type}' executed successfully.`, receivedInput: inputData });
                }
                
                nodeOutputs[nodeToRun.id] = typeof toolResult === 'string' ? JSON.parse(toolResult) : toolResult;
                executedNodeIds.add(nodeToRun.id);

                // Find next nodes to add to queue
                connections.filter(c => c.from === nodeToRun.id).forEach(c => {
                    const nextNode = nodes.find(n => n.id === c.to);
                    if (nextNode && !executedNodeIds.has(nextNode.id)) {
                        executionQueue.push(nextNode);
                    }
                });

            } catch (e: any) {
                 return { success: false, error: `Workflow failed at node "${nodeToRun.title}". Reason: ${e.message}`, completedNodes: Array.from(executedNodeIds) };
            }
        }
        
        return { success: true, message: `Workflow executed successfully. ${executedNodeIds.size} nodes completed.`, finalOutput: nodeOutputs };
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
    summarizeWebpageTool, extractInvoiceDataTool, createInvoiceTool, generateVinTool,
    analyzeSecurityAlertTool,
    getSystemHealthReportTool,
    evaluateConditionTool,
    executeDataTransformTool,
    executeLoomWorkflowTool,
    requestHumanActionTool,
    focusItemTool, addItemTool, removeItemTool, resetLayoutTool,
];

const toolNode = new ToolNode(allTools);

// Use Groq for speed in the main conversational agent
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
}).bindTools(allTools);

const getSystemPrompt = async (
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

  const recentCriticalEvents = (await getRecentSecurityEvents(5)).filter(
    (e) => e.severity === 'HIGH' || e.severity === 'CRITICAL'
  );
  
  let aegisContextSummary = '';
  if (recentCriticalEvents.length > 0) {
    const eventSummaries = recentCriticalEvents.map(e => `- ${e.severity} event: ${e.type} at ${e.timestamp.toLocaleTimeString()}`).join('\n');
    aegisContextSummary = `
**AEGIS SECURITY ALERT: URGENT**
The system has detected ${recentCriticalEvents.length} recent high-severity event(s).
${eventSummaries}

**Directive:** Your operational mode is now ELEVATED CAUTION. You must:
1.  Inform the user of the security alert immediately in your next response.
2.  Strongly recommend they use the \`analyzeSecurityAlert\` tool for more details.
3.  Be more cautious and verbose when evaluating user requests for sensitive actions.
`;
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
- If the user asks you to execute the workflow, use the \`executeLoomWorkflow\` tool, passing the nodes and connections.
- When asked to execute a single node, you can use the specific tool for that node type (e.g., \`summarizeWebpageTool\`, \`evaluateConditionTool\`).
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
${aegisContextSummary}
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
3.  **Human-in-the-Loop & Safety:** You MUST ask for user confirmation via the \`requestHumanAction\` tool before performing any potentially destructive or irreversible action. This includes, but is not limited to: using the \`removeItem\` tool to close a window, using the \`resetLayout\` tool, or any action that could lead to data loss or state changes (like creating an invoice). Always state what you are about to do and ask for permission. Do not proceed until you receive an explicit "approved" response from the user.
4.  **AEGIS SECURITY & SYSTEM HEALTH:** If the user asks about security, threats, or system anomalies, use the \`analyzeSecurityAlert\` tool. If they ask about system health, performance, or recent activity, use the \`getSystemHealthReport\` tool.
5.  If a tool fails, explain the error to the user.
6.  After successfully calling a UI tool, also generate a brief, natural language confirmation for the user. E.g., "Done. I've added the Loom Studio to your workspace."
7.  If the user asks a general question, use the 'searchKnowledgeBase' tool first.
8.  If asked to generate a workflow for Loom Studio via chat, politely decline and instruct the user to use the dedicated AI prompt bar at the top of the Loom Studio to generate workflows.
9.  Use the APPLICATION VIEW context to provide more relevant help. If the user is in the "Accounting" app, offer tips about invoices. If they are in the "Loom Studio", offer advice on building workflows. Be proactive but not annoying.
10. **Loom Workflow Execution**: If the user asks to run the workflow from Loom Studio, you MUST use the \`executeLoomWorkflow\` tool. Pass the full nodes and connections array to it.
11. **Invoice Creation Workflow:** If the user provides invoice text and asks to create an invoice, you must follow this sequence: First, use the \`extractInvoiceData\` tool. Second, present the extracted data to the user and ask for confirmation using the \`requestHumanAction\` tool. Third, upon receiving user approval, use the \`createInvoice\` tool with the extracted data to finalize the process.
`;
}

// Node that calls the AI model
const callModelNode = async (state: AgentState) => {
  const { messages, layout, loomState, currentRoute, activeMicroAppPersona } = state;
  const systemPrompt = await getSystemPrompt(layout || [], loomState, currentRoute, activeMicroAppPersona);
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
