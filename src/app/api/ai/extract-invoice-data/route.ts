
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { InvoiceDataSchema } from '@/lib/ai-schemas';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

export const maxDuration = 60;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Invoice text for extraction is required.' }), { status: 400 });
    }

    const { object: invoiceData } = await generateObject({
      model: groq('llama3-70b-8192'), // Use a larger model for reliable extraction
      schema: InvoiceDataSchema,
      prompt: `You are a data extraction expert. Analyze the following invoice text and extract the required information into a structured JSON object.
      If a field is not present, omit it from the output.
      The due date should be in YYYY-MM-DD format if possible.

      Invoice text to analyze:
      ---
      ${text}
      ---
      `,
    });

    return Response.json(invoiceData);

  } catch (error) {
    console.error('Error in invoice extraction API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
