import { useState, useEffect } from "react";
import { ArrowRight, Check, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple CountUp Component
const CountUp = ({ end, duration = 1000, visible = true }: { end: number, duration?: number, visible?: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, visible]);

    return <span>{count.toLocaleString()}</span>;
};

const SaasVsBuild = () => {
    const [pricePerSeat, setPricePerSeat] = useState(50);
    const [seats, setSeats] = useState(100);

    // ROI Logic 3.1
    // Annual Cost = (Seats * CostPerSeat) * 12
    const totalMonthlySpend = pricePerSeat * seats;
    const annualSaasRent = totalMonthlySpend * 12;

    // Bespoke Build = 25% of Annual Cost (One-time)
    const bespokeBuildCost = annualSaasRent * 0.25;

    // Maintenance = 5% of Annual Cost (Ongoing)
    const maintenanceCost = annualSaasRent * 0.05;

    // Year 1 Savings = Annual Rent - (Build + Maint)
    const year1Savings = annualSaasRent - (bespokeBuildCost + maintenanceCost);

    // Year 2+ Profit = Annual Rent - Maint
    const year2Profit = annualSaasRent - maintenanceCost;

    return (
        <section id="saas-killer" className="py-20 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The SaaS Killer</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        You are paying for the vendor's profit margin. I build you the engine so you own the asset.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <Card className="p-8 bg-card shadow-sm card-slab">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Monthly Cost Per Seat</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            value={pricePerSeat}
                                            onChange={(e) => setPricePerSeat(Number(e.target.value))}
                                            className="pl-8 text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">e.g. Copilot, Salesforce</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Seats</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={seats}
                                            onChange={(e) => setSeats(Number(e.target.value))}
                                            className="pl-9 text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Annual SaaS Rent:</span>
                                    <span className="font-mono font-medium text-foreground text-lg">
                                        $<CountUp end={annualSaasRent} />
                                    </span>
                                </div>

                                <div className="p-4 bg-secondary rounded-lg border border-border mt-4 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-primary">One-Time Build Fee:</span>
                                        <span className="font-mono font-bold text-lg text-primary">
                                            $<CountUp end={bespokeBuildCost} />
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <span>Annual Maintenance (5%):</span>
                                        <span>$<CountUp end={maintenanceCost} /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-wider">The ROI Model</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                                    <p className="text-sm text-emerald-800 font-medium mb-1">Year 1 Savings</p>
                                    <div className="text-3xl font-serif text-emerald-700">
                                        $<CountUp end={year1Savings} />
                                    </div>
                                    <p className="text-xs text-emerald-600/80 mt-1">Immediate cash flow positive.</p>
                                </div>

                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                                    <p className="text-sm text-blue-800 font-medium mb-1">Year 2+ Ownership Profit</p>
                                    <div className="text-3xl font-serif text-blue-700">
                                        $<CountUp end={year2Profit} />
                                    </div>
                                    <p className="text-xs text-blue-600/80 mt-1">Per year, forever. You own the code.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button className="flex-1 py-3 px-4 bg-[#0F172A] text-white font-medium rounded-lg hover:bg-[#1e293b] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                Start Your Rationalization <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SaasVsBuild;
