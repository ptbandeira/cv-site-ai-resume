import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface PulseItem {
  id: string;
  slug: string;
  category: string;
  noise: string;
  translation: string;
  date: string;
}

interface Manifest {
  items: PulseItem[];
}

const categoryColors: Record<string, string> = {
  "EU AI Act":       "bg-amber-400",
  "AI Governance":   "bg-amber-400",
  "AI Tools":        "bg-blue-400",
  "Enterprise AI":   "bg-blue-400",
  "Pharma AI":       "bg-emerald-400",
  "FinTech Compliance": "bg-purple-400",
  "Legal Tech":      "bg-rose-400",
};

const getDot = (category: string) =>
  categoryColors[category] ?? "bg-stone-400";

export default function FloatingPulseTeaser() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PulseItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // Load manifest
  useEffect(() => {
    fetch("/manifest.json")
      .then(r => r.json())
      .then((m: Manifest) => setItems((m.items ?? []).slice(0, 4)))
      .catch(() => {});
  }, []);

  // Collapse button on scroll down
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (!open) setCollapsed(y > lastY && y > 300);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Don't render if no items yet
  if (items.length === 0) return null;

  return (
    <>
      {/* Trigger button — bottom-left */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            onClick={() => setOpen(true)}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 2 }}
            className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-white border border-stone-200 rounded-full shadow-xl shadow-stone-200/50 transition-all duration-300 hover:border-amber-400/60 hover:shadow-2xl cursor-pointer group ${collapsed ? "px-3.5 py-3.5" : "px-5 py-3"}`}
          >
            <div className="relative">
              <Activity className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium text-foreground whitespace-nowrap overflow-hidden"
                >
                  Live Pulse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-6 z-50 w-80 bg-white border border-stone-200 rounded-2xl shadow-2xl shadow-stone-300/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-stone-600">
                  Live Pulse
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
              {items.map(item => (
                <Link
                  key={item.id}
                  to={`/pulse/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex flex-col gap-1 px-4 py-3.5 hover:bg-stone-50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDot(item.category)}`} />
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500">
                      {item.category}
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-stone-400 flex-shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-stone-700 leading-snug line-clamp-2 group-hover:text-stone-900">
                    {item.noise}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-snug line-clamp-1 italic">
                    → {item.translation}
                  </p>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between">
              <a
                href="/blog/eu-ai-act-compliance.html"
                target="_blank"
                rel="noopener"
                className="text-[11px] font-mono text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                EU AI Act Guide <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                to="/pulse"
                onClick={() => setOpen(false)}
                className="text-[11px] font-mono text-stone-500 hover:text-stone-700 flex items-center gap-1 transition-colors"
              >
                All notes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
