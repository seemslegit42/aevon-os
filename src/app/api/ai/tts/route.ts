
import Groq from 'groq-sdk';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

export const maxDuration = 60;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ttsResponse = await groq.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy", // Other voices: echo, fable, onyx, nova, shimmer
      response_format: "mp3",
    });

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in TTS API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
