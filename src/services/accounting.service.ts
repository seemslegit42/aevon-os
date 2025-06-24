// src/services/accounting.service.ts
'use server';

import prisma from '@/lib/db';
import type { Invoice, Transaction } from '@prisma/client';
import type { InvoiceFormValues, TransactionFormValues } from '@/micro-apps/accounting/schemas';

/**
 * Creates a new invoice in the database.
 * @param data The invoice data.
 * @returns The newly created invoice.
 */
export async function createInvoice(data: InvoiceFormValues): Promise<Invoice> {
  const newInvoice = await prisma.invoice.create({
    data: {
      client: data.client,
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status,
    },
  });
  return newInvoice;
}

/**
 * Fetches all invoices from the database.
 * @returns A promise that resolves to an array of invoices.
 */
export async function listInvoices(): Promise<Invoice[]> {
  return await prisma.invoice.findMany({
    orderBy: {
      dueDate: 'desc',
    },
  });
}

/**
 * Creates a new transaction in the database.
 * @param data The transaction data.
 * @returns The newly created transaction.
 */
export async function createTransaction(data: TransactionFormValues): Promise<Transaction> {
  const newTransaction = await prisma.transaction.create({
    data: {
      date: data.date,
      account: data.account,
      type: data.type,
      debit: data.debit,
      credit: data.credit,
    },
  });
  return newTransaction;
}

/**
 * Fetches all transactions from the database.
 * @returns A promise that resolves to an array of transactions.
 */
export async function listTransactions(): Promise<Transaction[]> {
  return await prisma.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
  });
}
