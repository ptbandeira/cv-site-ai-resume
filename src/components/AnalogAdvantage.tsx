import { Card } from "@/components/ui/card";

const AnalogAdvantage = () => {
    const mappings = [
        {
            analog: "Pharma Compliance / Regulated Ops",
            digital: "Private LLM Security & Guardrails",
            insight: "Regulatory rigor translates directly to prompt engineering for safety."
        },
        {
            analog: "Legacy Mainframe Migration",
            digital: "RAG (Retrieval Augmented Generation)",
            insight: "Connecting old data to new interfaces is the same core problem."
        },
        {
            analog: "Human Team Management",
            digital: "Multi-Agent Orchestration",
            insight: "Agents need clear roles, KPIs, and handoffs—just like humans."
        },
        {
            analog: "Executive Briefings",
            digital: "Context Compression",
            insight: "Summarizing 100 pages into 1 page is now an algorithmic art."
        }
    ];

    return (
        <section id="analog-advantage" className="py-20 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif text-foreground mb-6">The Analog Advantage</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        AI isn't magic; it's just the next layer of abstraction. My decades of "Old World" experience
                        provide the structural blueprints for robust "New World" reliability.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {mappings.map((item, index) => (
                        <Card key={index} className="p-6 border-l-4 border-l-primary/40 hover:border-l-primary transition-all duration-300">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Analog Skill</span>
                                    <span className="text-sm font-bold text-primary uppercase tracking-wider text-right">AI Translation</span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <h3 className="text-lg font-serif font-medium text-foreground">{item.analog}</h3>
                                    <span className="hidden md:block text-muted-foreground">→</span>
                                    <h3 className="text-lg font-sans font-medium text-foreground text-right">{item.digital}</h3>
                                </div>

                                <p className="text-sm text-muted-foreground italic border-t border-border pt-4">
                                    "{item.insight}"
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnalogAdvantage;
