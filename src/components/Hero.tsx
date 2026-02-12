import { ArrowRight } from "lucide-react";

interface HeroProps {
  onOpenChat: () => void;
}

const Hero = ({ onOpenChat }: HeroProps) => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 pt-20 bg-background"
    >
      <div className="max-w-5xl mx-auto w-full space-y-8">

        {/* Anti-Hype Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 rounded-full animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-medium text-foreground uppercase tracking-widest">
            AI Strategy & Architecture
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-foreground tracking-tight leading-[1.1] animate-slide-up">
          Dismantling AI Magic. <br />
          <span className="text-muted-foreground">Building Business Utility.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl font-light leading-relaxed animate-slide-up stagger-1">
          No Magic. Just Engineering. I bridge the AI Implementation Gap for
          regulated industries by replacing &ldquo;SaaS Taxes&rdquo; with owned assets
          and Human-in-the-Loop governance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 animate-slide-up stagger-2">
          <button
            onClick={onOpenChat}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            <span>Consult The Architect</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => document.getElementById('resource-audit')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-medium transition-colors hover:bg-secondary/80"
          >
            Optimize Your Stack
          </button>
        </div>

        {/* Social Proof / Capability Badges */}
        <div className="pt-12 border-t border-border mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
          <div>
            <h4 className="font-serif text-lg text-foreground">AgenticOS</h4>
            <p className="text-sm text-muted-foreground">Autonomous Workflows</p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-foreground">RAG pipelines</h4>
            <p className="text-sm text-muted-foreground">Enterprise Context</p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-foreground">Bridge Architecture</h4>
            <p className="text-sm text-muted-foreground">Human-in-the-loop</p>
          </div>
          <div>
            <h4 className="font-serif text-lg text-foreground">Guardrails</h4>
            <p className="text-sm text-muted-foreground">Deterministic Output</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
