import { Check, ArrowRight, Copy } from "lucide-react";
import { toast } from "sonner";

const OfferMenu = () => {
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
            title: "Sovereign AI Architecture",
            description: "Your data. Your metal. Your rules.",
            features: [
                "Local-first LLM deployment (Llama 3, DeepSeek)",
                "Air-gapped RAG pipelines",
                "Implementation roadmap + vendor neutral decisions"
            ],
            cta: "Discuss Architecture",
            subject: "Discuss Architecture",
            body: "Hi Pedro,\n\nI'd like to discuss Sovereign AI Architecture.\n\nIndustry: [e.g., Pharma, Law, Finance]\nData Sensitivity: [Internal / Confidential / PII]\n\nBest,",
            highlight: false,
            price: "Starting at €15k ex VAT",
            scope: "Scope: one domain + reference architecture + governance design."
        },
        {
            title: "Fractional AI Officer",
            description: "Adult supervision for your AI roadmap.",
            features: [
                "Risk governance & vendor audit",
                "Hiring & team structure strategy",
                "Training + operating cadence"
            ],
            cta: "Explore a Fractional Role",
            subject: "Explore Fractional Role",
            body: "Hi Pedro,\n\nI'm interested in exploring a Fractional Role.\n\nCurrent Stage:\nKey Pain Points:\n\nBest,",
            highlight: false,
            price: "€8k/mo (1 day/wk) · €15k/mo (2 days/wk) ex VAT",
            scope: "Includes: weekly exec cadence + delivery management + risk reporting."
        }
    ];

    const generateMailto = (subject: string, body: string) => {
        return `mailto:pedrobandeira@me.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleCopy = (subject: string, body: string) => {
        const text = `Subject: ${subject}\n\n${body}`;
        navigator.clipboard.writeText(text);
        // Assuming 'toast' is available globally or imported elsewhere
        // toast.success("Request copied to clipboard");
    };

    return (
        <section id="offers" className="py-24 bg-[#F9F9F7] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
                        Choose Your Engagement
                    </h2>
                    <p className="text-stone-600 font-mono text-sm md:text-base">
                        No hourly billing. No ambiguous retainers. Fixed-scope outcomes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-xl border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${offer.highlight
                                ? "bg-white border-stone-300 shadow-lg ring-1 ring-stone-200"
                                : "bg-[#F9F9F7] border-stone-200 hover:bg-white"
                                }`}
                        >
                            <div className="mb-6">
                                <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">{offer.title}</h3>
                                <p className="text-stone-600 text-sm h-10">{offer.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {offer.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                                        <Check className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto space-y-3">
                                <div className="text-xs font-mono text-stone-500 py-3 border-t border-stone-100 min-h-[60px]">
                                    {offer.scope}
                                </div>
                                <p className="text-sm font-medium text-stone-900 pb-2">
                                    {offer.price}
                                </p>
                                <a
                                    href={generateMailto(offer.subject, offer.body)}
                                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-colors ${offer.highlight
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-white border border-stone-200 text-stone-900 hover:bg-stone-50"
                                        }`}
                                >
                                    {offer.cta}
                                </a>
                                <button
                                    onClick={() => handleCopy(offer.subject, offer.body)}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-medium text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy Request
                                </button>
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
