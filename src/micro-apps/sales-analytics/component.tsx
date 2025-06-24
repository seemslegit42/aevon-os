
"use client"

import React, { useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';
import { useSalesAnalyticsStore } from './store';
import { shallow } from 'zustand/shallow';
import type { MonthlySales, SalesTrend } from '@/services/sales-data.service';


const barChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const lineChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const SalesAnalyticsComponent: React.FC = () => {
    const { toast } = useToast();
    
    const { monthlySales, salesTrend, isLoading, error, actions } = useSalesAnalyticsStore(
      (state) => ({
        monthlySales: state.monthlySales,
        salesTrend: state.salesTrend,
        isLoading: state.isLoading,
        error: state.error,
        actions: state.actions,
      }),
      shallow
    );
    
    useEffect(() => {
        // Only fetch data if it hasn't been fetched yet and isn't currently loading.
        if (!monthlySales && !salesTrend && !isLoading) {
            actions.fetchData();
        }
    }, [actions, monthlySales, salesTrend, isLoading]);

    useEffect(() => {
      const handleRefresh = () => {
          toast({ title: 'Refreshing Data...', description: 'Fetching the latest sales analytics.' });
          actions.fetchData();
      };
  
      const handleExport = () => {
          toast({ title: 'Export Action', description: 'This functionality is for demonstration purposes.' });
      };

      const handleDataUpdate = (data: { monthlySales: MonthlySales[], salesTrend: SalesTrend[] }) => {
        toast({ title: 'Data Updated', description: 'Sales analytics have been updated by the AI agent.' });
        actions.fetchData(); 
      };
  
      eventBus.on('control:click:refresh', handleRefresh);
      eventBus.on('control:click:export', handleExport);
      eventBus.on('sales-analytics:update', handleDataUpdate);
  
      return () => {
          eventBus.off('control:click:refresh', handleRefresh);
          eventBus.off('control:click:export', handleExport);
          eventBus.off('sales-analytics:update', handleDataUpdate);
      };
    }, [toast, actions]);

    if (isLoading) {
        return (
            <div className="space-y-4 h-full flex flex-col p-4">
                <Skeleton className="h-1/2 w-full rounded-lg" />
                <Skeleton className="h-1/2 w-full rounded-lg" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

  return (
    <div className="space-y-4 h-full flex flex-col p-4">
        <div className="flex-1">
            <Card className="h-full glassmorphism-panel border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-primary">Monthly Sales by Platform</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-4rem)] pb-0">
                    {monthlySales ? (
                         <ChartContainer config={barChartConfig} className="h-full w-full">
                            <BarChart accessibilityLayer data={monthlySales}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    ) : <p className="text-center text-muted-foreground">No monthly sales data.</p>}
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
                    {salesTrend ? (
                        <ChartContainer config={lineChartConfig} className="h-full w-full">
                            <LineChart accessibilityLayer data={salesTrend} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
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
                    ) : <p className="text-center text-muted-foreground">No sales trend data.</p>}
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default SalesAnalyticsComponent;
