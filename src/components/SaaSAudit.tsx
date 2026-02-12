import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const SaaSAudit = () => {
    // State is wired for interactivity
    const [seats, setSeats] = useState(10);
    const [monthlySpend, setMonthlySpend] = useState(500);

    // Logic:
    // Annual SaaS = Monthly * 12
    // Bespoke Build = 25% of Annual SaaS (One-time)
    // Maintenance = 10% of Bespoke Build (Annual)
    // Year 1 Savings = Annual SaaS - (Bespoke Build + Maintenance)
    // Year 2+ Savings = Annual SaaS - Maintenance

    const annualSaasCost = monthlySpend * 12;
    const bespokeBuildCost = annualSaasCost * 0.25;
    const maintenanceCost = bespokeBuildCost * 0.10;

    const year1Savings = annualSaasCost - (bespokeBuildCost + maintenanceCost);
    const year2Savings = annualSaasCost - maintenanceCost;

    return (
        <section id="saas-audit" className="py-20 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The SaaS Audit</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        You are paying for the vendor's overhead. I build you the engine so you own the asset.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <Card className="p-8 border-border bg-card shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Monthly SaaS Spend (Total)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        value={monthlySpend}
                                        onChange={(e) => setMonthlySpend(Number(e.target.value))}
                                        className="pl-8 text-lg"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Total bill for CRMs, AI writers, Data tools.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Team Size / Seats</Label>
                                    <span className="font-mono text-muted-foreground">{seats} seats</span>
                                </div>
                                <Slider
                                    value={[seats]}
                                    onValueChange={(v) => setSeats(v[0])}
                                    max={100}
                                    step={1}
                                    className="py-4"
                                />
                            </div>

                            <div className="pt-4 border-t border-border space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Annual SaaS Rent:</span>
                                    <span className="font-mono font-medium">${annualSaasCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Bespoke Build Cost (Est):</span>
                                    <span className="font-mono font-medium text-primary">${bespokeBuildCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Annual Maintenance (10%):</span>
                                    <span className="font-mono font-medium text-muted-foreground">${maintenanceCost.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-wider">The Verdict</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                                    <span className="text-foreground/80">Year 1 Savings:</span>
                                    <span className="text-3xl font-serif text-primary font-medium">
                                        ${year1Savings.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-foreground/80">Year 2+ Savings:</span>
                                    <span className="text-3xl font-serif text-primary font-medium">
                                        ${year2Savings.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Data Sovereignty</h4>
                                    <p className="text-sm text-muted-foreground">Your customized LLM doesn't train your competitors.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Zero Seat Fees</h4>
                                    <p className="text-sm text-muted-foreground">Scale agent usage without per-user penalties.</p>
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

export default SaaSAudit;
