import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Activity, TrendingUp, AlertTriangle, Zap, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingAICTA from "@/components/FloatingAICTA";
import AIChat from "@/components/AIChat";

interface PulseItem {
  id: string;
  slug: string;
  category: string;
  noise: string;
  translation: string;
  action: string;
  date: string;
  keywords: string[];
  sources?: Array<{ label: string; url: string }>;
}

const categoryConfig: Record<string, { gradient: string; iconBg: string; color: string; icon: React.ReactNode }> = {
  "AI Governance":      { gradient: "from-amber-500 to-orange-500",   iconBg: "bg-amber-100",   color: "text-amber-700",   icon: <AlertTriangle className="w-5 h-5" /> },
  "Enterprise AI":      { gradient: "from-blue-500 to-cyan-500",      iconBg: "bg-blue-100",    color: "text-blue-700",    icon: <Zap className="w-5 h-5" /> },
  "Legal Technology":   { gradient: "from-rose-500 to-pink-500",      iconBg: "bg-rose-100",    color: "text-rose-700",    icon: <Target className="w-5 h-5" /> },
  "Legal Tech":         { gradient: "from-rose-500 to-pink-500",      iconBg: "bg-rose-100",    color: "text-rose-700",    icon: <Target className="w-5 h-5" /> },
  "SMB Operations":     { gradient: "from-emerald-500 to-teal-500",   iconBg: "bg-emerald-100", color: "text-emerald-700", icon: <TrendingUp className="w-5 h-5" /> },
  "Pharma AI":          { gradient: "from-emerald-500 to-teal-500",   iconBg: "bg-emerald-100", color: "text-emerald-700", icon: <Activity className="w-5 h-5" /> },
  "FinTech Compliance": { gradient: "from-purple-500 to-violet-500",  iconBg: "bg-purple-100",  color: "text-purple-700",  icon: <TrendingUp className="w-5 h-5" /> },
};
const defaultConfig = {
  gradient: "from-stone-500 to-slate-500",
  iconBg: "bg-stone-100",
  color: "text-stone-700",
  icon: <Activity className="w-5 h-5" />,
};

export default function PulseDetail() {
  const { slug } = useParams();
  const [insight, setInsight] = useState<PulseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.items ?? []).find((i: PulseItem) => i.slug === slug);
        if (found) setInsight(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const cfg = insight ? (categoryConfig[insight.category] ?? defaultConfig) : defaultConfig;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back nav */}
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 text-sm font-mono text-stone-500 hover:text-stone-900 transition-colors mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            The Pulse
          </Link>

          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-1/5" />
              <div className="h-10 bg-stone-100 rounded w-4/5" />
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-full" />
              <div className="h-4 bg-stone-100 rounded w-3/4" />
            </div>
          )}

          {notFound && (
            <div className="text-center py-24 border border-dashed border-stone-200 rounded-sm">
              <Activity className="h-10 w-10 text-stone-300 mx-auto mb-4" />
              <p className="font-serif text-xl italic text-stone-700 mb-2">Insight not found</p>
              <p className="font-mono text-sm text-stone-400 mb-6">This article may have been updated or removed.</p>
              <Link to="/pulse" className="text-sm font-mono text-stone-900 underline underline-offset-4">
                ← Back to The Pulse
              </Link>
            </div>
          )}

          {insight && (
            <article>
              {/* Category + date */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm ${cfg.iconBg} ${cfg.color}`}>
                  {cfg.icon}
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">
                    {insight.category}
                  </span>
                </div>
                <span className="text-sm font-mono text-stone-400">
                  {new Date(insight.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Headline — the translation */}
              <h1 className="font-serif text-4xl md:text-5xl italic text-stone-900 tracking-tight leading-tight mb-8">
                {insight.translation}
              </h1>

              {/* The noise block */}
              {insight.noise && (
                <div className="border-l-2 border-stone-300 pl-5 mb-10">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-2">The Noise</p>
                  <p className="text-stone-600 leading-relaxed">{insight.noise}</p>
                </div>
              )}

              {/* The signal / translation block */}
              {insight.translation && (
                <div className={`border-l-2 pl-5 mb-10`} style={{ borderColor: "var(--color-primary, #1A1A1A)" }}>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-2">The Signal</p>
                  <p className="font-serif text-xl italic text-stone-800 leading-relaxed">{insight.translation}</p>
                </div>
              )}

              {/* Action */}
              {insight.action && (
                <div className="bg-stone-900 text-white rounded-sm p-6 mb-10">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-3">
                    What to do about it
                  </p>
                  <p className="font-sans text-base leading-relaxed text-stone-100">{insight.action}</p>
                </div>
              )}

              {/* Keywords */}
              {insight.keywords?.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-3">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.keywords.map((kw, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 bg-stone-100 text-stone-600 rounded-sm font-mono hover:bg-stone-200 transition-colors">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {insight.sources?.length ? (
                <div className="mb-10">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-3">Sources</p>
                  <div className="space-y-2">
                    {insight.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-stone-600 hover:text-stone-900 transition-colors underline underline-offset-4 block"
                      >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        {src.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Divider */}
              <div className="border-t border-stone-200 my-10" />

              {/* CTA */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-300 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">Work with Pedro</span>
                </div>
                <h3 className="font-serif text-2xl italic text-stone-900 mb-3">
                  Need this translated into action for your business?
                </h3>
                <p className="text-stone-600 leading-relaxed mb-6">
                  I help SMBs and regulated-industry companies turn AI developments into governed, auditable workflows — without the SaaS sprawl.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/#fit-assessment"
                    className="px-6 py-3 bg-stone-900 text-white rounded-sm font-medium text-sm hover:bg-stone-700 transition-colors"
                  >
                    Run the Fit Check →
                  </a>
                  <Link
                    to="/pulse"
                    className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-sm font-medium text-sm hover:bg-stone-50 transition-colors"
                  >
                    ← More analysis
                  </Link>
                </div>
              </div>

            </article>
          )}
        </div>
      </main>

      <Footer onOpenChat={() => setIsChatOpen(true)} />
      <FloatingAICTA onOpenChat={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
