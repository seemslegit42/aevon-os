
import { generateObject } from 'ai';
import { z } from 'zod';
import { ContentGenerationSchema } from '@/lib/ai-schemas';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { groq } from '@/lib/ai/groq';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { topic, contentType, tone } = await req.json();

    if (!topic || !contentType || !tone) {
      return new Response(JSON.stringify({ error: 'Topic, content type, and tone are required.' }), { status: 400 });
    }

    const prompt = `You are an expert content creator specializing in writing for business audiences. Your task is to generate content based on the user's request.
    
    Topic: ${topic}
    Content Type: ${contentType}
    Tone of Voice: ${tone}

    Generate a compelling piece of content based on these parameters.
    - If the content type is "Blog Post", the body should be well-structured with markdown for headings, lists, and bold text. It should be at least 3 paragraphs long.
    - If the content type is "Tweet", the body should be concise, under 280 characters, and include relevant hashtags.
    - If the content type is "Marketing Email", the body should have a clear call-to-action and a professional closing.
    
    Adhere strictly to the requested tone.
    `;

    const { object: content } = await generateObject({
      model: groq('llama3-70b-8192'),
      schema: ContentGenerationSchema,
      prompt: prompt,
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
