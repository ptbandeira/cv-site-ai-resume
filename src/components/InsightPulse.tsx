import { ArrowRight, Activity, TrendingUp, AlertTriangle, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

const categoryConfig: Record<string, { color: string; iconBg: string; gradient: string; icon: React.ReactNode }> = {
  "AI Governance":      { color: "text-amber-700",   iconBg: "bg-amber-100 text-amber-700",   gradient: "from-amber-500 to-orange-500",   icon: <AlertTriangle className="w-5 h-5" /> },
  "Enterprise AI":      { color: "text-blue-700",    iconBg: "bg-blue-100 text-blue-700",     gradient: "from-blue-500 to-cyan-500",      icon: <Zap className="w-5 h-5" /> },
  "Law Firms":          { color: "text-rose-700",    iconBg: "bg-rose-100 text-rose-700",     gradient: "from-rose-500 to-pink-500",      icon: <Target className="w-5 h-5" /> },
  "Legal Technology":   { color: "text-rose-700",    iconBg: "bg-rose-100 text-rose-700",     gradient: "from-rose-500 to-pink-500",      icon: <Target className="w-5 h-5" /> },
  "SMB Operations":     { color: "text-emerald-700", iconBg: "bg-emerald-100 text-emerald-700", gradient: "from-emerald-500 to-teal-500", icon: <TrendingUp className="w-5 h-5" /> },
  "Data Sovereignty":   { color: "text-purple-700",  iconBg: "bg-purple-100 text-purple-700", gradient: "from-purple-500 to-violet-500",  icon: <Activity className="w-5 h-5" /> },
  "Pharma AI":          { color: "text-emerald-700", iconBg: "bg-emerald-100 text-emerald-700", gradient: "from-emerald-500 to-teal-500", icon: <Activity className="w-5 h-5" /> },
  "FinTech Compliance": { color: "text-purple-700",  iconBg: "bg-purple-100 text-purple-700", gradient: "from-purple-500 to-violet-500",  icon: <TrendingUp className="w-5 h-5" /> },
};

const defaultConfig = { color: "text-stone-700", iconBg: "bg-stone-100 text-stone-700", gradient: "from-stone-500 to-slate-500", icon: <Activity className="w-5 h-5" /> };

const InsightPulse = () => {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then(data => {
        // Filter to items with real content, show latest 2
        const withContent = (data.items ?? []).filter((i: PulseItem) => i.noise && i.translation);
        setPulseItems(withContent.slice(0, 2));
      })
      .catch(() => setPulseItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="insight-pulse" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">The 60-Day Pulse</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-1.5 bg-stone-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="h-3 bg-stone-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pulseItems.length === 0) {
    return null; // Hide section if no published content yet
  }

  return (
    <section id="insight-pulse" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              The 60-Day Pulse
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Not a blog. A translation layer — cutting through AI noise to show what actually matters for your business.
            </p>
          </div>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 hover:border-primary/50 text-stone-600 hover:text-primary rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow-md whitespace-nowrap"
          >
            View all Pulse notes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {pulseItems.map((insight) => {
            const cfg = categoryConfig[insight.category] ?? defaultConfig;
            return (
              <Link
                to={`/pulse/${insight.slug}`}
                key={insight.id}
                className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Color bar */}
                <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + Date */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center`}>
                      {cfg.icon}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                      {insight.date}
                    </span>
                  </div>

                  {/* The Noise */}
                  <div className="mb-4">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold mb-1.5">
                      The Noise
                    </p>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {insight.noise}
                    </p>
                  </div>

                  {/* The Translation */}
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-1.5">
                      The Translation
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {insight.translation}
                    </p>
                  </div>

                  {/* The Action */}
                  {insight.action && (
                    <div className="mt-auto p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1.5">
                        The Action
                      </p>
                      <p className="text-sm text-emerald-800/80 leading-relaxed">
                        {insight.action}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsightPulse;
