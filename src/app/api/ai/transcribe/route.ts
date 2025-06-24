import { type NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { groqSdk } from '@/lib/ai/groq';

export const maxDuration = 60; // Allow up to 60 seconds for transcription
export const runtime = 'nodejs'; // Required for file handling

/**
 * Handles audio transcription requests for BEEP.
 */
export async function POST(req: NextRequest) {
  // 1. Rate limit the request to prevent abuse.
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Fail fast if the required API key is not configured.
  if (!process.env.GROQ_API_KEY) {
    console.error('AEGIS ALERT: Transcription service is offline. Reason: GROQ_API_KEY is not configured.');
    return NextResponse.json(
      { error: "Server configuration error: The transcription service is not available." },
      { status: 503 } // 503 Service Unavailable
    );
  }

  try {
    // 3. Process the incoming audio file from the form data.
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No audio file was provided in the request." }, { status: 400 });
    }
    
    // 4. Call the external transcription service.
    const transcription = await groqSdk.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3", // Use the large model for best accuracy.
    });

    // 5. Return the successful transcription text.
    return NextResponse.json({ text: transcription.text });

  } catch (error: any) {
    // 6. Catch any other errors and return a structured JSON response.
    console.error('Error during transcription:', error);
    let errorMessage = 'An unexpected error occurred during transcription.';
    
    // Provide more specific error messages if available from the upstream API.
    if (error.error?.message) {
        errorMessage = error.error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
