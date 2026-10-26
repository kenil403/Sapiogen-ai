import type { APIRoute } from 'astro';
import { posts } from '../data/posts';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href || process.env.PUBLIC_SITE_URL || 'https://sapiogenai.com').replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const staticPaths = [
    { path: '/', priority: '1.0' },
    { path: '/about', priority: '0.8' },
    { path: '/services', priority: '0.9' },
    { path: '/process', priority: '0.8' },
    { path: '/work', priority: '0.8' },
    { path: '/careers', priority: '0.8' },
    { path: '/blog', priority: '0.7' },
    { path: '/contact', priority: '0.9' },
    { path: '/privacy', priority: '0.3' },
    { path: '/terms', priority: '0.3' }
  ];

  const urls = [
    ...staticPaths.map(
      (p) => `  <url>
    <loc>${base}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...posts.map(
      (p) => `  <url>
    <loc>${base}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <priority>0.6</priority>
  </url>`
    )
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
