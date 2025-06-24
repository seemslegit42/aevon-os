import { create } from 'zustand';
import { format } from 'date-fns';

interface LedgerEntry {
    id: string;
    date: Date;
    account: string;
    type: 'Income' | 'Expense' | 'Asset' | 'Liability' | 'Equity';
    debit: number;
    credit: number;
}

interface Invoice {
    id: string;
    client: string;
    date: Date;
    dueDate: Date;
    amount: number;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

interface AccountingState {
    ledgerData: LedgerEntry[];
    invoiceData: Invoice[];
    addTransaction: (transaction: Omit<LedgerEntry, 'id'>) => void;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'date'> & { dueDate: Date }) => void;
}

const initialLedgerData: LedgerEntry[] = [
    { id: 'tx-1', date: new Date('2024-06-22'), account: 'Stripe Payout', type: 'Income', debit: 0, credit: 2450.00 },
    { id: 'tx-2', date: new Date('2024-06-21'), account: 'Google Cloud', type: 'Expense', debit: 350.00, credit: 0 },
    { id: 'tx-3', date: new Date('2024-06-21'), account: 'Dividends', type: 'Equity', debit: 1000.00, credit: 0 },
    { id: 'tx-4', date: new Date('2024-06-20'), account: 'Bank Loan', type: 'Liability', debit: 0, credit: 5000.00 },
    { id: 'tx-5', date: new Date('2024-06-19'), account: 'New Laptop', type: 'Asset', debit: 2200.00, credit: 0 },
];

const initialInvoiceData: Invoice[] = [
    { id: 'INV-003', client: 'Innovate Corp', date: new Date('2024-06-15'), dueDate: new Date('2024-07-15'), amount: 5000.00, status: 'Sent' },
    { id: 'INV-002', client: 'Synergy Solutions', date: new Date('2024-05-20'), dueDate: new Date('2024-06-20'), amount: 2500.00, status: 'Paid' },
    { id: 'INV-001', client: 'Apex Industries', date: new Date('2024-05-10'), dueDate: new Date('2024-06-10'), amount: 1800.00, status: 'Overdue' },
];

export const useAccountingStore = create<AccountingState>((set) => ({
    ledgerData: initialLedgerData,
    invoiceData: initialInvoiceData,
    addTransaction: (transaction) => set((state) => ({
        ledgerData: [{ id: `tx-${Date.now()}`, ...transaction }, ...state.ledgerData]
    })),
    addInvoice: (invoice) => set((state) => ({
        invoiceData: [{ id: `INV-${String(state.invoiceData.length + 4).padStart(3, '0')}`, date: new Date(), ...invoice }, ...state.invoiceData]
    }))
}));
