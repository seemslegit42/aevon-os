'use server';
/**
 * @fileOverview Defines a function for generating app marketplace descriptions.
 * This is a mock implementation to remove the Genkit dependency.
 *
 * - generateAppDescription - A function to create a description.
 */

import type { AppDescriptionInput } from '@/ai/schemas';

/**
 * Mock implementation to remove Genkit dependency and fix build.
 * Returns a mock response to allow the UI to function without a real AI backend.
 */
export async function generateAppDescription(input: AppDescriptionInput): Promise<string> {
    console.log("Mock generateAppDescription called with input:", input);
    return new Promise(resolve => setTimeout(() => {
        resolve(`This is a mock description for "${input.microAppName}". The AI backend has been disconnected to resolve a build issue.`);
    }, 1000));
}
