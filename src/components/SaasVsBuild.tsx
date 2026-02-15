import { useState, useEffect } from "react";
import { ArrowRight, Calculator as CalcIcon, RefreshCw, Copy, Check, DollarSign, Users, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple CountUp Component
const CountUp = ({ end, duration = 1000, visible = true }: { end: number, duration?: number, visible?: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, visible]);

    return <span>{count.toLocaleString()}</span>;
};

/* ── Stack definitions ──────────────────────────────────────── */
const stacks = [
    {
        id: "m365",
        name: "Microsoft 365 + SharePoint",
        monthlyPerSeat: 36,
        overlappingTools: [
            { name: "Notion", perSeat: 10 },
            { name: "Slack", perSeat: 12.50 },
            { name: "Dropbox Business", perSeat: 15 },
        ],
        optimizationAngle: "SharePoint already includes document management, team sites, and workflow automation via Power Automate. We turn your existing SharePoint into a Revenue Engine — RAG pipelines over your own data, often without new SaaS subscriptions.",
    },
    {
        id: "google",
        name: "Google Workspace + Drive",
        monthlyPerSeat: 14,
        overlappingTools: [
            { name: "Notion", perSeat: 10 },
            { name: "Trello", perSeat: 10 },
            { name: "Zoom", perSeat: 13.33 },
        ],
        optimizationAngle: "Google Workspace includes Meet, Chat, and Shared Drives. We leverage the Google API ecosystem to build agentic workflows on infrastructure you already pay for — document processing, calendar ops, and lead routing at €0 incremental.",
    },
    {
        id: "salesforce",
        name: "Salesforce + HubSpot",
        monthlyPerSeat: 75,
        overlappingTools: [
            { name: "HubSpot Marketing", perSeat: 45 },
            { name: "Outreach.io", perSeat: 100 },
            { name: "ZoomInfo", perSeat: 83 },
        ],
        optimizationAngle: "You're paying for two CRMs and three prospecting tools that overlap. We consolidate your pipeline into one deterministic engine — scoring, routing, and outreach orchestration built on your existing Salesforce instance.",
    },
];

