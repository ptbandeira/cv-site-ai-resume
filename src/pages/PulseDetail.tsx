import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Activity, TrendingUp, AlertTriangle, Zap, Target, Home } from "lucide-react";

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

const categoryConfig: Record<string, { gradient: string; iconBg: string; icon: React.ReactNode }> = {
  "AI Governance":      { gradient: "from-amber-500 to-orange-500",   iconBg: "bg-amber-100 text-amber-700",    icon: <AlertTriangle className="w-6 h-6" /> },
  "Enterprise AI":      { gradient: "from-blue-500 to-cyan-500",      iconBg: "bg-blue-100 text-blue-700",      icon: <Zap className="w-6 h-6" /> },
  "Law Firms":          { gradient: "from-rose-500 to-pink-500",      iconBg: "bg-rose-100 text-rose-700",      icon: <Target className="w-6 h-6" /> },
  "Legal Technology":   { gradient: "from-rose-500 to-pink-500",      iconBg: "bg-rose-100 text-rose-700",      icon: <Target className="w-6 h-6" /> },
  "SMB Operations":     { gradient: "from-emerald-500 to-teal-500",   iconBg: "bg-emerald-100 text-emerald-700", icon: <TrendingUp className="w-6 h-6" /> },
  "Data Sovereignty":   { gradient: "from-purple-500 to-violet-500",  iconBg: "bg-purple-100 text-purple-700",  icon: <Activity className="w-6 h-6" /> },
  "Pharma AI":          { gradient: "from-emerald-500 to-teal-500",   iconBg: "bg-emerald-100 text-emerald-700", icon: <Activity className="w-6 h-6" /> },
  "FinTech Compliance": { gradient: "from-purple-500 to-violet-500",  iconBg: "bg-purple-100 text-purple-700",  icon: <TrendingUp className="w-6 h-6" /> },
};
const defaultConfig = { gradient: "from-stone-500 to-slate-500", iconBg: "bg-stone-100 text-stone-700", icon: <Activity className="w-6 h-6" /> };

const PulseDetail = () => {
  const { slug } = useParams();
  const [insight, setInsight] = useState<PulseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then(data => {
        const found = (data.items ?? []).find((i: PulseItem) => i.slug === slug);
        if (found) {
          setInsight(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const cfg = insight ? (categoryConfig[insight.category] ?? defaultConfig) : defaultConfig;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900" />
      </div>
    );
  }

  if (notFound || !insight) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600 text-lg">Article not found.</p>
        <Link to="/pulse" className="text-primary underline underline-offset-4">← Back to Pulse</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/pulse" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" />
            <span className="font-medium text-stone-700 group-hover:text-primary transition-colors text-sm">
              Back to Pulse
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Analog AI</span>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-6 pt-28 pb-20 max-w-3xl">
        <div className="bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${cfg.gradient}`} />

          <div className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-full ${cfg.iconBg} flex items-center justify-center`}>
                {cfg.icon}
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1">
                  {insight.category}
                </span>
                <span className="text-sm font-mono text-stone-500 border border-stone-200 rounded-full px-3 py-1">
                  {insight.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-10">
              {/* The Noise */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-bold mb-3">
                  The Noise (What everyone is saying)
                </h3>
                <p className="text-xl md:text-2xl text-stone-600 font-medium leading-relaxed">
                  "{insight.noise}"
                </p>
              </div>

              {/* The Translation */}
              {insight.translation && (
                <div className="p-6 bg-primary/5 rounded-xl border-l-4 border-primary">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-3">
                    The Translation (Why it matters)
                  </h3>
                  <p className="text-xl md:text-2xl text-stone-900 font-serif leading-relaxed">
                    {insight.translation}
                  </p>
                </div>
              )}

              {/* The Action */}
              {insight.action && (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-3">
                    The Action (What we do)
                  </h3>
                  <p className="text-lg text-emerald-900/80 leading-relaxed font-medium">
                    {insight.action}
                  </p>
                </div>
              )}
            </div>

            {/* Keywords */}
            {insight.keywords && insight.keywords.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {insight.keywords.map((k, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-stone-100 text-stone-600 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            )}

            {/* Sources */}
            {insight.sources && insight.sources.length > 0 && (
              <div className="mt-10 pt-8 border-t border-stone-100">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-4">
                  Sources
                </h4>
                <div className="flex flex-wrap gap-4">
                  {insight.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/70 transition-colors underline decoration-primary/30 underline-offset-4"
                    >
                      {source.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/#fit-assessment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium text-sm"
          >
            Work with Pedro →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PulseDetail;
