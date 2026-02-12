import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, Euro } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const HOURLY_COST = 50; // €50/hr average
const WEEKS_PER_YEAR = 52;
const AGENT_EFFICIENCY = 0.7; // Agents automate 70% of manual work

const SavingsCalculator = () => {
    const [employees, setEmployees] = useState(15);
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [displayedSavings, setDisplayedSavings] = useState(0);
    const animFrameRef = useRef<number | null>(null);

    // Calculations
    const annualManualCost = employees * hoursPerWeek * HOURLY_COST * WEEKS_PER_YEAR;
    const annualSavings = Math.round(annualManualCost * AGENT_EFFICIENCY);
    const agentBuildCost = Math.round(annualSavings * 0.2); // One-time: 20% of first-year savings
    const netYear1 = annualSavings - agentBuildCost;
    const roiPercent = Math.round((netYear1 / agentBuildCost) * 100);

    // Animated counter
    useEffect(() => {
        const start = displayedSavings;
        const end = annualSavings;
        const duration = 600;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setDisplayedSavings(Math.round(start + (end - start) * eased));
            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            }
        };

        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(animate);

        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, [annualSavings]);

    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        ROI Calculator
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        How much is your team losing to Excel and Outlook? Adjust the sliders to see instant ROI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Input Card */}
                    <div className="glass-card rounded-2xl p-8 space-y-8">
                        {/* Employees */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <label className="text-sm font-medium text-foreground">Number of Employees</label>
                                </div>
                                <span className="font-mono text-lg font-bold text-indigo-600">{employees}</span>
                            </div>
                            <Slider
                                value={[employees]}
                                onValueChange={(v) => setEmployees(v[0])}
                                min={5}
                                max={200}
                                step={5}
                                className="py-2"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                                <span>5</span>
                                <span>200</span>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    <label className="text-sm font-medium text-foreground">Avg Hours in Excel/Outlook per Week</label>
                                </div>
                                <span className="font-mono text-lg font-bold text-purple-600">{hoursPerWeek}h</span>
                            </div>
                            <Slider
                                value={[hoursPerWeek]}
                                onValueChange={(v) => setHoursPerWeek(v[0])}
                                min={2}
                                max={40}
                                step={1}
                                className="py-2"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                                <span>2h</span>
                                <span>40h</span>
                            </div>
                        </div>

                        {/* Summary line */}
                        <div className="pt-4 border-t border-white/20">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Cost rate applied:</span>
                                <span className="font-mono">€{HOURLY_COST}/hr avg</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                <span>Automation efficiency:</span>
                                <span className="font-mono">{AGENT_EFFICIENCY * 100}% of manual tasks</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        {/* Big number */}
                        <motion.div
                            layout
                            className="glass-card rounded-2xl p-8 text-center"
                        >
                            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                                Money Saved Annually
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <Euro className="w-8 h-8 text-emerald-600" />
                                <motion.span
                                    className="text-5xl md:text-6xl font-serif text-emerald-600 font-medium tabular-nums"
                                >
                                    {displayedSavings.toLocaleString()}
                                </motion.span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3">
                                by automating {Math.round(employees * hoursPerWeek * AGENT_EFFICIENCY)} hours/week
                            </p>
                        </motion.div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card rounded-xl p-5">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                                    One-Time Build
                                </p>
                                <p className="text-2xl font-serif text-foreground">
                                    €{agentBuildCost.toLocaleString()}
                                </p>
                            </div>
                            <div className="glass-card rounded-xl p-5">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                                    Year 1 ROI
                                </p>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    <p className="text-2xl font-serif text-emerald-600">
                                        {roiPercent}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-xl p-4 border-l-4 border-indigo-500">
                            <p className="agent-text text-foreground/80">
                                <strong>Net Year 1 return:</strong> €{netYear1.toLocaleString()} after build costs.
                                Year 2+: €{annualSavings.toLocaleString()}/yr pure profit. You own the code.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SavingsCalculator;
