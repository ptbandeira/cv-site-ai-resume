import { useState, useEffect } from "react";
import { Download, Mail, Check, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PdfDownloadGateProps {
  pdfUrl: string;
  title: string;
  /** Compact inline button vs full banner */
  variant?: "banner" | "button";
}

const STORAGE_KEY = "pulse_subscriber_email";

export default function PdfDownloadGate({ pdfUrl, title, variant = "banner" }: PdfDownloadGateProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIsSubscribed(true);
  }, []);

  function triggerDownload() {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      if (supabase) {
        const { error } = await supabase
          .from("subscribers")
          .insert([{
            email: email.toLowerCase().trim(),
            source: "pdf-download",
          }]);

        if (error && error.code !== "23505") {
          throw error;
        }
      }

      // Save to localStorage regardless
      localStorage.setItem(STORAGE_KEY, email.toLowerCase().trim());
      setIsSubscribed(true);
      setStatus("success");
      setShowForm(false);

      // Auto-trigger download after a brief moment
      setTimeout(triggerDownload, 500);
    } catch (err: any) {
      console.error("Subscribe error:", err);
      setErrorMsg(err?.message ?? "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  function handleClick() {
    if (isSubscribed) {
      triggerDownload();
    } else {
      setShowForm(true);
    }
  }

  // ── Banner variant (for within articles) ──────────────────────────
  if (variant === "banner") {
    return (
      <div className="border border-stone-200 bg-stone-50/60 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-sm bg-amber-100 flex items-center justify-center">
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Download Guide
            </p>
            <p className="text-sm font-serif text-foreground leading-snug">
              {title}
            </p>
          </div>
        </div>

        {/* Gate or download */}
        <div className="px-6 py-4">
          {isSubscribed ? (
            <button
              onClick={triggerDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-foreground text-background rounded-sm hover:bg-stone-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter your email to download. You'll also get the weekly Pulse digest — signal only, no noise.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-2.5 text-sm font-mono bg-white border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 placeholder:text-stone-400 disabled:opacity-50 transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-foreground text-background rounded-sm hover:bg-stone-700 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  {status === "loading" ? "Subscribing…" : "Get PDF"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-xs font-mono text-red-500">{errorMsg}</p>
              )}
              <p className="text-[10px] font-mono text-stone-400">
                Unsubscribe anytime. No spam, ever.
              </p>
            </form>
          ) : (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-widest bg-foreground text-background rounded-sm hover:bg-stone-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              Get PDF — Free with email
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Button variant (for listing pages) ────────────────────────────
  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-150 text-stone-500 hover:text-foreground"
        title={isSubscribed ? "Download PDF" : "Subscribe to download"}
      >
        {isSubscribed ? (
          <Download className="w-3 h-3" />
        ) : (
          <Lock className="w-3 h-3" />
        )}
        PDF
      </button>

      {/* Modal overlay for email form */}
      {showForm && !isSubscribed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="bg-white rounded-sm border border-stone-200 shadow-xl max-w-md w-full mx-4 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-amber-100 flex items-center justify-center">
                <Download className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-serif text-base font-medium text-foreground">
                  Download: {title}
                </p>
                <p className="text-xs text-muted-foreground">PDF guide</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Enter your email to download. You'll also get the weekly Pulse digest — signal only, no noise.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-4 py-3 text-sm font-mono bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 placeholder:text-stone-400 disabled:opacity-50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="w-full px-5 py-3 text-xs font-mono uppercase tracking-widest bg-foreground text-background rounded-sm hover:bg-stone-700 disabled:opacity-40 transition-colors"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe & Download"}
              </button>
              {status === "error" && (
                <p className="text-xs font-mono text-red-500">{errorMsg}</p>
              )}
              <p className="text-[10px] font-mono text-stone-400 text-center">
                Unsubscribe anytime. No spam, ever.
              </p>
            </form>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full text-center text-xs font-mono text-stone-400 hover:text-stone-600 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
