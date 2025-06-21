
import { createOpenAI } from '@ai-sdk/openai';
import Groq from 'groq-sdk';

/**
 * AI SDK client for interacting with Groq's OpenAI-compatible API.
 * Used for text generation, object generation, and tool calls.
 */
export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Direct Groq SDK client.
 * Used for specific features not yet covered by the standard AI SDK client,
 * like audio transcription and text-to-speech.
 */
export const groqSdk = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
