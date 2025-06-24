
import { type NextRequest, NextResponse } from 'next/server';
import { getRecentSecurityEvents } from '@/services/aegis.service';
import { rateLimiter } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    if (isNaN(limitNumber) || limitNumber <= 0 || limitNumber > 50) {
        return NextResponse.json({ error: 'Invalid limit parameter. Must be between 1 and 50.' }, { status: 400 });
    }

    try {
        const events = await getRecentSecurityEvents(limitNumber);
        return NextResponse.json(events);
    } catch (error) {
        console.error('Failed to fetch security events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
