import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-2xl font-serif text-foreground mb-2">Pedro Bandeira</p>
            <p className="text-muted-foreground">The Human-AI Bridge</p>
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

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Pedro Bandeira. Built with Vibe Coding & Strategic Intent.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
