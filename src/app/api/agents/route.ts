import { type NextRequest, NextResponse } from 'next/server';
import { listAgents, createAgent, deleteAgent } from '@/services/agent-management.service';
import { z } from 'zod';
import type { AgentType } from '@prisma/client';

/**
 * GET /api/agents
 * Fetches a list of all agents.
 */
export async function GET(req: NextRequest) {
    try {
        const agents = await listAgents();
        return NextResponse.json(agents);
    } catch (error) {
        console.error('Failed to fetch agents:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const createAgentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    type: z.string(), // We'll validate against the enum on the server
    description: z.string().min(10, "Description is too short."),
});

/**
 * POST /api/agents
 * Creates a new agent.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = createAgentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
        }
        
        const agentTypes: AgentType[] = ['CONVERSATIONAL', 'WEB_INTELLECT', 'TASK_ORCHESTRATOR', 'CONTENT_SYNTHESIZER', 'DATA_CRUNCHER', 'SUPPORT_RESPONDER'];
        if (!agentTypes.includes(validation.data.type as any)) {
            return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 });
        }

        const newAgent = await createAgent({
            ...validation.data,
            type: validation.data.type as any, // Cast after validation
        });

        return NextResponse.json(newAgent, { status: 201 });
    } catch (error) {
        console.error('Failed to create agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * DELETE /api/agents
 * Deletes an agent.
 */
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('id');

    if (!agentId) {
        return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    if (agentId === 'system-beep') {
        return NextResponse.json({ error: 'The primary system agent cannot be deleted.' }, { status: 403 });
    }

    try {
        await deleteAgent(agentId);
        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error(`Failed to delete agent ${agentId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
