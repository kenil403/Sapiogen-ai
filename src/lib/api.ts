/**
 * API helpers: typed JSON responses, CORS origin check, admin auth.
 */

export function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers
    }
  });
}

export function ok<T extends Record<string, unknown>>(data: T, status = 200): Response {
  return json({ ok: true, ...data }, status);
}

export function fail(message: string, status = 400, extra: Record<string, unknown> = {}): Response {
  return json({ ok: false, message, ...extra }, status);
}

/** Parse ALLOWED_ORIGINS once at import */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // same-origin, curl, server-to-server
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

/** Constant-time string compare to resist timing attacks */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false; // disabled by default
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  return safeEqual(match[1]!.trim(), expected);
}
