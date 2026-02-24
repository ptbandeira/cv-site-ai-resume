// Lead Finder Agent — ANALOG AI VERSION
// ICP: 1–50 employee traditional professional services (law, accounting, insurance, finance)
//      LAGGARDS who are BEHIND competitors on digital/AI adoption — NOT early adopters
// Strategy:
//   Mode 1 "Sector Signal" — find articles about a SECTOR going digital → Pedro reaches out
//           to similar firms in that sector that haven't moved yet
//   Mode 2 "Direct Pain"   — find SMBs explicitly expressing struggle / falling behind
// Sources: Google News RSS (multilingual: en, pl, pt-PT, es, fr, de, it), Hacker News
// No Playwright needed — pure HTTP fetch

import { load } from 'cheerio';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Lead } from './types';

// ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Feedback boosts (loaded from feedback/good-leads.txt) ────────────────────
// Pedro adds good article URLs → system boosts leads from same sources
interface FeedbackBoosts { domains: Set<string> }
let FEEDBACK_BOOSTS: FeedbackBoosts = { domains: new Set() };

function loadFeedbackBoosts(): void {
  const feedbackPath = path.join(__dirname, '..', 'feedback', 'good-leads.txt');
  if (!fs.existsSync(feedbackPath)) return;
  const lines = fs.readFileSync(feedbackPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    try {
      const hostname = new URL(trimmed).hostname.replace(/^www\./, '');
      FEEDBACK_BOOSTS.domains.add(hostname);
    } catch (_) { /* skip non-URL lines */ }
  }
  if (FEEDBACK_BOOSTS.domains.size > 0) {
    console.log(`📚 Feedback: ${FEEDBACK_BOOSTS.domains.size} trusted domains loaded (${Array.from(FEEDBACK_BOOSTS.domains).join(', ')})`);
  }
}

function applyFeedbackBoost(url: string, priority: Lead['priority']): Lead['priority'] {
  if (FEEDBACK_BOOSTS.domains.size === 0) return priority;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    if (FEEDBACK_BOOSTS.domains.has(hostname)) {
      if (priority === 'cold') return 'warm';
      if (priority === 'warm') return 'hot';
    }
  } catch (_) {}
  return priority;
}

