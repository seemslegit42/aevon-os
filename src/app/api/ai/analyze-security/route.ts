import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { SecurityAlertInputSchema, SecurityAlertOutputSchema } from '@/lib/ai-schemas';

export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { alertDetails } = SecurityAlertInputSchema.parse(json);

    const { object } = await generateObject({
      model: groq('llama3-8b-8192'),
      schema: SecurityAlertOutputSchema,
      prompt: `Analyze the following security alert data. Provide a concise summary, identify potential threats, and recommend clear, actionable steps for mitigation. The alert data is: ${alertDetails}`,
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
