
'use server';

import prisma from '@/lib/db';
import type { ActionLog } from '@prisma/client';

export interface ActionLogStats {
  totalActions: number;
  successRate: number;
  avgTokens: number;
  actionsToday: number;
}

/**
 * Fetches the most recent action logs from the database.
 * @param limit The maximum number of logs to retrieve.
 * @returns A promise that resolves to an array of action logs.
 */
export async function getRecentActionLogs(limit: number = 20): Promise<ActionLog[]> {
  try {
    const logs = await prisma.actionLog.findMany({
      take: limit,
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        agent: true, // Include the related agent information
      },
    });
    return logs;
  } catch (error) {
    console.error("Failed to fetch recent action logs:", error);
    return [];
  }
}

/**
 * Calculates statistics based on the action logs.
 * @returns A promise that resolves to an object containing action log statistics.
 */
export async function getActionLogStats(): Promise<ActionLogStats> {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalActions, successfulActions, totalTokensData, actionsToday] = await prisma.$transaction([
      prisma.actionLog.count(),
      prisma.actionLog.count({ where: { status: 'success' } }),
      prisma.actionLog.aggregate({
        _sum: { tokens: true },
        _count: { tokens: true },
      }),
      prisma.actionLog.count({
        where: {
          timestamp: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
    ]);

    const totalTokenSum = totalTokensData._sum.tokens ?? 0;
    const totalTokenCount = totalTokensData._count.tokens > 0 ? totalTokensData._count.tokens : 1;

    return {
      totalActions,
      actionsToday,
      successRate: totalActions > 0 ? (successfulActions / totalActions) * 100 : 100,
      avgTokens: totalTokenSum / totalTokenCount,
    };
  } catch (error) {
    console.error("Failed to fetch action log stats:", error);
    return {
      totalActions: 0,
      actionsToday: 0,
      successRate: 0,
      avgTokens: 0,
    };
  }
}
