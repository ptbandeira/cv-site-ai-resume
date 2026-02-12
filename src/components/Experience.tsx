import ExperienceCard from "./ExperienceCard";

const Experience = () => {
  const experiences = [
    {
      company: "Microsoft / Accenture",
      role: "Solutions Architect & Consultant",
      period: "2010 - 2020",
      highlights: [
        "Led enterprise digital transformation projects for Fortune 500 clients.",
        "Architected scalable Azure cloud solutions for complex data environments.",
        "Bridged the gap between technical engineering teams and C-suite strategy."
      ],
      aiContext: {
        situation: "Large-scale organizational silos preventing data agility.",
        approach: "Implemented unified cloud data strategies using Azure.",
        technicalWork: "Azure Synapse, Cosmos DB, Microservices Architecture.",
        lessonsLearned: "Technology is easy; organizational change is hard."
      }
    },
    {
      company: "Grupa Moja Farmacja",
      role: "CIO / Strategic Leaer",
      period: "2020 - 2024",
      highlights: [
        "Directed IT strategy for a major pharmaceutical network.",
        "Implemented e-commerce and logistics optimization systems.",
        "Managed compliance and data security for sensitive healthcare data."
      ],
      aiContext: {
        situation: "Rapid operational scaling required robust digital backbone.",
        approach: "Full digital transformation of logistics and sales channels.",
        technicalWork: "Custom ERP integrations, Secure Health Data Pipelines.",
        lessonsLearned: "Operational efficiency drives the bottom line."
      }
    }
  ];

  const skills = {
    strong: ["Azure Architecture", "Strategic Leadership", "Vibe Coding", "AI Orchestration"],
    moderate: ["React/TypeScript", "Python (GenAI)", "Node.js"],
    gaps: ["Legacy Mainframe", "Manual QA", "Pixel-Perfect CSS"]
  };

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            Experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Each role includes queryable AI context—the real story behind the bullet points.
          </p>
        </div>

        {/* Experience cards */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.company}
              company={exp.company}
              role={exp.role}
              period={exp.period}
              highlights={exp.highlights}
              aiContext={exp.aiContext}
              index={index}
            />
          ))}
        </div>

        {/* Skills Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <h4 className="text-sm font-mono uppercase tracking-wider text-green-500 mb-4">
              Strong
            </h4>
            <ul className="space-y-2">
              {skills.strong.map((skill) => (
                <li key={skill} className="text-foreground flex items-center gap-2">
                  <span className="text-green-500">✓</span>
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

          <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
            <h4 className="text-sm font-mono uppercase tracking-wider text-yellow-500 mb-4">
              Gaps (Outsourced)
            </h4>
            <ul className="space-y-2">
              {skills.gaps.map((skill) => (
                <li key={skill} className="text-foreground flex items-center gap-2">
                  <span className="text-yellow-500">✗</span>
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
