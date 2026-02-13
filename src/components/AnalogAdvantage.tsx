import { ShieldCheck, Zap, Users } from "lucide-react";
import { useState } from "react";

const cards = [
    {
        icon: ShieldCheck,
        name: "High-Stakes Governance",
        description: "For environments where 'hallucination' is a liability. I build deterministic guardrails that keep your data safe and your output accurate.",
        className: "md:col-span-1",
        background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-50" />,
    },
    {
        icon: Zap,
        name: "Operational Velocity",
        description: "Turning static data (SharePoint, Excel, SQL) into active intelligence. From automated morning briefings to instant inventory analysis.",
        className: "md:col-span-2",
        background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent opacity-50" />,
    },
    {
        icon: Users,
        name: "The Human-in-the-Loop",
        description: "AI shouldn't replace your judgment; it should scale it. I design workflows where agents handle the noise, and you handle the decision.",
        className: "md:col-span-3",
        background: <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-t from-orange-500/5 via-transparent to-transparent opacity-50" />,
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
            className={`${card.className} relative group rounded-2xl p-6 md:p-8
        bg-white border border-stone-200 overflow-hidden
        transition-all duration-300 ease-out cursor-default
        hover:scale-[1.01] hover:border-stone-300
        shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-300/50`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background Gradient */}
            {card.background}

            <div className="relative z-10 h-full flex flex-col">
                {/* Icon & Title */}
                <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4 text-stone-700 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2">
                        {card.name}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base font-sans text-muted-foreground leading-relaxed md:max-w-md">
                    {card.description}
                </p>

                {/* Arrow hint on hover */}
                <div
                    className={`mt-auto pt-6 flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        }`}
                >
                    <span>Explore Strategy</span>
                    <span className="text-xs">→</span>
                </div>
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
                    <p className="text-lg font-sans text-stone-600 leading-relaxed">
                        AI isn't magic — it's the next layer of abstraction. Decades of
                        "Old&nbsp;World" experience provide the structural blueprints for
                        robust "New&nbsp;World" reliability.
                    </p>
                </div>

                {/* Bento grid: 3-col on md+ (since we have col-span-1, 2, 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <BentoCard key={card.name} card={card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnalogAdvantage;
