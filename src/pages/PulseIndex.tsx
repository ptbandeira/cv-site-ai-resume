import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Activity, TrendingUp, AlertTriangle, Zap, Target, ArrowRight } from "lucide-react";
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

interface Manifest {
  generated: string;
  totalItems: number;
  items: PulseItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  "AI Governance":    <AlertTriangle className="h-5 w-5" />,
  "Enterprise AI":    <Zap className="h-5 w-5" />,
  "Pharma AI":        <Activity className="h-5 w-5" />,
  "FinTech Compliance": <TrendingUp className="h-5 w-5" />,
  "Legal Tech":       <Target className="h-5 w-5" />,
  "Legal Technology": <Target className="h-5 w-5" />,
  "SMB Operations":   <TrendingUp className="h-5 w-5" />,
};

const categoryColors: Record<string, { color: string; iconBg: string; dot: string }> = {
  "AI Governance":    { color: "text-amber-700",   iconBg: "bg-amber-100",   dot: "bg-amber-500" },
  "Enterprise AI":    { color: "text-blue-700",    iconBg: "bg-blue-100",    dot: "bg-blue-500" },
  "Pharma AI":        { color: "text-emerald-700", iconBg: "bg-emerald-100", dot: "bg-emerald-500" },
  "FinTech Compliance": { color: "text-purple-700", iconBg: "bg-purple-100", dot: "bg-purple-500" },
  "Legal Tech":       { color: "text-rose-700",    iconBg: "bg-rose-100",    dot: "bg-rose-500" },
  "Legal Technology": { color: "text-rose-700",    iconBg: "bg-rose-100",    dot: "bg-rose-500" },
  "SMB Operations":   { color: "text-emerald-700", iconBg: "bg-emerald-100", dot: "bg-emerald-500" },
};

export default function PulseIndex() {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then((manifest: Manifest) => setPulseItems(manifest.items ?? []))
      .catch(() => setPulseItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Page header — matches site editorial style */}
          <div className="mb-16 border-b border-stone-200 pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-300 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                Intelligence Feed
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl italic text-stone-900 tracking-tight leading-tight mb-5">
              The Pulse
            </h1>
            <p className="font-mono text-base text-stone-500 max-w-xl">
              AI news decoded for executives. Cutting vendor hype with 25 years of operator experience from both sides of the table.
            </p>
          </div>

          {/* Featured Guide */}
          <div className="mb-12">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-5">
              Featured Guide
            </p>
            <a
              href="/blog/eu-ai-act-compliance.html"
              className="block bg-white border border-stone-200 rounded-sm p-8 hover:shadow-lg hover:border-stone-300 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 rounded-sm bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">
                      AI Governance
                    </span>
                    <span className="text-xs font-mono text-stone-400">·</span>
                    <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-sm font-bold">
                      Deep Dive
                    </span>
                    <span className="text-xs font-mono text-stone-400">Feb 2026</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl italic text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
                    EU AI Act: A Business Translation
                  </h2>
                  <p className="text-stone-600 leading-relaxed mb-5">
                    The high-risk deadline moved to 2027 — but two obligations are already in force. 
                    A plain-English guide for European SMBs and regulated industries.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {["EU AI Act compliance", "AI literacy training", "high-risk systems", "SMB guide"].map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded-sm font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
                    Read the guide <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Latest Analysis */}
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 mb-5">
              Latest Analysis
            </p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-stone-200 rounded-sm p-6 animate-pulse">
                    <div className="h-4 bg-stone-100 rounded w-1/4 mb-3" />
                    <div className="h-6 bg-stone-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-stone-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : pulseItems.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-stone-200 rounded-sm">
                <Activity className="h-8 w-8 text-stone-300 mx-auto mb-3" />
                <p className="font-mono text-sm text-stone-500">No analysis published yet. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pulseItems.map((insight) => {
                  const colors = categoryColors[insight.category] || { color: "text-stone-600", iconBg: "bg-stone-100", dot: "bg-stone-400" };
                  const icon = categoryIcons[insight.category] || <Activity className="h-5 w-5" />;

                  return (
                    <Link
                      to={`/pulse/${insight.slug}`}
                      key={insight.id}
                      className="block bg-white border border-stone-200 rounded-sm p-6 hover:shadow-md hover:border-stone-300 transition-all group"
                    >
                      <div className="flex items-start gap-5">
                        <div className={`flex-shrink-0 p-2.5 rounded-sm ${colors.iconBg} ${colors.color}`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${colors.color}`}>
                              {insight.category}
                            </span>
                            <span className="text-xs font-mono text-stone-400">
                              {new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          {insight.noise && (
                            <p className="text-xs font-mono text-stone-500 mb-2 truncate">
                              The noise: {insight.noise}
                            </p>
                          )}

                          <p className="font-serif text-lg italic text-stone-900 leading-snug group-hover:text-stone-700 transition-colors">
                            {insight.translation}
                          </p>

                          {insight.keywords?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {insight.keywords.slice(0, 4).map((kw, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-sm font-mono">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="flex-shrink-0 h-4 w-4 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-1 transition-all mt-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom tagline */}
          <div className="mt-16 pt-8 border-t border-stone-200">
            <p className="font-mono text-xs text-stone-400 text-center uppercase tracking-widest">
              Analysis from 25 years of operating experience · Updated when the news warrants it
            </p>
          </div>

        </div>
      </main>

      <Footer onOpenChat={() => setIsChatOpen(true)} />
      <FloatingAICTA onOpenChat={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