// ── Known publishers / enterprises to exclude from leads ─────────────────────
// Media outlets, think tanks, large enterprises — NOT SMB prospects.
const KNOWN_PUBLISHERS = new Set([
  // Legal media (English)
  'law360', 'legaltech news', 'above the law', 'american lawyer', 'legal week',
  'the national law review', 'the national law journal', 'legal cheek',
  'lawyers monthly', 'the lawyer', 'legal futures', 'attorneys at law magazine',
  'artificial lawyer', 'lawsites', 'jd supra',
  // Privacy / AI associations & think tanks
  'iapp', 'international association of privacy professionals',
  'future of privacy forum', 'electronic frontier foundation', 'eff',
  'ai now institute', 'partnership on ai', 'center for ai safety',
  'ada lovelace institute', 'alan turing institute', 'real instituto elcano',
  'digitaleurope', 'tech policy press', 'economist impact',
  // General tech & business media (English)
  'techcrunch', 'the verge', 'wired', 'ars technica', 'zdnet', 'cnet',
  'venturebeat', 'the information', 'protocol', 'semafor', 'axios',
  'business insider', 'fortune', 'forbes', 'bloomberg', 'reuters',
  'the guardian', 'financial times', 'ft', 'wall street journal', 'wsj',
  'new york times', 'nyt', 'washington post', 'bbc', 'bbc news',
  'computerworld', 'infoworld', 'networkworld', 'the register', 'theregister',
  // AI-specific media
  'the ai journal', 'ai business', 'ai news', 'towards data science',
  'analytics vidhya', 'kdnuggets', 'papers with code',
  // Newswires / PR distribution
  'financialcontent', 'tmx newsfile', 'tmxnewsfile', 'newswire', 'pr newswire',
  'businesswire', 'business wire', 'globe newswire', 'accesswire', 'ein presswire',
  // Big law firms (large enterprises, not SMBs)
  'orrick', 'orrick.com', 'crowell', 'crowell & moring',
  'allen & overy', 'linklaters', 'freshfields', 'clifford chance',
  'baker mckenzie', 'dentons', 'norton rose', 'hogan lovells',
  'latham & watkins', 'skadden', 'sidley', 'kirkland', 'weil gotshal',
  'baker donelson', 'harris beach', 'harris beach murtha',
  // Large enterprises (not SMBs)
  'wolters kluwer', 'lexisnexis', 'thomson reuters', 'westlaw', 'relx',
  'microsoft', 'google', 'amazon', 'meta', 'apple', 'ibm', 'oracle', 'sap',
  'microsoft source', 'oracle blogs', 'thomson reuters legal solutions',
  'deloitte', 'pwc', 'kpmg', 'ey', 'ernst & young', 'mckinsey', 'bcg', 'bain',
  'accenture', 'capgemini', 'infosys', 'tcs', 'wipro', 'cognizant',
  // Universities
  'mit', 'stanford', 'harvard', 'oxford', 'cambridge',
  'london school of economics', 'lse', 'imperial college',
  // Polish media
  'polskie radio', 'oko.press', 'tvn', 'tvp', 'gazeta wyborcza',
  'onet', 'wp.pl', 'interia', 'oficjalna strona prezydenta', 'prezydent.pl',
  'rzeczpospolita', 'gazeta prawna', 'prawo.pl', 'lex.pl', 'nowoczesna firma',
  'dziennik gazeta prawna', 'puls biznesu', 'wyborcza',
  // Portuguese media
  'publico', 'jornal de negocios', 'expresso', 'observador', 'eco',
  'sapo', 'dn.pt', 'cmjornal', 'rtp', 'sic noticias', 'tvi24', 'ionline',
  'dinheiro vivo', 'jornal economico', 'executivo', 'nit.pt', 'jornaldenegocios',
  // Spanish media
  'el pais', 'elpais', 'el mundo', 'abc.es', 'expansion', 'cincodias',
  'la razon', 'la vanguardia', 'el confidencial', 'vozpopuli', 'economia digital',
  'cinco dias', 'idealista news', 'elespanol', 'eldiario',
  // French media
  'le monde', 'le figaro', 'les echos', 'bfmtv', 'liberation', 'le point',
  'l express', 'challenges', 'capital.fr', 'latribune', 'la tribune',
  'lefigaro', 'lemonde',
  // German media
  'sueddeutsche', 'faz', 'spiegel', 'zeit', 'handelsblatt', 'wirtschaftswoche',
  'welt', 'focus', 'manager magazin', 'wiwo', 'heise', 't-online', 'gruenderszene',
  // Italian media
  'corriere della sera', 'la repubblica', 'il sole 24 ore', 'la stampa',
  'il corriere', 'il giornale', 'sole24ore', 'corrierecomunicazioni', 'startupitalia',
  // Other
  'valor economico', 'valor econômico',
]);

function isKnownPublisher(name: string | null | undefined): boolean {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  // Strip leading articles in any language (the, a, an, la, le, el, les, los, die, il, lo)
  const stripped = lower.replace(/^(the|a|an|la|le|el|les|los|die|il|lo|das|der|den) /, '');
  if (KNOWN_PUBLISHERS.has(lower)) return true;
  if (KNOWN_PUBLISHERS.has(stripped)) return true;
  for (const pub of KNOWN_PUBLISHERS) {
    if (lower.startsWith(pub) || stripped.startsWith(pub)) return true;
    if (lower.includes(' | ' + pub)) return true;
    if (stripped.startsWith(pub) || lower.includes(pub)) return true;
  }
  return false;
}

// Stable ID from URL — same article = same ID across runs (enables Supabase dedup)
function stableId(prefix: string, url: string): string {
  return `${prefix}-${createHash('md5').update(url).digest('hex').slice(0, 16)}`;
}

