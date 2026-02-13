import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Users, Mail, CalendarCheck, Loader2, Sparkles, CheckCircle2, FileSearch, Link2, Newspaper } from "lucide-react";

type Step = "idle" | "step1" | "step2" | "step3" | "done";

const thinkingSteps = [
    { id: "step1" as Step, icon: <Newspaper className="w-3.5 h-3.5" />, label: "Reading Legal News...", detail: "Parsing 47 regulatory feeds" },
    { id: "step2" as Step, icon: <FileSearch className="w-3.5 h-3.5" />, label: "Scanning SharePoint...", detail: "Cross-referencing 2,341 docs" },
    { id: "step3" as Step, icon: <Link2 className="w-3.5 h-3.5" />, label: "Linking Entities...", detail: "Building relationship graph" },
];

const TeamsAgentDemo = () => {
    const [currentStep, setCurrentStep] = useState<Step>("idle");

    const runBriefing = () => {
        setCurrentStep("step1");
        setTimeout(() => setCurrentStep("step2"), 1800);
        setTimeout(() => setCurrentStep("step3"), 3600);
        setTimeout(() => setCurrentStep("done"), 5400);
    };

    const stepIndex = currentStep === "idle" ? -1 : currentStep === "done" ? 3 : thinkingSteps.findIndex(s => s.id === currentStep);

    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        Agentic Workflow Simulator
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        See how AgenticOS runs a morning briefing — live. No mock data. Real agent reasoning.
                    </p>
                </div>

                {/* Teams-style container */}
                <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden max-w-2xl mx-auto">
                    {/* Teams header bar */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
                        <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">AgenticOS Daily Briefing</p>
                            <p className="text-[10px] text-muted-foreground font-mono">General Channel • Automated</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-emerald-600">Online</span>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="p-6 min-h-[320px] flex flex-col">
                        <AnimatePresence mode="wait">
                            {currentStep === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center gap-6"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                        <Play className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-foreground font-medium mb-1">Morning Briefing Ready</p>
                                        <p className="text-sm text-muted-foreground">Agent will scan feeds, cross-reference data, and surface opportunities.</p>
                                    </div>
                                    <button
                                        onClick={runBriefing}
                                        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                                    >
                                        Run Morning Briefing
                                    </button>
                                </motion.div>
                            )}

                            {currentStep !== "idle" && currentStep !== "done" && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col justify-center gap-4"
                                >
                                    {thinkingSteps.map((step, i) => {
                                        const isActive = step.id === currentStep;
                                        const isDone = i < stepIndex;
                                        const isPending = i > stepIndex;

                                        return (
                                            <motion.div
                                                key={step.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? "bg-indigo-50/80 border border-indigo-200" : isDone ? "bg-emerald-50/50 border border-emerald-200" : "border border-transparent"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "gradient-ai text-white" : isDone ? "bg-emerald-100 text-emerald-600" : "bg-secondary text-muted-foreground"
                                                    }`}>
                                                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : step.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${isActive ? "text-indigo-700" : isDone ? "text-emerald-700" : "text-muted-foreground"}`}>
                                                        {step.label}
                                                    </p>
                                                    <p className="agent-text text-muted-foreground truncate">{step.detail}</p>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 1.8, ease: "linear" }}
                                                        className="absolute bottom-0 left-0 h-0.5 gradient-ai rounded-full"
                                                        style={{ position: "relative", maxWidth: 60 }}
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {currentStep === "done" && (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex-1 flex flex-col gap-4"
                                >
                                    {/* Opportunity Card */}
                                    <div className="bg-white rounded-xl border border-indigo-100 p-5 shadow-sm">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center flex-shrink-0">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">Opportunity Detected</p>
                                                <p className="text-[10px] font-mono text-muted-foreground">Confidence: 87% • 3 sources cross-referenced</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 mb-4">
                                            <p className="agent-text text-foreground leading-relaxed">
                                                <strong>EU AI Act Amendment (Art. 6)</strong> published today creates new compliance obligations for <strong>Client_Nexus_Inc</strong>.
                                                Their current M&A advisory engagement overlaps with incoming 2026 audit requirements.
                                                Cross-practice opportunity between <strong>Tech Law</strong> and <strong>M&A</strong> teams.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0F172A] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b] transition-colors">
                                                <Mail className="w-4 h-4" /> Draft Client Email
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-border bg-white text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                                <CalendarCheck className="w-4 h-4" /> Schedule Meeting
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentStep("idle")}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                                    >
                                        Reset Simulator
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamsAgentDemo;
