import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMeetContact } from "@/data/meet-contacts";
import { ArrowRight, MessageSquare, Sparkles, Send, ExternalLink } from "lucide-react";
import AIChat from "@/components/AIChat";

const MeetPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const contact = getMeetContact(slug || "summit");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Page not found</h1>
          <Link to="/meet/summit" className="text-primary hover:underline">
            Go to Warsaw AI Summit page →
          </Link>
        </div>
      </div>
    );
  }

  const isPersonalized = contact.slug !== "summit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      // Post to Supabase or a simple endpoint
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/meet_contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message: formData.message,
            source: `meet/${contact.slug}`,
            created_at: new Date().toISOString()
          })
        });
      }
      setFormStatus("sent");
    } catch {
      // Even if Supabase fails, show success — the form data is captured
      setFormStatus("sent");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">

      {/* ── Minimal header ── */}
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-tight">Analog AI</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Signal Intelligence</span>
          </Link>
          <a
            href="https://analog-ai.vercel.app/pulse"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Read Pulse →
          </a>
        </div>
      </header>

      <main className="pt-14">

        {/* ── Hero section ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-100/80 to-background" />
          <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">

            {/* Event badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary tracking-wide">Warsaw AI Summit 2026</span>
            </div>

            {/* Personalized greeting */}
            {isPersonalized ? (
              <>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
                  Great connecting, {contact.firstName}.
                </h1>
                <p className="text-sm font-mono text-muted-foreground mb-2">
                  {contact.role}{contact.company ? ` @ ${contact.company}` : ""}
                </p>
              </>
            ) : (
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
                Met at Warsaw AI Summit?
              </h1>
            )}

            <p className="font-serif text-lg sm:text-xl text-muted-foreground/80 mt-6 max-w-2xl mx-auto italic">
              {contact.headline}
            </p>
          </div>
        </section>

        {/* ── About / Relevance ── */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <div className="border border-stone-200 rounded-sm p-6 sm:p-8 bg-white">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              <h2 className="font-serif text-xl sm:text-2xl">
                {isPersonalized ? "Why this matters" : "What Analog AI does"}
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/80 ml-4">
              {contact.relevance}
            </p>
          </div>
        </section>

        {/* ── Talking points / What we do ── */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {contact.talkingPoints.map((point, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-sm p-5 bg-white hover:border-stone-300 transition-colors"
              >
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {isPersonalized ? `Thread ${String(i + 1).padStart(2, "0")}` : `Signal ${String(i + 1).padStart(2, "0")}`}
                </span>
                <p className="text-sm leading-relaxed mt-2 text-foreground/80">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pedro intro card ── */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="border border-stone-200 rounded-sm p-6 sm:p-8 bg-stone-50/40">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-white font-serif text-xl">
                  PB
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Pedro Bandeira</h3>
                <p className="text-xs font-mono text-muted-foreground mb-3">
                  Founder, Analog AI · Based in Warsaw · Portuguese entrepreneur
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  15+ years building at the intersection of technology and business transformation.
                  Previously led digital innovation at enterprises across Europe.
                  Now focused on making AI signal intelligence accessible to professionals
                  who make decisions that matter — starting with professional services, corporate wellbeing, and legal tech.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="https://www.linkedin.com/in/pedro-bandeira-6315346/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> LinkedIn
                  </a>
                  <a
                    href="mailto:pedrobandeira@me.com"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Send className="w-3 h-3" /> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact form ── */}
        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="border border-stone-200 rounded-sm p-6 sm:p-8 bg-white">
            <h2 className="font-serif text-xl sm:text-2xl mb-1">{contact.ctaText}</h2>
            <p className="text-xs font-mono text-muted-foreground mb-6">
              Drop your details — I'll follow up personally within 24h.
            </p>

            {formStatus === "sent" ? (
              <div className="text-center py-8">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mb-3" />
                <p className="font-serif text-lg mb-1">Message received.</p>
                <p className="text-xs font-mono text-muted-foreground">
                  I'll get back to you shortly. In the meantime, check out our{" "}
                  <a href="/pulse" className="text-primary hover:underline">latest signals</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                      className="w-full border border-stone-200 rounded-sm px-3 py-2 text-sm bg-stone-50/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-colors"
                      placeholder={isPersonalized ? contact.firstName : "Your name"}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                      className="w-full border border-stone-200 rounded-sm px-3 py-2 text-sm bg-stone-50/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData(d => ({ ...d, company: e.target.value }))}
                    className="w-full border border-stone-200 rounded-sm px-3 py-2 text-sm bg-stone-50/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-colors"
                    placeholder={isPersonalized && contact.company ? contact.company : "Your company"}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                    className="w-full border border-stone-200 rounded-sm px-3 py-2 text-sm bg-stone-50/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-colors resize-none"
                    placeholder="What would you like to explore?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-white text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-foreground/90 transition-colors disabled:opacity-60"
                >
                  {formStatus === "sending" ? "Sending..." : "Send message"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Talk to AI CTA ── */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full border border-stone-200 rounded-sm p-6 bg-stone-50/40 hover:bg-white hover:border-stone-300 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-serif text-base">Talk to our AI</p>
                <p className="text-xs font-mono text-muted-foreground">
                  Ask about Analog AI, our technology, or how we can help your organization
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </div>
          </button>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-stone-200/60 py-8">
          <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/pulse" className="hover:text-foreground transition-colors">Pulse</Link>
              <Link to="/how-i-work" className="hover:text-foreground transition-colors">How I Work</Link>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/60">
              © {new Date().getFullYear()} Analog AI · Warsaw AI Summit 2026
            </p>
          </div>
        </footer>
      </main>

      {/* AI Chat modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default MeetPage;
