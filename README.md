# Sapiogen AI — Website

Single Astro SSR application. API routes replace the previous Express
backend; everything (pages + API + MongoDB) runs from one Node process.

```
sapiogen-ai/
├── public/              # Static assets (logo, robots.txt)
├── src/
│   ├── components/      # Header, Footer, NetworkGraph, Terminal, Marquee, etc.
│   ├── data/            # Services, openings, case studies, posts, process
│   ├── layouts/         # BaseLayout (SEO, structured data)
│   ├── lib/             # db, validators, rateLimit, api helpers
│   ├── models/          # Mongoose: Contact, Application
│   ├── pages/
│   │   ├── api/         # Astro API routes: contact, careers, health
│   │   ├── blog/        # Blog index + [slug].astro
│   │   └── *.astro      # Public pages
│   ├── styles/          # Global design tokens
│   └── middleware.ts    # Security headers (CSP, HSTS, etc.)
├── astro.config.mjs
├── Dockerfile           # Multi-stage, non-root, healthcheck
├── render.yaml          # Render Blueprint
└── package.json
```

---

## Pages

| Path                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `/`                     | Home — positioning, system shape, capabilities, metrics      |
| `/about`                | Team, founder (Rahil D. Jain), studio operating principles   |
| `/services`             | Eight engineering disciplines in detail                      |
| `/process`              | Four phases, operating truths, engagement shapes             |
| `/work`                 | Representative case studies, sectors we serve                |
| `/careers`              | Hiring bar, compensation, open roles, application form       |
| `/blog`                 | Writing index                                                |
| `/blog/[slug]`          | Individual essays (3 seeded)                                 |
| `/contact`              | Project enquiry form + full contact details                  |
| `/privacy`              | Privacy policy                                               |
| `/terms`                | Terms of use                                                 |
| `/thank-you`            | Post-submission confirmation (noindex)                       |
| `/404`                  | Branded not-found                                            |
| `/sitemap.xml`          | Dynamic sitemap                                              |

---

## API

All API routes are server-rendered. Rate-limited, origin-checked, honeypot-protected.

| Method | Path                | Purpose                                    | Auth           |
| ------ | ------------------- | ------------------------------------------ | -------------- |
| GET    | `/api/health`       | Service + DB status                        | Public         |
| POST   | `/api/contact`      | Project enquiry (10 req / 15 min / IP)     | Public         |
| GET    | `/api/contact`      | List enquiries                             | `Bearer <ADMIN_TOKEN>` |
| POST   | `/api/careers`      | Job application (5 req / hour / IP)        | Public         |
| GET    | `/api/careers`      | List applications                          | `Bearer <ADMIN_TOKEN>` |

---

## Local development

### 1. Set up MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Database Access → add a user with read/write to any database.
3. Network Access → add your IP (or `0.0.0.0/0` for dev — restrict later).
4. Clusters → **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sapiogen-ai?retryWrites=true&w=majority
   ```

### 2. Configure environment

```bash
# Create .env and set your MongoDB URI in MONGODB_URI
# Generate ADMIN_TOKEN:   openssl rand -hex 32
```

### 3. Install & run

```bash
npm install
npm run dev          # http://localhost:4321
```

Hot-reloads on save. The dev server runs the same SSR entry as production.

### 4. Verify

```bash
curl http://localhost:4321/api/health
# → {"ok":true,"service":"sapiogen-ai","db":"connected",…}
```

---

## Docker

Local Docker build & run:

```bash
docker build -t sapiogen-ai .
docker run --rm -p 4321:4321 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e ALLOWED_ORIGINS="http://localhost:4321" \
  -e ADMIN_TOKEN="$(openssl rand -hex 32)" \
  sapiogen-ai
```

The image:
- Multi-stage build; final image is `node:22-alpine` ~140 MB
- Runs as non-root `app` user
- Includes a `HEALTHCHECK` hitting `/api/health`
- Exposes port 4321

---

## Deploy to Render

### Option A — Blueprint (one click, recommended)

1. Push this repo to GitHub.
2. On Render: **New +** → **Blueprint** → connect your repo.
3. Render reads `render.yaml` and creates the service.
4. In the service's **Environment** tab, set the two "sync: false" vars:
   - `MONGODB_URI` — your Atlas connection string
   - `ADMIN_TOKEN` — a long random string (`openssl rand -hex 32`)
5. Click **Create resources**. Render builds the Dockerfile and starts the service.

### Option B — Manual

1. **New +** → **Web Service** → connect your repo
2. Runtime: **Docker**
3. Health check path: `/api/health`
4. Add `MONGODB_URI` and `ADMIN_TOKEN` as environment variables
5. Deploy

### MongoDB Atlas with Render

In Atlas → Network Access, add Render's egress IPs (or `0.0.0.0/0` for simplicity + rely on DB auth). The service is behind `MONGODB_URI` creds either way.

### Custom domain

In Render → **Settings** → **Custom Domains** → add `sapiogenai.com` and `www.sapiogenai.com`. Point your DNS at the records Render shows. Render provisions a free TLS cert automatically. Update `ALLOWED_ORIGINS` and `PUBLIC_SITE_URL` to match.

---

## Security notes

What's in place:

- **CSP + security headers** on every response (middleware.ts): `Content-Security-Policy`, `Strict-Transport-Security` (prod), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `CORP`.
- **Input validation** — Zod schemas on every API payload; Mongoose schema validators as second line.
- **Sanitization** — DOMPurify strips HTML from every text field before persistence.
- **URL validation** — `validator.js` for emails and URLs; portfolio/LinkedIn fields reject non-http(s).
- **Rate limiting** — per-IP sliding window; 10/15min for contact, 5/hour for careers.
- **Honeypot** — hidden `website` field in both forms; filled submissions are silently 202'd.
- **Dedupe window** — same email within 60s (contact) / 120s (careers) are no-oped.
- **Request guards** — `Content-Type` check, 32KB payload cap, origin allowlist.
- **Admin auth** — Bearer-token with constant-time compare to resist timing attacks. GETs return 401 if `ADMIN_TOKEN` is unset.
- **No secrets in code** — `.env` files are ignored and never included in the Docker image.
- **Non-root container** — Docker image runs as `app` user, not root.

For a multi-instance deploy, swap the in-memory rate limiter in `src/lib/rateLimit.ts` for a Redis-backed one.

---

## Content

All seed content is in `src/data/`:

- `services.ts` — eight engineering disciplines
- `openings.ts` — open roles (Astro dev, AI engineer, Product designer)
- `caseStudies.ts` — representative engagements (redacted; replace with real ones)
- `posts.ts` — blog essays (title, excerpt, body paragraphs)
- `process.ts` — four delivery phases

Change these files and the pages that render them update automatically.

---

## Design system

- **Palette:** pure black + warm off-white; monochrome by design.
- **Type:** `Michroma` (brand mark), `Space Grotesk` (headings + body), `JetBrains Mono` (data labels, terminal).
- **Layout:** full-bleed sections, hairline rules, sharp corners, strict grid.
- **AI motifs:** animated network graph on hero, terminal blocks for system shape, scrolling tech marquee, intersection-observer counters, pulsing status dots.
- **Motion:** one orchestrated hero reveal; everything else moves only in response to the user. `prefers-reduced-motion` fully honored.
- **Responsive:** tested at 320px / 480px / 768px / 1024px / 1440px / 1920px.
- **Accessibility:** keyboard focus visible, skip link, semantic landmarks, aria-labels on nav, reduced-motion respected.

Tokens live in `src/styles/global.css`.

---

## License

© Sapiogen AI. All rights reserved.
