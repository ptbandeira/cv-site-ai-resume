import { AlertTriangle, ShieldAlert, Lock, ZapOff, DollarSign, Link } from "lucide-react";

const WhenAIGoesWrong = () => {
    const failures = [
        {
            title: "The Oracle Trap",
            consequence: "Hallucinations become decisions.",
            fix: "Audit trails + human approvals + fallbacks.",
            icon: AlertTriangle
        },
        {
            title: "The Black Box",
            consequence: "No one can explain why the model said yes.",
            fix: "Deterministic workflows, logging, and test suites.",
            icon: ShieldAlert
        },
        {
            title: "Data Leakage",
            consequence: "Sensitive docs leave your perimeter.",
            fix: "Local-first or controlled routing.",
            icon: Lock
        },
        {
            title: "Pilot Graveyard",
            consequence: "Ten experiments, stalled production.",
            fix: "Reality tests + integration-first design.",
            icon: ZapOff
        },
        {
            title: "SaaS Tax",
            consequence: "You pay for tools nobody uses.",
            fix: "Workflow-first rationalization.",
            icon: DollarSign
        },
        {
            title: "Vendor Lock-in",
            consequence: "Your capability depends on one API.",
            fix: "Model-agnostic architecture.",
            icon: Link
        }
    ];

    return (
        <section className="py-24 bg-stone-50 border-y border-stone-200">
            <div className="container mx-auto px-6 max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-16 text-center">
                    When AI Goes Wrong
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {failures.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-6 text-stone-600">
                                <item.icon className="w-5 h-5" />
                            </div>

                            <h3 className="font-serif text-xl text-stone-900 mb-3">
                                {item.title}
                            </h3>

                            <div className="space-y-3">
                                <p className="text-stone-600 font-medium">
                                    {item.consequence}
                                </p>
                                <div className="pt-3 border-t border-stone-100">
                                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold mr-2">FIX:</span>
                                    <span className="text-sm text-stone-800">{item.fix}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhenAIGoesWrong;
