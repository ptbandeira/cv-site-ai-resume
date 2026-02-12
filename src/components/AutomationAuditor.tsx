import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AutomationAuditor = () => {
    const [accountability, setAccountability] = useState<string | null>(null);
    const [verifiability, setVerifiability] = useState<string | null>(null);

    const getResult = () => {
        if (!accountability || !verifiability) return null;

        // Safety Logic: 
        // If NO to Accountability OR NO to Verifiability (<10s) -> DANGER
        const isSafe = accountability === "yes" && verifiability === "yes";

        if (isSafe) {
            return {
                status: "safe",
                title: "Automation Approved",
                message: "This workflow has clear ownership and rapid verification. It is a candidate for autonomous execution.",
                icon: <BadgeCheck className="w-12 h-12 text-emerald-600" />,
                bg: "bg-emerald-50 border-emerald-200",
                text: "text-emerald-900"
            };
        } else {
            return {
                status: "danger",
                title: "STOP: Human-in-the-Loop Required",
                message: "🛑 DANGER: Do not automate this autonomously. You need a 'Human-in-the-Loop' system. Pedro specializes in building these safeguards.",
                icon: <ShieldAlert className="w-12 h-12 text-red-600" />,
                bg: "bg-red-50 border-red-200",
                text: "text-red-900"
            };
        }
    };

    const result = getResult();

    return (
        <section className="py-12 bg-background border-t border-border/40">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif text-foreground mb-4">The "Safe Automation" Auditor</h2>
                    <p className="text-muted-foreground text-lg">
                        Before you build, verify (A-V-C Framework).
                    </p>
                </div>

                <Card className="p-8 border-border shadow-sm">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {/* Q1 */}
                            <div className="space-y-3">
                                <Label className="text-lg font-medium text-foreground flex items-center gap-2">
                                    1. Accountability
                                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Who goes to jail?</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">Is there a specific human clearly responsible if this AI fails?</p>
                                <RadioGroup onValueChange={setAccountability} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="acc-yes" />
                                        <Label htmlFor="acc-yes">Yes, clear owner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="acc-no" />
                                        <Label htmlFor="acc-no">No / Unsure</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Q2 */}
                            <div className="space-y-3">
                                <Label className="text-lg font-medium text-foreground flex items-center gap-2">
                                    2. Verifiability
                                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">The 10s Rule</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">Can a human verify the output accuracy in less than 10 seconds?</p>
                                <RadioGroup onValueChange={setVerifiability} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="ver-yes" />
                                        <Label htmlFor="ver-yes">Yes, &lt; 10s</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="ver-no" />
                                        <Label htmlFor="ver-no">No, takes longer</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Result Panel */}
                        <div className="flex items-center justify-center">
                            {result ? (
                                <div className={`w-full p-6 rounded-xl border ${result.bg} ${result.text} animate-fade-in`}>
                                    <div className="flex flex-col items-center text-center gap-4">
                                        {result.icon}
                                        <h3 className="text-xl font-bold font-serif">{result.title}</h3>
                                        <p className="text-sm font-medium opacity-90 leading-relaxed">
                                            {result.message}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground space-y-2 opacity-50">
                                    <AlertTriangle className="w-12 h-12 mx-auto" />
                                    <p>Answer both questions to audit your risk.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default AutomationAuditor;
