import { FileText, Shield, Database, LayoutTemplate } from "lucide-react";

const FieldNoteLawFirm = () => {
    return (
        <section className="py-20 bg-stone-50 border-y border-stone-200">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif text-foreground">
                        Field Note: BD/BI Assistant for a Law Firm (Microsoft Stack)
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-stone-500" /> Problem
                            </h3>
                            <p className="text-stone-600 leading-relaxed">
                                Lawyers have no time for Business Development. Critical relationship info is scattered across personal Outlooks, newsletters, and siloed internal knowledge bases.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Database className="w-4 h-4 text-stone-500" /> Constraints
                            </h3>
                            <ul className="space-y-1 text-stone-600 list-disc list-inside">
                                <li>Strict GDPR/Confidentiality governance.</li>
                                <li>Data cannot leave the perimeter.</li>
                                <li>No new SaaS licensing permitted.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-stone-500" /> The Build
                            </h3>
                            <p className="text-stone-600 leading-relaxed mb-3">
                                <strong>PowerApps + Azure AI + SharePoint + Internal RAG.</strong>
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                Automated "Daily Briefing" cards delivered to Teams. Each card includes one-click actions:
                            </p>
                            <div className="mt-3 grid grid-cols-1 gap-2">
                                <div className="bg-white border border-stone-200 px-3 py-2 rounded text-sm text-stone-600 flex items-center gap-2 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Draft Outreach Email
                                </div>
                                <div className="bg-white border border-stone-200 px-3 py-2 rounded text-sm text-stone-600 flex items-center gap-2 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Draft LinkedIn Post
                                </div>
                                <div className="bg-white border border-stone-200 px-3 py-2 rounded text-sm text-stone-600 flex items-center gap-2 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Notify Internal Team
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-2">
                                Status
                            </h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium border border-emerald-200">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                PoC Complete. MVP Proposal in progress.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FieldNoteLawFirm;
