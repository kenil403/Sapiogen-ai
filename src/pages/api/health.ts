import type { APIRoute } from 'astro';
import { connectDB, dbStatus } from '../../lib/db';
import { ok, fail } from '../../lib/api';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Opportunistic connect — don't block health if DB is still coming up
    connectDB().catch(() => undefined);
    return ok({
      service: 'sapiogen-ai',
      time: new Date().toISOString(),
      uptime: process.uptime(),
      db: dbStatus()
    });
  } catch (err) {
    return fail('Health check failed', 503);
  }
};
