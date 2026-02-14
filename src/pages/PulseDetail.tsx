import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { pulseItems } from "@/data/pulseItems";

const PulseDetail = () => {
    const { slug } = useParams();
    const insight = pulseItems.find((item) => item.slug === slug);

    if (!insight) {
        return <Navigate to="/pulse" replace />;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/pulse" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-stone-500 group-hover:text-primary transition-colors" />
                        <span className="font-serif text-lg font-bold text-stone-900 group-hover:text-primary transition-colors">
                            Back to Pulse
                        </span>
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
                <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${insight.color}`} />

                    <div className="p-8 md:p-12">
                        {/* Meta */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-12 h-12 rounded-full ${insight.iconBg} flex items-center justify-center`}>
                                {insight.icon}
                            </div>
                            <span className="text-sm font-mono text-stone-500 border border-stone-200 rounded-full px-4 py-1.5">
                                {insight.date}
                            </span>
                        </div>

                        {/* Content Grid */}
                        <div className="space-y-10">
                            {/* The Noise */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold mb-3">
                                    The Noise (What everyone is saying)
                                </h3>
                                <p className="text-xl md:text-2xl text-stone-600 font-medium leading-relaxed">
                                    "{insight.noise}"
                                </p>
                            </div>

                            {/* The Translation */}
                            <div className="p-6 bg-primary/5 rounded-xl border-l-4 border-primary">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-3">
                                    The Translation (Why it matters)
                                </h3>
                                <p className="text-xl md:text-2xl text-stone-900 font-serif leading-relaxed">
                                    {insight.translation}
                                </p>
                            </div>

                            {/* The Action */}
                            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-3">
                                    The Action (What we do)
                                </h3>
                                <p className="text-lg text-emerald-900/80 leading-relaxed font-medium">
                                    {insight.action}
                                </p>
                            </div>
                        </div>

                        {/* Sources */}
                        {insight.sources && (
                            <div className="mt-12 pt-8 border-t border-stone-100">
                                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-4">
                                    Sources
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {insight.sources.map((source, i) => (
                                        <a
                                            key={i}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/70 transition-colors underline decoration-primary/30 underline-offset-4"
                                        >
                                            {source.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PulseDetail;
