import { Zap, Globe, ArrowRight } from "lucide-react";

const insights = [
    {
        id: "anthropic-enterprise",
        icon: <Zap className="w-5 h-5" />,
        color: "from-amber-500 to-orange-500",
        iconBg: "bg-amber-100 text-amber-700",
        noise: "OpenAI releases o3, Anthropic releases Claude 4.6.",
        translation: "Models are getting cheaper, not just smarter. Enterprise reasoning is now reliable enough for a Managing Partner's desk.",
        action: "We can move your document review from GPT-4 to Claude Haiku, saving 90% on API costs without losing accuracy. I can implement this switch in 24 hours.",
        date: "Feb 2026",
    },
    {
        id: "openclaw-sovereignty",
        icon: <Globe className="w-5 h-5" />,
        color: "from-primary to-orange-400",
        iconBg: "bg-orange-100 text-orange-700",
        noise: "Meta releases Llama 4, OpenClaw launches open-source agent framework.",
        translation: "Self-hosted models are now good enough for production workloads. You can stop sending client data to US servers.",
        action: "I can redeploy your document processing pipeline to run on-premise using Llama 4 + OpenClaw — same accuracy, full data sovereignty, zero API costs.",
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
                        Not a blog. A translation layer — cutting through AI noise to show what actually matters for your business.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {insights.map((insight) => (
                        <div
                            key={insight.id}
                            className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden flex flex-col"
                        >
                            {/* Color bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${insight.color}`} />

                            <div className="p-6 flex flex-col flex-1">
                                {/* Icon + Date */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className={`w-10 h-10 rounded-full ${insight.iconBg} flex items-center justify-center`}>
                                        {insight.icon}
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                                        {insight.date}
                                    </span>
                                </div>

                                {/* The Noise */}
                                <div className="mb-4">
                                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold mb-1.5">
                                        The Noise
                                    </p>
                                    <p className="text-sm text-foreground font-medium leading-relaxed">
                                        {insight.noise}
                                    </p>
                                </div>

                                {/* The Translation */}
                                <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                                    <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-1.5">
                                        The Translation
                                    </p>
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {insight.translation}
                                    </p>
                                </div>

                                {/* The Action */}
                                <div className="mt-auto p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1.5">
                                        The Action
                                    </p>
                                    <p className="agent-text text-emerald-800/80 leading-relaxed">
                                        {insight.action}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InsightPulse;
