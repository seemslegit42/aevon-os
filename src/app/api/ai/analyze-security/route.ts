
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { analyzeSecurityAlert } from '@/ai/flows/analyze-security-flow';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { alertDetails } = await req.json();

    if (!alertDetails) {
      return new Response(JSON.stringify({ error: 'Alert details are required.' }), { status: 400 });
    }

    const analysis = await analyzeSecurityAlert({ alertDetails });

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
