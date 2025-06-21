
"use client"

import React from 'react';
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for the charts
const monthlySalesData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const salesTrendData = [
  { date: '2024-01-01', sales: 2000 },
  { date: '2024-02-01', sales: 2200 },
  { date: '2024-03-01', sales: 3000 },
  { date: '2024-04-01', sales: 2780 },
  { date: '2024-05-01', sales: 3890 },
  { date: '2024-06-01', sales: 3390 },
  { date: '2024-07-01', sales: 4490 },
];


const barChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const lineChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const SalesAnalyticsApp: React.FC = () => {
  return (
    <div className="space-y-4 h-full flex flex-col">
        <div className="flex-1">
            <Card className="h-full glassmorphism-panel border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Monthly Sales by Platform</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-4rem)] pb-0">
                     <ChartContainer config={barChartConfig} className="h-full w-full">
                        <BarChart accessibilityLayer data={monthlySalesData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <div className="flex-1">
            <Card className="h-full glassmorphism-panel border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Sales Trend</CardTitle>
                    <CardDescription>Last 7 Months</CardDescription>
                </CardHeader>
                 <CardContent className="h-[calc(100%-4rem)] pb-0">
                    <ChartContainer config={lineChartConfig} className="h-full w-full">
                        <LineChart accessibilityLayer data={salesTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                            />
                            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SalesAnalyticsApp;
