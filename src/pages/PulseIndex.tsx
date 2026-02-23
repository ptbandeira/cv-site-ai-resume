import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
} from "lucide-react";

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
  "AI Governance": <AlertTriangle className="h-6 w-6" />,
  "Enterprise AI": <Zap className="h-6 w-6" />,
  "Pharma AI": <Activity className="h-6 w-6" />,
  "FinTech Compliance": <TrendingUp className="h-6 w-6" />,
  "Legal Tech": <Target className="h-6 w-6" />,
};

const categoryColors: Record<string, { color: string; iconBg: string }> = {
  "AI Governance": { color: "text-amber-600", iconBg: "bg-amber-100" },
  "Enterprise AI": { color: "text-blue-600", iconBg: "bg-blue-100" },
  "Pharma AI": { color: "text-emerald-600", iconBg: "bg-emerald-100" },
  "FinTech Compliance": { color: "text-purple-600", iconBg: "bg-purple-100" },
  "Legal Tech": { color: "text-rose-600", iconBg: "bg-rose-100" },
};

export default function PulseIndex() {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManifest() {
      try {
        const response = await fetch('/manifest.json');
        if (!response.ok) {
          throw new Error('Failed to fetch manifest');
        }
        const manifest: Manifest = await response.json();
        setPulseItems(manifest.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        console.error('Error fetching manifest:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchManifest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
            <p className="mt-4 text-stone-600">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <p className="text-stone-900 font-medium">Unable to load insights</p>
            <p className="text-stone-600 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (pulseItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-900 font-medium">No insights published yet</p>
            <p className="text-stone-600 text-sm mt-2">Check back soon for news analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
            The Pulse
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl">
            News analysis for executives navigating AI adoption. Cutting through
            vendor hype with experience from both sides of the table.
          </p>
        </div>

        {/* Featured Guide — pinned static content */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Featured Guide</p>
          <a
            href="/blog/eu-ai-act-compliance.html"
            className="block bg-amber-50 border border-amber-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-amber-100 text-amber-700">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">AI Governance</span>
                  <span className="text-sm text-stone-400">Feb 2026</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Deep Dive</span>
                </div>
                <p className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                  EU AI Act: A Business Translation
                </p>
                <p className="text-stone-600 leading-relaxed">
                  The high-risk deadline moved to 2027 — but two obligations are already in force. A plain-English guide for European SMBs and regulated industries.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["EU AI Act compliance", "AI literacy training", "high-risk systems", "SMB guide"].map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Latest Analysis</p>
        <div className="space-y-6">
          {pulseItems.map((insight) => {
            const colors = categoryColors[insight.category] || {
              color: "text-stone-600",
              iconBg: "bg-stone-100",
            };
            const icon = categoryIcons[insight.category] || (
              <Activity className="h-6 w-6" />
            );

            return (
              <Link
                to={`/pulse/${insight.slug}`}
                key={insight.id}
                className="block bg-white rounded-lg shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 p-3 rounded-lg ${colors.iconBg} ${colors.color}`}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-sm font-medium ${colors.color} uppercase tracking-wide`}
                      >
                        {insight.category}
                      </span>
                      <span className="text-sm text-stone-400">
                        {new Date(insight.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-base text-stone-600 font-medium mb-2">
                      {insight.noise}
                    </p>

                    <p className="text-lg text-stone-900 leading-relaxed font-serif group-hover:text-stone-700 transition-colors">
                      {insight.translation}
                    </p>

                    {insight.keywords && insight.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {insight.keywords.slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-stone-500">
          <p>Analysis from the perspective of a 50-year-old operator</p>
          <p className="mt-1">who's built analog businesses and shipped AI products</p>
        </div>
      </div>
    </div>
  );
}
