
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { AppDescriptionInputSchema } from '@/lib/ai-schemas';
import { z } from 'zod';

export const maxDuration = 60; // Increased timeout for the larger model

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

    const prompt = `Act as an expert marketing and product copywriter. Generate a compelling, engaging, and concise marketplace description for a new micro-application for the ΛΞVON OS.

The description should be market-ready, highlighting the primary benefits for the specified target audience in a punchy and professional tone.

App Details:
- App Name: ${microAppName}
- Core Functionality: ${microAppFunctionality}
- Target Audience: ${targetAudience}
- Key Features: ${keyFeatures}`;

    const { object } = await generateObject({
      model: groq('llama3-70b-8192'),
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
