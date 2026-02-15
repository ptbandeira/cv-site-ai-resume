import { useState } from "react";
import { X, ArrowRight, CheckCircle2, AlertTriangle, ChevronRight, RefreshCcw, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "industry" | "sensitivity" | "goal" | "result";

interface TriageState {
  industry: string;
  sensitivity: string;
  goal: string;
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
    goal: "",
  });

  const handleSelect = (key: keyof TriageState, value: string, nextStep: Step) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(nextStep), 250); // Small delay for "click feel"
  };

  const reset = () => {
    setStep("industry");
    setState({ industry: "", sensitivity: "", goal: "" });
  };

  const generateEmailLink = (title: string) => {
    const subject = getSubject(title);
    const body = getBody(title);
    return `mailto:pedrobandeira@me.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getSubject = (title: string) => {
    switch (title) {
      case "48-Hour Reality Test":
        return `Request: 48-Hour Reality Test (${state.industry})`;
      case "Sovereign AI Architecture":
        return `Inquiry: Sovereign AI Architecture (${state.industry})`;
      default:
        return `Booking: Executive Strategy Triage (${state.industry})`;
    }
  };

  const getBody = (title: string) => {
    const context = `Context:\n- Industry: ${state.industry}\n- Sensitivity: ${state.sensitivity}\n- Goal: ${state.goal}`;

    switch (title) {
      case "48-Hour Reality Test":
        return `Hi Pedro,\n\nI used your AI Triage tool and it recommended a 48-Hour Reality Test.\n\n${context}\n\nI'd like to schedule a brief chat to see if this fits.\n\nBest,\n[Name]`;
      case "Sovereign AI Architecture":
        return `Hi Pedro,\n\nI need to keep my data inside my perimeter. Your AI tool recommended the Sovereign Architecture approach.\n\n${context}\n\nWhen can we discuss this?\n\nBest,\n[Name]`;
      default:
        return `Hi Pedro,\n\nI'm looking for high-level governance and strategy. Your AI recommended the Executive Triage.\n\n${context}\n\nPlease let me know your availability.\n\nBest,\n[Name]`;
    }
  };

  const getRecommendation = () => {
    // LOGIC:
    // 1. Reality Test: "Stop pilot sprawl" OR Industry="Other" OR Sensitivity="Public"
    // 2. Sovereign Architecture: "Keep data inside perimeter"
    // 3. Executive Triage: Everything else (Exec reporting, Regulated/Pharma/Law/Finance)

    // Check for Reality Test Triggers
    if (
      state.goal === "Stop pilot sprawl" ||
      state.industry === "Other" ||
      state.sensitivity === "Public"
    ) {
      const title = "48-Hour Reality Test";
      return {
        title,
        description: "You need validation before scale. Don't build a cathedral when a tent will do.",
        bullets: [
          "Validate your use-case with a working MVP in 2 days",
          "Fail fast and cheap if the idea doesn't work",
          "Get a clear Build/Buy/Kill decision memo"
        ],
        cta: "Request Reality Test",
        action: () => window.location.href = generateEmailLink(title),
        subject: getSubject(title),
        body: getBody(title),
        isUrgent: false
      };
    }

    // Check for Sovereign Architecture Trigger
    if (state.goal === "Keep data inside perimeter") {
      const title = "Sovereign AI Architecture";
      return {
        title,
        description: "Your IP is the asset. Don't leak it to public models.",
        bullets: [
          "Local-first models (Llama 4 / DeepSeek) on your metal",
          "Full data sovereignty - no API calls leaving your VPC",
          "Audit trails for every agentic decision"
        ],
        cta: "Book Executive Triage",
        action: () => window.location.href = generateEmailLink(title),
        subject: getSubject(title),
        body: getBody(title),
        isUrgent: true
      };
    }

    // Default to Executive Triage (Strategy/Governance)
    const title = "Executive Strategy Triage";
    return {
      title,
      description: "You're dealing with high stakes. You need governance, not just code.",
      bullets: [
        "Boardroom-ready AI strategy & reporting",
        "Human-in-the-Loop governance frameworks",
        "Pilot-to-production execution playbook"
      ],
      cta: "Book Executive Triage",
      action: () => window.location.href = generateEmailLink(title),
      subject: getSubject(title),
      body: getBody(title),
      isUrgent: true
    };
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
                <h3 className="text-2xl font-serif text-foreground mt-1">Data sensitivity?</h3>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Public", sub: "Marketing, SEO, Website" },
                  { label: "Internal", sub: "Knowledge Base, Slack, Ops" },
                  { label: "Regulated", sub: "Patient Data, Contracts, PII" }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect("sensitivity", opt.label, "goal")}
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

          {/* STEP 3: GOAL */}
          {step === "goal" && (
            <div className="animate-fade-in space-y-6 flex-1">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Step 3 of 3</span>
                <h3 className="text-2xl font-serif text-foreground mt-1">What's the main goal?</h3>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Stop pilot sprawl", sub: "Too many toys, no value" },
                  { label: "Keep data inside perimeter", sub: "Security & Sovereignty" },
                  { label: "Exec reporting + governance", sub: "Strategy & Board Buy-in" }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect("goal", opt.label, "result")}
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
                  onClick={recommendation.action}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 text-white rounded-xl font-medium transition-all hover:scale-[1.02] shadow-xl shadow-stone-200",
                    recommendation.isUrgent ? "bg-[#1A1A1A] hover:bg-stone-800" : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {recommendation.cta} <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const text = `Subject: ${recommendation.subject}\n\n${recommendation.body}`;
                    navigator.clipboard.writeText(text);
                    toast.success("Request copied to clipboard");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-stone-200 text-stone-700 rounded-xl font-medium transition-all hover:bg-stone-50 hover:border-stone-300"
                >
                  <Copy className="w-4 h-4" />
                  Copy Request
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
            This tool does not provide legal advice. Don’t paste client confidential data.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIChat;
