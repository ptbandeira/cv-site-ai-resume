import ExperienceCard from "./ExperienceCard";

const Experience = () => {
  const milestones = [
    {
      challenge: "Enterprise Data Gridlock: 10 Years Bridging Engineering & C-Suite",
      role: "Solutions Architect & Consultant — Microsoft / Accenture",
      period: "2010 - 2020",
      highlights: [
        "Translated C-suite strategic goals into technical architecture across Fortune 500 engagements.",
        "Architected scalable Azure cloud solutions for complex, siloed data environments.",
        "Delivered multi-year digital transformation programs — the 'boring' infrastructure that keeps enterprises alive."
      ],
      aiContext: {
        situation: "Large-scale organizational silos preventing data agility across multinational enterprises.",
        approach: "Implemented unified cloud data strategies using Azure, bridging legacy systems to modern architectures.",
        technicalWork: "Azure Synapse, Cosmos DB, Microservices Architecture, Enterprise Integration Patterns.",
        lessonsLearned: "Technology is easy; organizational change is hard. The bottleneck is always human adoption, not infrastructure."
      },
      perspective2026: "How I'd solve this today: Human-in-the-Loop agents that automate the 40% of administrative waste I handled manually between 2010-2020. Enterprise data reconciliation that took weeks now takes hours with deterministic RAG pipelines — but still requires a human to sign off."
    },
    {
      challenge: "Scaling Regulated Retail: From 1 to 10 Units",
      role: "CIO / Strategic Leader — Grupa Moja Farmacja",
      period: "2020 - 2024",
      highlights: [
        "Built the digital backbone for a pharmaceutical retail network scaling from single-site to multi-unit operations.",
        "Implemented compliance-first e-commerce and logistics systems for regulated healthcare products.",
        "Managed data security and regulatory frameworks (GDP, GMP) for sensitive patient and prescription data."
      ],
      aiContext: {
        situation: "Rapid operational scaling required robust digital infrastructure with zero tolerance for compliance failure.",
        approach: "Full digital transformation of logistics, sales channels, and supply chain — with pharmaceutical regulations as the design constraint, not an afterthought.",
        technicalWork: "Custom ERP integrations, Secure Health Data Pipelines, Multi-site POS systems, Regulatory Reporting Automation.",
        lessonsLearned: "In regulated industries, the cost of a compliance failure dwarfs any technology investment. Build for the auditor first."
      },
      perspective2026: "How I'd solve this today: The Compliance Guardrail agent I now build can flag non-compliant marketing copy in 0.5 seconds — work that required manual review by me and two pharmacists in 2022. The A-V-C Framework I use for clients was born from this experience."
    }
  ];

  const skills = {
    strong: ["Azure Architecture", "Strategic Leadership", "AI Orchestration", "Regulated Industry Ops"],
    moderate: ["React/TypeScript", "Python (GenAI)", "Node.js"],
    gaps: ["Legacy Mainframe", "Manual QA", "Pixel-Perfect CSS"]
  };

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Operational Milestones
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The analog scars that inform the digital architecture.
          </p>
        </div>

        {/* Experience cards */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <ExperienceCard
              key={milestone.challenge}
              challenge={milestone.challenge}
              role={milestone.role}
              period={milestone.period}
              highlights={milestone.highlights}
              aiContext={milestone.aiContext}
              perspective2026={milestone.perspective2026}
              index={index}
            />
          ))}
        </div>

        {/* Skills Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-700 mb-4">
              Strong
            </h4>
            <ul className="space-y-2">
              {skills.strong.map((skill) => (
                <li key={skill} className="text-foreground flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-secondary border border-border rounded-2xl">
            <h4 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
              Moderate
            </h4>
            <ul className="space-y-2">
              {skills.moderate.map((skill) => (
                <li key={skill} className="text-foreground flex items-center gap-2">
                  <span className="text-muted-foreground">○</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <h4 className="text-sm font-mono uppercase tracking-wider text-amber-700 mb-4">
              Gaps (Outsourced)
            </h4>
            <ul className="space-y-2">
              {skills.gaps.map((skill) => (
                <li key={skill} className="text-foreground flex items-center gap-2">
                  <span className="text-amber-600">✗</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