// ─── Locale-aware query definition ───────────────────────────────────────────
interface NewsQuery {
  query: string;
  lang: string;    // Google News hl param (e.g. 'pl', 'pt-PT', 'es', 'fr', 'de', 'it')
  country: string; // Google News gl param (e.g. 'PL', 'PT', 'ES', 'FR', 'DE', 'IT')
  ceid: string;    // Google News ceid param (e.g. 'PL:pl', 'PT:pt-PT')
  market: string;  // Human-readable market label (e.g. 'Poland', 'Portugal')
}

// ─── ICP-tuned search queries (SECTOR-LAGGARD FOCUS) ─────────────────────────
// ICP: 1–50 employee traditional professional services
// Target: firms BEHIND their sector — no AI/digital presence while competitors move
// NOT looking for: Fortune 500, VC-backed startups, early adopter press releases
const GOOGLE_NEWS_QUERIES: NewsQuery[] = [

  // ── English: Sector-laggard signals (UK/Europe) ──────────────────────────
  {
    query: '"law firm" ("AI" OR "legal tech" OR "automation") ("small" OR "independent" OR "boutique") ("sector adopting" OR "industry trend" OR "firms are" OR "catching up")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK',
  },
  {
    query: '"accounting" OR "accountant" ("AI" OR "automation" OR "cloud software") ("small firms" OR "small practices" OR "independent") ("adopting" OR "trend" OR "switching" OR "wave")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK',
  },
  {
    query: '"insurance broker" ("AI" OR "insurtech" OR "automation" OR "digital") ("independent" OR "small" OR "regional") ("sector" OR "trend" OR "adopting" OR "industry")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK',
  },
  // Direct pain — SMBs explicitly struggling / falling behind
  {
    query: '"small business" OR "small firm" ("AI" OR "automation") ("falling behind" OR "losing clients" OR "overwhelmed" OR "struggling to implement" OR "don\'t know where to start")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'Europe',
  },
  {
    query: '"professional services" ("AI" OR "automation") ("behind competitors" OR "catching up" OR "lagging" OR "still using spreadsheets" OR "manual processes")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'Europe',
  },
  {
    query: '"EU AI Act" ("law firm" OR "accounting" OR "insurance" OR "SMB" OR "small business") ("compliance" OR "prepare" OR "deadline" OR "impact")',
    lang: 'en', country: 'GB', ceid: 'GB:en', market: 'Europe',
  },

  // ── Polish (Poland) ──────────────────────────────────────────────────────
  {
    // Law firm sector + AI trend in Poland
    query: '"kancelaria" ("sztuczna inteligencja" OR "AI" OR "automatyzacja") ("sektor" OR "branża" OR "trend" OR "kancelarie coraz")',
    lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland',
  },
  {
    // Accounting offices + AI trend
    query: '"biuro rachunkowe" OR "biura rachunkowe" ("AI" OR "sztuczna inteligencja" OR "automatyzacja") ("branża" OR "trend" OR "coraz więcej" OR "transformacja")',
    lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland',
  },
  {
    // Small businesses struggling / falling behind in Poland
    query: '"mała firma" OR "małe firmy" OR "MŚP" ("sztuczna inteligencja" OR "AI" OR "automatyzacja") ("trudności" OR "jak zacząć" OR "wyzwanie" OR "za konkurencją" OR "tracą klientów")',
    lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland',
  },
  {
    // Insurance brokers Poland
    query: '"pośrednik ubezpieczeniowy" OR "broker ubezpieczeniowy" ("digitalizacja" OR "AI" OR "automatyzacja" OR "sektor" OR "branża")',
    lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland',
  },

  // ── European Portuguese (Portugal) ──────────────────────────────────────
  {
    query: '"escritório de advogados" OR "escritórios de advogados" ("inteligência artificial" OR "IA" OR "legaltech") ("setor" OR "tendência" OR "adoção" OR "pequenos" OR "a adaptar")',
    lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal',
  },
  {
    query: '"contabilidade" OR "contabilista" ("inteligência artificial" OR "IA" OR "automatização") ("PME" OR "pequenas empresas" OR "setor" OR "adoção" OR "tendência")',
    lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal',
  },
  {
    query: '"pequenas empresas" OR "PME" ("inteligência artificial" OR "IA" OR "digitalização") ("atrás" OR "perder clientes" OR "concorrência" OR "dificuldades" OR "como começar")',
    lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal',
  },
  {
    query: '"corretora de seguros" OR "mediador de seguros" ("IA" OR "digitalização" OR "transformação digital") ("independente" OR "pequena" OR "setor" OR "tendência")',
    lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal',
  },

  // ── Spanish (Spain) ──────────────────────────────────────────────────────
  {
    query: '"despacho de abogados" OR "despachos de abogados" ("inteligencia artificial" OR "legaltech" OR "automatización") ("sector" OR "tendencia" OR "pequeño" OR "independiente" OR "adopción")',
    lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain',
  },
  {
    query: '"asesoría" OR "gestoría" ("inteligencia artificial" OR "IA" OR "automatización") ("PYME" OR "pequeñas" OR "sector" OR "adopción" OR "tendencia")',
    lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain',
  },
  {
    query: '"pequeñas empresas" OR "PYME" ("inteligencia artificial" OR "IA" OR "digitalización") ("rezagadas" OR "atrás" OR "perder clientes" OR "competencia" OR "cómo empezar")',
    lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain',
  },
  {
    query: '"correduría de seguros" OR "corredor de seguros" ("digitalización" OR "IA" OR "insurtech") ("independiente" OR "pequeña" OR "sector" OR "tendencia")',
    lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain',
  },

  // ── French (France) ──────────────────────────────────────────────────────
  {
    query: `"cabinet d'avocats" OR "cabinets d'avocats" ("intelligence artificielle" OR "legaltech" OR "automatisation") ("secteur" OR "tendance" OR "petit" OR "indépendant" OR "adoption")`,
    lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France',
  },
  {
    query: `"cabinet comptable" OR "expert-comptable" ("intelligence artificielle" OR "IA" OR "automatisation") ("TPE" OR "PME" OR "petites entreprises" OR "secteur" OR "tendance")`,
    lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France',
  },
  {
    query: `"petites entreprises" OR "PME" ("intelligence artificielle" OR "IA" OR "numérique") ("en retard" OR "perdre des clients" OR "concurrence" OR "difficultés" OR "comment commencer")`,
    lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France',
  },
  {
    query: `"courtier en assurance" OR "courtier d'assurance" ("digitalisation" OR "IA" OR "insurtech") ("indépendant" OR "petit" OR "secteur" OR "tendance")`,
    lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France',
  },

  // ── German (Germany / Austria / Switzerland) ─────────────────────────────
  {
    query: '"Kanzlei" OR "Anwaltskanzlei" ("Künstliche Intelligenz" OR "KI" OR "Legal Tech") ("Branche" OR "Trend" OR "Digitalisierung" OR "kleiner" OR "immer mehr")',
    lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany',
  },
  {
    query: '"Steuerberater" OR "Steuerberatung" ("KI" OR "Automatisierung" OR "Software") ("kleine" OR "mittelständische" OR "Branche" OR "Trend" OR "Einzelpraxis")',
    lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany',
  },
  {
    query: '"Kleinunternehmen" OR "Mittelstand" ("Künstliche Intelligenz" OR "KI" OR "Automatisierung") ("Rückstand" OR "Konkurrenz" OR "Herausforderung" OR "überwältigt" OR "hinterher")',
    lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany',
  },
  {
    query: '"Versicherungsmakler" OR "Versicherungsvermittler" ("Digitalisierung" OR "KI" OR "InsurTech") ("unabhängig" OR "klein" OR "Branche" OR "Trend")',
    lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany',
  },

  // ── Italian (Italy) ──────────────────────────────────────────────────────
  {
    query: '"studio legale" OR "studi legali" ("intelligenza artificiale" OR "legaltech" OR "automazione") ("settore" OR "tendenza" OR "piccolo" OR "indipendente" OR "adozione")',
    lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy',
  },
  {
    query: '"commercialista" OR "studio commercialista" ("intelligenza artificiale" OR "IA" OR "automazione") ("piccole imprese" OR "PMI" OR "settore" OR "adozione" OR "tendenza")',
    lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy',
  },
  {
    query: '"piccole imprese" OR "PMI" ("intelligenza artificiale" OR "IA" OR "digitalizzazione") ("in ritardo" OR "perdere clienti" OR "concorrenza" OR "difficoltà" OR "come iniziare")',
    lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy',
  },
  {
    query: '"broker assicurativo" OR "mediatore assicurativo" ("digitalizzazione" OR "IA" OR "insurtech") ("indipendente" OR "piccolo" OR "settore" OR "tendenza")',
    lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy',
  },
];

