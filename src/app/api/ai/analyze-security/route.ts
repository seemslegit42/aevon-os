
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { google } from '@/lib/ai/groq';
import { generateObject } from 'ai';
import { AegisSecurityAnalysisSchema } from '@/lib/ai-schemas';

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
        model: google('gemini-1.5-flash-latest'),
        schema: AegisSecurityAnalysisSchema,
        prompt: `You are a senior security analyst for the Aegis defense system. Your role is to analyze security alerts, determine their severity, identify the threats, and recommend clear, actionable steps for mitigation.

Analyze the following security alert data:
---
${alertDetails}
---

Based on your analysis, provide a structured response with a summary, severity, identified threats, and suggested actions.`
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
