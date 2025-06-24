import { z } from 'zod';

export const transactionSchema = z.object({
  date: z.date(),
  account: z.string().min(2, "Account name is too short"),
  type: z.enum(['Income', 'Expense', 'Asset', 'Liability', 'Equity']),
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
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue']).default('Draft'),
});
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
