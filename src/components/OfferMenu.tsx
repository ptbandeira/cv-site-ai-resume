import { ArrowRight, CheckCircle2 } from "lucide-react";

const OfferMenu = () => {
    const offers = [
        {
            title: "48‑Hour Reality Test",
            description: "Two days to prove what’s real, what’s risky, and what’s worth building.",
            deliverables: [
                "Working prototype or workflow simulation",
                "Risk register (hallucinations, data, auditability)",
                "Integration plan (systems, people, governance)",
                "Decision memo: Build / Buy / Kill"
            ],
            cta: "Request a Reality Test",
            href: "mailto:pedrobandeira@me.com?subject=Request a Reality Test",
            highlight: true,
            price: "Starting at €5k ex VAT"
        },
        {
            title: "Sovereign AI Architecture",
            description: "Local-first or controlled-cloud architectures for sensitive workflows.",
            deliverables: [
                "Reference architecture + threat model",
                "Governance: roles, audit trails, approvals",
                "Model strategy: local vs API, routing, fallbacks",
                "Implementation roadmap + vendor neutral decisions"
            ],
            cta: "Discuss Architecture",
            href: "mailto:pedrobandeira@me.com?subject=Discuss Architecture",
            highlight: false,
            price: "Starting at €15k ex VAT"
        },
        {
            title: "Fractional Chief AI Operator",
            description: "Boardroom clarity + delivery management across IT, Legal, Ops.",
            deliverables: [
                "AI program triage: what to stop, start, scale",
                "Pilot-to-production playbook",
                "Executive reporting: ROI, risk, adoption",
                "Training + operating cadence"
            ],
            cta: "Explore a Fractional Role",
            href: "mailto:pedrobandeira@me.com?subject=Explore Fractional Role",
            highlight: false,
            price: "Retainers from €8k/mo ex VAT"
        }
    ];

    return (
        <section id="offer-menu" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className={`flex flex-col p-8 rounded-xl border transition-all duration-300 ${offer.highlight
                                ? "bg-white border-primary/20 shadow-xl shadow-primary/5 scale-[1.02] md:-translate-y-2"
                                : "bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300"
                                }`}
                        >
                            <h3 className="font-serif text-2xl text-stone-900 mb-4">{offer.title}</h3>
                            <p className="text-stone-600 mb-8 min-h-[3rem]">{offer.description}</p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {offer.deliverables.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                                        <CheckCircle2 className="w-5 h-5 text-primary/80 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <p className="text-xs text-stone-500 font-mono mb-3 text-center opacity-80">
                                    {offer.price}
                                </p>
                                <a
                                    href={offer.href}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${offer.highlight
                                        ? "bg-[#1A1A1A] text-white hover:bg-[#333]"
                                        : "bg-white border border-stone-300 text-stone-900 hover:bg-stone-50"
                                        }`}
                                >
                                    {offer.cta}
                                    <ArrowRight className="w-4 h-4" />
                                </a>
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
