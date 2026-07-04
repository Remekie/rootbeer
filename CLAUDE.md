# CLAUDE.md — Web Application

> Loaded automatically by Claude Code and AI coding agents.
> Defines the rules of this repo. Follow these before writing a single line.
> **Do not override without explicit instruction from the project owner.**

---

## Project Identity

- **Project:** rootbeervodka.com (Zyra Root Beer Rush)
- **Type:** Static marketing site / landing page (single product, plus a store-locator page)
- **Owner:** Zyra Spirits brand team (Courtney Remekie)
- **Repo:** github.com/Remekie/rootbeer
- **Live URL:** https://rootbeervodka.com (custom domain active; apex + www over HTTPS)
- **Pages URL:** https://rootbeervodka.pages.dev (Cloudflare Pages project `rootbeervodka`)

Positioning: the only all-natural root beer vodka in North America. Distilled in Alberta with real sarsaparilla at 30% ABV.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Astro (static-first, zero client JS by default) | ^5.1.1 |
| Styling | Plain CSS with design tokens (no CSS framework) | — |
| Language | TypeScript (data + config); `.astro` components | ^5 |
| Backend | Cloudflare Pages Functions (`functions/`) — only the signup endpoint | — |
| Database | Cloudflare D1 (waitlist subscribers). Site content stays in typed files under `src/lib/` | — |
| Auth | None | — |
| Maps | Leaflet (store locator, progressive enhancement) | ^1.9.4 |
| Images | Astro `<Image>` + Sharp (responsive WebP at build) | sharp ^0.33.5 |
| SEO | `@astrojs/sitemap` + hand-authored JSON-LD | ^3.2.1 |
| Fonts | Self-hosted Fraunces Variable + DM Sans Variable (@fontsource-variable) | ^5.1.1 |
| Hosting | Cloudflare Pages | ✓ |
| Package Manager | npm | ✓ |

---

## Folder Structure

```
rootbeervodka/
├── src/
│   ├── assets/        # Bottle shots, logo, recipe images (optimized by Astro <Image>)
│   ├── components/    # .astro components (Hero, Header, Footer, ProofStrip, StoreLocator, ...)
│   ├── layouts/       # Base.astro — <head>, fonts, JSON-LD, OG/Twitter meta, skip-link
│   ├── lib/           # site.ts (copy + product facts), stores.ts (stockists), schema.ts (JSON-LD)
│   ├── pages/         # index.astro, where-to-buy/index.astro (file-based routing)
│   └── styles/        # tokens.css (locked brand system), global.css (base + utilities)
├── functions/         # Cloudflare Pages Functions — api/subscribe.ts (waitlist -> D1)
├── db/                # schema.sql for the D1 subscribers table
├── public/            # Static assets served as-is (favicon, robots.txt, og-image.png)
├── astro.config.mjs   # site URL, sitemap integration, image + build config
├── wrangler.toml      # Pages output dir + D1 binding (env.DB)
├── tsconfig.json
├── .env.example       # Committed env template (no real values)
└── package.json
```

---

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:4321
npm run build     # static build to ./dist
npm run preview   # preview the production build locally
```

> The project owner runs `dev` / `preview` and all browser testing in their own terminal.
> Do NOT start long-running dev servers or spawn browser automation on their behalf.

---

## Content is Data — Single Source of Truth

This is the most important rule in the repo. **Visible copy and structured data must never drift apart.**

- All product copy, facts, cocktails, FAQs, and quotable lines live in `src/lib/site.ts`.
- Stockist data lives in `src/lib/stores.ts` (the one file to swap per brand).
- JSON-LD is built from those same files in `src/lib/schema.ts`.
- **Never hardcode product facts, copy, or store data inside a component.** Add it to the data file and read from it, so the crawlable HTML and the JSON-LD stay identical.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase `.astro` | `StoreLocator.astro` |
| Data / utility modules | camelCase `.ts` | `site.ts`, `schema.ts` |
| CSS custom properties | `--kebab-case`, namespaced | `--ink-on-dark`, `--space-6` |
| BEM-ish class names | `block__element` | `.hero__spec`, `.more__figure` |
| Types / Interfaces | PascalCase, no `I` prefix | `Recipe`, `OtherProduct` |
| Routes | folder-based, `kebab-case` | `/where-to-buy` |
| Environment variables | `SCREAMING_SNAKE_CASE`, `PUBLIC_` prefix if client-read | `PUBLIC_SUBSCRIBE_ENDPOINT` |

---

## Code Style Standards

### TypeScript / Astro
- Prefer `const`; never `var`. Keep component frontmatter thin — logic belongs in `src/lib/`.
- No `any` — use `unknown` and narrow, or define a proper type.
- Keep components small and focused (target under 400 lines including the `<style>` block).
- Ship zero client JS unless a feature genuinely needs it. The store-locator map is progressive enhancement: the page must work with the static list if JS never loads.

### CSS (design-token system, `src/styles/`)
- **Use the tokens.** Colours, spacing, type scale, radius, and motion all come from `tokens.css`. Do not introduce raw hex values or ad-hoc pixel spacing in a component.
- Scope styles inside each component's `<style>` block; put only shared primitives in `global.css`.
- Mobile-first: base = mobile, scale up with `min-width` (this repo uses `rem` breakpoints, e.g. `@media (max-width: 60rem)`).
- No `!important`. No inline styles.

### Copy / Content
- **No em-dashes (—) in visible copy.** Use periods, commas, or colons. Spaced hyphens are also disallowed. En-dashes are fine only for true ranges (`Mon–Sat`, `10a–10p`, `3–4 oz`).
- British/Canadian spelling in brand copy where the existing text uses it ("flavour").
- Real facts only. No invented badges, awards, or stats.

---

## Anti-Vibe Design Mandate (project law)

This site must not look or read AI-generated. Enforced:

- **No gradient heroes.** One animation only: the single slow spotlight bloom behind the bottle.
- **One accent colour:** warm caramel gold `#C9A24B`. No purple / violet / indigo / blue / teal anywhere.
- **No hover-card grids.** Editorial blocks only.
- **No stock photography.** Real bottle shots and real recipe images.
- **No AI-generated prose.** Real recipes, real Q&A, no em-dash tells.
- **Body text never below 17px.** Typography is Fraunces (display) + DM Sans (body), self-hosted.

