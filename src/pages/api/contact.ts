import type { APIRoute } from 'astro';
import { connectDB } from '../../lib/db';
import Contact from '../../models/Contact';
import { ok, fail, isOriginAllowed, isAdmin } from '../../lib/api';
import { rateLimit, clientIp } from '../../lib/rateLimit';
import { contactSchema, cleanText, cleanEmail } from '../../lib/validators';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Content-Type guard
  const ct = request.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return fail('Content-Type must be application/json', 415);
  }

  // Origin check (same-origin for the website, additional origins via env)
  if (!isOriginAllowed(request.headers.get('origin'))) {
    return fail('Origin not allowed', 403);
  }

  // Request size guard — avoid parsing giant payloads
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 32_000) {
    return fail('Request too large', 413);
  }

  // Rate limit (per IP)
  const ip = clientIp(request.headers, clientAddress);
  const rl = rateLimit(`contact:${ip}`, 10, 15 * 60 * 1000);
  const rlHeaders: Record<string, string> = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000))
  };
  if (!rl.allowed) {
    return fail(
      'Too many requests. Please try again later.',
      429,
      {},
    );
  }

  // Parse JSON safely
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  // Validate shape with Zod
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return fail(first ? `${first.path.join('.') || 'field'}: ${first.message}` : 'Invalid input', 400);
  }
  const data = parsed.data;

  // Honeypot — silent accept to avoid giving bots feedback
  if (data.website && data.website.length > 0) {
    return ok({ message: 'Thank you.' }, 202);
  }

  // Sanitize (defense in depth against unexpected content)
  const payload = {
    name: cleanText(data.name).slice(0, 120),
    email: cleanEmail(data.email),
    company: cleanText(data.company).slice(0, 160),
    interest: data.interest,
    budget: data.budget,
    message: cleanText(data.message).slice(0, 4000)
  };

  if (!payload.email) {
    return fail('A valid email is required', 400);
  }
  if (payload.name.length < 2 || payload.message.length < 10) {
    return fail('Name and message are required', 400);
  }

  try {
    await connectDB();

    // Spam/dedupe: reject if same email submitted within last 60 seconds
    const recent = await Contact.findOne({
      email: payload.email,
      createdAt: { $gt: new Date(Date.now() - 60_000) }
    }).lean();
    if (recent) {
      return ok({ message: 'Thanks — we already have your recent enquiry.' }, 202);
    }

    const doc = await Contact.create({
      ...payload,
      ip,
      userAgent: request.headers.get('user-agent') || '',
      source: 'website'
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Enquiry received. We will reply within two business days.',
        id: String(doc._id)
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          ...rlHeaders
        }
      }
    );
  } catch (err: any) {
    if (err?.name === 'ValidationError') {
      const first = Object.values(err.errors || {})[0] as { message?: string } | undefined;
      return fail(first?.message || 'Validation failed', 400);
    }
    console.error('[api/contact] error:', err?.message || err);
    return fail('Something went wrong. Please email hello@sapiogenai.com.', 500);
  }
};

/** Admin listing — Bearer <ADMIN_TOKEN> required */
export const GET: APIRoute = async ({ request }) => {
  if (!isAdmin(request)) return fail('Unauthorized', 401);
  try {
    await connectDB();
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
    const docs = await Contact.find().sort({ createdAt: -1 }).limit(limit).lean();
    return ok({ count: docs.length, items: docs });
  } catch (err) {
    return fail('Failed to list contacts', 500);
  }
};
