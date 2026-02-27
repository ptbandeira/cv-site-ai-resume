import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
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
  isoDate?: string;
  keywords: string[];
  sources?: Array<{ label: string; url: string }>;
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

function formatDate(item: PulseItem): string {
  if (item.isoDate) {
    return new Date(item.isoDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  }
  const d = new Date(item.date);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  return item.date;
}

function firstSentence(text: string, maxLen = 120): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = match ? match[0] : text;
  return sentence.length > maxLen ? sentence.slice(0, maxLen).trimEnd() + "…" : sentence;
}

export default function PulseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [insight, setInsight] = useState<PulseItem | null>(null);
  const [related, setRelated] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch("/manifest.json")
      .then((r) => r.json())
      .then((data) => {
        const items: PulseItem[] = data.items ?? [];
        const found = items.find((i) => i.slug === slug);
        if (found) {
          setInsight(found);
          // Related: same category, exclude current, max 3
          const sameCategory = items.filter(
            (i) =>
              i.slug !== slug &&
              normalizeCategory(i.category) === normalizeCategory(found.category)
          );
          setRelated(sameCategory.slice(0, 3));
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Inject per-article meta tags for SEO and social sharing
  useEffect(() => {
    if (!insight) return;

    const BASE = "https://analog-ai.vercel.app";
    const articleUrl = `${BASE}/pulse/${insight.slug}`;
    const articleTitle = `${insight.noise} | Analog AI Pulse`;
    const articleDesc = firstSentence(insight.translation, 155);

    // Page title
    const prevTitle = document.title;
    document.title = articleTitle;

    // Helper: upsert a <meta> tag
    function setMeta(selector: string, attr: string, value: string) {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = selector.replace("meta[", "").replace("]", "").split('="');
        el.setAttribute(attrName, attrValue?.replace('"', "") ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]', "content", articleDesc);
    setMeta('meta[property="og:title"]', "content", articleTitle);
    setMeta('meta[property="og:description"]', "content", articleDesc);
    setMeta('meta[property="og:url"]', "content", articleUrl);
    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[name="twitter:title"]', "content", articleTitle);
    setMeta('meta[name="twitter:description"]', "content", articleDesc);

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = articleUrl;

    return () => {
      // Restore homepage defaults on unmount
      document.title = "AI Governance Consultant for Law Firms & SMBs in Europe | Analog AI";
      setMeta('meta[name="description"]', "content", "AI governance consulting for senior leaders in regulated industries across Europe. Fractional CAIO services — EU AI Act ready, private data architecture, no vendor lock-in.");
      setMeta('meta[property="og:title"]', "content", "AI Governance Consultant for European Law Firms & SMBs | Analog AI");
      setMeta('meta[property="og:description"]', "content", "Helping senior leaders in regulated industries turn AI hype into governed, private, auditable workflows. Based in Warsaw. Active across Europe.");
      setMeta('meta[property="og:url"]', "content", `${BASE}/`);
      setMeta('meta[property="og:type"]', "content", "website");
      setMeta('meta[name="twitter:title"]', "content", "AI Governance Consultant for European Law Firms & SMBs | Analog AI");
      setMeta('meta[name="twitter:description"]', "content", "Helping senior leaders in regulated industries turn AI hype into governed, private, auditable workflows. Based in Warsaw. Active across Europe.");
      const can = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (can) can.href = `${BASE}/`;
    };
  }, [insight]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />

      <main className="pt-36 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            The Pulse
          </Link>

          {/* ── Loading ── */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-2.5 w-32 bg-stone-100 rounded" />
              <div className="h-8 w-3/4 bg-stone-100 rounded" />
              <div className="h-px w-full bg-stone-100" />
              {[1, 2, 3].map(n => (
                <div key={n} className="space-y-2">
                  <div className="h-3 w-24 bg-stone-100 rounded" />
                  <div className="h-4 w-full bg-stone-100 rounded" />
                  <div className="h-4 w-5/6 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* ── Not found ── */}
          {!loading && (notFound || !insight) && (
            <div className="text-center py-20">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                Analysis not found
              </p>
              <Link to="/pulse" className="text-sm font-mono text-primary hover:underline">
                ← Return to Pulse
              </Link>
            </div>
          )}

          {/* ── Article ── */}
          {!loading && insight && (
            <>
              {/* Category + date */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${categoryDot(insight.category)}`} />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {normalizeCategory(insight.category)}
                </span>
                <span className="text-stone-200">·</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {formatDate(insight)}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight mb-8">
                {insight.translation}
              </h1>

              <div className="border-t border-stone-100 pt-10 space-y-10">

                {/* ── The Noise (what happened) ── */}
                <section>
                  <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    The Story
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {insight.noise}
                  </p>
                </section>

                {/* ── The Signal (why it matters) ── */}
                <section className="bg-stone-50 rounded-sm border border-stone-100 p-6">
                  <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    Why It Matters
                  </h2>
                  <p className="font-serif text-xl text-foreground leading-relaxed">
                    {insight.translation}
                  </p>
                </section>

                {/* ── What to do ── */}
                {insight.action && insight.action !== 'No action extracted' && (
                  <section>
                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                      What to Do About It
                    </h2>
                    <p className="text-base text-foreground leading-relaxed">
                      {insight.action}
                    </p>
                  </section>
                )}

                {/* ── Keywords ── */}
                {insight.keywords && insight.keywords.length > 0 && (
                  <section>
                    <div className="flex flex-wrap gap-2">
                      {insight.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground border border-stone-100 rounded-sm px-3 py-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-stone-300" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Sources ── */}
                {insight.sources && insight.sources.length > 0 && (
                  <section>
                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                      Sources
                    </h2>
                    <ul className="space-y-2">
                      {insight.sources.map((s, i) => (
                        <li key={i}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* ── CTA ── */}
                <section className="border-t border-stone-100 pt-10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                    Need help navigating this?
                  </p>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                    Talk to someone who's been on both sides of the table.
                  </h3>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="text-sm font-medium px-5 py-2.5 bg-[#1A1A1A] text-white rounded-sm hover:bg-stone-800 transition-all duration-200"
                  >
                    Request a Call
                  </button>
                </section>

                {/* ── Related articles ── */}
                {related.length > 0 && (
                  <section className="border-t border-stone-100 pt-10">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-5">
                      More in {normalizeCategory(insight.category)}
                    </p>
                    <div className="space-y-0">
                      {related.map((item) => (
                        <Link
                          key={item.id}
                          to={`/pulse/${item.slug}`}
                          className="group flex items-start gap-4 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50/40 transition-colors -mx-2 px-2 rounded-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                              {item.translation}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {firstSentence(item.noise, 100)}
                            </p>
                          </div>
                          <ArrowRight className="flex-shrink-0 w-4 h-4 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link
                        to="/pulse"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        All analysis
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </section>
                )}

              </div>
            </>
          )}

        </div>
      </main>

      <Footer onOpenChat={() => setIsChatOpen(true)} />
      <FloatingAICTA onOpenChat={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
