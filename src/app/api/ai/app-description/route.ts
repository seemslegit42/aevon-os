
import Groq from 'groq-sdk';
import { StreamingTextResponse, streamText } from 'ai';

export const runtime = 'edge';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { microAppName, microAppFunctionality, targetAudience, keyFeatures } = await req.json();

    if (!microAppName || !microAppFunctionality || !targetAudience || !keyFeatures) {
      return new Response(JSON.stringify({ error: 'All fields are required: microAppName, microAppFunctionality, targetAudience, keyFeatures' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an expert marketing copywriter specializing in creating compelling descriptions for new software applications and micro-apps.
Your tone should be enthusiastic, benefits-driven, and professional.
Generate a concise and engaging marketplace description.`;

    const userPrompt = `Generate a marketplace description for the following micro-app:
App Name: ${microAppName}
Functionality: ${microAppFunctionality}
Target Audience: ${targetAudience}
Key Features: ${keyFeatures}

Focus on the benefits for the target audience and highlight the key features in a compelling way. The description should be suitable for an app marketplace listing.`;

    const result = await streamText({
      model: groq.chat.completions.withStreaming({ modelName: 'llama3-8b-8192' }),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      max_tokens: 300,
    });
    
    return result.toAIStreamResponse();

  } catch (error) {
    console.error('Error in /api/ai/app-description:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
