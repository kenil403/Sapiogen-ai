export interface Service {
  id: string;
  title: string;
  short: string;
  detail: string;
  capabilities: string[];
}

export const services: Service[] = [
  {
    id: 'product',
    title: 'AI Powered Product Development',
    short:
      'Products engineered around intelligence from the first interaction to the final deployment.',
    detail:
      'We design and build end-to-end AI-native products where every workflow, interface, and system is architected around model capability rather than retrofitted to it. The result is software that compounds in value as it is used.',
    capabilities: [
      'AI-native product discovery and architecture',
      'Full-stack engineering with AI-first interfaces',
      'Model orchestration and multi-agent workflows',
      'Launch, iteration, and measurement'
    ]
  },
  {
    id: 'strategy',
    title: 'AI Strategy & Consulting',
    short:
      'Clear direction on where intelligence belongs in your product, operations, and roadmap.',
    detail:
      'We work with leadership teams to define the shape of their AI practice: which problems to attack first, which systems to rebuild versus augment, and how to measure business impact without theatre.',
    capabilities: [
      'AI opportunity mapping and prioritisation',
      'Build-vs-buy, model selection, and vendor strategy',
      'Roadmaps, operating models, and team design',
      'Risk, governance, and responsible deployment'
    ]
  },
  {
    id: 'systems',
    title: 'AI Development & Systems',
    short:
      'Durable AI systems — not demos. Built for production, built to be owned by your team.',
    detail:
      'We engineer the AI systems that sit behind reliable products: retrieval, evaluation, fine-tuning, guardrails, observability, and the connective tissue between models and the rest of your stack.',
    capabilities: [
      'Retrieval-augmented generation and context engineering',
      'Agentic workflows and tool-using systems',
      'Evaluation, observability, and continuous improvement',
      'Fine-tuning, distillation, and inference optimisation'
    ]
  },
  {
    id: 'automation',
    title: 'AI Automation & RPA',
    short:
      'Replace brittle manual work with intelligent automations that adapt instead of break.',
    detail:
      'We rebuild the repetitive, judgment-adjacent work inside operations, finance, support, and back-office with AI-driven automations that understand intent, handle exceptions, and improve over time.',
    capabilities: [
      'Process mining and automation design',
      'Document, email, and ticket intelligence',
      'Workflow orchestration across SaaS tools',
      'Human-in-the-loop review and exception handling'
    ]
  },
  {
    id: 'voice',
    title: 'Conversational & Voice AI',
    short:
      'Interfaces that listen, understand, and respond — in text and in natural voice.',
    detail:
      'We build conversational systems that go beyond scripted chatbots: contextual, multi-turn, voice-ready interfaces that reduce friction for customers and operators and work reliably at the edges of the conversation.',
    capabilities: [
      'Voice agents with low-latency speech pipelines',
      'Multi-channel chat across web, app, and messaging',
      'Grounded answers over your knowledge base',
      'Human handoff, analytics, and quality tooling'
    ]
  },
  {
    id: 'integration',
    title: 'AI Integration & Scaling',
    short:
      'Take a working AI capability and ship it everywhere it belongs — safely, at scale.',
    detail:
      'We integrate AI into the systems your business already runs on — CRMs, data warehouses, support platforms, internal tools — and operate it at scale with the reliability engineering those systems deserve.',
    capabilities: [
      'Integration with Salesforce, HubSpot, Snowflake, and more',
      'API design, SDKs, and internal developer platforms',
      'Rate-limit, cost, and capacity engineering',
      'Rollout strategy, change management, and enablement'
    ]
  },
  {
    id: 'infrastructure',
    title: 'AI Infrastructure Engineering',
    short:
      'The infrastructure that makes AI fast, affordable, and operable at production scale.',
    detail:
      'We design and run the infrastructure beneath AI products — serving, caching, routing, observability, security — so your systems stay fast and cost-controlled as usage grows.',
    capabilities: [
      'Model serving, routing, and multi-provider failover',
      'Cost, latency, and capacity engineering',
      'Secure deployment, VPC, and private model hosting',
      'Logging, metrics, tracing, and incident response'
    ]
  },
  {
    id: 'data',
    title: 'AI Data Systems Engineering',
    short:
      'Data pipelines, embeddings, and knowledge bases engineered for AI as a first-class consumer.',
    detail:
      'We build the data systems that make intelligence possible: clean, versioned, well-governed sources of truth, vector stores, and feature pipelines engineered specifically for AI workloads.',
    capabilities: [
      'Vector databases and hybrid retrieval systems',
      'ETL, CDC, and streaming pipelines for AI',
      'Data quality, lineage, and governance',
      'Knowledge base construction and maintenance'
    ]
  }
];
