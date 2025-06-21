
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { generateContent } from '@/ai/flows/generate-content-flow';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { topic, contentType, tone } = await req.json();

    if (!topic || !contentType || !tone) {
      return new Response(JSON.stringify({ error: 'Topic, content type, and tone are required.' }), { status: 400 });
    }

    const content = await generateContent({ topic, contentType, tone });

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
