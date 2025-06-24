// /src/app/api/accounting/invoices/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { listInvoices, createInvoice } from '@/services/accounting.service';
import { invoiceSchema } from '@/micro-apps/accounting/schemas';
import { rateLimiter } from '@/lib/rate-limiter';

/**
 * GET /api/accounting/invoices
 * Fetches all invoices.
 */
export async function GET(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const invoices = await listInvoices();
        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * POST /api/accounting/invoices
 * Creates a new invoice.
 */
export async function POST(req: NextRequest) {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const body = await req.json();
        // Manually parse date string since it comes from JSON
        if (body.dueDate) {
            body.dueDate = new Date(body.dueDate);
        }
        
        const validation = invoiceSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
        }
        
        const newInvoice = await createInvoice(validation.data);

        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        console.error('Failed to create invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
