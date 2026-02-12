import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Database, FileCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
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
        // 3-second delay as requested
        setTimeout(() => setStep("done"), 3000);
    };

    return (
        <Card className="p-6 border-border/60 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-700">
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
                            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-sm font-medium transition-colors"
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
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Parsing EU AI Act updates...</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "linear" }}
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
                            className="w-full bg-blue-50/50 rounded-lg p-4 border border-blue-100"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">T</div>
                                <span className="text-xs font-bold text-foreground">Teams Briefing</span>
                                <span className="text-[10px] text-muted-foreground ml-auto">Just now</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                                Found 3 matching precedents in SharePoint for your latest newsletter update.
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                                - Case 24-B (GDPR) <br />
                                - Policy Memo 102 (Retention)
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
        <Card className="p-6 border-border/60 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-green-600" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700">
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
                                className="text-sm bg-background"
                            />
                        </div>
                        <button
                            onClick={generateAngle}
                            disabled={!industry}
                            className="w-full py-2 bg-emerald-700 disabled:opacity-50 hover:bg-emerald-800 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Generate Strategy <ArrowRight className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}

                {loading && (
                    <div className="flex flex-col items-center gap-2 text-emerald-600">
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
                            className="text-[10px] text-emerald-600 mt-3 hover:underline"
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
        // Simulate checking process
        setTimeout(() => setStatus("success"), 2500);
    };

    return (
        <Card className="p-6 border-border/60 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-purple-700">
                    <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Pharma Compliance</h3>
                <p className="text-sm text-muted-foreground mt-1">Auto-validates marketing assets against FDA/EMA guidelines.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                {status === "idle" && (
                    <motion.div
                        onClick={handleDrop}
                        className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group bg-background/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-8 h-8 rounded-full bg-secondary group-hover:bg-purple-100 flex items-center justify-center mb-2 transition-colors">
                            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-purple-600" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">Click to Simulate File Drop <br />(PDF/DOCX)</span>
                    </motion.div>
                )}

                {status === "validating" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2 text-foreground/80"><Loader2 className="w-3 h-3 animate-spin" /> Checking EMA Annex 1...</span>
                                <span className="text-green-600 font-bold">[OK]</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2 text-foreground/80"><Loader2 className="w-3 h-3 animate-spin" /> Checking FDA Title 21...</span>
                                <span className="text-green-600 font-bold">[OK]</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center w-full"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground">Validated</h4>
                        <p className="text-sm text-muted-foreground mt-1">Asset passes all compliance checks.</p>

                        <div className="mt-4 p-3 bg-secondary/50 rounded text-xs text-left border border-border">
                            <p className="font-mono text-xs text-muted-foreground">Log ID: #88219-EMA</p>
                            <p className="font-mono text-xs text-muted-foreground">Status: Approved</p>
                        </div>

                        <button
                            onClick={() => setStatus("idle")}
                            className="text-[10px] text-purple-600 mt-4 hover:underline"
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
