
'use server';

import prisma from '@/lib/db';
import type { Agent } from '@prisma/client';
import { subMinutes } from 'date-fns';

export interface AgentWithStatus extends Agent {
  status: 'active' | 'idle' | 'error';
  lastTask: string;
}

/**
 * Fetches all registered agents and determines their current status based on their last action.
 * This is a more realistic representation of agent presence.
 */
export async function getAgentsWithStatus(): Promise<AgentWithStatus[]> {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        logs: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });

    const tenMinutesAgo = subMinutes(new Date(), 10);

    return agents.map((agent) => {
      const latestLog = agent.logs[0];
      let status: 'active' | 'idle' | 'error' = 'idle';
      let lastTask = 'Awaiting tasks.';

      if (latestLog) {
        if (latestLog.status === 'failure') {
          status = 'error';
          lastTask = `Failed task: ${latestLog.toolName}`;
        } else if (latestLog.timestamp > tenMinutesAgo) {
          status = 'active';
          lastTask = `Executing: ${latestLog.toolName}`;
        } else {
            lastTask = `Last seen: ${latestLog.toolName}`;
        }
      }
      
      // The `logs` property can be large and is not needed by the client.
      // We explicitly remove it before returning.
      const { logs, ...agentData } = agent;

      return {
        ...agentData,
        status,
        lastTask,
      };
    });
  } catch (error) {
    console.error("Failed to fetch agents with status:", error);
    // In a production environment, you might want more sophisticated logging.
    return []; // Return empty array on error to prevent frontend crash
  }
}
