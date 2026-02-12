import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIContext {
  situation: string;
  approach: string;
  technicalWork: string;
  lessonsLearned: string;
}

interface ExperienceCardProps {
  challenge: string;
  role: string;
  period: string;
  highlights: string[];
  aiContext: AIContext;
  perspective2026: string;
  index: number;
}

const ExperienceCard = ({
  challenge,
  role,
  period,
  highlights,
  aiContext,
  perspective2026,
  index,
}: ExperienceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group relative p-6 md:p-8 bg-card border border-border rounded-2xl transition-all duration-300 hover:border-accent/50",
        "animate-slide-up opacity-0"
      )}
      style={{ animationDelay: `${index * 0.1 + 0.2}s`, animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-serif text-foreground mb-1">{challenge}</h3>
          <p className="text-primary">{role}</p>
        </div>
        <span className="text-sm font-mono text-muted-foreground">{period}</span>
      </div>

      {/* Highlights */}
      <ul className="space-y-3 mb-6">
        {highlights.map((highlight, i) => (
          <li key={i} className="flex items-start gap-3 text-muted-foreground">
            <span className="text-accent mt-1.5">→</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* 2026 Perspective */}
      <div className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">2026 Perspective</span>
        </div>
        <p className="text-sm text-foreground/80 italic leading-relaxed">{perspective2026}</p>
      </div>

      {/* AI Context Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        <span>{expanded ? "Hide" : "View"} AI Context</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expanded AI Context */}
      {expanded && (
        <div className="mt-4 p-4 bg-secondary rounded-xl border border-border animate-slide-down">
          <div className="grid gap-4 text-sm">
            <div>
              <span className="text-text-subtle font-mono text-xs uppercase tracking-wider">
                Situation
              </span>
              <p className="text-foreground mt-1">{aiContext.situation}</p>
            </div>
            <div>
              <span className="text-text-subtle font-mono text-xs uppercase tracking-wider">
                Approach
              </span>
              <p className="text-foreground mt-1">{aiContext.approach}</p>
            </div>
            <div>
              <span className="text-text-subtle font-mono text-xs uppercase tracking-wider">
                Technical Work
              </span>
              <p className="text-foreground mt-1">{aiContext.technicalWork}</p>
            </div>
            <div>
              <span className="text-text-subtle font-mono text-xs uppercase tracking-wider">
                Lessons Learned
              </span>
              <p className="text-text-highlight mt-1 italic">"{aiContext.lessonsLearned}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;
