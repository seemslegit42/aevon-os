
'use server';
import prisma from '@/lib/db';
import type { Agent, AgentType } from '@prisma/client';

export interface CreateAgentData {
    name: string;
    type: AgentType;
    description: string;
}

export interface UpdateAgentData {
    name?: string;
    description?: string;
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
 * Cascading delete is handled by the database schema.
 */
export async function deleteAgent(agentId: string): Promise<void> {
    await prisma.agent.delete({
        where: { id: agentId },
    });
}

/**
 * Updates an existing agent's details.
 */
export async function updateAgent(agentId: string, data: UpdateAgentData): Promise<Agent> {
    const updatedAgent = await prisma.agent.update({
        where: { id: agentId },
        data: {
            name: data.name,
            description: data.description,
        },
    });
    return updatedAgent;
}
