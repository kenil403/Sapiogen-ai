export interface Post {
  slug: string;
  title: string;
  date: string;
  reading: string;
  tag: string;
  excerpt: string;
  body: string[]; // paragraphs
}

export const posts: Post[] = [
  {
    slug: 'architecting-products-around-intelligence',
    title: 'Architecting products around intelligence',
    date: '2025-10-12',
    reading: '7 min',
    tag: 'Engineering',
    excerpt:
      'A frame for designing software when the model is a first-class material — not a feature bolted on at the end.',
    body: [
      'Most AI features in production today are additions to a product that was designed before the model existed. A button that generates a draft. A sidebar that summarises a page. The underlying system is unchanged; the model is an accessory.',
      'The second generation of AI-native products looks different. The model is not an accessory; it is the material the product is made of. Workflows change shape. Interfaces defer to the model where the model is better, and surface controls to the human where the human is better. The system is shaped around a probability, not around a form submission.',
      'We think about three questions when architecting an AI-first product. First, which decisions are the model qualified to make, and which must stay with a person? Second, what does the system do when the model is wrong — because it will be? Third, how does the system get better at the thing you care about, continuously, after it is live?',
      'The honest answer to all three is engineering, not magic. Context, evaluation, retrieval, review loops, observability. The work is not glamorous. It is where the leverage is.'
    ]
  },
  {
    slug: 'evaluation-is-the-product',
    title: 'Evaluation is the product',
    date: '2025-09-28',
    reading: '5 min',
    tag: 'Systems',
    excerpt:
      'Why your evals shape your AI system more than your model choice does — and how we build eval harnesses from day one.',
    body: [
      'Teams spend weeks choosing a model and days — or no time at all — building the evaluation that tells them whether the model is working. The second decision has more impact on quality than the first.',
      'An eval harness is not a one-off benchmark. It is the test suite of an AI system. It defines what "good" means for your product, in cases you have agreed on in advance, and it tells you when a change makes things better or worse. Without it, you cannot ship a model update with any confidence.',
      'The practice is unglamorous. Curate a set of real inputs. Write down what the right answer looks like, or what a graded answer looks like. Run it against every change. Watch the trend. Argue about the failures. Add them to the set. Repeat.',
      'Teams that take this seriously can ship aggressively. Teams that do not, cannot — and often do not notice they cannot until a regression lands in production.'
    ]
  },
  {
    slug: 'the-economics-of-ai-first-engineering',
    title: 'The economics of AI-first engineering',
    date: '2025-09-10',
    reading: '6 min',
    tag: 'Strategy',
    excerpt:
      'Where the 10× actually comes from — and the specific cost structures that make AI-first teams uneconomic to compete with.',
    body: [
      'The "10× faster" line gets thrown around loosely. It is worth being specific. What AI-first engineering actually compresses is not keystrokes. It is cycles.',
      'A traditional team cycles between an engineer, a reviewer, a tester, a designer, and back. Each hop costs calendar time. AI-first engineers compress those hops because the system does more of the hopping — producing drafts, tests, and reviews that a senior engineer accepts, rejects, or edits in minutes instead of days.',
      'The economic consequence is that an AI-first team of five can produce the surface area of a traditional team of twenty, at a lower unit cost, with higher consistency. This is not a prediction; it is observable in teams working this way today.',
      'The implication for buyers is simple. Any software work you are commissioning in 2025 should assume this cost structure exists on the other side of the table. If your vendor is not working this way, the price you are being quoted is the price of their inefficiency, not the price of your work.'
    ]
  }
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