const SaasVsBuild = () => {
    const [selectedStack, setSelectedStack] = useState(stacks[0]);
    const [seats, setSeats] = useState(25);
    const [isStackOpen, setIsStackOpen] = useState(false);
    const [reclaimablePct, setReclaimablePct] = useState(60); // Default 60% reclaimable
    const [hasClicked, setHasClicked] = useState(false);

    // The core platform cost they already pay
    const existingPlatformAnnual = selectedStack.monthlyPerSeat * seats * 12;

    // The overlapping SaaS they can kill
    const overlappingMonthly = selectedStack.overlappingTools.reduce(
        (sum, tool) => sum + tool.perSeat * seats, 0
    );
    const overlappingAnnual = overlappingMonthly * 12;

    // AgenticOS build = 25% of the overlapping spend (one-time)
    const agenticOSBuild = overlappingAnnual * 0.25;
    const maintenanceCost = agenticOSBuild * 0.10;

    // Reclaimable Amount
    const redundantSpend = overlappingAnnual * (reclaimablePct / 100);

    // Year 1: Save reclaimable minus build+maintenance
    const year1Savings = redundantSpend - (agenticOSBuild + maintenanceCost);
    // Year 2+: Save reclaimable minus maintenance only
    const year2Savings = redundantSpend - maintenanceCost;

    const subject = "Request a SaaS vs Build Audit";
    const body = `Hi Pedro,\n\nI'm interested in an Optimization Audit.\n\nStack to Audit: [e.g., Vercel, Datadog, AWS]\nCurrent Monthly Spend: [Approximate]\nGoal: [Reduce cost / Improve performance / Compliance]\n\nBest,`;
    const mailtoLink = `mailto:pedrobandeira@me.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const handleRequest = () => {
        setHasClicked(true);
        window.location.href = mailtoLink;
    };

    const handleCopy = () => {
        const text = `Subject: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(text);
        toast.success("Request copied to clipboard");
    };

    return (
        <section className="py-20 bg-secondary/30">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-serif text-foreground mb-4">Resource Optimization Audit</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        You already own the platform. I show you how to turn it into a Revenue Engine — often for €0 in additional monthly licensing.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <Card className="p-8 bg-card shadow-sm card-slab">
                        <div className="space-y-6">
                            {/* Stack Selector */}
                            <div className="space-y-2">
                                <Label>Your Existing Stack</Label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsStackOpen(!isStackOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border rounded-lg text-left text-sm font-medium hover:bg-accent/5 transition-colors"
                                    >
                                        <span>{selectedStack.name}</span>
                                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isStackOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isStackOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                                            {stacks.map((stack) => (
                                                <button
                                                    key={stack.id}
                                                    onClick={() => { setSelectedStack(stack); setIsStackOpen(false); }}
                                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-accent/10 transition-colors ${selectedStack.id === stack.id ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'}`}
                                                >
                                                    {stack.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Seats */}
                            <div className="space-y-2">
                                <Label>Number of Seats</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={seats}
                                        onChange={(e) => setSeats(Number(e.target.value))}
                                        className="pl-9 text-lg"
                                    />
                                </div>
                            </div>

                            {/* Reclaimable Spend Slider */}
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between">
                                    <Label>Reclaimable %</Label>
                                    <span className="text-sm font-mono text-primary font-bold">{reclaimablePct}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={reclaimablePct}
                                    onChange={(e) => setReclaimablePct(Number(e.target.value))}
                                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Conservative estimate of how much overlapping SaaS you can actually cancel.
                                </p>
                            </div>

                            {/* Overlapping Tools */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3">Redundant SaaS You&apos;re Paying For</p>
                                <div className="space-y-2">
                                    {selectedStack.overlappingTools.map((tool) => (
                                        <div key={tool.name} className="flex justify-between items-center text-sm">
                                            <span className="text-red-600/80 flex items-center gap-2">
                                                <span className="text-red-500">✗</span> {tool.name}
                                            </span>
                                            <span className="font-mono text-muted-foreground">
                                                €{tool.perSeat}/seat/mo
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-border">
                                    <span className="text-foreground font-medium">Annual Redundant Spend:</span>
                                    <span className="font-mono font-bold text-red-600 text-lg">
                                        €<CountUp end={overlappingAnnual} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        {/* Optimization angle */}
                        <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                            <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-2">The €0 Play</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {selectedStack.optimizationAngle}
                            </p>
                        </div>

                        {/* ROI */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-sans font-bold text-stone-500 uppercase tracking-wider">The Optimization Report</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                                    <p className="text-sm text-emerald-800 font-medium mb-1">Year 1 Net Savings</p>
                                    <div className="text-3xl font-serif text-emerald-700">
                                        €<CountUp end={year1Savings} />
                                    </div>
                                    <p className="text-xs text-emerald-600/80 mt-1">After one-time System build fee.</p>
                                </div>

                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                                    <p className="text-sm text-blue-800 font-medium mb-1">Ongoing Annual Net Benefit</p>
                                    <div className="text-3xl font-serif text-blue-700">
                                        €<CountUp end={year2Savings} />
                                    </div>
                                    <p className="text-xs text-blue-600/80 mt-1">Assuming maintenance.</p>
                                </div>
                            </div>

                            <div className="text-[10px] font-mono text-stone-400 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                <strong>How this is calculated:</strong><br />
                                1. Redundant Spend = Monthly SaaS × 12<br />
                                2. Reclaimable Amount = Redundant Spend × {reclaimablePct}%<br />
                                3. Build Fee (One-time) = 25% of Redundant Spend<br />
                                4. Annual Maintenance = 10% of Build Price<br />
                                5. Net Benefit = Reclaimable - Maintenance
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleRequest}
                                className="flex-1 py-3 px-4 bg-[#0F172A] text-white font-medium rounded-lg hover:bg-[#1e293b] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                Start Your Optimization <ArrowRight className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {hasClicked && (
                                    <motion.button
                                        initial={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                                        animate={{ opacity: 1, width: "auto", paddingLeft: "24px", paddingRight: "24px" }}
                                        exit={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={handleCopy}
                                        className="py-3 rounded-lg border border-white/10 text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
                                    >
                                        <Copy className="w-4 h-4" /> Copy Request
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SaasVsBuild;
