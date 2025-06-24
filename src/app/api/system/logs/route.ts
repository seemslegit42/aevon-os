
import { type NextRequest, NextResponse } from 'next/server';
import { getRecentActionLogs } from '@/services/system-monitor.service';
import { rateLimiter } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const limitNumber = limit ? parseInt(limit, 10) : 20;

    if (isNaN(limitNumber) || limitNumber <= 0 || limitNumber > 100) {
        return NextResponse.json({ error: 'Invalid limit parameter. Must be between 1 and 100.' }, { status: 400 });
    }

    try {
        const logs = await getRecentActionLogs(limitNumber);
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch system logs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
