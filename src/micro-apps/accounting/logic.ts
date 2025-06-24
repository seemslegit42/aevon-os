import { useAccountingStore } from './store';
import { type TransactionFormValues, type InvoiceFormValues } from './schemas';

export const createTransaction = (data: TransactionFormValues) => {
    useAccountingStore.getState().addTransaction({
        ...data,
        debit: data.debit || 0,
        credit: data.credit || 0,
    });
};

export const createInvoice = (data: InvoiceFormValues) => {
    useAccountingStore.getState().addInvoice(data);
};
