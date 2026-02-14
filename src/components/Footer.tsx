import { Github, Linkedin, Mail } from "lucide-react";

const Footer = ({ onOpenChat }: { onOpenChat?: () => void }) => {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-2xl font-serif text-foreground mb-1">Analog AI</p>
            <p className="text-sm font-mono text-muted-foreground">by Pedro Bandeira</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ptbandeira"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/ptbandeira/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@pedrobandeira.ai"
              className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
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
                Architected by Pedro. Vibe Coded with Antigravity & Lovable.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                Want a site like this? <span className="underline">Run Fit Check</span>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              © 2026 Analog AI. Built with Sovereign Architecture.
            </p>
            <p className="text-xs font-mono text-[#555555] leading-relaxed max-w-xl mx-auto">
              Pedro Bandeira: Senior AI Operations Architect. Specializing in Human-in-the-Loop
              Workflows, Local LLMs, and Sovereign Data.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
