import { Check } from "lucide-react";

const AdultInTheRoom = () => {
    const qualifications = [
        "20+ years running business growth, partnerships, and commercial operations across Pharma/Healthcare, Digital Platforms, and Retail.",
        "Scaled and operated real businesses with P&L consequences (not slide decks).",
        "Built a pharmacy chain from 1 location to 18, growing headcount from 5 to 120.",
        "Worked in the Microsoft ecosystem (Dynamics 365) and enterprise operating realities.",
        "Law-trained: I think in risk, liability, and audit trails.",
        "Based in Warsaw, working EU/UK time zones. Languages: Portuguese, English, Spanish, French (Italian working)."
    ];

    return (
        <section className="py-24 bg-white border-y border-stone-200">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-12 text-center">
                    Why I’m the Adult in the AI Room
                </h2>

                <div className="grid gap-6">
                    {qualifications.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-stone-600" />
                            </div>
                            <p className="text-lg text-stone-700 leading-relaxed">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-xl md:text-2xl font-serif italic text-stone-900">
                        "I don’t sell hype. I sell clarity and governed execution."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AdultInTheRoom;
