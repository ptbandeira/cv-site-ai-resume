import { useState } from "react";
import { Calculator, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const SaaSAudit = () => {
    const [seats, setSeats] = useState(10);
    const [monthlySpend, setMonthlySpend] = useState(500); // Per seat or total? Let's say Total monthly SaaS bill for the function.

    // Logic: 
    // Traditional SaaS: Monthly Spend * 12
    // Agentic Build: One-time cost (e.g. $15k) + Maintenance ($100/mo)
    // This is a rough heuristic for the "Audit".

    const annualSaasCost = monthlySpend * 12;
    const agenticBuildCost = 5000 + (seats * 100); // Base build + low per-seat implementation
    const agenticMaintenance = 200 * 12; // Hosting/API costs
    const firstYearAgentic = agenticBuildCost + agenticMaintenance;

    const savings = annualSaasCost - firstYearAgentic;
    const isPositive = savings > 0;

    return (
        <section id="saas-audit" className="py-20 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The SaaS Audit</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Are you renting intelligence or building equity? Compare your perpetual SaaS rent against a custom-owned Agentic Asset.
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

                            <div className="pt-4 border-t border-border">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-muted-foreground">3-Year SaaS Rent:</span>
                                    <span className="font-mono font-medium">${(annualSaasCost * 3).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">OWNED Asset Cost (Est):</span>
                                    <span className="font-mono font-medium text-primary">${(firstYearAgentic + (agenticMaintenance * 2)).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-sm font-sans font-bold text-muted-foreground uppercase tracking-wider">The Verdict</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-serif text-foreground font-medium">
                                    {isPositive ? "Build" : "Keep Renting"}
                                </span>
                            </div>
                            <p className="text-lg text-foreground/80">
                                {isPositive
                                    ? `By building your own Agentic workflow, you could save projected $${savings.toLocaleString()} in Year 1.`
                                    : "At this scale, off-the-shelf SaaS might still be efficient. But do you own your data?"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground">Data Sovereignty</h4>
                                    <p className="text-sm text-muted-foreground">Your customized LLM doesn't train your competitors.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                                <div>
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
