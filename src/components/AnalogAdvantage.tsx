import { Shield, Users, ArrowRightLeft } from "lucide-react";
import { useState } from "react";

const cards = [
    {
        id: "compliance",
        analog: "Compliance Governance",
        digital: "Guardrailed LLMs",
        insight:
            "Regulatory rigor translates directly to prompt engineering for safety.",
        focus: "Safety",
        icon: Shield,
        span: "md:col-span-2",
    },
    {
        id: "sales",
        analog: "Deal Psychology",
        digital: "Empathetic Sales Agents",
        insight: "Understanding human motivation is the blueprint for persuasive AI.",
        focus: "Empathy",
        icon: Users,
        span: "md:col-span-1",
    },
    {
        id: "ops",
        analog: "P&L Discipline",
        digital: "ROI-Focused Automation",
        insight: "Every automation must justify its cost — just like every hire.",
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
        bg-white border border-stone-200
        transition-all duration-300 ease-out cursor-default
        hover:scale-[1.02] hover:border-stone-300
        shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-300/50`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Focus label */}
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                {card.focus}
            </span>

            {/* Analog → Digital mapping */}
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-serif text-foreground mb-1">
                    {card.analog}
                </h3>
                <div className="flex items-center gap-2 text-sm font-mono text-primary">
                    <span>→</span>
                    <span>{card.digital}</span>
                </div>
            </div>

            {/* Insight */}
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                "{card.insight}"
            </p>

            {/* Shield icon — reveals on hover */}
            <div
                className={`absolute top-6 right-6 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                    }`}
            >
                <Icon className="w-5 h-5 text-primary/60" />
            </div>
        </div>
    );
};

const AnalogAdvantage = () => {
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
                    <p className="text-sm md:text-base font-mono text-muted-foreground leading-relaxed">
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
