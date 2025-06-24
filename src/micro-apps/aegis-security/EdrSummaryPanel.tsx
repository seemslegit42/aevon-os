
"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Laptop, BrainCircuit } from 'lucide-react';
import type { EdrDataPoint } from '@/services/security.service';

interface EdrSummaryPanelProps {
  data: EdrDataPoint[];
}

const EdrSummaryPanel: React.FC<EdrSummaryPanelProps> = ({ data }) => {
  return (
    <Card className="glassmorphism-panel h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Laptop className="w-6 h-6 text-secondary" />
                <div>
                    <CardTitle className="font-headline text-lg">EDR Summary</CardTitle>
                    <CardDescription className="text-xs">Endpoint threat history</CardDescription>
                </div>
            </div>
            <Badge className="badge-glow-animate border-none bg-chart-4/80 text-black">
                <BrainCircuit className="w-4 h-4 mr-2" />
                AI Blocking: ON
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                 />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                <Bar dataKey="Malware" stackId="a" fill="hsl(var(--chart-5))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Ransomware" stackId="a" fill="hsl(var(--accent))" />
                <Bar dataKey="LateralMovement" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 0, 0, 4]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EdrSummaryPanel;
