
import Groq from 'groq-sdk';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface AnalyzeSecurityAlertsOutput {
  summary: string;
  potentialThreats: string[];
  recommendedActions: string[];
}

export async function POST(req: NextRequest) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const { alertDetails } = await req.json();

    if (!alertDetails || typeof alertDetails !== 'string' || !alertDetails.trim()) {
      return NextResponse.json({ error: 'Alert details are required and must be a non-empty string.' }, { status: 400 });
    }

    const systemPrompt = `You are an AI cybersecurity analyst. Your task is to analyze raw security alert data.
Provide a concise summary, identify potential threats, and suggest recommended actions.
Respond STRICTLY with a JSON object in the following format:
{
  "summary": "string",
  "potentialThreats": ["string"],
  "recommendedActions": ["string"]
}
Ensure the output is valid JSON.`;

    const userPrompt = `Analyze the following security alert data:
---
${alertDetails}
---
Provide your analysis as a JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama3-70b-8192', // Using a larger model for better JSON formatting and analysis
      temperature: 0.3,
      max_tokens: 1024,
      // Ensure Groq returns a JSON object. Some models support a response_format parameter.
      // For Groq with Llama3, we rely on strong prompting for JSON.
    });

    const rawResponse = chatCompletion.choices[0]?.message?.content;

    if (!rawResponse) {
      return NextResponse.json({ error: 'Failed to get a response from the AI model.' }, { status: 500 });
    }

    try {
      // Attempt to parse the response as JSON
      const parsedResponse: AnalyzeSecurityAlertsOutput = JSON.parse(rawResponse);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', rawResponse);
      // Fallback: if JSON parsing fails, return a summary with an error message
      return NextResponse.json({
        summary: "AI analysis completed, but the response format was unexpected. Raw data might be available in logs.",
        potentialThreats: ["Output parsing error"],
        recommendedActions: ["Review raw AI output if needed."],
      } as AnalyzeSecurityAlertsOutput, { status: 200 });
    }

  } catch (error) {
    console.error('Error in /api/ai/security-analysis:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