// Signals that definitely mean this is NOT a Pedro ICP lead
const NEGATIVE_COMPANY_FILTER = [
  'google', 'microsoft', 'amazon', 'meta', 'apple', 'nvidia', 'openai', 'anthropic',
  'novo nordisk', 'pfizer', 'roche', 'johnson', 'novartis', 'astrazeneca',
  'goldman sachs', 'jpmorgan', 'blackrock', 'bank of america',
  'series a', 'series b', 'series c', 'funding round', 'raises $', 'raises €', 'venture capital',
];

function isNegativeLead(text: string): boolean {
  const t = text.toLowerCase();
  return NEGATIVE_COMPANY_FILTER.some(term => t.includes(term));
}

// ─── Industry classifier (multilingual) ──────────────────────────────────────
const INDUSTRY_KEYWORDS: [string, Lead['industry']][] = [
  // Legal — English
  ['law firm', 'legal'], ['legal', 'legal'], ['attorney', 'legal'], ['counsel', 'legal'],
  ['barrister', 'legal'], ['solicitor', 'legal'], ['legaltech', 'legal'],
  // Legal — Polish
  ['kancelaria', 'legal'], ['prawna', 'legal'], ['adwokat', 'legal'], ['radca prawny', 'legal'],
  // Legal — Portuguese
  ['escritório de advogados', 'legal'], ['advogado', 'legal'], ['jurídico', 'legal'],
  // Legal — Spanish
  ['despacho de abogados', 'legal'], ['abogado', 'legal'], ['bufete', 'legal'], ['legaltech', 'legal'],
  // Legal — French
  ["cabinet d'avocats", 'legal'], ['avocat', 'legal'], ['cabinet juridique', 'legal'],
  // Legal — German
  ['kanzlei', 'legal'], ['rechtsanwalt', 'legal'], ['anwaltskanzlei', 'legal'], ['anwalt', 'legal'],
  // Legal — Italian
  ['studio legale', 'legal'], ['avvocato', 'legal'], ['studi legali', 'legal'],

  // Finance/Accounting/Insurance — English
  ['bank', 'finance'], ['financ', 'finance'], ['insurance', 'finance'],
  ['accounting', 'finance'], ['accountant', 'finance'], ['wealth', 'finance'],
  ['hedge fund', 'finance'], ['insurtech', 'finance'],
  // Finance/Accounting/Insurance — Polish
  ['biuro rachunkowe', 'finance'], ['księgowość', 'finance'], ['ubezpieczenia', 'finance'],
  ['pośrednik ubezpieczeniowy', 'finance'], ['doradca finansowy', 'finance'],
  // Finance/Accounting/Insurance — Portuguese
  ['contabilidade', 'finance'], ['contabilista', 'finance'], ['seguradora', 'finance'],
  ['corretora de seguros', 'finance'], ['mediador de seguros', 'finance'],
  // Finance/Accounting/Insurance — Spanish
  ['asesoría fiscal', 'finance'], ['gestoría', 'finance'], ['correduría de seguros', 'finance'],
  ['corredor de seguros', 'finance'], ['asesor fiscal', 'finance'],
  // Finance/Accounting/Insurance — French
  ['cabinet comptable', 'finance'], ['expert-comptable', 'finance'],
  ['courtier en assurance', 'finance'], ["courtier d'assurance", 'finance'],
  // Finance/Accounting/Insurance — German
  ['steuerberater', 'finance'], ['steuerberatung', 'finance'],
  ['versicherungsmakler', 'finance'], ['versicherungsvermittler', 'finance'],
  // Finance/Accounting/Insurance — Italian
  ['commercialista', 'finance'], ['studio commercialista', 'finance'],
  ['broker assicurativo', 'finance'], ['mediatore assicurativo', 'finance'],

  // Healthcare
  ['hospital', 'healthcare'], ['healthcare', 'healthcare'], ['health care', 'healthcare'],
  ['clinic', 'healthcare'], ['medical', 'healthcare'],

  // Pharma
  ['pharma', 'pharma'], ['pharmaceutical', 'pharma'], ['biotech', 'pharma'], ['drug', 'pharma'],
];

