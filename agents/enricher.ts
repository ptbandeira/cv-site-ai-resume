// agents/enricher.ts
// Apollo.io contact enrichment + AI email draft generator
// Called only for hot leads — preserves free-tier credits (10 exports/month)

interface Contact {
  name: string;
  email: string;
  title: string;
  linkedinUrl?: string;
  confidence: 'verified' | 'likely' | 'none';
}

interface EnrichedLead {
  contact: Contact | null;
  draft: string;
}

// ICP decision-maker titles — order matters (most likely first for our SMB target)
const ICP_TITLES = [
  'Managing Partner', 'Managing Director', 'CEO', 'Co-Founder',
  'Chief Compliance Officer', 'Chief Operating Officer', 'COO',
  'Head of Operations', 'VP Operations', 'Director of Compliance',
  'Chief AI Officer', 'Head of Digital', 'Head of Innovation', 'CTO',
  'General Manager', 'President',
];

// ─── Apollo People Search ────────────────────────────────────────────────────

// ── Apollo circuit-breaker ─────────────────────────────────────────────────────
// Avoids hammering a 403-returning API on every hot lead.
// Resets each run (in-memory only).
let apolloDisabled = false;
const apollo403Cache = new Set<string>(); // companies that returned 403

function apolloAvailable(): boolean {
  return !apolloDisabled && !!process.env.APOLLO_API_KEY;
}

