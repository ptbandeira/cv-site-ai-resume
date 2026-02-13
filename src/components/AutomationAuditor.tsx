import { useState } from "react";
import { CheckCircle2, ShieldAlert, BadgeCheck, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ── Risk Gauge SVG ─────────────────────────────────────────── */
const RiskGauge = ({ score }: { score: number }) => {
    // score: 0 (safe) → 100 (critical)
    // Arc goes from -120° to +120° (240° total)
    const angle = -120 + (score / 100) * 240;
    const needleRad = (angle * Math.PI) / 180;
    const nx = 50 + 35 * Math.cos(needleRad);
    const ny = 55 + 35 * Math.sin(needleRad);

    return (
        <svg viewBox="0 0 100 65" className="w-48 h-auto mx-auto">
            {/* Green zone */}
            <path
                d="M 10 55 A 40 40 0 0 1 35 18"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Yellow zone */}
            <path
                d="M 38 16 A 40 40 0 0 1 62 16"
                fill="none"
                stroke="#eab308"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Red zone */}
            <path
                d="M 65 18 A 40 40 0 0 1 90 55"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Needle */}
            <line
                x1="50"
                y1="55"
                x2={nx}
                y2={ny}
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-700"
            />
            {/* Center dot */}
            <circle cx="50" cy="55" r="3" fill="#0F172A" />
            {/* Labels */}
            <text x="8" y="63" fontSize="5" fill="#22c55e" fontFamily="monospace">SAFE</text>
            <text x="40" y="8" fontSize="5" fill="#eab308" fontFamily="monospace">WARN</text>
            <text x="78" y="63" fontSize="5" fill="#ef4444" fontFamily="monospace">STOP</text>
        </svg>
    );
};

/* ── Main Auditor Component ─────────────────────────────────── */
const AutomationAuditor = () => {
    const [step, setStep] = useState(1);
    const [taskName, setTaskName] = useState("");
    const [accountability, setAccountability] = useState<string | null>(null);
    const [verifiability, setVerifiability] = useState<string | null>(null);
    const [consequence, setConsequence] = useState<string | null>(null);

    const totalSteps = 4; // Define → Accountability → Verifiability → Consequence

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const getResult = () => {
        // CRITICAL: If Verifiability = No, force Red regardless of other answers
        if (verifiability === "no") {
            return {
                status: "danger",
                title: "STOP: Human-in-the-Loop Required",
                message: "This workflow cannot be verified in under 10 seconds. Autonomous execution without verification is how regulated companies get fined.",
                subMessage: "Pedro built Human-in-the-Loop governance for pharmaceutical compliance at Grupa Moja Farmacja — the same pattern your workflow needs.",
                riskScore: 95,
                icon: <ShieldAlert className="w-12 h-12 text-red-600" />,
                bg: "bg-red-50 border-red-200",
                text: "text-red-900",
                pharmaLink: true,
            };
        }

        if (accountability === "no") {
            return {
                status: "warning",
                title: "Warning: Accountability Gap",
                message: `The task "${taskName || 'this workflow'}" has no clear owner. Without accountability, automation creates liability.`,
                subMessage: null,
                riskScore: 70,
                icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
                bg: "bg-yellow-50 border-yellow-200",
                text: "text-yellow-900",
                pharmaLink: false,
            };
        }

        if (consequence === "high") {
            return {
                status: "warning",
                title: "Caution: High Consequence",
                message: `"${taskName || 'This workflow'}" passes Accountability and Verifiability checks, but the consequence of failure is severe. Consider staged rollout with manual override.`,
                subMessage: null,
                riskScore: 55,
                icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
                bg: "bg-yellow-50 border-yellow-200",
                text: "text-yellow-900",
                pharmaLink: false,
            };
        }

        return {
            status: "safe",
            title: "Automation Approved",
            message: `"${taskName || 'This workflow'}" has clear ownership, rapid verification, and manageable consequence. It is a prime candidate for autonomous execution.`,
            subMessage: null,
            riskScore: 10,
            icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
            bg: "bg-emerald-50 border-emerald-200",
            text: "text-emerald-900",
            pharmaLink: false,
        };
    };

    const result = step > totalSteps ? getResult() : null;

    const resetAll = () => {
        setStep(1);
        setTaskName("");
        setAccountability(null);
        setVerifiability(null);
        setConsequence(null);
    };

    return (
        <section className="py-24 bg-background border-t border-border/40">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The &ldquo;Safe Automation&rdquo; Auditor</h2>
                    <p className="text-muted-foreground text-lg">
                        Measure the Autonomy Risk of any business process.
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

                        {/* Step 1: Define */}
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

                        {/* Step 2: Accountability */}
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

                        {/* Step 3: Verifiability */}
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
                                    <Button onClick={handleNext} disabled={!verifiability} className="w-2/3 h-12">Next Step</Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Consequence */}
                        {step === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif">Step 4: Consequence</h3>
                                    <p className="text-muted-foreground">If this automation fails silently, what is the business impact?</p>
                                </div>

                                <RadioGroup onValueChange={setConsequence} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <RadioGroupItem value="low" id="con-low" className="peer sr-only" />
                                        <Label htmlFor="con-low" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">Low</span>
                                            <span className="text-xs text-center text-muted-foreground">Inconvenience, easily reversed</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="high" id="con-high" className="peer sr-only" />
                                        <Label htmlFor="con-high" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                            <span className="text-xl mb-2">High</span>
                                            <span className="text-xs text-center text-muted-foreground">Financial loss, regulatory risk, reputational damage</span>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={handleBack} className="w-1/3 h-12">Back</Button>
                                    <Button onClick={() => setStep(5)} disabled={!consequence} className="w-2/3 h-12">Analyze Risk</Button>
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {step === 5 && result && (
                            <div className="flex flex-col items-center text-center gap-6 animate-scale-in">

                                {/* Risk Gauge */}
                                <RiskGauge score={result.riskScore} />

                                <div className={`p-4 rounded-full ${result.bg}`}>
                                    {result.icon}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-serif font-bold mb-2">{result.title}</h3>
                                    <div className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-mono mb-4 border border-border">
                                        Risk Score: {result.riskScore}/100
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                                        {result.message}
                                    </p>

                                    {result.subMessage && (
                                        <p className="text-sm text-muted-foreground mt-4 italic border-l-2 border-primary pl-4 text-left max-w-lg mx-auto">
                                            {result.subMessage}
                                        </p>
                                    )}

                                    {result.pharmaLink && (
                                        <a
                                            href="#experience"
                                            className="inline-block mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                                        >
                                            See Pedro&apos;s Pharma GM experience →
                                        </a>
                                    )}
                                </div>

                                <Button
                                    onClick={resetAll}
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
