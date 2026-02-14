import { useState, useEffect, useRef } from "react";
import { Users, Clock, TrendingUp, Briefcase, Beaker, Table2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Preset = {
    id: string;
    label: string;
    icon: React.ReactNode;
    costPerHour: number;
    automationPct: number;
    buildCost: number;
    description: string;
};

const presets: Preset[] = [
    {
        id: "legal",
        label: "Legal / Advisory",
        icon: <Briefcase className="w-4 h-4" />,
        costPerHour: 120,
        automationPct: 55,
        buildCost: 25000,
        description: "High hourly value — complex docs lower automation ceiling",
    },
    {
        id: "pharma",
        label: "Pharma / Regulated",
        icon: <Beaker className="w-4 h-4" />,
        costPerHour: 90,
        automationPct: 65,
        buildCost: 20000,
        description: "Compliance workflows are often highly repeatable. Compliance sign-off stays with your team; the system produces audit trails and recommendations.",
    },
    {
        id: "backoffice",
        label: "Back-office / Admin",
        icon: <Table2 className="w-4 h-4" />,
        costPerHour: 45,
        automationPct: 80,
        buildCost: 12000,
        description: "Structured Excel/Outlook tasks are highly automatable",
    },
];

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

const SavingsCalculator = () => {
    const [activePreset, setActivePreset] = useState<string>("legal");
    const [employees, setEmployees] = useState(15);
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [captureRate, setCaptureRate] = useState(35); // Default 35% BS reduction

    const preset = presets.find((p) => p.id === activePreset)!;

    // Calculates
    const weeklyCost = employees * hoursPerWeek * preset.costPerHour;
    const annualCapacityValue = weeklyCost * 52; // Gross capacity value
    const automatedHoursWeekly = Math.round(employees * hoursPerWeek * (preset.automationPct / 100));
    const automatedHoursAnnual = automatedHoursWeekly * 52;

    // Realized Value (The "Non-BS" number)
    const valueCaptured = Math.round(annualCapacityValue * (preset.automationPct / 100) * (captureRate / 100));

    // ROI based on Captured Value
    const year1ROI = Math.round(((valueCaptured - preset.buildCost) / preset.buildCost) * 100);
    const netReturn = valueCaptured - preset.buildCost;

    // Animated counter for Value Captured
    const [displayValue, setDisplayValue] = useState(valueCaptured);
    const animRef = useRef<number>();
    const prevTarget = useRef(valueCaptured);

    useEffect(() => {
        const start = prevTarget.current;
        const end = valueCaptured;
        prevTarget.current = end;
        const duration = 600;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            setDisplayValue(Math.round(start + (end - start) * eased));
            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            }
        };

        if (animRef.current) cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [valueCaptured]);

    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    {/* Context Block */}
                    <div className="p-4 bg-stone-100/50 rounded-lg border border-stone-200 mb-8 max-w-3xl">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                            <div className="flex-1">
                                <span className="font-mono text-xs uppercase text-stone-500 font-bold block mb-1">Why this exists</span>
                                <p className="text-stone-700 font-medium leading-relaxed">
                                    “AI only matters if it changes cost, cycle time, or risk exposure.”
                                </p>
                            </div>
                            <div className="md:border-l md:border-stone-300 md:pl-4 min-w-[200px]">
                                <span className="font-mono text-xs uppercase text-stone-500 font-bold block mb-1">Mapped Offer</span>
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>Fractional Chief AI Operator</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
                        ROI Calculator
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        How much is your team losing to Excel and Outlook? Pick your
                        industry, adjust the sliders, see instant ROI.
                    </p>
                </div>

                {/* Industry Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {presets.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setActivePreset(p.id)}
                            className={`bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-xl p-4 text-left transition-all duration-300 border-2 ${activePreset === p.id
                                ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                                : "border-stone-200 hover:border-stone-300 hover:shadow-md"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${activePreset === p.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground"
                                        }`}
                                >
                                    {p.icon}
                                </div>
                                <span className="font-medium text-sm text-foreground">
                                    {p.label}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                {p.description}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    €{p.costPerHour}/hr
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    {p.automationPct}% auto
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Calculator Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl p-6 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    Number of Employees
                                </div>
                                <span className="font-mono text-lg font-bold text-primary">
                                    {employees}
                                </span>
                            </div>
                            <Slider
                                value={[employees]}
                                onValueChange={([v]) => setEmployees(v)}
                                min={5}
                                max={200}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-1 text-[10px] font-mono text-muted-foreground">
                                <span>5</span>
                                <span>200</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    Avg Hours in Excel/Outlook per Week
                                </div>
                                <span className="font-mono text-lg font-bold text-primary">
                                    {hoursPerWeek}h
                                </span>
                            </div>
                            <Slider
                                value={[hoursPerWeek]}
                                onValueChange={([v]) => setHoursPerWeek(v)}
                                min={2}
                                max={40}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-1 text-[10px] font-mono text-muted-foreground">
                                <span>2h</span>
                                <span>40h</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                    Value Capture Rate
                                </div>
                                <span className="font-mono text-lg font-bold text-primary">
                                    {captureRate}%
                                </span>
                            </div>
                            <Slider
                                value={[captureRate]}
                                onValueChange={([v]) => setCaptureRate(v)}
                                min={10}
                                max={80}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-1 text-[10px] font-mono text-muted-foreground">
                                <span>10% (Conservative)</span>
                                <span>80% (Aggressive)</span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                                Most calculators assume 100% efficiency. We assume you won't fire people, but reuse time with friction. 35% is realistic.
                            </p>
                        </div>

                        {/* Assumptions */}
                        <div className="pt-4 border-t border-border space-y-1">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                                Assumptions ({preset.label})
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Cost: <span className="text-foreground font-semibold">€{preset.costPerHour}/hr</span> •
                                Automation: <span className="text-foreground font-semibold">{preset.automationPct}%</span> •
                                Build: <span className="text-foreground font-semibold">€{preset.buildCost.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {/* Main counter */}
                        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-primary/50" />
                            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-3">
                                Annual Value Captured (Realized)
                            </p>
                            <p className="text-5xl md:text-6xl font-serif text-emerald-600 font-medium tracking-tight">
                                <span className="text-3xl mr-1">€</span>
                                {displayValue.toLocaleString()}
                            </p>
                            <p className="text-sm text-stone-500 mt-3 font-medium">
                                based on {captureRate}% capture of recovered capacity
                            </p>
                        </div>

                        {/* Sub-cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-xl p-5 text-center">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-2">
                                    Capacity Recovered
                                </p>
                                <p className="text-xl font-serif text-foreground">
                                    {automatedHoursAnnual.toLocaleString()} hrs/yr
                                </p>
                                <p className="text-[10px] text-stone-400 mt-1">
                                    ({automatedHoursWeekly} hrs/week)
                                </p>
                            </div>
                            <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-xl p-5 text-center">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-2">
                                    Capacity Value (Gross)
                                </p>
                                <p className="text-xl font-serif text-stone-400 line-through decoration-stone-300">
                                    €{Math.round(annualCapacityValue * (preset.automationPct / 100)).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-stone-400 mt-1">
                                    Theoretical Max
                                </p>
                            </div>
                        </div>

                        {/* Net return */}
                        <div className={`rounded-xl p-4 text-center border ${netReturn > 0
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-red-50 border-red-200"
                            }`}>
                            <div className="grid grid-cols-2 gap-4 divide-x divide-stone-200/50">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                                        Year 1 ROI
                                    </p>
                                    <p className={`text-xl font-serif font-medium ${year1ROI > 0 ? "text-emerald-700" : "text-red-700"}`}>
                                        {year1ROI > 0 ? "+" : ""}{year1ROI}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                                        Net Return
                                    </p>
                                    <p className={`text-xl font-serif font-medium ${netReturn > 0 ? "text-emerald-700" : "text-red-700"}`}>
                                        €{netReturn.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] font-mono text-stone-400 text-center mt-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
                            <strong>Formula:</strong> Value Captured = (Capacity Value) × (Capture Rate).<br />
                            We discount theoretical savings because real-world friction exists.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SavingsCalculator;
