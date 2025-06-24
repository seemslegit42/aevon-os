// /src/app/api/accounting/transactions/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { listTransactions, createTransaction } from '@/services/accounting.service';
import { transactionSchema } from '@/micro-apps/accounting/schemas';
import { rateLimiter } from '@/lib/rate-limiter';

/**
 * GET /api/accounting/transactions
 * Fetches all transactions.
 */
export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const transactions = await listTransactions();
        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * POST /api/accounting/transactions
 * Creates a new transaction.
 */
export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const body = await req.json();
         // Manually parse date string
        if (body.date) {
            body.date = new Date(body.date);
        }

        const validation = transactionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
        }

        const newTransaction = await createTransaction(validation.data);

        return NextResponse.json(newTransaction, { status: 201 });
    } catch (error) {
        console.error('Failed to create transaction:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
