export interface Phase {
  id: string;
  index: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export const phases: Phase[] = [
  {
    id: 'frame',
    index: '01',
    title: 'Frame',
    duration: '1–2 weeks',
    description:
      'We start by framing the real problem — not the brief as written, but the system behaviour you want on the other side. We map the current workflow, the people in it, and where intelligence can earn its keep.',
    deliverables: [
      'Problem statement and target outcomes',
      'Opportunity map with build-vs-buy per surface',
      'Milestone plan and success criteria'
    ]
  },
  {
    id: 'architect',
    index: '02',
    title: 'Architect',
    duration: '1–3 weeks',
    description:
      'We design the system AI-first — the model surface, the retrieval and context strategy, the evaluation harness, the human review loop, the production integration. Decisions are written down so the whole team can argue with them.',
    deliverables: [
      'System architecture and data model',
      'Evaluation strategy with first eval set',
      'Technical risks and mitigations'
    ]
  },
  {
    id: 'build',
    index: '03',
    title: 'Build',
    duration: 'Project dependent',
    description:
      'We engineer in short, visible increments. Every change ships behind feature flags, every behaviour is evaluated, and the production system is treated as the source of truth from day one.',
    deliverables: [
      'Working increments weekly',
      'Evaluation dashboards and alerts',
      'Documentation for the engineers taking it over'
    ]
  },
  {
    id: 'operate',
    index: '04',
    title: 'Operate',
    duration: 'Ongoing or handover',
    description:
      'We stand with the system in production — on-call, iterating against real usage — until your team is confidently operating it. When you want full ownership, we hand over cleanly with runbooks and reviews.',
    deliverables: [
      'Production runbooks and SLOs',
      'Cost, latency, and quality dashboards',
      'Team enablement and knowledge transfer'
    ]
  }
];
