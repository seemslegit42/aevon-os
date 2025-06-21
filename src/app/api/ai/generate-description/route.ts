
import { AppDescriptionInputSchema } from '@/lib/ai-schemas';
import { generateAppDescriptionAction } from '@/lib/ai-actions';

export const maxDuration = 60; // Increased timeout for the larger model

export async function POST(req: Request) {
  try {
    const json = await req.json();
    // The schema validation is now handled inside the action.
    const result = await generateAppDescriptionAction(json);
    return Response.json(result);
  } catch (error) {
    console.error('Error in generate-description API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.format() }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
