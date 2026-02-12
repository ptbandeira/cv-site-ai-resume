import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Database, FileCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MiniAppSandbox = () => {
    return (
        <section id="sandbox" className="py-20 bg-background/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif text-foreground mb-6">The Workflow Sandbox</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Don't just read about it. Test the "Mini-App" architecture.
                        These are micro-simulations of actual AgenticOS modules I deploy for clients.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <LegalTriageSimulator />
                    <SalesOpsSimulator />
                    <PharmaComplianceSimulator />
                </div>
            </div>
        </section>
    );
};

// 1. Legal Triage Simulator
const LegalTriageSimulator = () => {
    const [step, setStep] = useState<"idle" | "scanning" | "done">("idle");

    const runSim = () => {
        setStep("scanning");
        setTimeout(() => setStep("done"), 2500);
    };

    return (
        <Card className="p-6 border-border/60 bg-card/40 hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 text-blue-500">
                    <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Legal Triage Agent</h3>
                <p className="text-sm text-muted-foreground mt-1">Monitors 50+ Regulatory RSS feeds & summarizes impact.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                    {step === "idle" && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={runSim}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                        >
                            Scan Regulatory Feeds
                        </motion.button>
                    )}

                    {step === "scanning" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full space-y-3"
                        >
                            <div className="flex items-center gap-2 text-sm text-blue-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Parsing EU AI Act updates...</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2.5, ease: "linear" }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                                &gt; Analyzing 124 articles<br />
                                &gt; Cross-referencing client portfolio...
                            </p>
                        </motion.div>
                    )}

                    {step === "done" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-secondary/50 rounded-lg p-3 border border-border"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg" className="w-4 h-4" alt="Teams" />
                                <span className="text-xs font-bold text-foreground">Teams Notification</span>
                                <span className="text-[10px] text-muted-foreground ml-auto">Just now</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed">
                                <strong>@LegalTeam</strong> High impact update detected in Article 5 of Final Draft.
                                Potential conflict with 'Project Chimera' data retention policy.
                                <span className="text-blue-500 cursor-pointer hover:underline"> View Redline &gt;</span>
                            </p>
                            <button
                                onClick={() => setStep("idle")}
                                className="text-[10px] text-muted-foreground mt-3 hover:text-foreground underline"
                            >
                                Reset Simulator
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
};

// 2. Sales Ops Simulator
const SalesOpsSimulator = () => {
    const [industry, setIndustry] = useState("");
    const [result, setResult] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    const generateAngle = () => {
        if (!industry) return;
        setLoading(true);
        setTimeout(() => {
            setResult(`Based on Q3 earning calls, ${industry} leaders are prioritized 'OPEX reduction'. 
            <strong>Angle:</strong> Pitch the "SaaS Audit" as an immediate 15% EBITDA improvement mechanism.`);
            setLoading(false);
        }, 1500);
    };

    return (
        <Card className="p-6 border-border/60 bg-card/40 hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-500">
                    <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Sales Ops Engine</h3>
                <p className="text-sm text-muted-foreground mt-1">Generates strategic outreach hooks based on real-time market data.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                {!result && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 w-full">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Target Industry</label>
                            <Input
                                placeholder="e.g. Fintech, Logistics..."
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="text-sm"
                            />
                        </div>
                        <button
                            onClick={generateAngle}
                            disabled={!industry}
                            className="w-full py-2 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Generate Strategy <ArrowRight className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}

                {loading && (
                    <div className="flex flex-col items-center gap-2 text-emerald-500">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs">Querying RAG Knowledge Base...</span>
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-secondary/50 p-4 rounded-lg border border-border text-sm"
                    >
                        <p className="text-foreground/90" dangerouslySetInnerHTML={{ __html: result }} />
                        <button
                            onClick={() => { setResult(null); setIndustry(""); }}
                            className="text-[10px] text-emerald-500 mt-3 hover:underline"
                        >
                            Try another industry
                        </button>
                    </motion.div>
                )}
            </div>
        </Card>
    );
};

// 3. Pharma Compliance Simulator
const PharmaComplianceSimulator = () => {
    const [status, setStatus] = useState<"idle" | "dropping" | "validating" | "success">("idle");

    const handleDrop = () => {
        setStatus("validating");
        setTimeout(() => setStatus("success"), 2000);
    };

    return (
        <Card className="p-6 border-border/60 bg-card/40 hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 text-purple-500">
                    <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Pharma Compliance</h3>
                <p className="text-sm text-muted-foreground mt-1">Auto-validates marketing assets against FDA/EMA guidelines.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                {status === "idle" && (
                    <motion.div
                        onClick={handleDrop}
                        className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-8 h-8 rounded-full bg-secondary group-hover:bg-purple-500/10 flex items-center justify-center mb-2 transition-colors">
                            <span className="text-lg">📄</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Click to Validate Mock PDF</span>
                    </motion.div>
                )}

                {status === "validating" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Checking FDA Title 21...</span>
                            <span className="text-purple-500">Processing</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <motion.div className="h-full bg-purple-500 w-3/4" animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono text-center opacity-70">
                                OCR scanning active...
                            </p>
                        </div>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground">Compliant</h4>
                        <p className="text-sm text-muted-foreground mt-1">98% match with EMA Guidelines.</p>
                        <div className="mt-4 flex gap-2 justify-center">
                            <span className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground border border-border">No Claims Violations</span>
                        </div>
                        <button
                            onClick={() => setStatus("idle")}
                            className="text-[10px] text-purple-500 mt-6 hover:underline"
                        >
                            Validate another
                        </button>
                    </motion.div>
                )}
            </div>
        </Card>
    );
};

export default MiniAppSandbox;
