import { useState } from "react";
import { CheckCircle2, ShieldAlert, BadgeCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AutomationAuditor = () => {
    const [step, setStep] = useState(1);
    const [taskName, setTaskName] = useState("");
    const [accountability, setAccountability] = useState<string | null>(null);
    const [verifiability, setVerifiability] = useState<string | null>(null);

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const getResult = () => {
        // Safety Logic: 
        // If NO to Accountability OR NO to Verifiability (<10s) -> DANGER
        const isSafe = accountability === "yes" && verifiability === "yes";

        if (isSafe) {
            return {
                status: "safe",
                title: "Automation Approved",
                message: `The task "${taskName || 'this workflow'}" has clear ownership and rapid verification. It is a prime candidate for autonomous execution.`,
                icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
                bg: "bg-emerald-50 border-emerald-200",
                text: "text-emerald-900",
                score: 95
            };
        } else {
            return {
                status: "danger",
                title: "STOP: Human-in-the-Loop Required",
                message: "🛑 DANGER: Do not automate this autonomously. You need a 'Human-in-the-Loop' system. Pedro specializes in building these safeguards.",
                icon: <ShieldAlert className="w-12 h-12 text-red-600" />,
                bg: "bg-red-50 border-red-200",
                text: "text-red-900",
                score: 15
            };
        }
    };

    const result = step > totalSteps ? getResult() : null;

    return (
        <section className="py-24 bg-background border-t border-border/40" id="automation-auditor">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The "Safe Automation" Auditor</h2>
                    <p className="text-muted-foreground text-lg">
                        Before you build, verify (A-V-C Framework).
                    </p>
                </div>

                <Card className="min-h-[400px] border-border shadow-sm card-slab flex flex-col justify-center relative overflow-hidden">

                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 max-w-2xl mx-auto w-full">

                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif">Step 1: Define the Workflow</h3>
                                    <p className="text-muted-foreground">What task are you trying to automate?</p>
                                </div>
                                <Input
                                    placeholder="e.g. Processing Invoices..."
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="text-lg py-6"
                                />
                                <Button
                                    onClick={handleNext}
                                    disabled={!taskName}
                                    className="w-full h-12 text-base"
                                >
                                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif">Step 2: Accountability</h3>
                                    <p className="text-muted-foreground">Is there a specific human clearly responsible if this AI fails? (Who goes to jail?)</p>
                                </div>

                                <RadioGroup onValueChange={setAccountability} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <RadioGroupItem value="yes" id="acc-yes" className="peer sr-only" />
                                        <Label htmlFor="acc-yes" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">Yes</span>
                                            <span className="text-xs text-center text-muted-foreground">Clear owner identified</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="no" id="acc-no" className="peer sr-only" />
                                        <Label htmlFor="acc-no" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">No / Unsure</span>
                                            <span className="text-xs text-center text-muted-foreground">Ambiguous ownership</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={handleBack} className="w-1/3 h-12">Back</Button>
                                    <Button onClick={handleNext} disabled={!accountability} className="w-2/3 h-12">Next Step</Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif">Step 3: Verifiability</h3>
                                    <p className="text-muted-foreground">Can a human verify the output accuracy in less than 10 seconds?</p>
                                </div>

                                <RadioGroup onValueChange={setVerifiability} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <RadioGroupItem value="yes" id="ver-yes" className="peer sr-only" />
                                        <Label htmlFor="ver-yes" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">Yes</span>
                                            <span className="text-xs text-center text-muted-foreground">Quick check (&lt;10s)</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="no" id="ver-no" className="peer sr-only" />
                                        <Label htmlFor="ver-no" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">No</span>
                                            <span className="text-xs text-center text-muted-foreground">Complex review required</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={handleBack} className="w-1/3 h-12">Back</Button>
                                    <Button onClick={() => setStep(4)} disabled={!verifiability} className="w-2/3 h-12">Analyze Risk</Button>
                                </div>
                            </div>
                        )}

                        {step === 4 && result && (
                            <div className="flex flex-col items-center text-center gap-6 animate-scale-in">
                                <div className={`p-4 rounded-full ${result.bg}`}>
                                    {result.icon}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-serif font-bold mb-2">{result.title}</h3>
                                    <div className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-mono mb-4 border border-border">
                                        Risk Score: {100 - result.score}/100
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                                        {result.message}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => { setStep(1); setTaskName(""); setAccountability(null); setVerifiability(null); }}
                                    variant="ghost"
                                    className="mt-4"
                                >
                                    Audit Another Task
                                </Button>
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </section>
    );
};

export default AutomationAuditor;
