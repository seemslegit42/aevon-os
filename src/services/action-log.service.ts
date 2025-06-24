
'use server';

import prisma from '@/lib/db';
import type { AgentType } from '@prisma/client';
import { logSecurityEvent } from './aegis.service';

const SYSTEM_AGENT_ID = 'system-beep';
const SYSTEM_AGENT_NAME = 'BEEP';
const SYSTEM_AGENT_TYPE: AgentType = 'CONVERSATIONAL';

let isSystemAgentInitialized = false;

/**
 * Ensures the default system agent exists in the database.
 * This is now called lazily to avoid issues during build time.
 */
async function ensureSystemAgent() {
  if (isSystemAgentInitialized) return;
  try {
    await prisma.agent.upsert({
      where: { id: SYSTEM_AGENT_ID },
      update: {},
      create: {
        id: SYSTEM_AGENT_ID,
        name: SYSTEM_AGENT_NAME,
        type: SYSTEM_AGENT_TYPE,
        description: 'The primary conversational AI assistant for AEVON OS.',
      },
    });
    isSystemAgentInitialized = true;
  } catch (error) {
    console.error("Failed to ensure system agent exists:", error);
  }
}


interface LogActionData {
  agentId?: string;
  toolName: string;
  arguments: any;
  status: 'success' | 'failure';
  result?: any;
  tokens?: number;
}

/**
 * Logs a completed agent action to the database and updates agent invocation stats.
 * Also logs a security event if the action failed.
 * @param data - The details of the action to log.
 */
export async function logAction(data: LogActionData): Promise<void> {
  await ensureSystemAgent();

  const {
    agentId = SYSTEM_AGENT_ID,
    toolName,
    arguments: args,
    status,
    result,
    tokens,
  } = data;

  try {
    await prisma.$transaction([
      prisma.actionLog.create({
        data: {
          agentId: agentId,
          toolName: toolName,
          arguments: args,
          status: status,
          result: result,
          tokens: tokens,
        },
      }),
      prisma.agent.update({
        where: { id: agentId },
        data: {
          invocations: {
            increment: 1,
          },
          lastInvokedAt: new Date(),
        },
      }),
    ]);

    // AEGIS INTEGRATION: If the action failed, log a security event.
    if (status === 'failure') {
      await logSecurityEvent({
        type: 'ToolExecutionFailure',
        severity: 'MEDIUM',
        agentId: agentId,
        details: {
          toolName: toolName,
          arguments: args,
          error: result,
        },
      });
    }
    
  } catch (error) {
    console.error(`Failed to log action for tool "${toolName}":`, error);
  }
}
