
import { type NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { groqSdk } from '@/lib/ai/groq';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    if (!process.env.GROQ_API_KEY) {
      console.error('Transcription Error: GROQ_API_KEY is not set in the environment variables.');
      return NextResponse.json(
        { error: "Server configuration error: The transcription service is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    
    const transcription = await groqSdk.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
    });

    return NextResponse.json({ text: transcription.text });

  } catch (error) {
    console.error('Error in transcribe API:', error);
    let errorMessage = 'An unknown error occurred during transcription.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
