import agenticOSContext from '../../agenticOS.md?raw';
import freelanceContext from '../../freelance.md?raw';

// "Ground Truth" Manifesto Injection
const cvContext = `
Pedro is a Strategic AI Orchestrator bridging the divide between Fortune 500 discipline and the new AI economy. He creates 'Hybrid Intelligence' systems, combining 20 years of leadership (Microsoft/Accenture, Grupa Moja Farmacja) with 'Vibe Coding' speed. He is the 'Adult in the Room' who translates GenAI into Operational Efficiency.
`;

const agenticOSManifesto = `
AgenticOS is proof of 'SaaS Rationalization.' Built on Azure AI, it automates BD for law firms for a fraction of the cost of 'AI Wrappers' like Legora. It proves that domain experts can now build their own 'Vertical Intelligence' while maintaining 100% data sovereignty.
`;

export const PEDRO_CONTEXT = `
${cvContext}

${agenticOSManifesto}

${agenticOSContext}

${freelanceContext}
`;
