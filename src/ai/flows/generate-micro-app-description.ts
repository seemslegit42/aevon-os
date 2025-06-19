// src/ai/flows/generate-micro-app-description.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating descriptions for micro-apps to be published on the ΛΞVON Λrmory marketplace.
 *
 * - generateMicroAppDescription - A function that generates a micro-app description.
 * - GenerateMicroAppDescriptionInput - The input type for the generateMicroAppDescription function.
 * - GenerateMicroAppDescriptionOutput - The return type for the generateMicroAppDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroAppDescriptionInputSchema = z.object({
  microAppName: z.string().describe('The name of the micro-app.'),
  microAppFunctionality: z.string().describe('A detailed description of the micro-app functionality.'),
  targetAudience: z.string().describe('The target audience for the micro-app.'),
  keyFeatures: z.array(z.string()).describe('A list of key features of the micro-app.'),
});
export type GenerateMicroAppDescriptionInput = z.infer<typeof GenerateMicroAppDescriptionInputSchema>;

const GenerateMicroAppDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling description of the micro-app for the marketplace.'),
});
export type GenerateMicroAppDescriptionOutput = z.infer<typeof GenerateMicroAppDescriptionOutputSchema>;

export async function generateMicroAppDescription(
  input: GenerateMicroAppDescriptionInput
): Promise<GenerateMicroAppDescriptionOutput> {
  return generateMicroAppDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicroAppDescriptionPrompt',
  input: {schema: GenerateMicroAppDescriptionInputSchema},
  output: {schema: GenerateMicroAppDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in writing descriptions for micro-apps for the ΛΞVON Λrmory marketplace.

  Given the following information about a micro-app, write a compelling description that will entice users to download and use the app.

  Micro-App Name: {{{microAppName}}}
  Functionality: {{{microAppFunctionality}}}
  Target Audience: {{{targetAudience}}}
  Key Features:
  {{#each keyFeatures}}
  - {{{this}}}
  {{/each}}

  Description:
  `,
});

const generateMicroAppDescriptionFlow = ai.defineFlow(
  {
    name: 'generateMicroAppDescriptionFlow',
    inputSchema: GenerateMicroAppDescriptionInputSchema,
    outputSchema: GenerateMicroAppDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
