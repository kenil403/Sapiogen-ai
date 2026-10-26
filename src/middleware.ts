import { defineMiddleware } from 'astro:middleware';

/**
 * Security middleware — applies strict headers to every response.
 * This is the Astro-native replacement for Express's helmet.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Clone headers (some responses have read-only headers)
  const headers = new Headers(response.headers);

  // --- Content Security Policy ---
  // Allow self + Google Fonts; forbid inline scripts without hashes (Astro bundles its scripts).
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Astro injects small inline hydration scripts and prefetch hints; allow self + unsafe-inline for them.
    // unsafe-inline for scripts is a tradeoff; tighten with hashes when you have a build pipeline that computes them.
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests"
  ].join('; ');

  headers.set('Content-Security-Policy', csp);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()'
  );
  headers.set('X-DNS-Prefetch-Control', 'off');
  headers.set('X-Download-Options', 'noopen');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // HSTS only when HTTPS (behind a trusted proxy)
  if (import.meta.env.PROD) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
});
