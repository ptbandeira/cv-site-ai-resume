import { ShieldCheck, Zap, Users } from "lucide-react";
import { useState } from "react";

const AnalogAdvantage = ({ onOpenChat }: { onOpenChat?: () => void }) => {
    const [showVibeModal, setShowVibeModal] = useState(false);

    // 4 Cards for 2x2 grid
    const cards = [
        {
            icon: ShieldCheck,
            name: "High-Stakes Governance",
            description: "For environments where 'hallucination' is a liability. I build deterministic guardrails designed to keep data within your perimeter and output grounded.",
            className: "md:col-span-1",
            background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50" />,
        },
        {
            icon: Zap,
            name: "Operational Velocity",
            description: "Turning static data (SharePoint, Excel, SQL) into active intelligence. From automated morning briefings to instant inventory analysis.",
            className: "md:col-span-1",
            background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent opacity-50" />,
        },
        {
            icon: Users,
            name: "The Human-in-the-Loop",
            description: "AI shouldn't replace your judgment; it should scale it. I design workflows where agents handle the noise, and you handle the decision.",
            className: "md:col-span-1",
            background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-orange-500/5 via-transparent to-transparent opacity-50" />,
        },
        {
            icon: Zap, // Using Zap/FastForward equivalent
            name: "Rapid Reality Testing",
            description: "Strategy without execution is hallucination. I use Vibe Coding to build functional Proofs of Concept in days, not weeks. Validate the architecture before you hire the team.",
            className: "md:col-span-1 cursor-pointer ring-1 ring-primary/20", // Highlight
            background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />,
            onClick: () => setShowVibeModal(true),
            isAction: true,
        },
    ];

    return (
        <section
            id="analog-advantage"
            className="py-20 md:py-28 bg-background"
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-14 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-5">
                        The Analog / Digital Bridge
                    </h2>
                    <p className="text-lg font-sans text-stone-600 leading-relaxed">
                        AI isn't magic — it's the next layer of abstraction. Decades of
                        "Old&nbsp;World" experience provide the structural blueprints for
                        robust "New&nbsp;World" reliability.
                    </p>
                </div>

                {/* Bento grid: 2x2 Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
                    {cards.map((card) => (
                        <article
                            key={card.name}
                            onClick={'onClick' in card ? card.onClick : undefined}
                            className={`${card.className} relative group rounded-2xl p-6 md:p-8
              bg-white border border-stone-200 overflow-hidden
              transition-all duration-300 ease-out 
              ${'onClick' in card && card.onClick ? "hover:scale-[1.02] hover:shadow-primary/10 cursor-pointer" : "hover:scale-[1.01] cursor-default"}
              hover:border-stone-300
              shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-300/50`}
                            role="listitem"
                        >
                            {/* Background Gradient */}
                            {card.background}

                            <div className="relative z-10 h-full flex flex-col">
                                {/* Icon & Title */}
                                <div className="mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${'isAction' in card && card.isAction ? "bg-primary/10 text-primary" : "bg-stone-100 text-stone-700"}`}>
                                        <card.icon className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">
                                        {card.name}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-sm md:text-base font-sans text-muted-foreground leading-relaxed md:max-w-md">
                                    {card.description}
                                </p>

                                {/* Arrow hint on hover - Special text for Action card */}
                                <div
                                    className={`mt-auto pt-6 flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 ${'isAction' in card && card.isAction ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        } translate-y-2 group-hover:translate-y-0`}
                                    aria-hidden="true"
                                >
                                    <span>{'isAction' in card && card.isAction ? "See the Proof" : "Explore Strategy"}</span>
                                    <span className="text-xs">→</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Vibe Coding Modal */}
            {showVibeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 shadow-2xl relative animate-slide-up">
                        <button
                            onClick={() => setShowVibeModal(false)}
                            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-serif text-foreground mb-2">Don't Guess. Validate.</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Most strategic initiatives die in "Does this actually work?". I bypass the slide deck and build the actual system logic in a weekend. You get a working Sovereign AI architecture you can touch, test, and validate.
                            </p>
                        </div>

                        <div className="p-4 bg-secondary/50 rounded-xl mb-6">
                            <p className="text-sm font-mono text-stone-600 mb-2">
                                <span className="font-semibold text-foreground">Operational Proof of Concepts:</span>
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Sovereign Logic Validation
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Internal Tooling & Dashboards
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Executive-Ready PowerApps
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href="mailto:pedrobandeira@me.com?subject=Book a Sprint: Reactive MVP"
                                className="w-full py-4 bg-[#1A1A1A] text-white rounded-sm font-medium text-center hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
                            >
                                Book a Sprint <span className="text-stone-400">→</span>
                            </a>
                            <p className="text-xs text-center text-muted-foreground">
                                Limited availability. Sprints start at $5k.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AnalogAdvantage;
