
import Groq from 'groq-sdk';
import { StreamingTextResponse, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const { prompt, systemSnapshotData } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemMessage = `You are BEEP (Behavioral Event & Execution Processor), an AI assistant for the AEVON OS.
You are highly intelligent, concise, and helpful.
Current system snapshot data: ${systemSnapshotData || 'Not available'}.
The user is interacting with you through a dashboard interface. Provide helpful, context-aware responses.`;

    const result = await streamText({
      model: groq.chat.completions.withStreaming({ modelName: 'llama3-8b-8192' }),
      system: systemMessage,
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 500,
    });

    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Error in /api/ai/briefing:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
