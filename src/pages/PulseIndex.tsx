import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
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

export default function PulseIndex() {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch("/manifest.json")
      .then((r) => r.json())
      .then((data) => setPulseItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />

      <main className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Masthead */}
          <div className="mb-14">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Signal intelligence
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight mb-4">
              The Pulse
            </h1>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              News analysis for executives navigating AI adoption — cutting through
              vendor hype with experience from both sides of the table.
            </p>
          </div>

          {/* Featured Guide — EU AI Act */}
          <a
            href="/blog/eu-ai-act-compliance.html"
            className="group block mb-12 border border-amber-200 bg-amber-50/60 hover:bg-amber-50 rounded-sm p-6 transition-all duration-200 hover:border-amber-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-3 block">
                  Featured Guide
                </span>
                <h2 className="font-serif text-xl font-medium text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                  EU AI Act Compliance for SMBs
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A practical operator's guide to the EU AI Act — what it means for
                  mid-market companies, what's actually required by August 2026, and
                  how to avoid expensive surprises.
                </p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-amber-600">
              Read the guide
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Latest Analysis */}
          <div className="mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Latest Analysis
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-stone-100 rounded-sm p-6 animate-pulse">
                  <div className="h-3 w-24 bg-stone-100 rounded mb-4" />
                  <div className="h-5 w-3/4 bg-stone-100 rounded mb-3" />
                  <div className="h-4 w-full bg-stone-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          ) : pulseItems.length === 0 ? (
            <div className="text-center py-20 border border-stone-100 rounded-sm">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                No insights yet — check back soon
              </p>
            </div>
          ) : (
            <div className="space-y-px">
              {pulseItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/pulse/${item.slug}`}
                  className="group block border border-stone-100 hover:border-stone-200 bg-white hover:bg-stone-50/50 rounded-sm p-6 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-stone-300">·</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="font-serif text-lg font-medium text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                        {item.translation}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {item.noise}
                      </p>
                      {item.keywords && item.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.keywords.slice(0, 4).map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground"
                            >
                              <span className="w-1 h-1 rounded-full bg-stone-300" />
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="flex-shrink-0 w-4 h-4 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-stone-100 text-center">
            <p className="text-[11px] font-mono text-muted-foreground tracking-wide">
              Analysis from a 50-year-old operator — who's built analog businesses
              and shipped AI products
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
