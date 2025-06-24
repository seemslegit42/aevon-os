
'use server';

import prisma from '@/lib/db';
import type { AgentType } from '@prisma/client';

const SYSTEM_AGENT_ID = 'system-beep';
const SYSTEM_AGENT_NAME = 'BEEP';
const SYSTEM_AGENT_TYPE: AgentType = 'CONVERSATIONAL';

/**
 * Ensures the default system agent exists in the database.
 * Uses upsert to create it if it's not there, avoiding race conditions.
 */
async function ensureSystemAgent() {
  try {
    await prisma.agent.upsert({
      where: { id: SYSTEM_AGENT_ID },
      update: {},
      create: {
        id: SYSTEM_AGENT_ID,
        name: SYSTEM_AGENT_NAME,
        type: SYSTEM_AGENT_TYPE,
        description: 'The primary conversational AI assistant for AEVON OS.',
        // This agent is not tied to a specific user or workspace in this context
        // In a multi-tenant app, you might link this to a system-wide workspace
      },
    });
  } catch (error) {
    console.error("Failed to ensure system agent exists:", error);
    // In a real app, you might want to throw this error or handle it more gracefully
  }
}

// Call this once when the module loads to ensure the agent is ready.
ensureSystemAgent();

interface LogActionData {
  agentId?: string; // Optional, defaults to system agent
  toolName: string;
  arguments: any;
  status: 'success' | 'failure';
  result?: any;
  tokens?: number;
}

/**
 * Logs a completed agent action to the database.
 * @param data - The details of the action to log.
 */
export async function logAction(data: LogActionData): Promise<void> {
  const {
    agentId = SYSTEM_AGENT_ID,
    toolName,
    arguments: args,
    status,
    result,
    tokens,
  } = data;

  try {
    await prisma.actionLog.create({
      data: {
        agentId: agentId,
        toolName: toolName,
        arguments: args, // Prisma handles JSON serialization
        status: status,
        result: result,   // Prisma handles JSON serialization
        tokens: tokens,
      },
    });
  } catch (error) {
    console.error(`Failed to log action for tool "${toolName}":`, error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it silently so it doesn't crash the agent turn.
  }
}
