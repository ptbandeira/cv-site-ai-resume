import { ArrowRight } from "lucide-react";
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
  isoDate?: string;
  keywords: string[];
  sources?: Array<{ label: string; url: string }>;
  image?: string;
}

function normalizeCategory(cat: string): string {
  if (cat === "Legal Technology") return "Legal Tech";
  return cat;
}

const CATEGORY_ACCENT: Record<string, string> = {
  "SMB Operations": "bg-amber-400",
  "AI Governance":  "bg-sky-400",
  "AI Tools":       "bg-emerald-400",
  "Legal Tech":     "bg-violet-400",
};

function categoryDot(cat: string) {
  return CATEGORY_ACCENT[normalizeCategory(cat)] ?? "bg-stone-400";
}

function firstSentence(text: string, maxLen = 120): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = match ? match[0] : text;
  return sentence.length > maxLen ? sentence.slice(0, maxLen).trimEnd() + "…" : sentence;
}

function formatShortDate(item: PulseItem): string {
  const d = item.isoDate ? new Date(item.isoDate) : new Date(item.date);
  if (isNaN(d.getTime())) return item.date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const InsightPulse = () => {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/manifest.json')
      .then(r => r.json())
      .then(data => {
        const withContent = (data.items ?? []).filter((i: PulseItem) => i.noise && i.translation);
        setPulseItems(withContent.slice(0, 3));
      })
      .catch(() => setPulseItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="insight-pulse" className="py-24 px-6 border-t border-stone-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="h-3 w-32 bg-stone-100 rounded animate-pulse mb-4" />
            <div className="h-8 w-64 bg-stone-100 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-stone-100 rounded-sm p-5 animate-pulse">
                <div className="h-2.5 w-20 bg-stone-100 rounded mb-3" />
                <div className="h-5 w-3/4 bg-stone-100 rounded mb-2" />
                <div className="h-3.5 w-full bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pulseItems.length === 0) return null;

  return (
    <section id="insight-pulse" className="py-24 px-6 border-t border-stone-100">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Signal intelligence
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-3">
              The Pulse
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Cutting through AI noise — analysis for operators, not enthusiasts.
            </p>
          </div>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {pulseItems.map((item) => {
            const cat = normalizeCategory(item.category);
            return (
              <Link
                to={`/pulse/${item.slug}`}
                key={item.id}
                className="group flex items-start gap-5 border border-stone-150 hover:border-stone-300 bg-white hover:bg-stone-50/60 rounded-sm p-5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  {/* Category + date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${categoryDot(cat)}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      {cat}
                    </span>
                    <span className="text-stone-200">·</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {formatShortDate(item)}
                    </span>
                  </div>

                  {/* Title — actual news */}
                  <h3 className="font-serif text-base md:text-lg font-medium text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
                    {firstSentence(item.noise, 140)}
                  </h3>

                  {/* Translation — our take */}
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {firstSentence(item.translation, 120)}
                  </p>
                </div>
                <ArrowRight className="flex-shrink-0 w-4 h-4 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all mt-3" />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-sm hover:bg-stone-700 transition-colors"
          >
            Read all analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsightPulse;
