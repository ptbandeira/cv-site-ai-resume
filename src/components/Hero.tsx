import { ArrowRight } from "lucide-react";
import ScrambleText from "./ScrambleText";

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

        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-300 rounded-full animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">
            AI Strategy &amp; Architecture
          </span>
        </div>

        {/* Main heading — Serif + Mono dual-font */}
        <h1 className="font-serif text-6xl md:text-8xl italic text-black tracking-tight leading-[0.9] animate-slide-up">
          Analog Wisdom.
          <br />
          <span className="not-italic text-gradient font-mono tracking-tighter">
            <ScrambleText text="Digital Scale." delay={600} duration={1400} />
          </span>
        </h1>

        {/* Subtitle — Mono, graphite */}
        <p className="font-sans text-lg leading-relaxed text-stone-800 max-w-2xl animate-slide-up stagger-1">
          The bottleneck isn't technology; it's trust. I architect{" "}
          <strong className="font-semibold text-foreground">Sovereign AI Systems</strong> that
          integrate with your existing operations—whether that's complex
          logistics, regulated healthcare, or high-volume sales. No black boxes.
          Just business logic, automated.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-slide-up stagger-2">
          <a
            href="#fit-assessment"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-sm font-medium text-lg transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 min-w-[200px] text-center"
          >
            Initialize Fit Check
          </a>
          <a
            href="#architecture"
            className="px-8 py-4 bg-white text-foreground border border-stone-200 rounded-sm font-medium text-lg transition-all hover:bg-secondary hover:border-stone-300 min-w-[200px] text-center"
          >
            View Architecture
          </a>
        </div>

        {/* Capability Badges */}
        <div className="pt-12 border-t border-stone-200 mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-foreground">AgenticOS</h4>
            <p className="text-sm font-mono text-muted-foreground">Autonomous Workflows</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-foreground">RAG pipelines</h4>
            <p className="text-sm font-mono text-muted-foreground">Enterprise Context</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-foreground">Bridge Architecture</h4>
            <p className="text-sm font-mono text-muted-foreground">Human-in-the-loop</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-foreground">Guardrails</h4>
            <p className="text-sm font-mono text-muted-foreground">Deterministic Output</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
