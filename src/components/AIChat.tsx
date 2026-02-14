import { useState, useRef, useEffect } from "react";
import { X, ArrowRight, CheckCircle2, AlertTriangle, ChevronRight, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "industry" | "sensitivity" | "need" | "result";

interface TriageState {
  industry: string;
  sensitivity: string;
  need: string;
}

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  if (!isOpen) return null;
  return <TriageContent isOpen={isOpen} onClose={onClose} />;
};

const TriageContent = ({ isOpen, onClose }: AIChatProps) => {
  const [step, setStep] = useState<Step>("industry");
  const [state, setState] = useState<TriageState>({
    industry: "",
    sensitivity: "",
    need: "",
  });

  const handleSelect = (key: keyof TriageState, value: string, nextStep: Step) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(nextStep), 250); // Small delay for "click feel"
  };

  const reset = () => {
    setStep("industry");
    setState({ industry: "", sensitivity: "", need: "" });
  };

  const scrollToContact = () => {
    onClose();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getRecommendation = () => {
    switch (state.need) {
      case "Clarity fast":
        return {
          title: "48-Hour Reality Test",
          description: "Executives don't need more demos. They need to see where AI breaks before it hits customers.",
          bullets: [
            "Validate your idea with a working MVP in 2 days",
            "Identify hallucinations and risks early",
            "Get a clear Build/Buy/Kill decision memo"
          ]
        };
      case "Safe architecture":
        return {
          title: "Sovereign AI Architecture",
          description: "The valuable part isn't code. It's the operating logic and controls around it.",
          bullets: [
            "Local-first models for full data privacy",
            "Audit trails for every AI decision",
            "Vendor-neutral design (no lock-in)"
          ]
        };
      case "Leadership":
        return {
          title: "Fractional Chief AI Operator",
          description: "AI only matters if it changes cost, cycle time, or risk exposure.",
          bullets: [
            "Boardroom-ready strategy & reporting",
            "Pilot-to-production execution playbook",
            "Training & governance for your team"
          ]
        };
      default:
        // Fallback
        return {
          title: "48-Hour Reality Test",
          description: "Start with a rapid validation sprint.",
          bullets: [
            "Validate your idea with a working MVP",
            "Identify risks early",
            "Get a clear decision memo"
          ]
        };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl flex flex-col shadow-2xl animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white font-serif font-bold border border-stone-700">
              P
            </div>
            <div>
              <p className="text-foreground font-medium">Talk to ‘AI Pedro’</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Guided Triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[400px] flex flex-col">

          {/* STEP 1: INDUSTRY */}
          {step === "industry" && (
            <div className="animate-fade-in space-y-6 flex-1">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Step 1 of 3</span>
                <h3 className="text-2xl font-serif text-foreground mt-1">What’s your industry?</h3>
              </div>
              <div className="grid gap-3">
                {["Pharma", "Law", "Logistics", "Finance", "Other"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect("industry", opt, "sensitivity")}
                    className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50 transition-all group text-left"
                  >
                    <span className="font-medium text-stone-700">{opt}</span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SENSITIVITY */}
          {step === "sensitivity" && (
            <div className="animate-fade-in space-y-6 flex-1">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Step 2 of 3</span>
                <h3 className="text-2xl font-serif text-foreground mt-1">How sensitive is your data?</h3>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Public", sub: "Websites, Marketing, SEO" },
                  { label: "Internal", sub: "Operations, Slack, Knowledge Base" },
                  { label: "Regulated", sub: "Patient Data, Contracts, Financials" }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect("sensitivity", opt.label, "need")}
                    className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50 transition-all group text-left"
                  >
                    <div>
                      <span className="font-medium text-stone-700 block">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.sub}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: NEED */}
          {step === "need" && (
            <div className="animate-fade-in space-y-6 flex-1">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Step 3 of 3</span>
                <h3 className="text-2xl font-serif text-foreground mt-1">What do you need right now?</h3>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Clarity fast", sub: "Stop wasting time" },
                  { label: "Safe architecture", sub: "Data privacy + auditability" },
                  { label: "Leadership", sub: "Program management + execution" }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect("need", opt.label, "result")}
                    className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-primary/50 hover:bg-stone-50 transition-all group text-left"
                  >
                    <div>
                      <span className="font-medium text-stone-700 block">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.sub}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RESULT */}
          {step === "result" && (
            <div className="animate-fade-in flex flex-col flex-1 h-full">
              <div className="mb-6">
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider font-medium">Recommendation</span>
                <h3 className="text-3xl font-serif text-foreground mt-3 mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{recommendation.description}</p>
              </div>

              <div className="bg-stone-50 border border-stone-100 rounded-xl p-5 mb-8">
                <ul className="space-y-3">
                  {recommendation.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-700 font-medium text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={scrollToContact}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-stone-800 transition-all hover:scale-[1.02] shadow-xl shadow-stone-200"
                >
                  Send this to Pedro <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-stone-50 border-t border-border text-center space-y-2">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3 h-3 opacity-50" />
            No legal advice. No medical advice. This is triage for scoping work.
          </p>
          <div className="text-[10px] text-muted-foreground opacity-80 flex flex-col gap-0.5">
            <span className="font-medium text-stone-600">Privacy:</span>
            <span>• Don’t paste confidential client data.</span>
            <span>• Text is used only to generate your response.</span>
            <span>• If storage is enabled, it’s opt-in and stated explicitly.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChat;
