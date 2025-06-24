
"use client"

import React, { useState, useEffect, useCallback } from 'react';
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
import { getMonthlySales, getSalesTrend, type MonthlySales, type SalesTrend } from '@/services/sales-data.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';

const barChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const lineChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const SalesAnalyticsApp: React.FC = () => {
    const [monthlySalesData, setMonthlySalesData] = useState<MonthlySales[] | null>(null);
    const [salesTrendData, setSalesTrendData] = useState<SalesTrend[] | null>(null);
    const { toast } = useToast();
    
    const fetchData = useCallback(async () => {
        setMonthlySalesData(null);
        setSalesTrendData(null);
        const monthly = await getMonthlySales();
        const trend = await getSalesTrend();
        setMonthlySalesData(monthly);
        setSalesTrendData(trend);
    }, []);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
      const handleRefresh = () => {
          toast({ title: 'Refreshing Data...', description: 'Fetching the latest sales analytics.' });
          fetchData();
      };
  
      const handleExport = () => {
          toast({ title: 'Export Action', description: 'This functionality is for demonstration purposes.' });
      };
  
      eventBus.on('control:click:refresh', handleRefresh);
      eventBus.on('control:click:export', handleExport);
  
      return () => {
          eventBus.off('control:click:refresh', handleRefresh);
          eventBus.off('control:click:export', handleExport);
      };
    }, [toast, fetchData]);

  return (
    <div className="space-y-4 h-full flex flex-col">
        <div className="flex-1">
            <Card className="h-full glassmorphism-panel border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Monthly Sales by Platform</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-4rem)] pb-0">
                    {monthlySalesData ? (
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
                    ) : <Skeleton className="w-full h-full" />}
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
                    {salesTrendData ? (
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
                    ) : <Skeleton className="w-full h-full" />}
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SalesAnalyticsApp;
