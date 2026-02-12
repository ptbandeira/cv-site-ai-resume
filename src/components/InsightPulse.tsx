import { Zap, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const insights = [
    {
        id: "anthropic-enterprise",
        icon: <Zap className="w-5 h-5" />,
        color: "from-amber-600 to-orange-600",
        iconBg: "bg-amber-100 text-amber-700",
        headline: "Anthropic 4.6 & Enterprise Reasoning",
        translation:
            "Why this model finally makes legal document triaging reliable enough for a Managing Partner's desk. The reasoning chain is now deterministic enough to pass a compliance audit — not just impressive in a demo.",
        date: "Feb 2026",
    },
    {
        id: "openclaw-sovereignty",
        icon: <Globe className="w-5 h-5" />,
        color: "from-emerald-600 to-teal-600",
        iconBg: "bg-emerald-100 text-emerald-700",
        headline: "OpenClaw & The Sovereignty Shift",
        translation:
            "Why the new open-source movement means you can soon stop sending your client data to US-based servers entirely. Self-hosted models are now good enough for production legal and pharma workloads.",
        date: "Feb 2026",
    },
];

const InsightPulse = () => {
    return (
        <section id="insight-pulse" className="py-24 px-6 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                        The 60-Day Pulse
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Not a blog. A translation layer — what the latest AI breakthroughs actually mean for your business.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {insights.map((insight) => (
                        <Card
                            key={insight.id}
                            className="p-0 overflow-hidden border-border card-slab flex flex-col"
                        >
                            {/* Color bar */}
                            <div
                                className={`h-1.5 bg-gradient-to-r ${insight.color}`}
                            />

                            <div className="p-6 flex flex-col flex-1">
                                {/* Icon + Date */}
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-10 h-10 rounded-full ${insight.iconBg} flex items-center justify-center`}
                                    >
                                        {insight.icon}
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                                        {insight.date}
                                    </span>
                                </div>

                                {/* Headline */}
                                <h3 className="text-lg font-serif font-medium text-foreground mb-4">
                                    {insight.headline}
                                </h3>

                                {/* Translation */}
                                <div className="flex-1">
                                    <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-2">
                                        Translation
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {insight.translation}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InsightPulse;
