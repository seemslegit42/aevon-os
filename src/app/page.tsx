
"use client";
import React, { useState, useEffect } from 'react';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChartIcon, Activity, AlertTriangle, Zap, Lightbulb, Briefcase, Settings, Shield, ShoppingCart } from 'lucide-react';
import { generatePersonalizedBriefing, GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";

const chartData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
];

const pieChartData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
];
const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];


export default function HomePage() {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      try {
        const input: GeneratePersonalizedBriefingInput = {
          userName: "Dashboard User",
          operationalMetrics: "Current system load is moderate. User engagement is up by 10%. No critical alerts.",
          relevantInformation: "Provide a concise performance summary and one actionable insight for the dashboard.",
        };
        const result = await generatePersonalizedBriefing(input);
        // Extract a relevant part for the insight
        const insightText = result.briefing.split('.').slice(0, 2).join('.') + '.';
        setAiInsight(insightText);
      } catch (error) {
        console.error("Error fetching AI insight:", error);
        setAiInsight("Could not load AI insight at this time.");
        toast({ variant: "destructive", title: "AI Insight Error", description: "Failed to fetch AI-powered insight." });
      } finally {
        setIsLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [toast]);

  return (
    <div className="space-y-8">
      <Card className="glassmorphism-panel shadow-xl animate-subtle-pulse">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <Lightbulb className="w-8 h-8 mr-3 text-primary" /> AI-Powered Insights
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Your intelligent overview for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInsight ? (
            <p className="text-foreground/70">Loading your personalized insight...</p>
          ) : (
            <p className="text-foreground text-lg">{aiInsight}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MicroAppCard title="Sales Performance" icon={BarChart} className="min-h-[300px]">
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={chartData}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </MicroAppCard>

        <MicroAppCard title="Revenue Trends" icon={LineChart} className="min-h-[300px]">
           <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={chartData}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--accent))" strokeWidth={2} activeDot={{ r: 6 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </MicroAppCard>

        <MicroAppCard title="Product Distribution" icon={PieChartIcon} className="min-h-[300px]">
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                 contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                 labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
            </RechartsPieChart>
          </ResponsiveContainer>
        </MicroAppCard>
      </div>

      <h2 className="text-2xl font-headline text-primary mt-12 mb-6">Your Micro-Apps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Quick Task", icon: Zap, description: "Automate a routine task." },
          { title: "Recent Activity", icon: Activity, description: "View system logs." },
          { title: "Security Scan", icon: AlertTriangle, description: "Initiate a surface scan." },
          { title: "Agent Manager", icon: Briefcase, description: "Oversee AI agents." }
        ].map(app => (
          <MicroAppCard key={app.title} title={app.title} icon={app.icon} description={app.description}>
            <Button variant="outline" className="w-full mt-4 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              Open App
            </Button>
          </MicroAppCard>
        ))}
      </div>
    </div>
  );
}
