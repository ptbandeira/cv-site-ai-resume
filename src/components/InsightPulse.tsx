import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { pulseItems } from "@/data/pulseItems";

const InsightPulse = () => {
    // Take only the latest 2 items
    const latestInsights = pulseItems.slice(0, 2);

    return (
        <section id="insight-pulse" className="py-24 px-6 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
                            The 60-Day Pulse
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Not a blog. A translation layer — cutting through AI noise to show what actually matters for your business.
                        </p>
                    </div>
                    <Link
                        to="/pulse"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 hover:border-primary/50 text-stone-600 hover:text-primary rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                        View all Pulse notes
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {latestInsights.map((insight) => (
                        <Link
                            to={`/pulse/${insight.slug}`}
                            key={insight.id}
                            className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-300"
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
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InsightPulse;