---

## SEO / GEO — Do Not Regress

The site is built to be fully crawlable and answer-engine friendly. Preserve:

- A real `<h1>` carrying the category claim; full text rendered at build time (no client-only content).
- Complete Open Graph + Twitter Card meta in `Base.astro`.
- Organization + Product + Recipe + FAQPage JSON-LD, built from `src/lib/`.
- Sitemap (`@astrojs/sitemap`) and `robots.txt`.
- Self-hosted fonts — no external font requests.
- Descriptive `alt` text on every image; colour contrast ≥ 4.5:1.

---

## Code Quality — Non-Negotiable

- No `console.log` in committed code.
- No hardcoded copy or product facts in components — read from `src/lib/`.
- No unused imports, dead code, or commented-out blocks (git history preserves it).
- Every `fetch()` checks `response.ok` before parsing; every `async` path has error handling.
- The signup form handles loading, success, and error states. It posts to the first-party `/api/subscribe` Function by default; `PUBLIC_SUBSCRIBE_ENDPOINT` only overrides that.
- `functions/api/subscribe.ts` validates server-side, drops honeypot hits, treats a duplicate email as success, and never reveals whether an address was already stored.

### Security
- No secrets or tokens in source. `.env` only; `.env.example` stays current.
- Never build HTML from untrusted input; no `eval` / `new Function`.
- Treat the subscribe endpoint as untrusted — validate the response, never assume success.

### Accessibility (WCAG 2.1 AA)
- Semantic HTML: `<button>` / `<a>`, not `<div onclick>`.
- Every image has descriptive `alt`; interactive elements are keyboard-reachable with visible focus.
- The store locator remains usable via the static list without geolocation permission.

---

## Testing

- No automated test suite is configured yet. [FILL IN if/when added — Vitest for `src/lib/` data + schema, Playwright for the store-locator flow.]
- Until then, verification is manual via `npm run preview`, run by the project owner.
- If you add tests: mock the subscribe endpoint and geolocation; never hit real services.

---

## Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `PUBLIC_SUBSCRIBE_ENDPOINT` | Override the signup POST target | Client-read (`PUBLIC_`). Leave unset — the form defaults to `/api/subscribe`. Only set to route to a different backend. |

- `.env.example` is committed. `.env` / `.env.local` are never committed.

---

## Signups (Cloudflare D1)

The waitlist form posts JSON `{ email, source }` to the `/api/subscribe` Pages Function, which writes to a D1 database bound as `env.DB`.

One-time setup (run by the owner; needs a Cloudflare login):

```bash
npx wrangler d1 create zyra_subscribers          # copy the database_id into wrangler.toml
npx wrangler d1 execute zyra_subscribers --remote --file=./db/schema.sql
```

Then confirm the Pages project has the `DB` binding (wrangler.toml provides it, or set it in Pages -> Settings -> Functions -> D1 bindings).

- Local run with Functions + D1: `npx wrangler pages dev` (not `astro dev`, which does not run Functions). Seed the local DB with the same `execute` command minus `--remote`.
- Read the list: `npx wrangler d1 execute zyra_subscribers --remote --command "SELECT email, source, created_at FROM subscribers ORDER BY created_at DESC"`.
- `wrangler` is invoked via `npx` — it is intentionally not a project dependency.

---

## Git and PR Conventions

- Branch naming: `feature/short-description`, `fix/bug-description`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- PRs small and focused — one concern per PR. No force-pushing to `main`.
- Deploy: Cloudflare Pages project `rootbeervodka`. Production branch `main`, build command `npm run build`, output dir `dist`, root dir `/`. The D1 binding comes from `wrangler.toml`, so Git builds inherit it.
- The project was first published via direct upload (`npx wrangler pages deploy`). Git auto-deploy and the `rootbeervodka.com` custom domain are attached in the Pages dashboard (one-time).

---

## AI Agent Behavior Rules

1. Read the folder structure and `src/lib/` before creating files — do not duplicate existing components or hardcode data that belongs in a data file.
2. Ask before adding dependencies — state purpose, bundle cost, and whether Astro or the token system already covers it. Default to zero new client JS.
3. Never auto-commit — summarize what changed and why first.
4. Do not start dev/preview servers or run browser automation — the owner does this manually in their own terminal.
5. Flag scope creep — if a request touches more than one component or the token system, say so before proceeding.
6. Never regress the Anti-Vibe mandate or the SEO/GEO guarantees to satisfy a smaller request; surface the conflict instead.
7. Self-review after every non-trivial change against the checklist above.