function detectIndustry(text: string): Lead['industry'] {
  const lower = text.toLowerCase();
  for (const [kw, industry] of INDUSTRY_KEYWORDS) {
    if (lower.includes(kw)) return industry;
  }
  return 'other';
}

// ─── Priority scorer (multilingual) ──────────────────────────────────────────
// Hot  = explicit pain / company/person actively struggling or falling behind
// Warm = sector-level transition signal (Pedro targets the non-movers in that sector)
// Cold = general professional services + AI news
function scorePriority(text: string): Lead['priority'] {
  const t = text.toLowerCase();

  const hotSignals = [
    // English — direct pain
    'struggling', 'failed', 'failure', 'problem', 'behind',
    "don't know", 'overwhelmed', 'confused', 'worried',
    'seeking help', 'looking for help', 'need a', 'hire a', 'fractional',
    'falling behind', 'losing clients', 'lost clients',
    'still using spreadsheets', 'no website', 'pen and paper', 'manual process',
    'deadline', 'penalty', 'fine', 'non-compliant', 'audit', 'enforcement',
    'where to start', 'getting left behind', 'cannot keep up', 'cant keep up',
    // Polish — direct pain
    'trudności', 'jak zacząć', 'szukamy pomocy', 'za konkurencją',
    'tracą klientów', 'nie wiemy', 'ręczne procesy', 'brak strony',
    'jak wdrożyć', 'nie wiedzą jak',
    // Portuguese — direct pain
    'dificuldades', 'como começar', 'precisamos de ajuda',
    'a perder clientes', 'sem website', 'processos manuais',
    'ficando para trás', 'não sabem como',
    // Spanish — direct pain
    'dificultades', 'cómo empezar', 'buscamos ayuda',
    'perdiendo clientes', 'sin web', 'procesos manuales',
    'quedarse atrás', 'no saben cómo',
    // French — direct pain
    'difficultés', 'comment commencer', 'cherchons aide',
    'perdre des clients', 'sans site web', 'processus manuels',
    'prendre du retard', 'ne savent pas comment',
    // German — direct pain
    'schwierigkeiten', 'wie anfangen', 'suchen hilfe',
    'kunden verlieren', 'keine website', 'manuelle prozesse',
    'den anschluss verlieren', 'wissen nicht wie',
    // Italian — direct pain
    'difficoltà', 'come iniziare', 'cerchiamo aiuto',
    'perdere clienti', 'senza sito', 'processi manuali',
    'rimanere indietro', 'non sanno come',
  ];

  const warmSignals = [
    // English — sector transition (sector moving → laggards to reach)
    'sector adopting', 'industry trend', 'law firms are', 'accountants are',
    'brokers are', 'wave of adoption', 'catching up', 'rapidly adopting',
    'firms are turning to', 'practices are embracing', 'industry is moving',
    'announced', 'launches', 'launched', 'beginning', 'starting',
    'partnership', 'initiative', 'exploring', 'piloting', 'strategy',
    'eu ai act', 'ai regulation', 'ai governance', 'compliance program',
    'preparing for', 'getting ready', 'ai policy', 'digital transformation',
    // Polish — sector transition
    'transformacja cyfrowa', 'digitalizacja', 'wdrożenie ai', 'automatyzacja branży',
    'branża się zmienia', 'coraz więcej firm', 'kancelarie zaczynają',
    'biura rachunkowe przechodzą', 'sektor się digitalizuje',
    // Portuguese — sector transition
    'transformação digital', 'adoção de ia', 'digitalização', 'automação do setor',
    'setor em mudança', 'cada vez mais empresas', 'escritórios começam',
    'tendência do setor', 'setor adota',
    // Spanish — sector transition
    'transformación digital', 'adopción de ia', 'digitalización',
    'automatización del sector', 'tendencia del sector',
    'cada vez más despachos', 'asesorías empiezan',
    // French — sector transition
    'transformation numérique', 'adoption de ia', 'numérisation',
    'automatisation du secteur', 'tendance du secteur',
    'de plus en plus de cabinets', 'cabinets commencent',
    // German — sector transition
    'digitale transformation', 'ki-einführung', 'digitalisierung',
    'branchentrend', 'immer mehr kanzleien', 'branche verändert sich',
    'zunehmend einführen',
    // Italian — sector transition
    'trasformazione digitale', 'adozione dell ia', 'digitalizzazione',
    'automazione del settore', 'tendenza del settore',
    'sempre più studi', 'settore si digitalizza',
  ];

  if (hotSignals.some(s => t.includes(s))) return 'hot';
  if (warmSignals.some(s => t.includes(s))) return 'warm';
  return 'cold';
}

