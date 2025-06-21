
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 60; // Increased timeout for the larger model

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama3-70b-8192'),
    system: `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You are aware of the OS's components like Aegis (security), Loom (workflows), and the Armory (marketplace). You are capable of complex reasoning and should provide insightful, clear, and concise responses. Always aim to be proactive and anticipate user needs.`,
    messages,
  });

  return result.toAIStreamResponse();
}
