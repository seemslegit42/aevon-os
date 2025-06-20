
'use server';
/**
 * @fileOverview Generates a micro-app description using an AI model.
 *
 * - generateMicroAppDescription - A server action that takes details about a micro-app to generate a compelling description.
 * - GenerateMicroAppDescriptionInput - The input type for the description generation.
 * - GenerateMicroAppDescriptionOutput - The return type for the description generation.
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
  keyFeatures: string[]; // Array of key features
}

export interface GenerateMicroAppDescriptionOutput {
  description: string;
}

export async function generateMicroAppDescription(
  input: GenerateMicroAppDescriptionInput
): Promise<GenerateMicroAppDescriptionOutput> {
  'use server';

  const featuresList = input.keyFeatures.map(feature => `- ${feature}`).join('\n');

  const fullPrompt = `
Micro-App Name: ${input.microAppName}
Functionality: ${input.microAppFunctionality}
Target Audience: ${input.targetAudience}
Key Features:
${featuresList}

Based on the information above, generate a compelling and concise marketplace description for this micro-app.
Highlight its benefits and unique selling points.
The description should be engaging and encourage users to "Get App".
Keep it around 2-4 sentences long.
`;

  const { text } = await generateText({
    model: groq('llama3-8b-8192'),
    system:
      "You are an expert marketing copywriter specializing in software and app descriptions. " +
      "Your tone should be professional, slightly enthusiastic, and benefit-oriented. " +
      "Focus on clarity and conciseness.",
    prompt: fullPrompt,
    temperature: 0.7, // Slightly higher for more creative marketing copy
    maxTokens: 200,
  });

  return { description: text || "Description could not be generated." };
}
