
import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { agentGraph } from '@/lib/ai/agent';
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { type Message } from 'ai';
import type { LayoutItem } from '@/types/dashboard';


export const maxDuration = 60;

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

    try {
        const { messages, layoutItems, loomState }: { messages: Message[], layoutItems?: LayoutItem[], loomState?: any } = await req.json();
        
        // Invoke the LangGraph agent with the current chat history and layout context.
        const stream = await agentGraph.stream({
            messages: messages.map(toLangChainMessage),
            layout: layoutItems ?? [],
            loomState: loomState,
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
