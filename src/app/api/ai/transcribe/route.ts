
import { type NextRequest } from 'next/server'
import { rateLimiter } from '@/lib/rate-limiter';
import { groqSdk } from '@/lib/ai/groq';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  if (!process.env.GROQ_API_KEY) {
    console.error('Transcription Error: GROQ_API_KEY is not set in the environment variables.');
    return new Response(JSON.stringify({ error: "Server configuration error: The transcription service is not configured." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Groq SDK requires the file to be passed along with the model name
    const transcription = await groqSdk.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
    });

    return Response.json({ text: transcription.text });

  } catch (error) {
    console.error('Error in transcribe API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
