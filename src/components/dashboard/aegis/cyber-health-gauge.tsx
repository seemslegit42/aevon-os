
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';

const CyberHealthGauge: React.FC = () => {
    const [score, setScore] = useState(0);
    const prevScoreRef = useRef(score);
    
    // In a real app, the sound file would be in /public/sounds/
    // Since we cannot add binary files, this will fail silently.
    const playSwooshSound = useSound('/sounds/swoosh.mp3');

    useEffect(() => {
        // Initial animation from 0 to a starting score
        const initialScore = Math.floor(Math.random() * 21) + 75; // Start between 75-95
        setScore(initialScore);
        prevScoreRef.current = initialScore;

        const interval = setInterval(() => {
            setScore(prevScore => {
                prevScoreRef.current = prevScore;
                // Simulate score fluctuation
                const change = (Math.random() - 0.45) * 15;
                const newScore = Math.max(0, Math.min(100, Math.round(prevScore + change)));
                return newScore;
            });
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Effect to detect sudden score drops
        if (prevScoreRef.current - score > 15) {
            playSwooshSound();
        }
    }, [score, playSwooshSound]);

    const getScoreData = () => {
        const needleValue = Math.max(0, Math.min(100, score));
        return [{ value: needleValue }];
    };

    const getGaugeColor = (value: number) => {
        if (value >= 80) return "text-green-400";
        if (value >= 50) return "text-yellow-400";
        return "text-red-500";
    };

    const getStatusInfo = (value: number) => {
        if (value >= 80) return { emoji: "😌", text: "Secure", color: "text-green-400" };
        if (value >= 50) return { emoji: "⚠️", text: "Warning", color: "text-yellow-400" };
        return { emoji: "🚨", text: "Critical", color: "text-red-500" };
    };

    const status = getStatusInfo(score);

    return (
        <div className={cn(
            "glassmorphism-panel w-full max-w-md p-4 transition-all duration-500",
            score < 50 && "gauge-pulse-animate"
        )}>
            <div className="relative w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        barSize={15}
                        data={[{ value: 100 }]}
                        startAngle={180}
                        endAngle={0}
                    >
                        <defs>
                            <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#4ade80" />
                            </linearGradient>
                        </defs>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        {/* Background track */}
                        <RadialBar
                            background
                            dataKey="value"
                            angleAxisId={0}
                            fill="hsl(var(--muted) / 0.3)"
                            cornerRadius={10}
                        />
                        {/* Animated foreground score bar */}
                        <RadialBar
                            dataKey={() => score}
                            angleAxisId={0}
                            fill="url(#healthGradient)"
                            cornerRadius={10}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-4">
                    <motion.div
                        key={score}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-baseline font-headline"
                    >
                        <span className={cn("text-7xl font-bold", getGaugeColor(score))}>
                            {Math.round(score)}
                        </span>
                        <span className="text-3xl text-muted-foreground">%</span>
                    </motion.div>
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={status.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 mt-1"
                        >
                            <span className="text-xl">{status.emoji}</span>
                            <span className={cn("font-semibold", status.color)}>{status.text}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CyberHealthGauge;
