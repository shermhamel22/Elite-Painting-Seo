# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **artifacts/painting-site** — Elite Painting Solutions marketing site (React + Vite). Vero Beach FL painters. Static prerender via `scripts/postbuild.mjs` produces per-route HTML with baked-in `<title>`, meta description, OG/Twitter cards, JSON-LD (Organization, LocalBusiness, FAQPage, Service, Article, BreadcrumbList) and a hidden `.seo-prerender` text block so non-JS crawlers and LLMs see real content. Production canonical: `https://elitepaintingsolutions.com` (override with `VITE_SITE_URL`).
- **artifacts/api-server** — Express API for the quote form (Gmail send via `gmailClient.ts`, route `POST /api/quote`).
- **artifacts/mockup-sandbox** — Vite mockup sandbox for iframe previews on the canvas.

## SEO + Performance Notes (painting-site)

- `index.html` ships with: long keyword-rich title (~70 chars), preconnect + LCP image preload (storefront-mobile.webp / storefront.webp), non-blocking Google Fonts via `media="print" onload`, JSON-LD graph (Organization + LocalBusiness with Vero Beach 32960 address + sameAs), and gated GA4 + Meta Pixel snippets that only load when `window.GA_MEASUREMENT_ID` / `window.FB_PIXEL_ID` are filled in (top of `<head>`).
- `src/index.css` does NOT import Google Fonts (was render-blocking) — fonts come via `<link>` in `index.html`.
- `public/_headers` sets long cache (`/assets/*` immutable 1y, images 30d, fonts 1y, html 10min). Honored by Replit Deployments / Cloudflare Pages / Netlify.
- `docs/dns-records.md` — copy-paste DNS records for SPF, DKIM, DMARC, optional CAA + MX.
- Service-area routes are real Vero Beach neighborhoods (Sebastian, Indian River Shores, Wabasso, Gifford, Florida Ridge, Vero Lake Estates, Grand Harbor, John's Island, Riomar, etc.).
- Footer social: Google, Facebook, Yelp, Nextdoor (real URLs) + YouTube, X (placeholder URLs — replace when accounts exist). LinkedIn / Instagram intentionally omitted.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **`artifacts/painting-site`** — Elite Painting Solutions marketing site (React + Vite, served at `/`).
  - Build outputs SEO-prerendered HTML for every route (services, areas, blog, etc.) plus `sitemap.xml` via `scripts/postbuild.mjs`.
  - JSON-LD (Organization + LocalBusiness + WebSite) is baked into the static `index.html`; per-route Service / FAQ / Article / Breadcrumb JSON-LD is injected at prerender time.
  - Production canonical host is `https://elitepaintingsolutions.com` (override with `VITE_SITE_URL` at build time).
- **`artifacts/api-server`** — shared Express API at `/api`.
- **`artifacts/mockup-sandbox`** — internal design canvas.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/painting-site run build` — build the marketing site (vite + post-build SEO)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## SEO

- Static `index.html` ships full meta tags (canonical, robots, OG, Twitter, theme) and a JSON-LD `@graph` with Organization, LocalBusiness/Painter, and WebSite entities.
- `scripts/postbuild.mjs` runs after `vite build`:
  - generates `dist/public/sitemap.xml` from the route list
  - copies `robots.txt`
  - prerenders an `index.html` per route with route-specific `<title>`, `<meta description>`, canonical, OG/Twitter tags, and per-page JSON-LD (Service, FAQPage, Article, BreadcrumbList) injected before `</head>`
- Runtime `<SEO />` component still keeps the head in sync during client-side navigation.
- To change the production hostname used in canonical URLs, sitemap, and JSON-LD, set `VITE_SITE_URL` before building (e.g. `VITE_SITE_URL=https://your-domain.com pnpm --filter @workspace/painting-site run build`).

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
