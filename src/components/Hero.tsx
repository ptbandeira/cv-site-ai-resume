import { ArrowRight } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface HeroProps {
  onOpenChat: () => void;
}

const Hero = ({ onOpenChat }: HeroProps) => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 pt-20"
      style={{ background: "#050505" }}
    >
      <div className="max-w-5xl mx-auto w-full space-y-8">

        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
            AI Strategy &amp; Architecture
          </span>
        </div>

        {/* Main heading — Serif + Mono dual-font */}
        <h1 className="text-5xl md:text-7xl tracking-tight leading-[1.1] animate-slide-up">
          <span className="font-serif font-medium text-white">Analog Wisdom.</span>
          <br />
          <span className="font-mono text-gradient">
            <ScrambleText text="Digital Scale." delay={600} duration={1400} />
          </span>
        </h1>

        {/* Subtitle — Mono, neutral-400 */}
        <p className="text-base md:text-lg font-mono text-neutral-400 max-w-2xl leading-relaxed animate-slide-up stagger-1">
          The AI revolution isn't about code; it's about context. I apply 20
          years of &ldquo;Analog&rdquo; management experience to steer
          &ldquo;Digital&rdquo; agent swarms, ensuring safety, ROI, and
          operational sanity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 animate-slide-up stagger-2">
          <button
            onClick={onOpenChat}
            className="group inline-flex items-center gap-2 px-8 py-4 btn-neumorphic text-white rounded-full font-medium"
          >
            <span>Consult The Architect</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => document.getElementById('resource-audit')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white/80 rounded-full font-medium transition-colors hover:bg-white/10"
          >
            Optimize Your Stack
          </button>
        </div>

        {/* Capability Badges */}
        <div className="pt-12 border-t border-white/10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-white/90">AgenticOS</h4>
            <p className="text-sm font-mono text-white/40">Autonomous Workflows</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-white/90">RAG pipelines</h4>
            <p className="text-sm font-mono text-white/40">Enterprise Context</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-white/90">Bridge Architecture</h4>
            <p className="text-sm font-mono text-white/40">Human-in-the-loop</p>
          </div>
          <div className="frosted-card rounded-xl p-4">
            <h4 className="font-serif text-lg text-white/90">Guardrails</h4>
            <p className="text-sm font-mono text-white/40">Deterministic Output</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
