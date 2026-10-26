export interface CaseStudy {
  id: string;
  title: string;
  sector: string;
  summary: string;
  outcome: string;
  stack: string[];
  year: string;
}

/**
 * Representative engagements. Named clients and metrics
 * are redacted; replace with real case studies when published.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: 'retrieval-platform-fintech',
    title: 'Retrieval platform for a fintech underwriter',
    sector: 'Financial Services',
    summary:
      'Rebuilt a document-heavy underwriting workflow around a retrieval and reasoning layer so analysts could decision applications in minutes instead of hours.',
    outcome:
      'Decision time reduced by an order of magnitude; analyst capacity re-pointed from reading to judgement.',
    stack: ['Retrieval', 'Evaluation harness', 'Guardrails', 'Postgres + pgvector'],
    year: '2025'
  },
  {
    id: 'voice-agent-logistics',
    title: 'Voice agent for a logistics operator',
    sector: 'Logistics',
    summary:
      'Shipped a low-latency voice agent that handles inbound dispatch calls, confirms details, and files tickets in the operator\u2019s existing system.',
    outcome:
      'Night-shift queue cleared autonomously; human operators escalate only edge cases.',
    stack: ['Streaming STT/TTS', 'Realtime orchestration', 'CRM integration'],
    year: '2025'
  },
  {
    id: 'ops-automation-saas',
    title: 'Operations automation for a B2B SaaS',
    sector: 'SaaS',
    summary:
      'Replaced a sprawl of brittle Zapier workflows and manual spreadsheets with an evaluated AI automation layer that reconciles tickets, invoices, and customer records.',
    outcome:
      'Hundreds of hours of manual back-office work removed per month, with full audit trail.',
    stack: ['Workflow engine', 'LLM routing', 'Human-in-the-loop review'],
    year: '2024'
  },
  {
    id: 'infra-platform-enterprise',
    title: 'AI infrastructure for an enterprise platform',
    sector: 'Enterprise Software',
    summary:
      'Designed and operated the serving layer behind a multi-tenant AI product: routing, caching, failover, and per-tenant cost controls.',
    outcome:
      'Sub-second p95 latency maintained across model providers; per-tenant unit economics modelled and enforced.',
    stack: ['Gateway + router', 'Caching layer', 'Observability stack'],
    year: '2024'
  }
];
