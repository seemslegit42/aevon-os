
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
        setTimeout(() => {
            setScore(initialScore);
            prevScoreRef.current = initialScore;
        }, 500);

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

    const getFillColor = (value: number) => {
        if (value >= 80) return "hsl(var(--chart-4))"; // Green
        if (value >= 50) return "hsl(var(--accent))"; // Yellow
        return "hsl(var(--chart-5))"; // Red
    };
    
    const getStatusInfo = (value: number) => {
        if (value >= 80) return { emoji: "😌", text: "Secure", color: getFillColor(value) };
        if (value >= 50) return { emoji: "⚠️", text: "Warning", color: getFillColor(value) };
        return { emoji: "🚨", text: "Critical", color: getFillColor(value) };
    };

    const status = getStatusInfo(score);
    const fillColor = getFillColor(score);

    return (
        <div className={cn(
            "glassmorphism-panel w-full max-w-sm mx-auto p-4 aspect-square flex items-center justify-center transition-all duration-500",
            score < 50 && "gauge-pulse-animate"
        )}>
            <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={20}
                        data={[{ value: score }]}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        {/* Background track */}
                        <RadialBar
                            background={{ fill: "hsl(var(--muted) / 0.3)" }}
                            dataKey="value"
                            angleAxisId={0}
                            cornerRadius={10}
                            // This is a dummy data bar that will be overridden by the animated one
                        />
                        {/* Animated foreground score bar */}
                        <RadialBar
                            dataKey="value"
                            angleAxisId={0}
                            fill={fillColor}
                            cornerRadius={10}
                            className="transition-colors duration-500"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={score}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-baseline font-headline"
                        style={{ color: fillColor }}
                    >
                        <span className="text-7xl font-bold">
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
                            <span className="font-semibold" style={{ color: status.color }}>{status.text}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CyberHealthGauge;
