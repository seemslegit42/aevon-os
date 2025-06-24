
"use client"

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, startOfMonth } from 'date-fns';
import { shallow } from 'zustand/shallow';

// Local-to-app imports
import { useAccountingStore } from './store';
import { transactionSchema, invoiceSchema, type TransactionFormValues, type InvoiceFormValues } from './schemas';
import { createTransaction, createInvoice } from './logic';

// UI Imports (Global)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, Upload, FileText, CalendarIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// DIALOGS for adding new data
const AddTransactionDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: { date: new Date(), account: '', debit: 0, credit: 0, type: 'Expense' },
    });

    const onSubmit = (values: TransactionFormValues) => {
        createTransaction(values);
        toast({ title: "Transaction Added", description: `Added ${values.account} transaction.` });
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><PlusCircle /> Add Transaction</Button>
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

const NewInvoiceDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: { client: '', amount: 0, dueDate: new Date(), status: 'Draft' },
    });
    
    const onSubmit = (values: InvoiceFormValues) => {
        createInvoice(values);
        toast({ title: "Invoice Created", description: `New invoice for ${values.client} has been saved as a draft.` });
        form.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button><PlusCircle /> New Invoice</Button>
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
const LedgerTab = () => {
    const ledgerData = useAccountingStore((s) => s.ledgerData);
    return (
        <Card className="h-full glassmorphism-panel border-none">
            <CardHeader>
                <CardTitle className="font-headline text-primary">Dynamic Ledger</CardTitle>
                <CardDescription>Real-time view of all financial transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                     <AddTransactionDialog />
                    <Button size="sm" variant="outline"><Upload /> Import Statement</Button>
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
};

const InvoicesTab = () => {
    const invoiceData = useAccountingStore((s) => s.invoiceData);
    return (
     <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Invoices & Payments</CardTitle>
            <CardDescription>Create, send, and track client invoices.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <NewInvoiceDialog />
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
};

const ReportsTab = () => {
    const ledgerData = useAccountingStore((s) => s.ledgerData);
    const cashflowData = useMemo(() => {
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        ledgerData.forEach(tx => {
            const monthKey = format(startOfMonth(tx.date), 'yyyy-MM');
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expenses: 0 };
            }
            if (tx.type === 'Income') {
                monthlyData[monthKey].income += tx.credit || 0;
            } else if (tx.type === 'Expense') {
                monthlyData[monthKey].expenses += tx.debit || 0;
            }
        });
        
        const sortedMonths = Object.keys(monthlyData).sort();

        return sortedMonths.map(monthKey => {
            return {
                name: format(new Date(`${monthKey}-02`), 'MMM'), // Use day 2 to avoid timezone issues
                income: monthlyData[monthKey].income,
                expenses: monthlyData[monthKey].expenses,
            }
        });
    }, [ledgerData]);

    return (
        <Card className="h-full glassmorphism-panel border-none">
            <CardHeader>
                <CardTitle className="font-headline text-primary">Financial Reports</CardTitle>
                <CardDescription>Key financial reports and cash flow analysis based on your ledger data.</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] pb-0">
                <div className="flex gap-2 mb-4">
                    <Button size="sm" variant="outline"><FileText /> Profit & Loss</Button>
                    <Button size="sm" variant="outline"><FileText /> Balance Sheet</Button>
                    <Button size="sm" variant="outline"><FileText /> GST/HST Report</Button>
                </div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Monthly Cash Flow</h4>
                <ResponsiveContainer width="100%" height={250}>
                    {cashflowData.length > 0 ? (
                        <BarChart data={cashflowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`}/>
                            <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Bar dataKey="income" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>No income or expense data to display. Add transactions in the Ledger tab.</p>
                        </div>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const AccountingComponent = () => {
    return (
        <div className="h-full w-full p-4">
            <Tabs defaultValue="ledger" className="h-full w-full flex flex-col">
                <TabsList className="flex-shrink-0">
                    <TabsTrigger value="ledger">Ledger</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="payroll" disabled>Payroll</TabsTrigger>
                </TabsList>
                <TabsContent value="ledger" className="flex-grow">
                   <LedgerTab />
                </TabsContent>
                <TabsContent value="invoices" className="flex-grow">
                    <InvoicesTab />
                </TabsContent>
                <TabsContent value="reports" className="flex-grow">
                    <ReportsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AccountingComponent;
