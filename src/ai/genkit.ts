'use server';
/**
 * @fileOverview Initializes and configures the Genkit AI instance.
 * This centralized file ensures that all Genkit plugins and settings
 * are consistently applied across the application.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
export const ai = genkit({
  plugins: [googleAI()],
  // To enable production-grade tracing, you could configure a trace store here.
  // For example, using the Firebase plugin (genkitx-firebase):
  // plugins: [googleAI(), firebase()],
  // traceStore: 'firebase'
});
