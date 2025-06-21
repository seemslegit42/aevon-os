
import { generateObject } from 'ai';
import { z } from 'zod';
import { AegisSecurityAnalysisSchema } from '@/lib/ai-schemas';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { groq } from '@/lib/ai/groq';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

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
