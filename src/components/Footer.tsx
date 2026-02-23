import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ onOpenChat }: { onOpenChat?: () => void }) => {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-serif text-foreground mb-6">Contact</h2>
            <div className="space-y-4">
              <p className="text-lg text-stone-600 leading-relaxed">
                Based in Warsaw. Remote across Europe (EU/UK time zones).
              </p>
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                Languages: EN / PT / ES / FR
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <a
                href="mailto:pedrobandeira@me.com?subject=General Inquiry&body=Hi Pedro,%0D%0A%0D%0AI'm reaching out regarding...%0D%0A%0D%0ABest,"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-stone-800 transition-all hover:scale-[1.02] shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/pedro-bandeira-6315346/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-xl font-medium hover:bg-stone-50 hover:border-stone-300 transition-all"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              If you’re serious, start with a Reality Test.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center space-y-6">
          <div className="flex justify-center">
            <button
              onClick={onOpenChat}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary transition-all border border-transparent hover:border-stone-200"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Status: online
              </div>
              <p className="text-sm text-foreground font-medium">
                Architected by Pedro. Built with the same tools I recommend to clients.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                Want a site like this? <span className="underline">Run Fit Check</span>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2026 Analog AI. Built with Sovereign Architecture. • <Link to="/press" className="hover:text-primary transition-colors">Press Kit</Link>
            </p>
            <p className="text-xs font-mono text-[#555555] leading-relaxed max-w-xl mx-auto">
              Pedro Bandeira: Fractional CAIO & AI Governance Advisor. Specialising in Human-in-the-Loop
              Workflows, EU AI Act Compliance, and Private AI Architecture.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