export async function enrichLead(
  company: string | undefined,
  industry: string | undefined,
  articleTitle: string | undefined
): Promise<EnrichedLead> {
  const apiKey = process.env.APOLLO_API_KEY;
  const draft = generateDraft(company, industry, articleTitle, null);

  // Fast-fail if Apollo disabled (403 from earlier in this run)
  if (!apiKey || apolloDisabled || !company || company === 'Unknown' || company.length < 3) {
    if (apolloDisabled) console.log(`  ⚡ Apollo disabled (free plan 403) — skipping ${company}`);
    return { contact: null, draft };
  }

  try {
    const res = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        q_organization_name: company,
        person_titles: ICP_TITLES,
        page: 1,
        per_page: 3, // get top 3, pick highest-ranking ICP title
      }),
    });

    if (!res.ok) {
      if (res.status === 403) {
        apolloDisabled = true;
        console.warn(`⚡ Apollo 403 for ${company} — disabling for this run (free plan limit)`);
      } else {
        console.error(`Apollo API returned ${res.status} for company: ${company}`);
      }
      return { contact: null, draft };
    }

    const data = await res.json();
    const people: any[] = data.people ?? [];

    if (people.length === 0) {
      return { contact: null, draft };
    }

    // Pick the person with the highest-priority ICP title
    const person = people.sort((a, b) => {
      const aIdx = ICP_TITLES.findIndex(t =>
        (a.title ?? '').toLowerCase().includes(t.toLowerCase())
      );
      const bIdx = ICP_TITLES.findIndex(t =>
        (b.title ?? '').toLowerCase().includes(t.toLowerCase())
      );
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    })[0];

    const email = person.email ?? '';
    const confidence: Contact['confidence'] =
      person.email_status === 'verified' ? 'verified' :
      email.includes('@') ? 'likely' : 'none';

    const contact: Contact = {
      name: `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim(),
      email: email || '(not found)',
      title: person.title ?? '',
      linkedinUrl: person.linkedin_url,
      confidence,
    };

    const draftWithContact = generateDraft(company, industry, articleTitle, contact);

    return { contact, draft: draftWithContact };

  } catch (err: any) {
    console.error(`Apollo enrichment failed for ${company}: ${err.message}`);
    return { contact: null, draft };
  }
}

// ─── Draft Email Generator ───────────────────────────────────────────────────
// Detects language from company name patterns, keeps it short (3 sentences max)
function generateDraft(
  company: string,
  industry: string,
  articleTitle: string,
  contact: Contact | null
): string {
  const lang = detectLanguage(company);
  const firstName = contact?.name.split(' ')[0] ?? null;
  const topic = extractTopic(articleTitle);
  const pain = getPainByIndustry(industry);
  const valueProps = getValuePropByIndustry(industry, lang);

  if (lang === 'pl') {
    const greeting = firstName ? `Dzień dobry ${firstName},` : 'Dzień dobry,';
    return (
      `${greeting}\n\n` +
      `Przeczytałem o ${topic} i pomyślałem, że mogę pomóc. ` +
      `Specjalizuję się w bezpiecznym wdrożeniu AI dla firm takich jak ${company} — ${pain}. ` +
      `${valueProps}\n\n` +
      `Czy ma Pan/Pani 20 minut na rozmowę w tym tygodniu?`
    );
  }

  if (lang === 'pt') {
    const greeting = firstName ? `Bom dia ${firstName},` : 'Bom dia,';
    return (
      `${greeting}\n\n` +
      `Li sobre ${topic} e acredito que posso ajudar. ` +
      `Especializo-me em implementação segura de IA para empresas como ${company} — ${pain}. ` +
      `${valueProps}\n\n` +
      `Tem 20 minutos para uma conversa esta semana?`
    );
  }

  // English (default)
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
  return (
    `${greeting}\n\n` +
    `Saw the piece about ${topic} — exactly the space I work in. ` +
    `I help companies like ${company} implement AI safely, without the usual ${pain}. ` +
    `${valueProps}\n\n` +
    `Worth a 20-minute call this week?`
  );
}

function detectLanguage(company: string): 'pl' | 'pt' | 'en' {
  const c = company.toLowerCase();
  // Polish signals: sp. z o.o., kancelaria, sp.k., s.a.
  if (/kancelaria|spółka|sp\. z|sp\.k|s\.a\.|group (sp|sa)|polska|warsaw|kraków|wrocław/i.test(company)) return 'pl';
  // Portuguese signals: lda, lda., sa, portugal, lisboa
  if (/lda\.?|sociedade|portugal|lisboa|porto|unipessoal|pt$/i.test(company)) return 'pt';
  return 'en';
}

function extractTopic(articleTitle: string | undefined | null): string {
  if (!articleTitle) return "AI implementation";
  // Shorten the article title to a natural phrase
  const cleaned = articleTitle
    .replace(/["""]/g, '')
    .replace(/\s*[-–—]\s*.+$/, '') // remove source suffix
    .trim();
  return cleaned.length > 80 ? cleaned.slice(0, 77) + '…' : cleaned;
}

function getPainByIndustry(industry: string): string {
  const pains: Record<string, string> = {
    'Legal Tech': 'GDPR risks, hallucination liability, and client data leaving the building',
    'Pharma AI': 'regulatory data privacy constraints and EU AI Act Annex III requirements',
    'Enterprise AI': 'the risk of sending sensitive operations data to third-party AI vendors',
    'AI Governance': 'compliance complexity and the cost of getting it wrong',
    'FinTech Compliance': 'data sovereignty and audit trail requirements',
  };
  return pains[industry] ?? 'the usual implementation gap between AI hype and actual business results';
}

function getValuePropByIndustry(industry: string, lang: 'pl' | 'pt' | 'en'): string {
  const props: Record<string, Record<string, string>> = {
    'Legal Tech': {
      en: 'I deploy local-first AI models (no data leaves your servers) and have deployed this in a Warsaw law firm already.',
      pl: 'Wdrażam modele AI działające lokalnie — żadne dane nie opuszczają Państwa serwerów. Mam już gotowe wdrożenie w warszawskiej kancelarii.',
      pt: 'Implemento modelos de IA locais — nenhum dado sai dos seus servidores. Já tenho uma implementação numa firma jurídica.',
    },
    'Pharma AI': {
      en: 'I have 10 years of pharma operations background (Grupo Moja Farmacja) and specialise in EU AI Act Annex III compliance for life sciences.',
      pl: 'Mam 10 lat doświadczenia w operacjach farmaceutycznych i specjalizuję się w zgodności z EU AI Act Aneks III.',
      pt: 'Tenho 10 anos de experiência em operações farmacêuticas e especializo-me em conformidade EU AI Act Anexo III para ciências da vida.',
    },
  };
  const industryProps = props[industry];
  if (!industryProps) {
    return lang === 'pl'
      ? 'Buduję bezpieczne, prywatne systemy AI, które pracują z danymi wrażliwymi bez ryzyka wycieku.'
      : lang === 'pt'
      ? 'Construo sistemas de IA seguros e privados que processam dados sensíveis sem risco de fuga.'
      : 'I build secure, private AI systems that handle sensitive data without cloud exposure.';
  }
  return industryProps[lang] ?? industryProps['en'];
}
