
"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

// UI Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircleIcon, UploadIcon, FileIcon, CalendarIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


// Schemas for form validation
const transactionSchema = z.object({
  date: z.date(),
  account: z.string().min(2, "Account name is too short"),
  type: z.enum(['Income', 'Expense', 'Asset', 'Liability', 'Equity']),
  debit: z.coerce.number().optional(),
  credit: z.coerce.number().optional(),
}).refine(data => data.debit || data.credit, {
  message: "Either Debit or Credit must have a value.",
  path: ["debit"],
});
type TransactionFormValues = z.infer<typeof transactionSchema>;

const invoiceSchema = z.object({
  client: z.string().min(2, "Client name is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  dueDate: z.date(),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue']).default('Draft'),
});
type InvoiceFormValues = z.infer<typeof invoiceSchema>;


// Mock Data (will be used as initial state)
const initialLedgerData = [
    { id: 'tx-1', date: new Date('2024-06-22'), account: 'Stripe Payout', type: 'Income' as const, debit: 0, credit: 2450.00 },
    { id: 'tx-2', date: new Date('2024-06-21'), account: 'Google Cloud', type: 'Expense' as const, debit: 350.00, credit: 0 },
    { id: 'tx-3', date: new Date('2024-06-21'), account: 'Dividends', type: 'Equity' as const, debit: 1000.00, credit: 0 },
    { id: 'tx-4', date: new Date('2024-06-20'), account: 'Bank Loan', type: 'Liability' as const, debit: 0, credit: 5000.00 },
    { id: 'tx-5', date: new Date('2024-06-19'), account: 'New Laptop', type: 'Asset' as const, debit: 2200.00, credit: 0 },
];

const initialInvoiceData = [
    { id: 'INV-003', client: 'Innovate Corp', date: new Date('2024-06-15'), dueDate: new Date('2024-07-15'), amount: 5000.00, status: 'Sent' as const },
    { id: 'INV-002', client: 'Synergy Solutions', date: new Date('2024-05-20'), dueDate: new Date('2024-06-20'), amount: 2500.00, status: 'Paid' as const },
    { id: 'INV-001', client: 'Apex Industries', date: new Date('2024-05-10'), dueDate: new Date('2024-06-10'), amount: 1800.00, status: 'Overdue' as const },
];

const mockCashflowData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 9800, expenses: 2000 },
    { name: 'Apr', income: 3908, expenses: 2780 },
    { name: 'May', income: 4800, expenses: 1890 },
    { name: 'Jun', income: 3800, expenses: 2390 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// DIALOGS for adding new data
const AddTransactionDialog = ({ onSave }: { onSave: (data: TransactionFormValues) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: { date: new Date(), account: '', debit: 0, credit: 0, type: 'Expense' },
    });

    const onSubmit = (values: TransactionFormValues) => {
        onSave(values);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><PlusCircleIcon/> Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glassmorphism-panel">
                <DialogHeader>
                    <DialogTitle className="font-headline text-primary">New Ledger Entry</DialogTitle>
                    <DialogDescription>Add a new transaction to the general ledger.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="account" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account</FormLabel>
                                <FormControl><Input placeholder="e.g., Office Supplies" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="debit" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Debit</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="credit" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit</FormLabel>
                                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Income">Income</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                        <SelectItem value="Asset">Asset</SelectItem>
                                        <SelectItem value="Liability">Liability</SelectItem>
                                        <SelectItem value="Equity">Equity</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <DialogFooter>
                            <Button type="submit" className="btn-gradient-primary-accent">Save Transaction</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const NewInvoiceDialog = ({ onSave }: { onSave: (data: InvoiceFormValues) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: { client: '', amount: 0, dueDate: new Date(), status: 'Draft' },
    });
    
    const onSubmit = (values: InvoiceFormValues) => {
        onSave(values);
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button><PlusCircleIcon/> New Invoice</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glassmorphism-panel">
                <DialogHeader>
                    <DialogTitle className="font-headline text-primary">New Invoice</DialogTitle>
                    <DialogDescription>Create and send a new invoice to a client.</DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="client" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Innovate Corp" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="dueDate" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <DialogFooter>
                            <Button type="submit" className="btn-gradient-primary-accent">Create Invoice</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}


// TABS
const LedgerTab = ({ ledgerData, onSave }: { ledgerData: (typeof initialLedgerData[0])[], onSave: (data: any) => void }) => (
    <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Dynamic Ledger</CardTitle>
            <CardDescription>Real-time view of all financial transactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
                 <AddTransactionDialog onSave={onSave} />
                <Button size="sm" variant="outline"><UploadIcon/> Import Statement</Button>
            </div>
            <ScrollArea className="h-[280px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ledgerData.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell>{format(tx.date, 'yyyy-MM-dd')}</TableCell>
                            <TableCell>{tx.account}</TableCell>
                            <TableCell><Badge variant="outline">{tx.type}</Badge></TableCell>
                            <TableCell className="text-right text-destructive">{tx.debit ? currencyFormatter.format(tx.debit) : '-'}</TableCell>
                            <TableCell className="text-right text-chart-4">{tx.credit ? currencyFormatter.format(tx.credit) : '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </ScrollArea>
        </CardContent>
    </Card>
);

const InvoicesTab = ({ invoiceData, onSave }: { invoiceData: (typeof initialInvoiceData[0])[], onSave: (data: any) => void }) => (
     <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Invoices & Payments</CardTitle>
            <CardDescription>Create, send, and track client invoices.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <NewInvoiceDialog onSave={onSave} />
            </div>
             <ScrollArea className="h-[280px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoiceData.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{format(invoice.dueDate, 'yyyy-MM-dd')}</TableCell>
                            <TableCell>
                                <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'} className={invoice.status === 'Paid' ? 'badge-success' : ''}>{invoice.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{currencyFormatter.format(invoice.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             </ScrollArea>
        </CardContent>
    </Card>
);

const ReportsTab = () => (
     <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Financial Reports</CardTitle>
            <CardDescription>Visualize your business's financial health.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] pb-0">
             <div className="flex gap-2 mb-4">
                <Button size="sm" variant="outline"><FileIcon /> Profit & Loss</Button>
                <Button size="sm" variant="outline"><FileIcon /> Balance Sheet</Button>
                <Button size="sm" variant="outline"><FileIcon /> GST/HST Report</Button>
            </div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Monthly Cash Flow</h4>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockCashflowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`}/>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)', }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Bar dataKey="income" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);


const AccountingApp = () => {
    const { toast } = useToast();
    const [ledgerData, setLedgerData] = useState<(typeof initialLedgerData[0])[]>(initialLedgerData);
    const [invoiceData, setInvoiceData] = useState<(typeof initialInvoiceData[0])[]>(initialInvoiceData);

    const handleSaveTransaction = (data: TransactionFormValues) => {
        const newTransaction = {
            id: `tx-${Date.now()}`,
            ...data,
        };
        setLedgerData(prev => [newTransaction, ...prev]);
        toast({ title: "Transaction Added", description: `Added ${data.account} transaction.` });
    };

    const handleSaveInvoice = (data: InvoiceFormValues) => {
        const newInvoice = {
            id: `INV-${String(invoiceData.length + 4).padStart(3, '0')}`,
            date: new Date(),
            ...data,
        };
        setInvoiceData(prev => [newInvoice, ...prev]);
        toast({ title: "Invoice Created", description: `New invoice for ${data.client} has been saved as a draft.` });
    }

    return (
        <div className="h-full w-full p-1">
            <Tabs defaultValue="ledger" className="h-full w-full flex flex-col">
                <TabsList className="flex-shrink-0">
                    <TabsTrigger value="ledger">Ledger</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="payroll" disabled>Payroll</TabsTrigger>
                </TabsList>
                <TabsContent value="ledger" className="flex-grow">
                   <LedgerTab ledgerData={ledgerData} onSave={handleSaveTransaction} />
                </TabsContent>
                <TabsContent value="invoices" className="flex-grow">
                    <InvoicesTab invoiceData={invoiceData} onSave={handleSaveInvoice} />
                </TabsContent>
                <TabsContent value="reports" className="flex-grow">
                    <ReportsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AccountingApp;
