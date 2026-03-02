// Personalized landing page data for Warsaw AI Summit 2026 contacts

export interface MeetContact {
  slug: string;
  name: string;
  firstName: string;
  role: string;
  company: string;
  headline: string;        // personalized hook
  relevance: string;       // why Analog AI matters to them
  talkingPoints: string[]; // 3 conversation starters
  ctaText: string;         // personalized CTA
  linkedinUrl?: string;
}

export const meetContacts: Record<string, MeetContact> = {

  // ── TIER 1: High-value personalized targets ──────────────────────────────

  "renate-strazdina": {
    slug: "renate-strazdina",
    name: "Renate Strazdina",
    firstName: "Renate",
    role: "National Technology Officer, North Europe Multi-Country Cluster",
    company: "Microsoft",
    headline: "Where Microsoft's enterprise AI vision meets real-world implementation",
    relevance: "We're building AgenticOS — a business development intelligence tool for professional services — entirely on the Microsoft stack (Azure, Copilot ecosystem, MS Graph). We believe the next wave of enterprise AI isn't about general chat, but about domain-specific agents that actually close deals.",
    talkingPoints: [
      "AgenticOS runs on Azure + MS Graph — how Microsoft is enabling vertical AI solutions",
      "The gap between Copilot adoption and real workflow transformation in professional services",
      "How AI signal intelligence (what Analog AI does) feeds into enterprise decision-making"
    ],
    ctaText: "Let's explore how Analog AI fits the Microsoft partner ecosystem"
  },

  "monika-byrtek": {
    slug: "monika-byrtek",
    name: "Monika Byrtek",
    firstName: "Monika",
    role: "AI Philosopher, AI Futures Lab",
    company: "Capgemini",
    headline: "When AI philosophy meets the reality of enterprise wellbeing and productivity",
    relevance: "We operate at the intersection of AI and human performance. Sirona, our corporate wellbeing platform, uses AI to map workforce resilience signals — not to replace human judgment, but to surface what leaders can't see. Your work on AI futures aligns perfectly with our approach: technology that amplifies human awareness.",
    talkingPoints: [
      "AI-driven corporate wellbeing — moving from reactive to predictive workforce health",
      "How large consultancies like Capgemini can partner with vertical AI platforms",
      "The ethical dimension of workplace AI signals — where philosophy meets product"
    ],
    ctaText: "Let's discuss how AI signal intelligence can serve enterprise wellbeing"
  },

  "kamil-stanuch": {
    slug: "kamil-stanuch",
    name: "Kamil Stanuch",
    firstName: "Kamil",
    role: "Data & Automation | Angel Investor",
    company: "",
    headline: "AI signal intelligence for professionals who make decisions that matter",
    relevance: "You invest in and build data & automation solutions. Analog AI is an AI-powered intelligence layer that monitors regulatory shifts, market signals, and competitive moves — then translates them into actionable briefings. We're building the 'Bloomberg Terminal for the rest of us' — starting with professional services.",
    talkingPoints: [
      "Your talk on B2D and the 100 million semi-devs — how Analog AI serves that exact audience",
      "The investment thesis: vertical AI signal platforms vs. horizontal AI tools",
      "AgenticOS — our BD intelligence tool for law firms, built on the MS stack"
    ],
    ctaText: "Let's talk about the signal intelligence opportunity"
  },

  "andrea-coifman": {
    slug: "andrea-coifman",
    name: "Andrea Coifman",
    firstName: "Andrea",
    role: "Director of Software Engineering, Gen AI Platform",
    company: "Nasdaq",
    headline: "From market data to market intelligence — the next frontier of enterprise AI",
    relevance: "You're building Nasdaq's Gen AI platform — the infrastructure that powers intelligent financial systems. Analog AI takes a similar approach for a different audience: we aggregate market and regulatory signals, process them through AI, and deliver actionable intelligence to decision-makers in professional services. Different market, same architectural philosophy.",
    talkingPoints: [
      "Parallels between financial market intelligence and professional services signal processing",
      "How you're architecting Nasdaq's Gen AI platform — build vs. buy decisions",
      "The challenge of making AI-generated insights trustworthy enough for real decisions"
    ],
    ctaText: "Let's exchange perspectives on enterprise AI signal platforms"
  },

  "kotryna-kurt": {
    slug: "kotryna-kurt",
    name: "Kotryna Kurt",
    firstName: "Kotryna",
    role: "CEO",
    company: "Linkedist",
    headline: "AI-powered content strategy meets LinkedIn audience growth",
    relevance: "Analog AI publishes weekly AI signal intelligence through our Pulse platform and LinkedIn. We're using AI to generate genuinely insightful market analysis — not recycled content. As someone building LinkedIn growth strategies, you'd appreciate what happens when the content itself is the differentiation, not just the distribution.",
    talkingPoints: [
      "How AI-generated signal intelligence performs vs. traditional thought leadership on LinkedIn",
      "Our automated content pipeline: Slack → AI analysis → Pulse article → LinkedIn distribution",
      "Potential collaboration: Linkedist's audience growth expertise + Analog AI's content engine"
    ],
    ctaText: "Let's explore how signal-driven content changes the LinkedIn game"
  },

  "dariusz-wylon": {
    slug: "dariusz-wylon",
    name: "Dariusz Wylon",
    firstName: "Dariusz",
    role: "Lead of AI for Higher Education, Central and Eastern Europe",
    company: "Google",
    headline: "Building AI fluency — from campus labs to real-world enterprise impact",
    relevance: "Your work on AI fluency in education connects directly to what we see in the market: the gap between AI literacy and AI implementation. Analog AI bridges that gap for professionals — we turn complex AI/regulatory signals into plain-language briefings that non-technical decision-makers can actually act on.",
    talkingPoints: [
      "Your talk on 'The New Graduate Skillset' — how AI fluency translates to enterprise readiness",
      "Google's CEE AI ecosystem and how startups like Analog AI fit in",
      "The role of AI-powered intelligence tools in accelerating professional development"
    ],
    ctaText: "Let's connect on the AI fluency and enterprise intelligence opportunity"
  },

  // ── GENERIC: Summit catch-all ─────────────────────────────────────

  "summit": {
    slug: "summit",
    name: "",
    firstName: "",
    role: "",
    company: "",
    headline: "AI signal intelligence for professionals who make decisions that matter",
    relevance: "Analog AI monitors market shifts, regulatory changes, and competitive moves across industries — then translates them into actionable intelligence briefings. We believe the professionals who win aren't the ones with the most data, but the ones who see the signal before the noise.",
    talkingPoints: [
      "Weekly AI-curated Pulse briefings — real signals, not recycled content",
      "AgenticOS — our BD intelligence tool for professional services (built on Microsoft stack)",
      "Sirona — corporate wellbeing platform that uses AI to map workforce resilience"
    ],
    ctaText: "Let's start a conversation"
  }
};

export function getMeetContact(slug: string): MeetContact | null {
  return meetContacts[slug] || null;
}
