"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircleIcon, UploadIcon, FileIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock Data
const mockLedgerData = [
    { date: '2024-06-22', account: 'Stripe Payout', type: 'Income', debit: '-', credit: '2,450.00', balance: '15,200.00' },
    { date: '2024-06-21', account: 'Google Cloud', type: 'Expense', debit: '350.00', credit: '-', balance: '12,750.00' },
    { date: '2024-06-21', account: 'Dividends', type: 'Equity', debit: '1,000.00', credit: '-', balance: '13,100.00' },
    { date: '2024-06-20', account: 'Bank Loan', type: 'Liability', debit: '-', credit: '5,000.00', balance: '14,100.00' },
    { date: '2024-06-19', account: 'New Laptop', type: 'Asset', debit: '2,200.00', credit: '-', balance: '9,100.00' },
];

const mockInvoiceData = [
    { id: 'INV-003', client: 'Innovate Corp', date: '2024-06-15', due: '2024-07-15', amount: '5,000.00', status: 'Sent' },
    { id: 'INV-002', client: 'Synergy Solutions', date: '2024-05-20', due: '2024-06-20', amount: '2,500.00', status: 'Paid' },
    { id: 'INV-001', client: 'Apex Industries', date: '2024-05-10', due: '2024-06-10', amount: '1,800.00', status: 'Overdue' },
];

const mockCashflowData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 9800, expenses: 2000 },
    { name: 'Apr', income: 3908, expenses: 2780 },
    { name: 'May', income: 4800, expenses: 1890 },
    { name: 'Jun', income: 3800, expenses: 2390 },
];

const LedgerTab: React.FC = () => (
    <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Dynamic Ledger</CardTitle>
            <CardDescription>Real-time view of all financial transactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
                <Button size="sm"><PlusCircleIcon/> Add Transaction</Button>
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
                        <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockLedgerData.map((tx, i) => (
                        <TableRow key={i}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.account}</TableCell>
                            <TableCell><Badge variant="outline">{tx.type}</Badge></TableCell>
                            <TableCell className="text-right text-destructive">{tx.debit}</TableCell>
                            <TableCell className="text-right text-chart-4">{tx.credit}</TableCell>
                            <TableCell className="text-right font-medium">${tx.balance}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </ScrollArea>
        </CardContent>
    </Card>
);

const InvoicesTab: React.FC = () => (
     <Card className="h-full glassmorphism-panel border-none">
        <CardHeader>
            <CardTitle className="font-headline text-primary">Invoices & Payments</CardTitle>
            <CardDescription>Create, send, and track client invoices.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button className="mb-4"><PlusCircleIcon/> New Invoice</Button>
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
                    {mockInvoiceData.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.due}</TableCell>
                            <TableCell>
                                <Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'} className={invoice.status === 'Paid' ? 'badge-success' : ''}>{invoice.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">${invoice.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             </ScrollArea>
        </CardContent>
    </Card>
);

const ReportsTab: React.FC = () => (
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
                    <Tooltip contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Bar dataKey="income" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);


const AccountingApp: React.FC = () => {
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

export default AccountingApp;
