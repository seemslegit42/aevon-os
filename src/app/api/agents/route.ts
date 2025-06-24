
import { type NextRequest, NextResponse } from 'next/server';
import { listAgents, createAgent, deleteAgent, updateAgent } from '@/services/agent-management.service';
import { z } from 'zod';
import { AgentType } from '@prisma/client';

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
    type: z.nativeEnum(AgentType),
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
        
        const newAgent = await createAgent(validation.data);

        return NextResponse.json(newAgent, { status: 201 });
    } catch (error) {
        console.error('Failed to create agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const updateAgentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long.").optional(),
    description: z.string().min(10, "Description is too short.").optional(),
}).refine(data => data.name || data.description, {
    message: "At least one field (name or description) must be provided for an update."
});

/**
 * PUT /api/agents?id=<agentId>
 * Updates an agent's name or description.
 */
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('id');

    if (!agentId) {
        return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }
    if (agentId === 'system-beep') {
        return NextResponse.json({ error: 'The primary system agent cannot be modified.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const validation = updateAgentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
        }

        const updatedAgent = await updateAgent(agentId, validation.data);
        return NextResponse.json(updatedAgent);
    } catch (error) {
        console.error(`Failed to update agent ${agentId}:`, error);
        return NextResponse.json({ error: 'Failed to update agent. It may not exist.' }, { status: 500 });
    }
}


/**
 * DELETE /api/agents?id=<agentId>
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
