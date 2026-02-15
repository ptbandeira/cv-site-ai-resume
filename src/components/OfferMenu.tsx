import { Zap, ArrowRight, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OfferMenu = () => {
    const [clickedOffers, setClickedOffers] = useState<Set<string>>(new Set());

    const offers = [
        {
            title: "48-Hour Reality Test",
            description: "Validate first. Scale later.",
            features: [
                "Two-day Sprint to build a working POC",
                "Hard feasibility check (Technical & Legal)",
                "Decision memo: Build / Buy / Kill"
            ],
            cta: "Request a Reality Test",
            subject: "Request a Reality Test",
            body: "Hi Pedro,\n\nI'm interested in a 48-Hour Reality Test.\n\nChallenge: [Describe your specific problem]\nGoal: [Validation vs. MVP vs. Workflow]\n\nBest,",
            highlight: true,
            price: "Starting at €5k ex VAT",
            scope: "Scope: one workflow, one team, one decision memo."
        },
        {
            title: "The Executive Triage",
            description: "For leaders drowning in AI noise.",
            features: [
                "Map your entire organization's AI opportunities",
                "Identify high-risk 'Shadow AI' usage",
                "Stack-rank pilot candidates by ROI"
            ],
            cta: "Book Triage Session",
            subject: "Request an Executive Triage",
            body: "Hi Pedro,\n\nI need to cut through the noise. Interested in an Executive Triage session.\n\nOrganization Size:\nCurrent AI state: [Chaos / Curated / Blocked]\n\nBest,",
            highlight: false,
            price: "Flat fee €2.5k",
            scope: "Scope: full-day workshop + strategic roadmap."
        },
        {
            title: "Sovereign Systems",
            description: "End-to-end proprietary architecture.",
            features: [
                "Custom LLM pipelines on your infrastructure",
                "Full data residency & compliance control",
                "Zero-dependency on external SaaS wrappers"
            ],
            cta: "Discuss Architecture",
            subject: "Discuss Sovereign Architecture",
            body: "Hi Pedro,\n\nWe need to build something proprietary.\n\nUse Case: [Internal Knowledge / Customer Facing]\nCompliance Needs: [GDPR / HIPAA / proprietary data]\n\nBest,",
            highlight: false,
            price: "Custom Engagement",
            scope: "Scope: design, build, and handoff of full system."
        }
    ];

    const handleRequest = (offer: typeof offers[0]) => {
        setClickedOffers(prev => new Set(prev).add(offer.title));
        window.location.href = `mailto:pedrobandeira@me.com?subject=${encodeURIComponent(offer.subject)}&body=${encodeURIComponent(offer.body)}`;
    };

    const handleCopy = (offer: typeof offers[0]) => {
        const text = `Subject: ${offer.subject}\n\n${offer.body}`;
        navigator.clipboard.writeText(text);
        toast.success("Request copied to clipboard");
    };

    return (
        <section id="offers" className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-3">
                        Choose Your Engagement
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                        Stop buying software. Start building assets.
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Most agencies sell you a subscription to their time. I sell you a
                        working system that belongs to you. No retainers, no "maintenance
                        fees", just sovereign code.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div
                            key={offer.title}
                            className={`relative p-8 rounded-xl border transition-all duration-300 flex flex-col ${offer.highlight
                                ? "bg-white border-primary/20 shadow-xl shadow-primary/5 scale-105 z-10"
                                : "bg-stone-100 border-stone-200 hover:border-primary/20 hover:shadow-lg"
                                }`}
                        >
                            {offer.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-2">
                                <h3 className="text-xl font-serif font-bold text-foreground">
                                    {offer.title}
                                </h3>
                                <p className="text-sm font-mono text-stone-500 mt-1">{offer.price}</p>
                            </div>

                            <p className="text-stone-600 mb-6 min-h-[48px]">
                                {offer.description}
                            </p>

                            <ul className="space-y-3 mb-8 flex-1">
                                {offer.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-stone-600">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${offer.highlight ? "text-primary" : "text-stone-400"
                                            }`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto space-y-3 pt-6 border-t border-stone-100">
                                <p className="text-xs font-mono text-stone-400 italic px-1">
                                    {offer.scope}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRequest(offer)}
                                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${offer.highlight
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg"
                                            : "bg-white border border-stone-200 text-stone-700 hover:border-primary/50 hover:text-primary"
                                            }`}
                                    >
                                        {offer.cta} <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                        {clickedOffers.has(offer.title) && (
                                            <motion.button
                                                initial={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                                                animate={{ opacity: 1, width: "auto", paddingLeft: "12px", paddingRight: "12px" }}
                                                exit={{ opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => handleCopy(offer)}
                                                className="py-3 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
                                                title="Copy Request"
                                            >
                                                <Copy className="w-4 h-4 flex-shrink-0" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center border-t border-stone-200 pt-8 max-w-2xl mx-auto">
                    <p className="font-mono text-sm text-stone-500 uppercase tracking-wide">
                        Serious work starts with a paid engagement. If you need a junior dev, this isn’t it.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OfferMenu;
