
'use server';

import { google } from '@/lib/ai/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AiGeneratedFlowDataSchema } from './ai-schemas';
import type { AiGeneratedFlowData } from '@/types/loom';
import { generateNodeId } from '../utils';

const LoomWorkflowInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters long.'),
});

/**
 * Generates a structured workflow for Loom Studio from a natural language prompt.
 * This function is a server action that can be called directly from client components.
 * @param input - An object containing the user's prompt.
 * @returns A promise that resolves to the generated workflow data.
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

            Your task is to break down the request into a logical sequence of nodes. You must generate a 'workflowName' and an array of 'nodes'. Each node must have a 'title', a 'description', a 'type', and 'position' coordinates.

            Available Node Types: 'prompt', 'decision', 'agent-call', 'wait', 'api-call', 'trigger', 'custom', 'web-summarizer', 'data-transform', 'conditional'.

            - Use the 'decision' or 'conditional' type for branching logic.
            - Use 'agent-call' for tasks requiring an autonomous agent.
            - Use 'web-summarizer' for fetching and summarizing web content.
            - Use 'prompt' for steps that require generating text with an LLM.
            - Use 'data-transform' for manipulating data between steps.
            - Lay out the nodes logically on the canvas. Start at around x: 50, y: 50 and increment x by about 300 for each subsequent node in a linear flow. For branching flows, use the y-coordinate to separate paths.

            Generate the complete workflow structure now.`,
        });

        // Post-process to ensure unique IDs, as the model might not generate them.
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
