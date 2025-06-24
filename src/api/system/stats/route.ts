
import { type NextRequest, NextResponse } from 'next/server';
import { getActionLogStats } from '@/services/system-monitor.service';
import { rateLimiter } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const stats = await getActionLogStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Failed to fetch system stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
