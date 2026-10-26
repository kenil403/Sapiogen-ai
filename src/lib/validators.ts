import { z } from 'zod';
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

// -------- Sanitizers --------
export function cleanText(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Trim, strip HTML, cap length defensively (schemas enforce final caps)
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).slice(0, 5000);
}

export function cleanEmail(input: unknown): string {
  const s = typeof input === 'string' ? input.trim().toLowerCase() : '';
  if (!validator.isEmail(s, { allow_display_name: false, allow_utf8_local_part: false })) {
    return '';
  }
  return validator.normalizeEmail(s, { gmail_remove_dots: false }) || s;
}

export function cleanURL(input: unknown): string {
  const s = typeof input === 'string' ? input.trim() : '';
  if (!s) return '';
  if (
    !validator.isURL(s, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })
  ) {
    return '';
  }
  return s.slice(0, 500);
}

// -------- Schemas --------
export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional().default(''),
  interest: z
    .enum([
      '',
      'product',
      'strategy',
      'systems',
      'automation',
      'voice',
      'integration',
      'infrastructure',
      'data',
      'other'
    ])
    .optional()
    .default(''),
  budget: z.enum(['', 'under-25k', '25-75k', '75-200k', '200k-plus']).optional().default(''),
  message: z.string().min(10).max(4000),
  // Honeypot — must be empty. Any value triggers silent-accept in the handler
  // (NOT a schema failure, so bots don't learn the field is a trap).
  website: z.string().max(500).optional().default('')
});

export const applicationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().default(''),
  role: z.string().min(1).max(80),
  portfolio: z.string().max(500).optional().default(''),
  linkedin: z.string().max(500).optional().default(''),
  experience: z.coerce.number().min(0).max(60).optional().default(0),
  message: z.string().min(10).max(4000),
  website: z.string().max(500).optional().default('')
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
