import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

export default function PulseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [insight, setInsight] = useState<PulseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch("/manifest.json")
      .then((r) => r.json())
      .then((data) => {
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
            Back to Pulse
          </Link>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-3 w-32 bg-stone-100 rounded" />
              <div className="h-8 w-3/4 bg-stone-100 rounded" />
              <div className="h-px w-full bg-stone-100" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-5/6 bg-stone-100 rounded" />
                <div className="h-4 w-4/6 bg-stone-100 rounded" />
              </div>
            </div>
          ) : notFound || !insight ? (
            <div className="text-center py-20">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                Insight not found
              </p>
              <Link
                to="/pulse"
                className="text-sm font-mono text-primary hover:underline"
              >
                ← Return to Pulse
              </Link>
            </div>
          ) : (
            <>
              {/* Meta */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {insight.category}
                </span>
                <span className="text-stone-200">·</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(insight.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight mb-10">
                {insight.translation}
              </h1>

              <div className="border-t border-stone-100 pt-10 space-y-10">

                {/* The Noise */}
                <section>
                  <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    The Noise
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {insight.noise}
                  </p>
                </section>

                {/* The Signal */}
                <section>
                  <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    The Signal
                  </h2>
                  <p className="font-serif text-xl text-foreground leading-relaxed">
                    {insight.translation}
                  </p>
                </section>

                {/* What to do */}
                <section>
                  <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    What to do about it
                  </h2>
                  <p className="text-base text-foreground leading-relaxed">
                    {insight.action}
                  </p>
                </section>

                {/* Keywords */}
                {insight.keywords && insight.keywords.length > 0 && (
                  <section>
                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {insight.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground border border-stone-100 rounded-sm px-3 py-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary/40" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Sources */}
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

                {/* CTA */}
                <section className="border-t border-stone-100 pt-10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                    Need help navigating this?
                  </p>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                    Talk to someone who's been on both sides of the table.
                  </h3>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="text-sm font-medium px-5 py-2.5 bg-[#1A1A1A] text-white rounded-sm hover:shadow-lg transition-all duration-300"
                  >
                    Request a Call
                  </button>
                </section>
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
