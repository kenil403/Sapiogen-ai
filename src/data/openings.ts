export interface Opening {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
}

export const openings: Opening[] = [
  {
    id: 'fullstack-astro',
    title: 'Full Stack Software Engineer — Astro',
    team: 'Engineering',
    location: 'Ahmedabad · On-site',
    type: 'Full-time',
    summary:
      'Build high-performance websites and modern web applications in the Astro framework. Minimum one year of hands-on experience and demonstrable Astro projects required.'
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    team: 'Engineering',
    location: 'Ahmedabad · On-site',
    type: 'Full-time',
    summary:
      'Design and ship AI systems in production — retrieval, evaluation, agentic workflows, and model orchestration. For engineers who have shipped real AI features, not just prototypes.'
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    team: 'Design',
    location: 'Ahmedabad · On-site',
    type: 'Full-time',
    summary:
      'Design interfaces for AI-native products — new interaction patterns, calm defaults, and the taste to know when to cut. Portfolio over credentials.'
  }
];
