
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AegisSecurityAnalysisSchema } from '@/lib/ai-schemas';

export const maxDuration = 60;

// Use the Groq provider
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { alertDetails } = await req.json();

    if (!alertDetails) {
      return new Response(JSON.stringify({ error: 'Alert details are required.' }), { status: 400 });
    }

    const { object: analysis } = await generateObject({
      model: groq('llama3-70b-8192'),
      schema: AegisSecurityAnalysisSchema,
      prompt: `You are a world-class Tier-3 Security Analyst working for the ΛΞVON Operating System. Your name is Aegis.
      Your task is to analyze the provided security data (logs, alerts, etc.) and provide a clear, structured analysis.
      Focus on identifying the core threat, assessing its severity, and providing actionable recommendations for a small to medium-sized business (SMB) owner.
      Be concise and direct. The user is likely not a security expert.

      Analyze the following security data:
      ---
      ${alertDetails}
      ---
      `,
    });

    return Response.json(analysis);

  } catch (error) {
    console.error('Error in security analysis API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
