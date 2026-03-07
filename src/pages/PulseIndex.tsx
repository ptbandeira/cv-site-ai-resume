import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Download, FileText } from "lucide-react";
import PdfDownloadGate from "@/components/PdfDownloadGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingAICTA from "@/components/FloatingAICTA";
import AIChat from "@/components/AIChat";
import SubscribeForm from "@/components/SubscribeForm";
import ShareButtons from "@/components/ShareButtons";

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

// ─── Category helpers ────────────────────────────────────────────────────────

// Normalize slight naming differences in the data
function normalizeCategory(cat: string): string {
  if (cat === "Legal Technology") return "Legal Tech";
  return cat;
}

const CATEGORY_ACCENT: Record<string, string> = {
  "SMB Operations":  "bg-amber-400",
  "AI Governance":   "bg-sky-400",
  "AI Tools":        "bg-emerald-400",
  "Legal Tech":      "bg-violet-400",
};

function categoryDot(cat: string) {
  return CATEGORY_ACCENT[normalizeCategory(cat)] ?? "bg-stone-400";
}

// ─── Date helpers ────────────────────────────────────────────────────────────

function parseItemDate(item: PulseItem): Date {
  if (item.isoDate) return new Date(item.isoDate);
  // Fallback: try parsing "Feb 25, 2026" etc.
  const d = new Date(item.date);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function formatShortDate(item: PulseItem): string {
  const d = parseItemDate(item);
  if (d.getTime() === 0) return item.date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function monthGroupKey(item: PulseItem): string {
  const d = parseItemDate(item);
  if (d.getTime() === 0) return item.date;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// First sentence of a text block (for teasers)
function firstSentence(text: string, maxLen = 120): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = match ? match[0] : text;
  return sentence.length > maxLen ? sentence.slice(0, maxLen).trimEnd() + "…" : sentence;
}

const RECENT_COUNT = 5;

// ─── Sub-components ──────────────────────────────────────────────────────────

function RecentCard({ item }: { item: PulseItem }) {
  const cat = normalizeCategory(item.category);
  return (
    <div className="group flex flex-col border border-stone-150 hover:border-stone-300 bg-white hover:bg-stone-50/60 rounded-sm p-6 transition-all duration-200 hover:shadow-sm">
      {/* Category + date + share */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${categoryDot(cat)}`} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {cat}
          </span>
          <span className="text-stone-300 text-[10px] font-mono">·</span>
          <span className="text-[10px] font-mono text-stone-400">{formatShortDate(item)}</span>
        </div>
        <ShareButtons
          url={`https://analog-ai.vercel.app/pulse/${item.slug}`}
          title={firstSentence(item.noise, 80)}
          compact
        />
      </div>

      <Link to={`/pulse/${item.slug}`} className="flex flex-col flex-1">
        {/* Thumbnail */}
        {item.image && (
          <div className="mb-3 -mx-1">
            <img
              src={item.image}
              alt=""
              className="w-full h-32 object-cover rounded-sm border border-stone-100"
              loading="lazy"
            />
          </div>
        )}

        {/* Headline — actual news first */}
        <h2 className="font-serif text-lg font-medium text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
          {firstSentence(item.noise, 140)}
        </h2>

        {/* Our take — translation */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 italic">
          {firstSentence(item.translation, 120)}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-1.5 mt-auto text-[11px] font-mono text-stone-400 group-hover:text-primary transition-colors">
          Read full analysis
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}

function ArchiveRow({ item }: { item: PulseItem }) {
  const cat = normalizeCategory(item.category);
  return (
    <Link
      to={`/pulse/${item.slug}`}
      className="group flex items-start gap-4 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50/40 transition-colors -mx-3 px-3 rounded-sm"
    >
      {/* Date */}
      <span className="flex-shrink-0 text-[10px] font-mono text-stone-400 w-20 pt-0.5">
        {formatShortDate(item)}
      </span>

      {/* Category dot */}
      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${categoryDot(cat)}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
              {cat}
            </span>
            <p className="font-serif text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors mb-1">
              {firstSentence(item.noise, 100)}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 italic">
              {firstSentence(item.translation, 100)}
            </p>
          </div>
          <ArrowRight className="flex-shrink-0 w-3.5 h-3.5 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PulseIndex() {
  const [allItems, setAllItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetch("/manifest.json")
      .then((r) => r.json())
      .then((data) => setAllItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Unique normalized categories from data
  const categories = ["All", ...Array.from(
    new Set(allItems.map((i) => normalizeCategory(i.category)))
  ).sort()];

  // Filtered items
  const filtered =
    activeCategory === "All"
      ? allItems
      : allItems.filter((i) => normalizeCategory(i.category) === activeCategory);

  const recentItems = filtered.slice(0, RECENT_COUNT);
  const archiveItems = filtered.slice(RECENT_COUNT);

  // Group archive by month
  const archiveByMonth: Record<string, PulseItem[]> = {};
  archiveItems.forEach((item) => {
    const key = monthGroupKey(item);
    if (!archiveByMonth[key]) archiveByMonth[key] = [];
    archiveByMonth[key].push(item);
  });

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header onOpenChat={() => setIsChatOpen(true)} />

      <main className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* ── Masthead ── */}
          <div className="mb-12">
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

          {/* ── Deep Guides (visually separated from signal feed) ── */}
          <section className="mb-16 border border-stone-200 rounded-sm bg-white overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-foreground flex items-center justify-center">
                    <FileText className="w-4 h-4 text-background" />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
                      Deep Guides
                    </h2>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      Long-form analysis · downloadable PDFs
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 border border-stone-200 rounded-sm px-2 py-1">
                  3 Guides
                </span>
              </div>
            </div>

            {/* Guide cards */}
            <div className="divide-y divide-stone-100">
              {/* Guide 1: Anthropic Skills */}
              <div className="p-6 hover:bg-stone-50/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 mb-1 block">
                      AI Tools Guide
                    </span>
                    <a
                      href="/blog/anthropic-skills-guide-claude.html"
                      className="group"
                    >
                      <p className="font-serif text-lg font-medium text-foreground leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors">
                        Anthropic's Skills Guide: What It Means for Your Business
                      </p>
                    </a>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      They released a 29-page blueprint for turning Claude into a specialized ops tool. Here's the business translation.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="/blog/anthropic-skills-guide-claude.html"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Read article
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <span className="text-stone-200">|</span>
                      <PdfDownloadGate
                        pdfUrl="/downloads/anthropic-skills-guide-claude.pdf"
                        title="Anthropic Skills Guide"
                        variant="button"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide 2: EU AI Act */}
              <div className="p-6 hover:bg-stone-50/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-amber-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600 mb-1 block">
                      Compliance Guide
                    </span>
                    <a
                      href="/blog/eu-ai-act-compliance.html"
                      className="group"
                    >
                      <p className="font-serif text-lg font-medium text-foreground leading-snug mb-1.5 group-hover:text-amber-700 transition-colors">
                        EU AI Act Compliance for SMBs
                      </p>
                    </a>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      What's actually required by August 2026, for mid-market operators.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="/blog/eu-ai-act-compliance.html"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Read article
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <span className="text-stone-200">|</span>
                      <PdfDownloadGate
                        pdfUrl="/downloads/eu-ai-act-compliance.pdf"
                        title="EU AI Act Compliance Guide"
                        variant="button"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide 3: 2028 Scenario */}
              <div className="p-6 hover:bg-stone-50/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1 block">
                      Scenario Analysis
                    </span>
                    <a
                      href="/blog/ai-2028-intelligence-scenario.html"
                      className="group"
                    >
                      <p className="font-serif text-lg font-medium text-foreground leading-snug mb-1.5 group-hover:text-slate-700 transition-colors">
                        The 2028 Intelligence Scenario: A Business Translation
                      </p>
                    </a>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      What happens if AI capability outpaces institutional adaptation — and which businesses survive.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="/blog/ai-2028-intelligence-scenario.html"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Read article
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <span className="text-stone-200">|</span>
                      <PdfDownloadGate
                        pdfUrl="/downloads/ai-2028-intelligence-scenario.pdf"
                        title="2028 Intelligence Scenario"
                        variant="button"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Visual separator between articles and signal feed ── */}
          <div className="mb-10 flex items-center gap-4">
            <span className="flex-1 h-px bg-stone-200" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 px-2">
              Signal Feed
            </span>
            <span className="flex-1 h-px bg-stone-200" />
          </div>

          {/* ── Category filter ── */}
          {!loading && allItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm border transition-all duration-150 ${
                    activeCategory === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white text-muted-foreground border-stone-200 hover:border-stone-300 hover:text-foreground"
                  }`}
                >
                  {cat !== "All" && (
                    <span className={`w-1.5 h-1.5 rounded-full ${categoryDot(cat)}`} />
                  )}
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-stone-100 rounded-sm p-6 animate-pulse">
                  <div className="h-2.5 w-24 bg-stone-100 rounded mb-4" />
                  <div className="h-5 w-3/4 bg-stone-100 rounded mb-3" />
                  <div className="h-3.5 w-full bg-stone-100 rounded mb-2" />
                  <div className="h-3.5 w-2/3 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 border border-stone-100 rounded-sm">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                {activeCategory === "All"
                  ? "No insights yet — check back soon"
                  : `No articles in ${activeCategory} yet`}
              </p>
            </div>
          )}

          {/* ── Recent Signal (top N cards) ── */}
          {!loading && recentItems.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Recent Signal
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* 2-col grid on md+, single col on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentItems.map((item, i) =>
                  i === 0 ? (
                    // First card spans full width
                    <div key={item.id} className="md:col-span-2">
                      <div className="group flex flex-col border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/60 rounded-sm p-6 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${categoryDot(normalizeCategory(item.category))}`} />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                              {normalizeCategory(item.category)}
                            </span>
                            <span className="text-stone-300 text-[10px] font-mono">·</span>
                            <span className="text-[10px] font-mono text-stone-400">{formatShortDate(item)}</span>
                            <span className="ml-2 text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-200 bg-amber-50 rounded-sm px-1.5 py-0.5">
                              Latest
                            </span>
                          </div>
                          <ShareButtons
                            url={`https://analog-ai.vercel.app/pulse/${item.slug}`}
                            title={firstSentence(item.noise, 80)}
                            compact
                          />
                        </div>
                        <Link to={`/pulse/${item.slug}`} className="flex flex-col md:flex-row gap-6">
                          {item.image && (
                            <div className="md:w-64 flex-shrink-0">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-40 md:h-full object-cover rounded-sm border border-stone-100"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h2 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                              {firstSentence(item.noise, 200)}
                            </h2>
                            <p className="text-base text-muted-foreground leading-relaxed mb-4 italic">
                              {firstSentence(item.translation, 180)}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 group-hover:text-primary transition-colors">
                              Read full analysis
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <RecentCard key={item.id} item={item} />
                  )
                )}
              </div>
            </section>
          )}

          {/* ── Mid-page subscribe ── */}
          {!loading && recentItems.length > 0 && (
            <div className="mb-14">
              <SubscribeForm />
            </div>
          )}

          {/* ── Past Issues (archive grouped by month) ── */}
          {!loading && archiveItems.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Past Issues
                </span>
                <span className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="space-y-8">
                {Object.entries(archiveByMonth).map(([month, items]) => (
                  <div key={month}>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-2">
                      {month}
                    </p>
                    <div className="border border-stone-100 rounded-sm px-3 divide-y divide-stone-100">
                      {items.map((item) => (
                        <ArchiveRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Subscribe ── */}
          {!loading && (
            <div className="mb-14">
              <SubscribeForm />
            </div>
          )}

          {/* ── Footer rule ── */}
          {/* ── Footer rule ── */}
          <div className="pt-8 border-t border-stone-100 text-center">
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
