import { useState } from "react";
import { ArrowRight, Check, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SaasVsBuild = () => {
    const [pricePerSeat, setPricePerSeat] = useState(50);
    const [seats, setSeats] = useState(100);

    // ROI Logic 3.0
    // Total Monthly = Price * Seats
    const totalMonthlySpend = pricePerSeat * seats;
    const annualSaasRent = totalMonthlySpend * 12;

    // Bespoke Build = 25% of Annual SaaS (One-time)
    const bespokeBuildCost = annualSaasRent * 0.25;

    // Payback Period (Months) = Build Cost / Monthly Spend
    // If Build is 3 months of rent (which 25% of 12 months IS), then payback is 3.0
    const paybackPeriod = bespokeBuildCost / totalMonthlySpend;

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
                    <Card className="p-8 border-slate-200 bg-card shadow-sm">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Price Per Seat</Label>
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
                                    <span className="text-muted-foreground">Monthly Burn:</span>
                                    <span className="font-mono font-medium text-foreground">${totalMonthlySpend.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Annual Rent:</span>
                                    <span className="font-mono font-medium text-foreground">${annualSaasRent.toLocaleString()}</span>
                                </div>
                                <div className="p-3 bg-secondary rounded-lg border border-border mt-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-primary">Bespoke Build Cost (Est):</span>
                                        <span className="font-mono font-bold text-lg text-primary">${bespokeBuildCost.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1 text-right">One-time investment (25% of annual rent)</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-wider">The Verdict</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                                    <span className="text-foreground/80">Payback Period:</span>
                                    <span className="text-4xl font-serif text-primary font-medium">
                                        {paybackPeriod.toFixed(1)} Months
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-emerald-700 mt-2 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">
                                After month 3, you are 100% profitable.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Asset Ownership</h4>
                                    <p className="text-sm text-muted-foreground">Stop renting intelligence. Own the weights.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Unlimited Scale</h4>
                                    <p className="text-sm text-muted-foreground">Add 1,000 users for $0 extra license fees.</p>
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 text-primary font-medium hover:underline group">
                            Start Your Architecture Review <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SaasVsBuild;
