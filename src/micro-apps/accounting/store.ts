// src/micro-apps/accounting/store.ts
import { create } from 'zustand';
import type { Invoice, Transaction, InvoiceStatus, TransactionType } from '@prisma/client';
import type { InvoiceFormValues, TransactionFormValues } from './schemas';

interface AccountingState {
    ledgerData: Transaction[];
    invoiceData: Invoice[];
    isLoading: boolean;
    fetchInitialData: () => Promise<void>;
    addTransaction: (transaction: TransactionFormValues) => Promise<Transaction>;
    addInvoice: (invoice: InvoiceFormValues) => Promise<Invoice>;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
    ledgerData: [],
    invoiceData: [],
    isLoading: true,

    fetchInitialData: async () => {
        set({ isLoading: true });
        try {
            const [transactionsRes, invoicesRes] = await Promise.all([
                fetch('/api/accounting/transactions'),
                fetch('/api/accounting/invoices'),
            ]);
            if (!transactionsRes.ok || !invoicesRes.ok) {
                throw new Error('Failed to fetch accounting data.');
            }
            const transactions = await transactionsRes.json();
            const invoices = await invoicesRes.json();
            set({
                ledgerData: transactions.map((t: any) => ({...t, date: new Date(t.date)})),
                invoiceData: invoices.map((i: any) => ({...i, dueDate: new Date(i.dueDate)})),
                isLoading: false,
            });
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },

    addTransaction: async (transaction) => {
        const response = await fetch('/api/accounting/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            throw new Error('Failed to create transaction.');
        }
        const newTransaction = await response.json();
        const parsedTransaction = {...newTransaction, date: new Date(newTransaction.date)};
        set(state => ({
            ledgerData: [parsedTransaction, ...state.ledgerData],
        }));
        return parsedTransaction;
    },

    addInvoice: async (invoice) => {
        const response = await fetch('/api/accounting/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice),
        });
        if (!response.ok) {
            throw new Error('Failed to create invoice.');
        }
        const newInvoice = await response.json();
        const parsedInvoice = {...newInvoice, dueDate: new Date(newInvoice.dueDate)};
        set(state => ({
            invoiceData: [parsedInvoice, ...state.invoiceData],
        }));
        return parsedInvoice;
    },
}));
