
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import Groq from 'groq-sdk';

/**
 * AI SDK client for interacting with Groq's OpenAI-compatible API.
 * Used for text generation, object generation, and tool calls.
 * IMPORTANT: This requires the GROQ_API_KEY environment variable.
 */
export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * AI SDK client for interacting with Google's Gemini models.
 * IMPORTANT: This requires the GOOGLE_GENERATIVE_AI_API_KEY environment variable.
 */
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

/**
 * AI SDK client for interacting with OpenAI's models.
 * IMPORTANT: This requires the OPENAI_API_KEY environment variable.
 */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


/**
 * Direct Groq SDK client.
 * Used for specific features not yet covered by the standard AI SDK client,
 * like audio transcription.
 * IMPORTANT: This requires the GROQ_API_KEY environment variable.
 */
export const groqSdk = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
