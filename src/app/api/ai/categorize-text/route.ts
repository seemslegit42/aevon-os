
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { TextCategorySchema } from '@/lib/ai-schemas';
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
      return new Response(JSON.stringify({ error: 'Text for categorization is required.' }), { status: 400 });
    }

    const { object: category } = await generateObject({
      model: groq('llama3-8b-8192'), // Use a smaller model for this simple task
      schema: TextCategorySchema,
      prompt: `You are an expert text classification agent. Analyze the following text and determine if it is an invoice.
      If it is an invoice, set 'isMatch' to true and 'category' to 'Invoice'.
      Otherwise, set 'isMatch' to false and provide a general category like 'General Inquiry', 'Spam', or 'Order Confirmation'.

      Text to analyze:
      ---
      ${text}
      ---
      `,
    });

    return Response.json(category);

  } catch (error) {
    console.error('Error in text categorization API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
