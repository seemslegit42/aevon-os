
'use server';

import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import { ContentGenerationSchema, type ContentGeneration } from '@/lib/ai-schemas';

interface ContentParams {
    topic: string;
    contentType: string;
    tone: string;
}

/**
 * A server action to generate marketing content using a dedicated AI model.
 * @param params - The parameters for content generation (topic, contentType, tone).
 * @returns A promise that resolves to the structured generated content.
 */
export async function generateContent(params: ContentParams): Promise<ContentGeneration> {
    const { topic, contentType, tone } = params;
    try {
        const { object: content } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: ContentGenerationSchema,
            prompt: `You are an expert content creator specializing in writing compelling marketing copy. Your task is to generate a piece of content based on the provided topic, content type, and tone.

Topic: ${topic}
Content Type: ${contentType}
Tone: ${tone}

Generate a title and the main body for the content. The body should be appropriately formatted, using markdown if necessary (e.g., for blog posts).`
        });
        return content;
    } catch (error) {
        console.error("Error in generateContent server action:", error);
        throw new Error("The AI model failed to generate content.");
    }
}
