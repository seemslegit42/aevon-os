'use server';
import prisma from '@/lib/db';
import type { Agent, AgentType } from '@prisma/client';

export interface CreateAgentData {
    name: string;
    type: AgentType;
    description: string;
}

/**
 * Creates a new agent in the database.
 */
export async function createAgent(data: CreateAgentData): Promise<Agent> {
    const newAgent = await prisma.agent.create({
        data: {
            name: data.name,
            type: data.type,
            description: data.description,
            status: 'idle',
        },
    });
    return newAgent;
}

/**
 * Fetches all agents from the database.
 */
export async function listAgents(): Promise<Agent[]> {
    const agents = await prisma.agent.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return agents;
}

/**
 * Deletes an agent from the database.
 */
export async function deleteAgent(agentId: string): Promise<void> {
    // We need to delete dependent logs first.
    await prisma.actionLog.deleteMany({
        where: { agentId: agentId },
    });
    await prisma.agent.delete({
        where: { id: agentId },
    });
}
