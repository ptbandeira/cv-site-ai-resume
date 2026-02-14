import { X, Check } from "lucide-react";

const FilterSection = () => {
    return (
        <section className="py-24 bg-white border-y border-stone-200">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">

                    {/* Left Column: Not for you */}
                    <div className="space-y-8 animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                        <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-200 pb-4">
                            Not for you
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-stone-600">
                                <X className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0" />
                                <span>If you want a cheap developer to "build an app"</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-600">
                                <X className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0" />
                                <span>If you want a ChatGPT wrapper with no governance</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-600">
                                <X className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0" />
                                <span>If you want AI to replace humans and dodge accountability</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-600">
                                <X className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0" />
                                <span>If you want to send sensitive data to public APIs without controls</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: For you */}
                    <div className="space-y-8 animate-fade-in opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                        <h3 className="font-serif text-2xl text-stone-900 border-b border-primary/20 pb-4">
                            For you
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-stone-900 font-medium">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>If you’re accountable for risk, compliance, and ROI</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-900 font-medium">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>If pilots aren’t landing in production</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-900 font-medium">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>If your team is overwhelmed by tool churn</span>
                            </li>
                            <li className="flex items-start gap-4 text-stone-900 font-medium">
                                <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span>If you need a sane plan and an operator to execute it</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FilterSection;
