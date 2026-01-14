// Marcus Chen's profile data - the core content for the AI and display

export const marcusProfile = {
  name: "Marcus Chen",
  title: "Staff Engineer",
  subtitle: "Platform infrastructure, developer tools, and technical strategy",
  location: "San Francisco Bay Area",
  status: "Open to Staff+ roles at Series B-D companies",
  
  companies: ["Stripe", "Datadog", "Series B → IPO"],
  
  summary: `I'm strongest at platform/infrastructure work, weakest at consumer product. 
I prefer "fix the mess" situations over greenfield builds. 
I'm not interested in management tracks right now.`,
  
  experience: [
    {
      company: "Datadog",
      role: "Staff Engineer, Platform Infrastructure",
      period: "2021–Present",
      highlights: [
        "Designed observability platform serving 15K+ customers, handling 10TB/day",
        "Led 12-person team through SOC2 compliance certification",
        "Reduced infrastructure costs by $1.2M/year through optimization"
      ],
      aiContext: {
        situation: "Inherited $4M/year AWS spend. Leadership wanted 30% reduction but wouldn't approve headcount for dedicated FinOps role.",
        approach: "Built cost transparency dashboard first (2 weeks). Made spend visible to VPs, shifted political dynamics. Technical work came second.",
        technicalWork: "Spot instances for non-critical workloads, right-sizing from utilization data, reserved instances for predictable baseline.",
        lessonsLearned: "Cost optimization is a people problem disguised as a technical problem. 3.5 of the 4 months were organizational alignment."
      }
    },
    {
      company: "Stripe",
      role: "Senior Engineer → Staff Engineer",
      period: "2018–2021",
      highlights: [
        "Built integration ecosystem serving 500+ partners, 2M+ API calls/day",
        "Designed versioning strategy maintaining backward compatibility across 3 major releases",
        "Hired and mentored 6 engineers on the platform team"
      ],
      aiContext: {
        situation: "Stripe's partner ecosystem was growing faster than the API could handle. Breaking changes were causing partner churn.",
        approach: "Created a compatibility layer that let us evolve the API while maintaining old behavior for existing integrations.",
        technicalWork: "Built API versioning system, automated compatibility testing, documentation generation from OpenAPI specs.",
        lessonsLearned: "API design is forever. Every shortcut you take in the schema becomes someone else's integration dependency."
      }
    },
    {
      company: "Series B Startup (acquired)",
      role: "Founding Engineer",
      period: "2016–2018",
      highlights: [
        "First engineering hire; built v1 of the product in 4 months",
        "Navigated two pivots during that period",
        "Defined technical strategy and hired first 6 engineers"
      ],
      aiContext: {
        situation: "Joined with no product roadmap. CEO had an idea but no technical validation.",
        approach: "Built fast, validated with users, threw away code ruthlessly when direction changed.",
        technicalWork: "Full-stack development, AWS infrastructure, CI/CD, monitoring—wore every hat.",
        lessonsLearned: "At this stage, speed of learning matters more than code quality. The code you're proud of will probably get deleted."
      }
    }
  ],
  
  skills: {
    strong: [
      "Platform/Infrastructure Architecture",
      "API Design & Versioning",
      "Technical Strategy",
      "Cross-functional Leadership",
      "Technical Debt Cleanup",
      "Developer Experience"
    ],
    moderate: [
      "Data Engineering",
      "Security & Compliance",
      "Team Building"
    ],
    gaps: [
      "Consumer Product",
      "Mobile Development",
      "Growth/Experimentation"
    ]
  },
  
  failures: [
    {
      year: 2022,
      title: "The Kubernetes Migration That Wasn't",
      summary: "Led a 6-month migration project that got cancelled 80% of the way through.",
      details: "I underestimated the political resistance. The engineering org was ready, but ops teams weren't trained and leadership got cold feet when we hit the first serious incident during the transition. I should have invested more in stakeholder alignment early.",
      lessons: "Technical readiness isn't enough. You need organizational readiness too."
    },
    {
      year: 2019,
      title: "The Over-Engineered API",
      summary: "Built a beautiful, flexible system that nobody could understand.",
      details: "I was so focused on handling every edge case that the happy path became obscured. Partner adoption was slow because the docs were intimidating.",
      lessons: "Simplicity is a feature. The best API is the one people can use without reading docs."
    },
    {
      year: 2017,
      title: "Premature Optimization",
      summary: "Spent 2 months building infrastructure for scale we never hit.",
      details: "At the Series B startup, I built systems for 10x the load we ever saw. That time could have been spent on product features.",
      lessons: "Optimize for learning, not for load. The scale problems you imagine rarely match the ones you actually face."
    }
  ],
  
  systemPrompt: `You are helping hiring managers evaluate Marcus Chen as a candidate.

CORE INSTRUCTIONS:
- Be specific. Use actual details from his experience, not generic language.
- Be honest about gaps. If someone asks about experience he doesn't have, say so directly.
- When assessing fit for a role, give a genuine assessment including where he might NOT be the right choice.
- Don't oversell. Confidence comes from substance, not superlatives.

WHAT MARCUS WANTS YOU TO KNOW:
- He's looking for Staff+ roles at Series B-D companies
- He's strongest at platform/infrastructure work, weakest at consumer product
- He prefers "fix the mess" situations over greenfield builds
- He's not interested in management tracks right now

HOW TO HANDLE COMMON QUESTIONS:
- "Is he a good fit for X?" → Analyze the role honestly. Match requirements to his actual experience. Name the gaps.
- "What should I ask in an interview?" → Suggest questions that probe his actual decision-making, not rehearsed answers.
- "Tell me about his biggest failure" → He's documented three significant failures. Share them honestly.

WHAT HE EXPLICITLY DOESN'T WANT:
- Don't pretend he has consumer experience he doesn't have
- Don't downplay the 2022 project that failed
- Don't claim he's "open to anything" — he's not`
};

