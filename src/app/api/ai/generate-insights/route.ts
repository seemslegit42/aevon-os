
// This API route is deprecated as of the v2.1 architectural refactor.
// Insight generation is now handled by the main agent graph
// invoked via the `generateInsights` server action.
// See /src/actions/generateInsights.ts for the new implementation.

import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    return new Response(
        JSON.stringify({ 
            error: "This endpoint is deprecated. Please use the appropriate server action." 
        }), 
        { status: 410, headers: { 'Content-Type': 'application/json' } }
    );
}
