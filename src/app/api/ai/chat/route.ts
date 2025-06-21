
import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { agentGraph } from '@/lib/ai/agent';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { type Message } from 'ai';


export const maxDuration = 60;

/**
 * Converts a Vercel AI SDK message to a LangChain message.
 * @param message The Vercel AI SDK message.
 * @returns The LangChain message.
 */
const toLangChainMessage = (message: Message) => {
    if (message.role === 'user') {
        return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
        // Note: We are not including tool calls here because the agent will regenerate them.
        return new AIMessage(message.content);
    }
    // We will ignore tool messages for now as the agent will re-execute them.
    // In a more stateful implementation, you might pass tool results here.
    return new HumanMessage(message.content);
}


export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    const { messages }: { messages: Message[] } = await req.json();
    
    // Invoke the LangGraph agent with the current chat history.
    const stream = await agentGraph.stream({
        messages: messages.map(toLangChainMessage),
    });

    // The LangChainAdapter gracefully handles converting the LangGraph stream,
    // which includes text and tool calls, into the format expected by the useChat hook.
    const aiStream = LangChainAdapter.toAIStream(stream);

    return new StreamingTextResponse(aiStream);
}

