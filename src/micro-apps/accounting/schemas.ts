import { z } from 'zod';
import { TransactionType, InvoiceStatus } from '@prisma/client';

export const transactionSchema = z.object({
  date: z.date(),
  account: z.string().min(2, "Account name is too short"),
  type: z.nativeEnum(TransactionType),
  debit: z.coerce.number().optional(),
  credit: z.coerce.number().optional(),
}).refine(data => data.debit || data.credit, {
  message: "Either Debit or Credit must have a value.",
  path: ["debit"],
});
export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const invoiceSchema = z.object({
  client: z.string().min(2, "Client name is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  dueDate: z.date(),
  status: z.nativeEnum(InvoiceStatus).default('DRAFT'),
});
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
