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
            href: "mailto:pedrobandeira@me.com?subject=Request a Reality Test&body=Hi Pedro,%0D%0A%0D%0AI'm interested in a 48-Hour Reality Test.%0D%0A%0D%0AChallenge: [Describe your specific problem]%0D%0AGoal: [Validation vs. MVP vs. Workflow]%0D%0A%0D%0ABest,",
            highlight: true,
            price: "Starting at €5k ex VAT",
            scope: "Scope: one workflow, one team, one decision memo."
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
            href: "mailto:pedrobandeira@me.com?subject=Discuss Architecture&body=Hi Pedro,%0D%0A%0D%0AI'd like to discuss Sovereign AI Architecture.%0D%0A%0D%0AIndustry: [e.g., Pharma, Law, Finance]%0D%0AData Sensitivity: [Internal / Confidential / PII]%0D%0A%0D%0ABest,",
            highlight: false,
            price: "Starting at €15k ex VAT",
            scope: "Scope: one domain + reference architecture + governance design."
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
            href: "mailto:pedrobandeira@me.com?subject=Explore Fractional Role&body=Hi Pedro,%0D%0A%0D%0AI'm interested in exploring a Fractional Role.%0D%0A%0D%0ACurrent Stage:%0D%0AKey Pain Points:%0D%0A%0D%0ABest,",
            highlight: false,
            price: "€8k/mo (1 day/wk) · €15k/mo (2 days/wk) ex VAT",
            scope: "Includes: weekly exec cadence + delivery management + risk reporting."
        }
    ];

    return (
        <section id="offer-menu" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row p-8 rounded-xl border border-primary/20 bg-white shadow-xl shadow-primary/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <CheckCircle2 className="w-32 h-32 text-primary" />
                        </div>

                        <div className="flex-1 pr-6 relative z-10">
                            <div className="inline-block px-3 py-1 mb-4 text-xs font-mono font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                New • First Step
                            </div>
                            <h3 className="font-serif text-3xl text-stone-900 mb-4">Executive Triage <span className="text-lg text-stone-500 font-sans font-normal">(90 minutes)</span></h3>
                            <p className="text-stone-600 mb-6 text-lg">Fast clarity for leaders who are stuck in pilot sprawl.</p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />
                                    <span><strong>1-page decision memo:</strong> Stop / Start / Scale</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />
                                    <span><strong>Risk map:</strong> data, auditability, ownership, hallucinations</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />
                                    <span><strong>Next step:</strong> Reality Test or Architecture plan</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col justify-end min-w-[240px] border-l border-stone-100 pl-8 md:pl-8 relative z-10 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0">
                            <p className="text-sm text-stone-500 font-mono mb-4 text-center">
                                €950 ex VAT (fixed)
                            </p>
                            <a
                                href="mailto:pedrobandeira@me.com?subject=Book Executive Triage&body=Hi Pedro,%0D%0A%0D%0AI'd like to book an Executive Triage session (90 mins).%0D%0A%0D%0AMy main goal is: [Stop pilot sprawl / Board reporting / Strategy reset]%0D%0A%0D%0ABest,"
                                className="flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-all bg-[#F25D27] text-white hover:bg-[#d14d1e] shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                            >
                                Book Executive Triage
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

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
                                <p className="text-xs text-stone-500 font-mono mb-1 text-center opacity-80">
                                    {offer.price}
                                </p>
                                <p className="text-[10px] text-stone-400 font-sans mb-4 text-center max-w-[90%] mx-auto leading-tight">
                                    {offer.scope}
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
