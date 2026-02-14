import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        q: "How do you ensure AI safety in Pharma?",
        a: "I use a 'Local-First' architecture where patient data never leaves your on-premise server, utilizing Llama 3 models instead of public APIs. This means zero data leakage, full audit trails, and compliance with GxP and GDPR constraints. Compliance sign-off stays with your team; the system produces audit trails and recommendations.",
    },
    {
        q: "Can AI replace my sales team?",
        a: "No. I build 'Hybrid Intelligence' systems where AI handles data entry, CRM updates, and report generation — while humans handle negotiation, relationship-building, and strategic decisions. The goal is to reclaim 15+ hours per rep per week.",
    },
    {
        q: "What is the difference between your approach and hiring a SaaS vendor?",
        a: "SaaS is rent. I build owned assets. A SaaS vendor locks you into per-seat pricing that scales linearly with headcount. I architect systems you own — local models, custom pipelines, deterministic outputs — that scale with compute, not payroll.",
    },
    {
        q: "How long does implementation typically take?",
        a: "A functional PoC takes 1–3 weeks. Full enterprise rollout with guardrails, training, and governance typically runs 3–4 months. I scope aggressively because regulated environments demand precision over speed.",
    },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-border last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 px-1 text-left group"
                aria-expanded={open}
            >
                <span className="text-base md:text-lg font-serif text-foreground pr-4 group-hover:text-primary transition-colors">
                    {q}
                </span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    open ? "max-h-96 pb-5" : "max-h-0"
                )}
            >
                <p className="font-mono text-sm text-muted-foreground leading-relaxed px-1">
                    {a}
                </p>
            </div>
        </div>
    );
};

const StrategicFAQ = () => {
    return (
        <section id="strategic-faq" className="py-20 bg-background">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                        Strategic FAQ
                    </h2>
                    <p className="font-mono text-sm text-muted-foreground">
                        Direct answers to the questions that matter.
                    </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StrategicFAQ;
