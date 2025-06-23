
'use server';

import { google } from '@/lib/ai/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AiGeneratedFlowDataSchema } from '@/lib/ai-schemas';
import type { AiGeneratedFlowData } from '@/types/loom';
import { generateNodeId } from '../utils';

const LoomWorkflowInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters long.'),
});

/**
 * Generates a structured workflow for Loom Studio from a natural language prompt.
 */
export async function generateLoomWorkflow(
  input: z.infer<typeof LoomWorkflowInputSchema>
): Promise<Omit<AiGeneratedFlowData, 'message' | 'error' | 'userInput'>> {
    try {
        const { object } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: AiGeneratedFlowDataSchema,
            prompt: `You are an expert AI workflow designer for a platform called Loom Studio. Based on the user's request, generate a JSON object representing a complete workflow.

            User request: "${input.prompt}"

            Your task is to break down the request into a logical sequence of nodes. You MUST generate a creative and relevant 'workflowName' and an array of 'nodes'. Each node must have a 'title', a 'description', a 'type', and 'position' coordinates.

            Available Node Types: 'prompt', 'decision', 'agent-call', 'wait', 'api-call', 'trigger', 'custom', 'web-summarizer', 'data-transform', 'conditional'.

            - Be creative with the workflow. If the user asks to "summarize a news article about AI", create a multi-step flow:
              1. A 'web-summarizer' node to get the article content.
              2. A 'prompt' node to re-format the summary into a tweet.
              3. A 'conditional' node to decide if the sentiment is positive.
              4. An 'agent-call' node to post the tweet if the sentiment is positive.
            - Lay out the nodes logically on the canvas. Start at x: 50, y: 50. Increment x by about 300 for each subsequent node in a linear flow. For branching flows, use the y-coordinate to separate paths (e.g., y: 50 for the 'true' path, y: 250 for the 'false' path).
            - Ensure descriptions are clear and concise.
            - Do not generate more than 5 nodes unless the prompt is very complex.

            Generate the complete workflow structure now.`,
        });

        const processedNodes = object.nodes.map((node, index) => ({
            ...node,
            id: generateNodeId(node.type, node.title, index),
        }));

        return {
            ...object,
            nodes: processedNodes,
        };
    } catch (error) {
        console.error("Error generating Loom workflow:", error);
        throw new Error("Failed to generate workflow from AI. The model may have returned an invalid structure. Please try a different prompt.");
    }
}
