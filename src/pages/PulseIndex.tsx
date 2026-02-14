import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { pulseItems } from "@/data/pulseItems";

const PulseIndex = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-stone-500 group-hover:text-primary transition-colors" />
                        <span className="font-serif text-xl font-bold text-stone-900 group-hover:text-primary transition-colors">
                            Analog AI
                        </span>
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
                        The 60-Day Pulse
                    </h1>
                    <p className="text-stone-600 text-lg max-w-2xl leading-relaxed">
                        A running log of signal vs. noise. What matters for enterprise AI, translated for decision makers.
                    </p>
                </div>

                <div className="grid gap-8">
                    {pulseItems.map((insight) => (
                        <Link
                            to={`/pulse/${insight.slug}`}
                            key={insight.id}
                            className="bg-white border border-stone-200 hover:border-primary/50 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group"
                        >
                            <div className={`h-1.5 bg-gradient-to-r ${insight.color}`} />
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${insight.iconBg} flex items-center justify-center`}>
                                            {insight.icon}
                                        </div>
                                        <span className="text-sm font-mono text-stone-500">
                                            {insight.date}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-primary transition-colors" />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-1">
                                            The Noise
                                        </p>
                                        <p className="text-base text-stone-600 font-medium">
                                            {insight.noise}
                                        </p>
                                    </div>

                                    <div className="pl-4 border-l-2 border-primary/20">
                                        <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-1">
                                            The Translation
                                        </p>
                                        <p className="text-lg text-stone-900 leading-relaxed font-serif">
                                            {insight.translation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PulseIndex;
