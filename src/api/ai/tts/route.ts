import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { google } from '@/lib/ai/groq';
import { generate } from 'ai';
import wav from 'wav';

export const maxDuration = 60;

/**
 * Converts raw PCM audio buffer to a WAV file buffer (as a Base64 string).
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { speech } = await generate({
      model: google('gemini-2.5-flash-preview-tts'),
      prompt: text,
      // The AI SDK's Gemini integration does not currently support speechConfig.
      // It will use the default voice.
    });

    if (!speech) {
      throw new Error('TTS generation failed, no audio returned.');
    }

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    // Gemini TTS from AI SDK returns raw PCM data. We need to wrap it in a WAV header.
    const wavBase64 = await toWav(audioBuffer);
    const wavBuffer = Buffer.from(wavBase64, 'base64');
    
    return new Response(wavBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in TTS API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
