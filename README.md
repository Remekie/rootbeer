# rootbeervodka.com

Zyra Root Beer Rush — the only all-natural root beer vodka in North America.

## Tech Stack

- **Framework**: Astro 5 (static-first, zero JS by default)
- **Fonts**: Self-hosted Fraunces Variable (display) + DM Sans Variable (body)
- **Styling**: CSS with design tokens (no framework)
- **Images**: Optimized WebP via Astro's `<Image>`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and set `PUBLIC_SUBSCRIBE_ENDPOINT` before launch:

```
PUBLIC_SUBSCRIBE_ENDPOINT=https://your-email-provider.com/api/subscribe
```

## SEO / GEO

- Real `<h1>` with category claim
- Full Open Graph (8 tags) + Twitter Card (4 tags)
- Organization + Product + Recipe + FAQPage JSON-LD
- Sitemap + robots.txt
- Self-hosted fonts, no external requests
- Accessible color contrast (all text ≥4.5:1)

## Anti-Vibe Compliance

- No gradient heroes (single spotlight bloom animation)
- No purple/violet/indigo/blue/teal in palette
- No hover-card grids (editorial blocks only)
- No fake stock photos (all real bottle shots)
- No AI-generated text (real recipes, real Q&A)
