
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

const initialLedgerData: LedgerEntry[] = [];

const initialInvoiceData: Invoice[] = [];

export const useAccountingStore = create<AccountingState>((set) => ({
    ledgerData: initialLedgerData,
    invoiceData: initialInvoiceData,
    addTransaction: (transaction) => set((state) => ({
        ledgerData: [{ id: `tx-${Date.now()}`, ...transaction }, ...state.ledgerData]
    })),
    addInvoice: (invoice) => set((state) => ({
        invoiceData: [{ id: `INV-${String(state.invoiceData.length + 1).padStart(3, '0')}`, date: new Date(), ...invoice }, ...state.invoiceData]
    }))
}));
