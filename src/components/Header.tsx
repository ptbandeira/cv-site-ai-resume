import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield, Cpu, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onOpenChat?: () => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskAI = () => {
    setMobileMenuOpen(false);
    if (onOpenChat) {
      onOpenChat();
    } else {
      scrollToSection("experience");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-[#F9F9F7]/95 backdrop-blur-md border-stone-200 py-3"
          : "bg-[#F9F9F7] border-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-left group"
          >
            <h1 className="font-serif text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
              Analog AI
            </h1>
            <span className="text-[10px] font-mono text-muted-foreground tracking-wide mt-0.5">
              by Pedro Bandeira
            </span>
          </button>
        </div>

        {/* System Status Badge — desktop only */}
        {/* System Status Badge — desktop only */}
        <div className="hidden lg:flex items-center">
          <div className="relative z-50 flex items-center gap-3 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm transition-colors hover:border-stone-300">

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help group">
                  <Cpu className="w-3 h-3 text-indigo-500" />
                  <span className="text-[10px] font-mono text-muted-foreground">Deployment: <span className="text-foreground font-semibold">Cloud or On-Prem (as required)</span></span>
                  <Info className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-mono text-xs max-w-[200px]">
                <p>Cloud by default; on-prem or private VPC when policy or data sensitivity requires it.</p>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-3 bg-stone-200" />

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help group">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-mono text-muted-foreground">Data: <span className="text-emerald-600 font-semibold">stays inside your perimeter (as required)</span></span>
                  <Info className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-mono text-xs max-w-[200px]">
                <p>Sensitive data can be processed locally; nothing is stored unless you explicitly opt in.</p>
              </TooltipContent>
            </Tooltip>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-breathe" />
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/pulse"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pulse
          </Link>
          <Link
            to="/blog/eu-ai-act-compliance.html"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            EU AI Act
          </Link>
          <button
            onClick={() => scrollToSection("how-i-work")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How I work
          </button>
          <button
            onClick={() => scrollToSection("resource-audit")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ROI Audit
          </button>
          <button
            onClick={() => scrollToSection("fit-assessment")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Fit Check
          </button>
          <button
            onClick={handleAskAI}
            className="text-sm font-medium px-5 py-2.5 bg-[#1A1A1A] text-white rounded-sm hover:shadow-lg transition-all duration-300"
          >
            Request a Call
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F9F7] border-b border-stone-200 animate-slide-down absolute w-full">
          <div className="px-6 py-6 space-y-6">
            <Link
              to="/pulse"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left font-medium text-muted-foreground hover:text-foreground"
            >
              Pulse
            </Link>
            <Link
              to="/blog/eu-ai-act-compliance.html"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left font-medium text-muted-foreground hover:text-foreground"
            >
              EU AI Act Guide
            </Link>
            <button
              onClick={() => scrollToSection("how-i-work")}
              className="block w-full text-left font-medium text-muted-foreground hover:text-foreground"
            >
              How I work
            </button>
            <button
              onClick={() => scrollToSection("resource-audit")}
              className="block w-full text-left font-medium text-muted-foreground hover:text-foreground"
            >
              ROI Audit
            </button>
            <button
              onClick={() => scrollToSection("fit-assessment")}
              className="block w-full text-left font-medium text-muted-foreground hover:text-foreground"
            >
              Fit Check
            </button>
            <button
              onClick={handleAskAI}
              className="block w-full text-left font-medium text-primary"
            >
              Request a Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
