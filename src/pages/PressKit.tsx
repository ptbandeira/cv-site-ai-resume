import { ArrowLeft, Mail, Linkedin, Mic, Download, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PressKit = () => {
    const { toast } = useToast();

    const copyBio = () => {
        navigator.clipboard.writeText("Pedro Bandeira is a Senior AI Operations Architect who bridges the gap between boardroom strategy and engineering reality. With 20+ years of experience in high-stakes environments, he helps enterprise leaders move from 'pilot purgatory' to reliable, revenue-generating AI systems. He is currently focused on sovereign AI architectures and human-in-the-loop workflows.");
        toast({
            title: "Bio copied to clipboard",
            duration: 2000,
        });
    };

    const interviewTopics = [
        "The Agentic C-Suite: Why your next exec might run on silicon.",
        "Sovereign AI: Why European data needs to stay in Europe.",
        "The Death of SaaS: How custom agents are replacing rigid software.",
        "Pilot Purgatory: Why 90% of enterprise AI fails (and how to fix it).",
        "The \"Human-in-the-Loop\" Fallacy: It's not a bug, it's a feature.",
        "Vibe Coding vs. Engineering: The new divide in software creation.",
        "AI ROI: Moving beyond \"productivity\" to hard revenue.",
        "The Automation Auditor: Why you need a \"Chief Skeptic\" for your AI."
    ];

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

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
                <div className="mb-12">
                    <span className="font-mono text-xs uppercase text-primary font-bold tracking-wider mb-2 block">
                        Press Kit
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">
                        Pedro Bandeira
                    </h1>
                    Senior AI Operations Architect • Sovereign AI Specialist • "The Adult in the AI Room"
                </div>

                <div className="space-y-12">
                    {/* Bio Section */}
                    <section className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-serif font-bold text-stone-900">Short Bio</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-stone-600"
                                onClick={copyBio}
                            >
                                <Copy className="w-3 h-3" />
                                Copy
                            </Button>
                        </div>
                        <p className="text-stone-700 leading-relaxed text-lg">
                            Pedro Bandeira is a Senior AI Operations Architect who bridges the gap between boardroom strategy and engineering reality. With 20+ years of experience in high-stakes environments, he helps enterprise leaders move from "pilot purgatory" to reliable, revenue-generating AI systems. He is currently focused on sovereign AI architectures and human-in-the-loop workflows.
                        </p>
                    </section>

                    {/* Interview Topics */}
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
                            <Mic className="w-6 h-6 text-primary" />
                            Suggested Interview Topics
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {interviewTopics.map((topic, i) => (
                                <div key={i} className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                                    <p className="text-stone-700 font-medium">
                                        {topic}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Why Now */}
                    <section className="bg-secondary/20 rounded-2xl p-8 border border-secondary/30">
                        <h2 className="text-lg font-serif font-bold text-stone-900 mb-4">Why Now?</h2>
                        <p className="text-stone-700 leading-relaxed font-medium italic">
                            "We are crossing the chasm from 'chatbots that write poems' to 'agents that do work'. The technology is ready, but the organizations are not. The next 12 months will decide who builds the future and who gets automated by it."
                        </p>
                    </section>

                    {/* Image Assets would go here - placeholder for now */}

                    {/* Contact */}
                    <section className="border-t border-stone-200 pt-10">
                        <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Get in Touch</h2>
                        <div className="flex gap-4">
                            <a
                                href="mailto:pedrobandeira@me.com?subject=Press / Booking Inquiry&body=Hi Pedro,%0D%0A%0D%0AI'm reaching out regarding...%0D%0A%0D%0ABest,"
                                className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10"
                            >
                                <Mail className="w-4 h-4" />
                                Email for Booking
                            </a>
                            <a
                                href="https://linkedin.com/in/pedrobandeira"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-lg font-medium hover:bg-[#006396] transition-colors shadow-lg shadow-blue-900/10"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PressKit;
