
"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LaptopIcon, BrainCircuitIcon } from '@/components/icons';

const edrData = [
  { day: 'Mon', Malware: 2, Ransomware: 0, LateralMovement: 1 },
  { day: 'Tue', Malware: 3, Ransomware: 1, LateralMovement: 2 },
  { day: 'Wed', Malware: 1, Ransomware: 0, LateralMovement: 0 },
  { day: 'Thu', Malware: 4, Ransomware: 0, LateralMovement: 3 },
  { day: 'Fri', Malware: 2, Ransomware: 1, LateralMovement: 1 },
  { day: 'Sat', Malware: 0, Ransomware: 0, LateralMovement: 0 },
  { day: 'Sun', Malware: 1, Ransomware: 0, LateralMovement: 1 },
];

const EdrSummaryPanel: React.FC = () => {
  return (
    <Card className="glassmorphism-panel h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <LaptopIcon className="w-6 h-6 text-secondary" />
                <div>
                    <CardTitle className="font-headline text-lg">EDR Summary</CardTitle>
                    <CardDescription className="text-xs">Endpoint threat history</CardDescription>
                </div>
            </div>
            <Badge className="badge-glow-animate border-none bg-chart-4/80 text-black">
                <BrainCircuitIcon className="w-4 h-4 mr-2" />
                AI Blocking: ON
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={edrData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
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
