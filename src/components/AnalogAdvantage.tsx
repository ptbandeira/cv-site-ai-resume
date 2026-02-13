import { Shield, Users, ArrowRightLeft } from "lucide-react";
import { useState } from "react";

const cards = [
    {
        id: "pharma",
        analog: "Pharma Compliance / Regulated Ops",
        digital: "Private LLM Security & Guardrails",
        insight:
            "Regulatory rigor translates directly to prompt engineering for safety.",
        focus: "Safety",
        icon: Shield,
        span: "md:col-span-2", // large card
    },
    {
        id: "team",
        analog: "Human Team Management",
        digital: "Multi-Agent Orchestration",
        insight: "Agents need clear roles, KPIs, and handoffs—just like humans.",
        focus: "Orchestration",
        icon: Users,
        span: "md:col-span-1",
    },
    {
        id: "legacy",
        analog: "Legacy Mainframe Migration",
        digital: "RAG (Retrieval Augmented Generation)",
        insight: "Connecting old data to new interfaces is the same core problem.",
        focus: "ROI",
        icon: ArrowRightLeft,
        span: "md:col-span-1",
    },
];

const BentoCard = ({
    card,
}: {
    card: (typeof cards)[number];
}) => {
    const [hovered, setHovered] = useState(false);
    const Icon = card.icon;

    return (
        <div
            className={`${card.span} relative group rounded-2xl p-6 md:p-8
        backdrop-blur-md bg-white/[0.04] border border-white/[0.08]
        transition-all duration-300 ease-out cursor-default
        hover:scale-[1.02] hover:bg-white/[0.07] hover:border-white/[0.15]
        hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)]`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Focus label */}
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4 block">
                {card.focus}
            </span>

            {/* Analog → Digital mapping */}
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-serif text-white/90 mb-1">
                    {card.analog}
                </h3>
                <div className="flex items-center gap-2 text-sm font-mono text-emerald-400/70">
                    <span>→</span>
                    <span>{card.digital}</span>
                </div>
            </div>

            {/* Insight */}
            <p className="text-sm font-mono text-white/40 leading-relaxed">
                "{card.insight}"
            </p>

            {/* Shield icon — reveals on hover */}
            <div
                className={`absolute top-6 right-6 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    }`}
            >
                <Icon className="w-5 h-5 text-emerald-400/60" />
            </div>
        </div>
    );
};

const AnalogAdvantage = () => {
    return (
        <section
            id="analog-advantage"
            className="py-20 md:py-28"
            style={{ background: "#050505" }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-14 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-white/90 mb-5">
                        The Analog Advantage
                    </h2>
                    <p className="text-sm md:text-base font-mono text-white/40 leading-relaxed">
                        AI isn't magic — it's the next layer of abstraction. Decades of
                        "Old&nbsp;World" experience provide the structural blueprints for
                        robust "New&nbsp;World" reliability.
                    </p>
                </div>

                {/* Bento grid: 2-col on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <BentoCard key={card.id} card={card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnalogAdvantage;
