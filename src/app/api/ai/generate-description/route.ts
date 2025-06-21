import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { AppDescriptionInputSchema } from '@/lib/ai-schemas';
import { z } from 'zod';

export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const DescriptionOutputSchema = z.object({
  description: z.string().describe('The generated marketplace description for the application.'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { microAppName, microAppFunctionality, targetAudience, keyFeatures } = AppDescriptionInputSchema.parse(json);

    const prompt = `Generate a compelling and concise marketplace description for a micro-application.
      - App Name: ${microAppName}
      - Functionality: ${microAppFunctionality}
      - Target Audience: ${targetAudience}
      - Key Features: ${keyFeatures}

      The description should be engaging, clear, and highlight the primary benefits for the target audience.`;

    const { object } = await generateObject({
      model: groq('llama3-8b-8192'),
      schema: DescriptionOutputSchema,
      prompt,
    });

    return Response.json(object);
  } catch (error) {
    console.error('Error in generate-description API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
