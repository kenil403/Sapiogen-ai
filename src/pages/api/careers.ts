import type { APIRoute } from 'astro';
import { connectDB } from '../../lib/db';
import Application from '../../models/Application';
import { ok, fail, isOriginAllowed, isAdmin } from '../../lib/api';
import { rateLimit, clientIp } from '../../lib/rateLimit';
import { applicationSchema, cleanText, cleanEmail, cleanURL } from '../../lib/validators';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ct = request.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return fail('Content-Type must be application/json', 415);
  }

  if (!isOriginAllowed(request.headers.get('origin'))) {
    return fail('Origin not allowed', 403);
  }

  const len = Number(request.headers.get('content-length') || 0);
  if (len > 32_000) {
    return fail('Request too large', 413);
  }

  const ip = clientIp(request.headers, clientAddress);
  const rl = rateLimit(`careers:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return fail('Too many applications. Please try again later.', 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail('Invalid JSON body', 400);
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return fail(first ? `${first.path.join('.') || 'field'}: ${first.message}` : 'Invalid input', 400);
  }
  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return ok({ message: 'Thank you.' }, 202);
  }

  const payload = {
    name: cleanText(data.name).slice(0, 120),
    email: cleanEmail(data.email),
    phone: cleanText(data.phone).slice(0, 40),
    role: cleanText(data.role).slice(0, 80),
    portfolio: cleanURL(data.portfolio),
    linkedin: cleanURL(data.linkedin),
    experience: Number(data.experience) || 0,
    message: cleanText(data.message).slice(0, 4000)
  };

  if (!payload.email) return fail('A valid email is required', 400);
  if (!payload.role) return fail('A role is required', 400);
  if (payload.name.length < 2 || payload.message.length < 10) {
    return fail('Name and message are required', 400);
  }

  try {
    await connectDB();

    // Dedupe: block duplicate submission within 2 minutes
    const recent = await Application.findOne({
      email: payload.email,
      role: payload.role,
      createdAt: { $gt: new Date(Date.now() - 120_000) }
    }).lean();
    if (recent) {
      return ok({ message: 'Thanks — we already have your recent application for this role.' }, 202);
    }

    const doc = await Application.create({
      ...payload,
      ip,
      userAgent: request.headers.get('user-agent') || ''
    });

    return ok(
      {
        message: 'Application received. We will respond within one week.',
        id: String(doc._id)
      },
      201
    );
  } catch (err: any) {
    if (err?.name === 'ValidationError') {
      const first = Object.values(err.errors || {})[0] as { message?: string } | undefined;
      return fail(first?.message || 'Validation failed', 400);
    }
    console.error('[api/careers] error:', err?.message || err);
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
    const filter: Record<string, unknown> = {};
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    if (role) filter.role = role;
    if (status) filter.status = status;
    const docs = await Application.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return ok({ count: docs.length, items: docs });
  } catch (err) {
    return fail('Failed to list applications', 500);
  }
};