// ─── Company name extractor ───────────────────────────────────────────────────
// For non-English content or unextractable names, returns a sector signal label
// so the Slack digest clearly communicates "this is a sector signal, find laggards"
function extractCompanyFromTitle(title: string, sourceName: string, market: string): string {
  // English pattern: "OrgName verb AI..." at start
  const match = title.match(/^([A-Z][A-Za-z0-9&\s',.-]{2,40}?)\s+(launches|announces|says|warns|faces|struggles|adopts|pilots|hires|seeks|reports)/);
  if (match) {
    const extracted = match[1].trim();
    if (!isKnownPublisher(extracted)) return extracted;
  }
  // Fallback: "How OrgName is..."
  const match2 = title.match(/(?:How|Why|When)\s+([A-Z][A-Za-z0-9&\s',.-]{2,40}?)\s+(?:is|are|was|has)/);
  if (match2) {
    const extracted = match2[1].trim();
    if (!isKnownPublisher(extracted)) return extracted;
  }
  // For non-English or sector-level articles: label clearly as sector signal
  return `📡 [${market}] Sector Signal`;
}

// ─── Google News RSS scraper (locale-aware) ───────────────────────────────────
async function scrapeGoogleNews(nq: NewsQuery): Promise<Lead[]> {
  const leads: Lead[] = [];
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(nq.query)}&hl=${nq.lang}&gl=${nq.country}&ceid=${nq.ceid}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/rss+xml,application/xml,text/xml,*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    $('item').slice(0, 6).each((_, el) => {
      const title       = $(el).find('title').first().text().trim();
      const link        = $(el).find('link').first().text().trim();
      const sourceName  = $(el).find('source').first().text().trim();
      const description = $(el).find('description').first().text().replace(/<[^>]*>/g, '').trim();

      if (!title || !link) return;

      // Skip if the news SOURCE itself is a known publisher/media outlet
      if (isKnownPublisher(sourceName)) {
        console.log(`  ⏭  Skip publisher source: ${sourceName}`);
        return;
      }

      const fullText = `${title} ${description} ${sourceName}`;

      // Skip Fortune 500 / VC news
      if (isNegativeLead(fullText)) {
        console.log(`  ⏭  Skip negative: ${title.slice(0, 55)}`);
        return;
      }

      const industry    = detectIndustry(fullText);
      const priority    = applyFeedbackBoost(link, scorePriority(fullText));
      const companyName = extractCompanyFromTitle(title, sourceName, nq.market);

      // Publisher filter: skip if extracted company is a known media/enterprise
      // (but keep sector signal labels that start with 📡)
      if (!companyName.startsWith('📡') && isKnownPublisher(companyName)) {
        console.log(`  ⏭  Skip publisher company: ${companyName}`);
        return;
      }

      leads.push({
        id: stableId('gn', link),
        source: 'news',
        company_name: companyName,
        industry,
        signal: title,
        signal_url: link,
        priority,
        scraped_at: new Date().toISOString(),
        synced_to_hubspot: false,
      });
    });

    console.log(`  ✓ [${nq.market}/${nq.lang}] "${nq.query.slice(0, 40)}...": ${leads.length} leads`);
  } catch (err: any) {
    console.log(`  ✗ [${nq.market}] "${nq.query.slice(0, 40)}...": ${err.message}`);
  }
  return leads;
}

// ─── Hacker News API (SMB pain point discussions) ────────────────────────────
async function scrapeHackerNews(): Promise<Lead[]> {
  const leads: Lead[] = [];
  try {
    // Queries focused on SMB pain and professional services lagging behind
    const queries = [
      'small law firm AI automation implementation',
      'accounting practice software automation small',
      'professional services falling behind AI digital',
      'SMB small business AI where to start implementation',
    ];
    const since = Math.floor(Date.now() / 1000) - 7 * 24 * 3600; // last 7 days

    for (const q of queries) {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=8&numericFilters=created_at_i>${since}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data: any = await res.json();

      for (const hit of data.hits || []) {
        if (!hit.title) continue;
        const storyUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        const fullText = `${hit.title} ${hit.story_text || ''}`;
        const industry = detectIndustry(fullText);
        if (isNegativeLead(fullText)) continue;

        leads.push({
          id: `hn-${hit.objectID}`,
          source: 'news',
          company_name: extractCompanyFromTitle(hit.title, 'HN Discussion', 'HN'),
          industry: industry === 'other' ? 'other' : industry,
          signal: hit.title,
          signal_url: storyUrl,
          priority: hit.points > 100 ? 'hot' : hit.points > 30 ? 'warm' : 'cold',
          scraped_at: new Date().toISOString(),
          synced_to_hubspot: false,
        });
      }
    }
    console.log(`  ✓ Hacker News: ${leads.length} items`);
  } catch (err: any) {
    console.log(`  ✗ Hacker News: ${err.message}`);
  }
  return leads;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function runLeadFinderSwarmFree(): Promise<Lead[]> {
  console.log('🎯 ICP: 1–50 employee traditional professional services (law, accounting, insurance)');
  console.log('🎯 Mode: Sector-laggard signals — firms BEHIND competitors on AI/digital\n');

  // Load feedback boosts — Pedro's good examples teach the system what to find more of
  loadFeedbackBoosts();

  // Run all Google News locale queries in parallel (batched to avoid rate limits)
  console.log('📰 Scraping Google News (multilingual — en, pl, pt-PT, es, fr, de, it)...');
  const googleLeads = await Promise.all(GOOGLE_NEWS_QUERIES.map(nq => scrapeGoogleNews(nq)));

  console.log('\n🔶 Scraping Hacker News (SMB pain discussions)...');
  const hnLeads = await scrapeHackerNews();

  // Merge + deduplicate by signal_url
  const all = [...googleLeads.flat(), ...hnLeads];
  const seen = new Set<string>();
  const unique = all.filter(lead => {
    if (seen.has(lead.signal_url)) return false;
    seen.add(lead.signal_url);
    return true;
  });

  const hot  = unique.filter(l => l.priority === 'hot');
  const warm = unique.filter(l => l.priority === 'warm');
  const cold = unique.filter(l => l.priority === 'cold');

  console.log(`\n✅ Found ${unique.length} unique leads`);
  console.log(`   Hot:  ${hot.length}`);
  console.log(`   Warm: ${warm.length}`);
  console.log(`   Cold: ${cold.length}`);
  console.log(`\n💡 Sector Signal leads (📡): reach out to similar firms that haven't adopted AI yet`);

  return unique;
}
