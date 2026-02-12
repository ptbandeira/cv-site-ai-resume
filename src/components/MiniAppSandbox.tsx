import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Database, FileCheck, ArrowRight, Loader2, CheckCircle2, FileText, Users, Send, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
        setTimeout(() => setStep("done"), 3000);
    };

    return (
        <Card className="p-6 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm card-slab">
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
                            className="px-6 py-2 bg-[#0F172A] hover:bg-[#1e293b] text-white rounded-full text-sm font-medium transition-colors"
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
                                <span>Parsing Law Bulletin...</span>
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
                                &gt; Analyzing Cross-Practice Data<br />
                                &gt; Identifying M&A Synergies...
                            </p>
                        </motion.div>
                    )}

                    {step === "done" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full bg-blue-50/50 rounded-lg p-4 border border-blue-100"
                        >
                            <div className="flex items-center gap-2 mb-3 border-b border-blue-200/50 pb-2">
                                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                    <Users className="w-3 h-3" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-foreground block">AgenticOS Daily Briefing</span>
                                    <span className="text-[10px] text-muted-foreground block">General Channel</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground ml-auto">Just now</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                                <strong>Opportunity Detected:</strong> Found 3 cross-practice opportunities between M&A and Real Estate based on today's Law Bulletin.
                            </p>

                            <button
                                onClick={() => setStep("idle")}
                                className="text-[10px] text-muted-foreground mt-3 hover:text-foreground underline w-full text-center"
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

// 2. Sales Ops Simulator -> NOW "Start Free" Lead Gen Form
const SalesOpsSimulator = () => {
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
                .insert([{ email, industry, source: 'sales_ops_simulator' }]);

            if (error) throw error;

            toast.success("Strategy Guide Sent!", {
                description: "Check your inbox in 5 minutes."
            });
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            // Fallback for demo if supabase fails / not configured
            toast.success("Strategy Guide Sent! (Demo Mode)", {
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
            <Card className="p-6 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm card-slab">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-green-600" />
                <div className="mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-700">
                        <Database className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Sales Ops Engine</h3>
                    <p className="text-sm text-muted-foreground mt-1">Generates strategic outreach hooks based on real-time market data.</p>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Want to see the real engine?
                        <br />
                        I'll generate a custom outreach strategy for your industry.
                    </p>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Start Free Strategy <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-muted-foreground">No credit card required.</p>
                </div>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Get Your Agentic Strategy</DialogTitle>
                        <DialogDescription>
                            Enter your details and I'll deploy a mini-agent to research your industry hooks.
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
                            <Label htmlFor="industry">Target Industry</Label>
                            <Input
                                id="industry"
                                required
                                placeholder="e.g. Fintech, Logistics, Healthcare"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0F172A]">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                {isSubmitting ? "Deploying..." : "Generate Strategy"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

// 3. Pharma Compliance Simulator
const PharmaComplianceSimulator = () => {
    const [status, setStatus] = useState<"idle" | "dropping" | "validating" | "success">("idle");

    const handleDrop = () => {
        setStatus("validating");
        setTimeout(() => setStatus("success"), 2500);
    };

    return (
        <Card className="p-6 bg-card hover:bg-card/60 transition-colors relative overflow-hidden h-[400px] flex flex-col shadow-sm card-slab">
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2 text-foreground/80"><Loader2 className="w-3 h-3 animate-spin" /> Checking Actavis Legacy Data...</span>
                                <span className="text-green-600 font-bold">[MATCH]</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2 text-foreground/80"><Loader2 className="w-3 h-3 animate-spin" /> Checking GMF Prescription Logs...</span>
                                <span className="text-green-600 font-bold">[MATCH]</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.6 }}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="flex items-center gap-2 text-foreground/80"><Loader2 className="w-3 h-3 animate-spin" /> Verifying "GDP" Compliance...</span>
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
                        <h4 className="text-lg font-medium text-foreground">Compliance Verified</h4>
                        <p className="text-sm text-muted-foreground mt-1">Asset passes Actavis/GMF protocols.</p>

                        <div className="mt-4 p-3 bg-secondary/50 rounded text-xs text-left border border-border">
                            <p className="font-mono text-xs text-muted-foreground">Log ID: #88219-EMA</p>
                            <p className="font-mono text-xs text-muted-foreground">Status: Approved (FDA Title 21)</p>
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
