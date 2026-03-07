import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingAICTA from "@/components/FloatingAICTA";
import AIChat from "@/components/AIChat";
import SubscribeForm from "@/components/SubscribeForm";
import PdfDownloadGate from "@/components/PdfDownloadGate";

interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  image: string;
  htmlUrl: string;
  pdfUrl: string;
}

const GUIDES: Guide[] = [
  {
    slug: "anthropic-skills-guide-claude",
    title: "Anthropic's Skills Guide: What It Means for Your Business",
    subtitle: "AI Tools Guide",
    description:
      "Anthropic released a 29-page blueprint for turning Claude into a specialized ops tool. Here's the business translation — what it actually means for operations, and how to use it without writing a line of code.",
    category: "AI Tools",
    categoryColor: "emerald",
    readTime: "6 min read",
    date: "March 2026",
    image: "/images/guides/anthropic-skills-guide.jpg",
    htmlUrl: "/blog/anthropic-skills-guide-claude.html",
    pdfUrl: "/downloads/anthropic-skills-guide-claude.pdf",
  },
  {
    slug: "eu-ai-act-compliance",
    title: "EU AI Act: A Business Owner's Translation",
    subtitle: "Compliance Guide",
    description:
      "The high-risk deadline just moved to 2027. But two obligations are already in force — and most European companies are ignoring both. What's actually required, broken down for mid-market operators.",
    category: "Compliance",
    categoryColor: "amber",
    readTime: "12 min read",
    date: "February 2026",
    image: "/images/guides/eu-ai-act-compliance.jpg",
    htmlUrl: "/blog/eu-ai-act-compliance.html",
    pdfUrl: "/downloads/eu-ai-act-compliance.pdf",
  },
  {
    slug: "ai-2028-intelligence-scenario",
    title: "The 2028 Intelligence Scenario: A Business Translation",
    subtitle: "Scenario Analysis",
    description:
      "A prominent financial research firm published a scenario where AI capability outpaces institutional adaptation — mapping the transmission from 'AI disrupts white-collar work' to systemic financial risk. Here's what it means.",
    category: "Strategy",
    categoryColor: "slate",
    readTime: "11 min read",
    date: "February 2026",
    image: "/images/guides/ai-2028-intelligence-scenario.jpg",
    htmlUrl: "/blog/ai-2028-intelligence-scenario.html",
    pdfUrl: "/downloads/ai-2028-intelligence-scenario.pdf",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string; hoverBg: string }> = {
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "text-emerald-600 bg-emerald-100",
    hoverBg: "hover:border-emerald-300",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-600 bg-amber-100",
    hoverBg: "hover:border-amber-300",
  },
  slate: {
    border: "border-slate-200",
    bg: "bg-slate-50",
    text: "text-slate-700",
    icon: "text-slate-600 bg-slate-100",
    hoverBg: "hover:border-slate-300",
  },
};

export default function Guides() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-foreground">
      <Header />

      <main className="pt-28 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Masthead */}
          <div className="mb-14">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-5">
              <FileText className="w-3.5 h-3.5" />
              Deep Guides
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight mb-4">
              Long-Form Analysis
            </h1>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              In-depth guides translating AI policy, tools, and scenarios into
              business language. Each one is available to read online or download
              as a PDF.
            </p>
          </div>

          {/* Guide cards */}
          <div className="space-y-8">
            {GUIDES.map((guide) => {
              const colors = colorMap[guide.categoryColor] || colorMap.slate;
              return (
                <article
                  key={guide.slug}
                  className={`group border ${colors.border} ${colors.hoverBg} bg-white rounded-sm overflow-hidden transition-all duration-200 hover:shadow-md`}
                >
                  {/* Hero image */}
                  <a href={guide.htmlUrl}>
                    <div className="relative h-56 md:h-72 overflow-hidden">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span
                        className={`absolute top-4 left-4 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {guide.subtitle}
                      </span>
                    </div>
                  </a>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span>{guide.category}</span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {guide.readTime}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span>{guide.date}</span>
                    </div>

                    <a href={guide.htmlUrl}>
                      <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h2>
                    </a>

                    <p className="text-base text-muted-foreground leading-relaxed mb-6">
                      {guide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={guide.htmlUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        Read article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <span className="text-stone-200">|</span>

                      <PdfDownloadGate
                        pdfUrl={guide.pdfUrl}
                        title={guide.title}
                        variant="button"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Subscribe section */}
          <div className="mt-16 border border-stone-200 rounded-sm bg-white p-8 md:p-10">
            <div className="max-w-lg mx-auto text-center mb-6">
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                Get new guides in your inbox
              </h3>
              <p className="text-sm text-muted-foreground">
                When we publish a new deep guide, you'll be the first to know.
                Signal only, no noise.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>

          {/* Cross-link to Pulse */}
          <div className="mt-10 text-center">
            <Link
              to="/pulse"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Browse the daily Signal Feed
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingAICTA />
      <AIChat />
    </div>
  );
}
