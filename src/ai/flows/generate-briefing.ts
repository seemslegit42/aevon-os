'use server';
/**
 * @fileOverview Defines a function for generating an AI briefing.
 * This is a mock implementation to remove the Genkit dependency.
 *
 * - generateBriefing - A function to get a response from the AI assistant.
 */

import type { BriefingInput } from '@/ai/schemas';

/**
 * Mock implementation to remove Genkit dependency and fix build.
 * Returns a mock response to allow the UI to function without a real AI backend.
 */
export async function generateBriefing(input: BriefingInput): Promise<string> {
    console.log("Mock generateBriefing called with input:", input);
    return new Promise(resolve => setTimeout(() => {
        resolve(`This is a mock BEEP response to the prompt: "${input.prompt}". The AI backend has been disconnected to resolve a build issue.`);
    }, 1000));
}