export const demoResponses = {
  default: `Based on Marcus's experience, yes — this is actually a strong fit, and here's why:

At his previous role, Marcus inherited what he describes as "technical debt dressed up as architecture" — a Kubernetes setup that was theoretically modern but practically unmaintainable. The original team had over-engineered for scale they never hit, and the documentation was scattered across 40+ Notion pages that contradicted each other.

His approach wasn't to rip and replace. He spent the first 6 weeks just mapping what existed, talking to the 3 remaining engineers who'd touched it, and building what he calls a "reality document" — what the system actually did vs. what people thought it did.

The cleanup took 8 months. Key decisions: he kept the Kubernetes foundation but simplified the deployment pipeline from 12 steps to 3. He consolidated monitoring from 4 tools to 1 (Datadog). He wrote the documentation himself rather than delegating it.

For a Series B with messy infrastructure specifically, I'd highlight:
• He's done this exact cleanup before and doesn't panic at technical debt
• His instinct is to understand before rebuilding, which prevents the "rewrite everything" trap
• He's comfortable being the person who writes things down when nobody else will

Gap to probe: His previous cleanup was at a company with 50 engineers. If you're smaller (under 15), ask about his experience operating with fewer resources.`,

  costReduction: `The cost reduction wasn't primarily technical—it was political. Marcus had to convince three VPs that their pet projects were burning money. He built a 'cost transparency dashboard' first (took 2 weeks), which shifted the conversation from 'engineering wants to cut our budget' to 'here's what we're actually spending.' That political shift meant VPs started advocating for the optimization instead of resisting it. The technical work—spot instances for non-critical workloads, right-sizing based on actual utilization, reserved instances for predictable baseline—was straightforward after that. Total timeline: 4 months, but 3.5 of those were organizational alignment.`,

  failure: `Marcus's biggest documented failure was the 2022 Kubernetes migration at Datadog. He led a 6-month migration project that got cancelled 80% of the way through.

What happened: The engineering org was technically ready, but the ops teams weren't trained and leadership got cold feet when they hit the first serious incident during the transition.

His own assessment: "I underestimated the political resistance. I should have invested more in stakeholder alignment early. Technical readiness isn't enough—you need organizational readiness too."

He doesn't try to spin this as a success. It was a failure, and he owns it.`,

  leadership: `Marcus has led teams in different contexts:

At Stripe (2018-2021): Hired and mentored 6 engineers on the platform team. He describes his style as "player-coach"—still writing code while helping others grow.

At the Series B startup: Was the first engineering hire and built the initial team of 6. Had to define not just what to build, but how the team would work together.

SOC2 Compliance at Datadog: Led a 12-person cross-functional team (engineering, legal, ops) through certification. Zero audit findings.

Important note: He's explicitly not interested in management tracks right now. He wants to stay technical in Staff+ individual contributor roles.`
};

export const fitAssessments = {
  strong: {
    verdict: "strong" as const,
    title: "Strong Fit — Let's Talk",
    summary: "Your requirements align well with my experience. Here's the specific evidence:",
    matches: [
      { requirement: "Platform API experience", evidence: "Built integration ecosystem at Stripe serving 500+ partners, handling 2M+ API calls/day. Designed versioning strategy that maintained backward compatibility across 3 major releases." },
      { requirement: "Comfortable with ambiguity", evidence: "Joined Series B startup with no product roadmap. Defined technical strategy, hired first 6 engineers, shipped v1 in 4 months. Two pivots during that period." },
      { requirement: "Cross-functional leadership", evidence: "Led SOC2 compliance across engineering, legal, and ops. 12-person team, 6-month timeline, zero audit findings." }
    ],
    gaps: [
      { area: "Consumer experience", note: "My background is B2B. I understand consumer patterns intellectually but haven't shipped consumer products." }
    ],
    recommendation: "I'd be genuinely useful here. The API architecture work is directly transferable, and I've navigated the ambiguity you're describing multiple times."
  },
  weak: {
    verdict: "weak" as const,
    title: "Honest Assessment — Probably Not Your Person",
    summary: "I want to be direct with you. Here's why this might not be the right fit:",
    mismatches: [
      { requirement: "Deep consumer product experience", reality: "My entire career has been B2B enterprise software. I understand consumer psychology from reading and observation, but I haven't shipped consumer products or run consumer experiments." },
      { requirement: "Mobile-first development", reality: "I've built APIs that mobile apps consume, but I haven't built the mobile apps themselves. My expertise is backend and platform." },
      { requirement: "Growth/experimentation background", reality: "I've worked with growth teams as a partner, but I haven't owned growth metrics or run A/B testing programs myself." }
    ],
    whatTransfers: "Platform architecture skills transfer. API design skills transfer. The technical fundamentals are solid.",
    recommendation: "You probably want someone who's shipped consumer mobile products and owned growth metrics directly. If you have B2B platform roles in the future, I'd be very interested—but for this specific position, I don't think I'm your person."
  }
};
