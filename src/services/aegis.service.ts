'use server';

import prisma from '@/lib/db';
import { SeverityLevel } from '@prisma/client';

interface LogEventArgs {
  type: string;
  severity: SeverityLevel;
  details: Record<string, any>;
  agentId?: string;
}

/**
 * Logs a security event to the Aegis system.
 */
export async function logSecurityEvent({ type, severity, details, agentId }: LogEventArgs): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        type,
        severity,
        details,
        agentId,
      },
    });
  } catch (error) {
    console.error(`[AEGIS] Failed to log security event:`, error);
  }
}

/**
 * Fetches the most recent security events.
 * @param limit The number of events to fetch.
 * @returns A promise that resolves to an array of security events.
 */
export async function getRecentSecurityEvents(limit: number = 10) {
  try {
    return await prisma.securityEvent.findMany({
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        agent: true,
      },
    });
  } catch (error) {
    console.error(`[AEGIS] Failed to fetch recent security events:`, error);
    return [];
  }
}
