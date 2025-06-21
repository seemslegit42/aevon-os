
"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { FishIcon } from '@/components/icons';

const phishingData = {
  clickResistance: 82,
  emailsBlocked: [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 18 },
    { day: "Wed", count: 9 },
    { day: "Thu", count: 25 },
    { day: "Fri", count: 15 },
    { day: "Sat", count: 7 },
    { day: "Sun", count: 4 },
  ],
  trainingRequired: 'Low',
};

const getTrainingColor = (level: string) => {
  if (level === 'High') return 'badge-destructive';
  if (level === 'Medium') return 'badge-high';
  return 'badge-success';
};

const PhishingResiliencePanel: React.FC = () => {
  return (
    <Card className="glassmorphism-panel h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2">
        <FishIcon className="w-6 h-6 text-secondary" />
        <div className="flex-1">
          <CardTitle className="font-headline text-lg">Phishing Resilience</CardTitle>
          <CardDescription className="text-xs">Email threat monitoring</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Click Resistance</h4>
             <ChartContainer
                config={{
                    score: { label: 'Resistance', color: 'hsl(var(--chart-2))' },
                }}
                className="w-full h-32"
            >
                <RadialBarChart
                    data={[{ name: 'score', value: phishingData.clickResistance, fill: 'hsl(var(--chart-2))' }]}
                    startAngle={-270}
                    endAngle={90}
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={12}
                    >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" background={{ fill: 'hsl(var(--muted)/0.3)'}} cornerRadius={10} />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground text-2xl font-bold font-headline"
                    >
                        {phishingData.clickResistance}%
                    </text>
                </RadialBarChart>
            </ChartContainer>
        </div>
        <div className="flex flex-col items-center">
             <h4 className="text-sm font-semibold text-muted-foreground mb-2">Emails Blocked</h4>
             <ChartContainer config={{ count: { label: "Blocked" } }} className="w-full h-32">
                <BarChart data={phishingData.emailsBlocked} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                    <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Bar dataKey="count" fill="hsl(var(--chart-5))" radius={2} />
                </BarChart>
            </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Badge className={getTrainingColor(phishingData.trainingRequired)}>
          Training Required: {phishingData.trainingRequired}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PhishingResiliencePanel;
