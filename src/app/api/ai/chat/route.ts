
import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { agentGraph } from '@/lib/ai/agent';
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { type Message } from 'ai';
import type { LayoutItem } from '@/types/dashboard';
import { useLoomStore } from '@/stores/loom.store';


export const maxDuration = 60;
export const runtime = 'nodejs';

/**
 * Converts a Vercel AI SDK message to a LangChain message.
 * @param message The Vercel AI SDK message.
 * @returns The LangChain message.
 */
const toLangChainMessage = (message: Message): BaseMessage => {
    if (message.role === 'user') {
        return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
        const tool_calls = message.tool_calls?.map(tc => ({
            id: tc.toolCallId,
            name: tc.toolName,
            args: tc.args,
        }));
        return new AIMessage({
            content: message.content,
            tool_calls: tool_calls,
        });
    } else if (message.role === 'tool') {
        return new ToolMessage({
            content: message.content,
            tool_call_id: message.tool_call_id!,
        });
    }
    // Fallback for other roles or unforeseen cases
    return new HumanMessage(message.content);
}


export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    // Production Hardening: Check for required API keys
    if (!process.env.GROQ_API_KEY || !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error('AEGIS ALERT: Chat service is offline. Reason: Required API keys are not configured.');
        return new Response(JSON.stringify({ error: "Server configuration error: The chat service is not available." }), { 
            status: 503, // Service Unavailable
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { messages, layoutItems, loomState, currentRoute, activeMicroAppPersona }: { 
            messages: Message[], 
            layoutItems?: LayoutItem[], 
            loomState?: any,
            currentRoute?: string;
            activeMicroAppPersona?: { name: string; description: string } | null;
        } = await req.json();
        
        // Invoke the LangGraph agent with the current chat history and layout context.
        const stream = await agentGraph.stream({
            messages: messages.map(toLangChainMessage),
            layout: layoutItems ?? [],
            loomState: loomState,
            currentRoute: currentRoute,
            activeMicroAppPersona: activeMicroAppPersona,
        },
        {
          // This is a temporary stream event handler on the server side
          // to update the Zustand store for real-time visualization.
          // In a production multi-user environment, this would be handled via websockets.
          async onStreamEvent(event) {
            if (event.event === 'on_chain_end' && event.name === 'tools') {
               const toolCall = event.data.output?.[0];
               if (toolCall) {
                   const toolName = toolCall.tool;
                   const toolArgs = toolCall.args;
                   
                   // Find the node being executed based on the tool call
                   const { nodes } = useLoomStore.getState();
                   let executingNode = nodes.find(node => node.config?.promptText === toolArgs?.promptText || node.config?.url === toolArgs?.url);

                   if(toolName === 'executeLoomWorkflow') {
                      // For the orchestrator tool, we don't have a single node.
                      // Here you might emit a different kind of event.
                      return;
                   }

                   if (executingNode) {
                        const status = toolCall.result?.includes('"error":true') ? 'failed' : 'completed';
                        useLoomStore.getState().updateNodeStatus(executingNode.id, status);
                        useLoomStore.getState().updateNode(executingNode.id, { config: {...executingNode.config, output: JSON.parse(toolCall.result)}})
                   }
               }
            }
          }
        });

        // The LangChainAdapter gracefully handles converting the LangGraph stream,
        // which includes text and tool calls, into the format expected by the useChat hook.
        const aiStream = LangChainAdapter.toAIStream(stream);

        return new StreamingTextResponse(aiStream);

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
