
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { google } from '@/lib/ai/groq';
import { generateObject } from 'ai';
import { ContentGenerationSchema } from '@/lib/ai-schemas';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { topic, contentType, tone } = await req.json();

    if (!topic || !contentType || !tone) {
      return new Response(JSON.stringify({ error: 'Topic, content type, and tone are required.' }), { status: 400 });
    }

    const { object: content } = await generateObject({
        model: google('gemini-1.5-flash-latest'),
        schema: ContentGenerationSchema,
        prompt: `You are an expert content creator specializing in writing compelling marketing copy. Your task is to generate a piece of content based on the provided topic, content type, and tone.

Topic: ${topic}
Content Type: ${contentType}
Tone: ${tone}

Generate a title and the main body for the content. The body should be appropriately formatted, using markdown if necessary (e.g., for blog posts).`
    });

    return Response.json(content);

  } catch (error) {
    console.error('Error in content generation API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
