
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { SecurityAlertInputSchema, SecurityAlertOutputSchema } from '@/lib/ai-schemas';

export const maxDuration = 60; // Increased timeout for the larger model

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { alertDetails } = SecurityAlertInputSchema.parse(json);

    const { object } = await generateObject({
      model: groq('llama3-70b-8192'),
      schema: SecurityAlertOutputSchema,
      prompt: `Act as a Tier-3 Senior Security Operations Center (SOC) Analyst for the ΛΞVON OS. Your task is to analyze the provided security alert data with expert precision.
        
Analyze the following security alert data: ${alertDetails}

Based on your analysis, provide:
1.  A concise, executive-level summary of the event.
2.  An assessment of the alert's severity level (Low, Medium, High, or Critical).
3.  A bulleted list of specific, identified potential threats.
4.  A bulleted list of clear, actionable, and prioritized steps for mitigation.`,
    });

    return Response.json(object);
  } catch (error) {
    console.error('Error in analyze-security API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
