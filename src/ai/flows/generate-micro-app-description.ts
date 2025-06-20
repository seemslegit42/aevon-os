
'use server';
/**
 * @fileOverview This file defines a function for generating descriptions for micro-apps
 * to be published on the ΛΞVON Λrmory marketplace, using Vercel AI SDK and Groq.
 *
 * - generateMicroAppDescription - A function that generates a micro-app description.
 * - GenerateMicroAppDescriptionInput - The input type for the generateMicroAppDescription function.
 * - GenerateMicroAppDescriptionOutput - The return type for the generateMicroAppDescription function.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Ensure you have GROQ_API_KEY in your .env file
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export interface GenerateMicroAppDescriptionInput {
  microAppName: string;
  microAppFunctionality: string;
  targetAudience: string;
  keyFeatures: string[];
}

export interface GenerateMicroAppDescriptionOutput {
  description: string;
}

export async function generateMicroAppDescription(
  input: GenerateMicroAppDescriptionInput
): Promise<GenerateMicroAppDescriptionOutput> {
  const featuresString = input.keyFeatures.map(f => `- ${f}`).join('\n  ');

  const prompt = `You are an expert copywriter specializing in writing descriptions for micro-apps for the ΛΞVON Λrmory marketplace.

Given the following information about a micro-app, write a compelling description that will entice users to download and use the app.

Micro-App Name: ${input.microAppName}
Functionality: ${input.microAppFunctionality}
Target Audience: ${input.targetAudience}
Key Features:
  ${featuresString}

Provide only the description as a string.`;

  const { text } = await generateText({
    model: groq('mixtral-8x7b-32768'), // Or any other Groq model
    prompt: prompt,
  });

  return { description: text };
}
