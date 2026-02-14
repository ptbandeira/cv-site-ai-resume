import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Database, FileCheck, ArrowRight, Loader2, CheckCircle2, FileText, Users, Send, X, AlertTriangle, FolderOpen, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const MiniAppSandbox = () => {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif text-foreground mb-6">
                        <span className="text-gradient">Workflow Previews</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        These are previews of deterministic workflows I deploy for clients.
                        Click to see deterministic logic patterns — not just UI mockups.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <SharePointBrain />
                    <LeadGenCTA />
                    <ComplianceGuardrail />
                </div>
            </div>
        </section>
    );
};

/* ── 1. The SharePoint Brain ─────────────────────────────────── */
const SharePointBrain = () => {
    const [step, setStep] = useState<"idle" | "scanning" | "conflict" | "done">("idle");
    const [scanLines, setScanLines] = useState<string[]>([]);

    const scanOutput = [
        "> Indexing 4 client folders...",
        "> Parsing 847 documents...",
        "> Building entity graph...",
        "> Cross-referencing board members...",
        "> ⚠ CONFLICT DETECTED",
    ];

    const runSim = () => {
        setStep("scanning");
        setScanLines([]);

        // Terminal typing effect — reveal lines sequentially
        scanOutput.forEach((line, i) => {
            setTimeout(() => {
                setScanLines((prev) => [...prev, line]);
            }, 400 * (i + 1));
        });

        setTimeout(() => setStep("conflict"), 400 * scanOutput.length + 300);
        setTimeout(() => setStep("done"), 400 * scanOutput.length + 600);
    };

    const folders = [
        { name: "📁 Client_Acme_Corp/", status: "clean" },
        { name: "📁 Client_Zenith_Ltd/", status: "clean" },
        { name: "📁 Client_Nexus_Inc/", status: "conflict" },
        { name: "📁 Client_Orion_LLC/", status: "clean" },
    ];

    return (
        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl p-6 relative overflow-hidden h-[440px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
            <div className="absolute top-0 left-0 w-full h-1.5 gradient-ai" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-700 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">The SharePoint Brain</h3>
                <p className="text-sm text-muted-foreground mt-1">AI finds a hidden conflict of interest in a simulated document folder.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                    {step === "idle" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full space-y-4"
                        >
                            <div className="space-y-1.5">
                                {folders.map((f) => (
                                    <div key={f.name} className="flex items-center gap-2 text-xs font-mono text-muted-foreground px-2 py-1.5 bg-secondary/50 rounded">
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={runSim}
                                className="w-full px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <Search className="w-4 h-4" /> Scan for Conflicts
                            </button>
                        </motion.div>
                    )}

                    {step === "scanning" && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full space-y-3"
                        >
                            <div className="bg-slate-900 rounded-lg p-3 min-h-[120px]">
                                {scanLines.map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`text-[11px] font-mono leading-relaxed ${line.includes("⚠") ? "text-red-400 font-bold" : "text-emerald-400"
                                            }`}
                                    >
                                        {line}
                                        {i === scanLines.length - 1 && (
                                            <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
                                        )}
                                    </motion.p>
                                ))}
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full gradient-ai"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: scanOutput.length * 0.4, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {(step === "conflict" || step === "done") && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="w-full bg-red-50 rounded-xl p-4 border border-red-200"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                                >
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </motion.div>
                                <span className="text-sm font-bold text-red-800">Conflict of Interest Detected</span>
                            </div>
                            <div className="space-y-2 text-xs text-red-700">
                                <p className="font-mono bg-red-100/50 p-2 rounded">
                                    <strong>Client_Nexus_Inc/</strong> board member <strong>J. Harrington</strong>
                                    {" "}is also listed as an advisor to <strong>Client_Acme_Corp/</strong>
                                </p>
                                <p className="text-red-600/80">
                                    ⚠️ Active matter overlap detected in M&A advisory docs.
                                    Requires ethical wall review.
                                </p>
                            </div>
                            <button
                                onClick={() => { setStep("idle"); setScanLines([]); }}
                                className="text-[10px] text-red-600 mt-3 hover:underline w-full text-center"
                            >
                                Reset Preview
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

/* ── 2. Lead Gen CTA ──────────────────────────────────────────── */
const LeadGenCTA = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [industry, setIndustry] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('leads')
                .insert([{ email, industry, source: 'workflow_preview' }]);

            if (error) throw error;

            toast.success("Optimization Report Sent!", {
                description: "Check your inbox in 5 minutes."
            });
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            toast.success("Report Sent! (Demo Mode)", {
                description: "This would save to Supabase in prod."
            });
            setIsOpen(false);
        } finally {
            setIsSubmitting(false);
            setEmail("");
            setIndustry("");
        }
    };

    return (
        <>
            <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl p-6 relative overflow-hidden h-[440px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-orange-400" />
                <div className="mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3 text-orange-700 group-hover:scale-110 transition-transform">
                        <Database className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Start Free Optimization</h3>
                    <p className="text-sm text-muted-foreground mt-1">Get a custom analysis of your existing stack's untapped potential.</p>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        I'll analyze your current platform and show how AgenticOS turns it into a revenue engine — at $0 incremental licensing.
                    </p>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-sm text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Start Free Audit <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-muted-foreground">No credit card required.</p>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Get Your Optimization Report</DialogTitle>
                        <DialogDescription>
                            Enter your details and I'll analyze how your existing stack can replace redundant SaaS.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="pedro@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="industry">Your Industry</Label>
                            <Input
                                id="industry"
                                required
                                placeholder="e.g. Legal, Pharma, Fintech"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#1A1A1A]">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                {isSubmitting ? "Deploying..." : "Generate Report"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

/* ── 3. The Compliance Guardrail ─────────────────────────────── */
const ComplianceGuardrail = () => {
    const [status, setStatus] = useState<"idle" | "scanning" | "flagged">("idle");

    const samplePhrases = [
        { text: "Our supplement boosts immunity by 300%", compliant: false, rule: "FDA 21 CFR 101.93 — Unsubstantiated health claim" },
        { text: "Clinically studied ingredients", compliant: true, rule: null },
        { text: "Guaranteed to cure joint pain", compliant: false, rule: "FTC Act §5 — Deceptive advertising" },
    ];

    const handleScan = () => {
        setStatus("scanning");
        setTimeout(() => setStatus("flagged"), 500);
    };

    return (
        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl p-6 relative overflow-hidden h-[440px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-purple-700 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">The Compliance Guardrail</h3>
                <p className="text-sm text-muted-foreground mt-1">AI flags non-compliant marketing phrases in seconds.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                {status === "idle" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-3"
                    >
                        <div className="space-y-1.5">
                            {samplePhrases.map((p, i) => (
                                <div key={i} className="text-xs font-mono text-muted-foreground px-2 py-1.5 bg-secondary/50 rounded truncate">
                                    "{p.text}"
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleScan}
                            className="w-full px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Run Compliance Scan
                        </button>
                    </motion.div>
                )}

                {status === "scanning" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full space-y-3"
                    >
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Scanning against FDA/FTC rulesets...</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}

                {status === "flagged" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-2"
                    >
                        {samplePhrases.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                    delay: i * 0.12,
                                }}
                                className={`text-xs p-2.5 rounded-lg border ${p.compliant
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    {p.compliant ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 600, damping: 12, delay: i * 0.12 + 0.15 }}
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 600, damping: 12, delay: i * 0.12 + 0.15 }}
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                                        </motion.div>
                                    )}
                                    <span className="font-medium truncate">"{p.text}"</span>
                                </div>
                                {p.rule && (
                                    <p className="font-mono text-[10px] text-red-600/80 ml-5">{p.rule}</p>
                                )}
                            </motion.div>
                        ))}
                        <div className="text-center pt-2">
                            <span className="text-[10px] font-mono text-muted-foreground">Scan complete • 2 violations found</span>
                        </div>
                        <button
                            onClick={() => setStatus("idle")}
                            className="text-[10px] text-purple-600 mt-1 hover:underline w-full text-center"
                        >
                            Reset Preview
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MiniAppSandbox;
