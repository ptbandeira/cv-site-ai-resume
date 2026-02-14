import ExperienceCard from "./ExperienceCard";

const Experience = () => {
  const milestones = [
    {
      challenge: "The AI Hype Cycle vs. Operational Reality",
      role: "Independent Consultant / Contractor",
      period: "2023 - Present",
      highlights: [
        "Helping businesses operationalize AI beyond chat interfaces.",
        "Building sovereign AI architectures for data privacy and auditability.",
        "Bridging the gap between technical possibility and business ROI."
      ],
      aiContext: {
        situation: "Companies drowning in 'pilot purgatory' with no production value.",
        approach: "Implementing 'Human-in-the-loop' workflows that scale judgment.",
        technicalWork: "AgenticOS, OpenWebUI, Local LLMs, n8n/Make automation.",
        lessonsLearned: "Automation without governance is just high-speed chaos."
      },
      perspective2026: "The 'Chief AI Operator' is the new COO. We don't need more SaaS; we need governed, owned intelligence."
    },
    {
      challenge: "Enterprise Digital Transformation at Scale",
      role: "Business Development — Microsoft Dynamics 365, Accenture",
      period: "Aug 2021 - Jul 2023",
      highlights: [
        "Driving adoption of complex ERP/CRM ecosystems for large enterprises.",
        "Aligning technical capabilities with business outcomes (P&L focus).",
        "Navigating complex stakeholder environments to deliver operational change."
      ],
      aiContext: {
        situation: "Massive data silos preventing agile decision-making.",
        approach: "Unified Data/CRM strategies (Dynamics 365) to break down walls.",
        technicalWork: "ERP/CRM Architecture, Enterprise Sales, Solution Mapping.",
        lessonsLearned: "Technology is easy; organizational change is hard."
      },
      perspective2026: "What used to be a 2-year ERP rollout can now be a 2-month agentic workflow deployment—if you have the right architecture."
    },
    {
      challenge: "International Efficiency & Execution",
      role: "Global Sales Director — Glownet",
      period: "2017 - 2018",
      highlights: [
        "Led global sales strategy for RFID/Cashless event solutions.",
        "Managed cross-border partnerships and high-stakes deployments.",
        "Optimized revenue operations across multiple markets."
      ],
      aiContext: {
        situation: "High-volume transaction data and real-time operational pressure.",
        approach: "Data-driven sales operations and forecasting.",
        technicalWork: "RFID Tech, Sales Ops, International Logistics.",
        lessonsLearned: "Real-time data prevents operational disaster."
      },
      perspective2026: "Predictive sales agents now handle the forecasting I used to do in Excel until 2 AM."
    },
    {
      challenge: "Scaling Regulated Retail: From 1 to 10 Units",
      role: "General Manager — Grupa Moja Farmacja",
      period: "2011 - 2014",
      highlights: [
        "Managed P&L and operational growth for a pharmacy chain.",
        "Oversaw logistics, supply chain, and regulatory compliance.",
        "Led teams through rapid expansion from 1 to 10+ units."
      ],
      aiContext: {
        situation: "High-stakes inventory and compliance management.",
        approach: "Strict standard operating procedures (analog guardrails).",
        technicalWork: "Supply Chain Optimization, Regulatory Compliance, Team Leadership.",
        lessonsLearned: "In regulated industries, process adherence is survival."
      },
      perspective2026: "The 'Compliance Guardrail' agent I now build does the work of 3 auditors I used to hire."
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
            <h4 className="text-sm font-mono uppercase tracking-wider text-stone-500 mb-4">
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
