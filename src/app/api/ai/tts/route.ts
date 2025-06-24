
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { google } from '@/lib/ai/groq';
import { generate } from 'ai';
import wav from 'wav';
import type { AvatarState } from '@/types/dashboard';

export const maxDuration = 60;
export const runtime = 'nodejs'; // Force Node.js runtime for 'wav' package compatibility

// This type mirrors the `avatarState` from the frontend for mapping emotions.
type EmotionTone = 'neutral' | 'thinking' | 'tool_call' | 'security_alert';

/**
 * Determines the emotional state from the text content.
 * This allows the TTS to have an expressive tone matching the message.
 */
function getToneFromText(text: string): EmotionTone {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('security alert') || lowerText.includes('threat detected')) {
        return 'security_alert';
    }
    if (lowerText.startsWith('analyzing') || lowerText.startsWith('generating insights')) {
        return 'thinking';
    }
    if (lowerText.startsWith('done.') || lowerText.startsWith('okay, i have') || lowerText.startsWith('alright,')) {
        return 'tool_call';
    }
    return 'neutral'; // Neutral/default state for all speaking variations
}

/**
 * Wraps text with SSML tags based on the derived emotional state.
 */
function wrapWithSSML(text: string, tone: EmotionTone): string {
  // Sanitize text to prevent SSML injection issues
  const sanitizedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  let content = sanitizedText;
  switch (tone) {
    case 'thinking':
      // Slower, lower-pitched speech for a thoughtful tone
      content = `<prosody rate="slow" pitch="-1st">${sanitizedText}</prosody>`;
      break;
    case 'tool_call':
      // Quicker, sharper tone for confirmation
      content = `<prosody rate="fast" pitch="+1st">${sanitizedText}</prosody>`;
      break;
    case 'security_alert':
      // Lower, more serious tone with strong emphasis for alerts
      content = `<emphasis level="strong"><prosody rate="medium" pitch="-3st">${sanitizedText}</prosody></emphasis>`;
      break;
    default:
      // No change for neutral speaking tones
      break;
  }
  return `<speak>${content}</speak>`;
}


/**
 * Converts raw PCM audio buffer to a WAV file buffer.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs)));

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

    const tone = getToneFromText(text);
    const ssmlText = wrapWithSSML(text, tone);

    const { speech } = await generate({
      model: google('gemini-2.5-flash-preview-tts'),
      prompt: ssmlText,
    });

    if (!speech) {
      throw new Error('TTS generation failed, no audio returned.');
    }

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    // Gemini TTS from AI SDK returns raw PCM data. We need to wrap it in a WAV header.
    const wavBuffer = await toWav(audioBuffer);
    
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
