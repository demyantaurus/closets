# Development Plan — Custom Furniture Website ("Closets")

Reference sites: https://shkaf-graf.by (unreachable at planning time), https://mebel-fbrk.by/
Business domain: made-to-order furniture (wardrobes, sliding-door closets, kitchens, entryways) — Minsk / Belarus market, Russian-language content.

**Stack decision: Payload CMS 3** — a Node.js/TypeScript headless CMS that embeds natively into the Next.js app. One codebase and one deployable provide the public site, the admin panel (`/admin`), and the REST/GraphQL API. Auth, media library with sharp image processing, drafts/versions, and live preview come built in.

---

## 1. Goals

- Modern, visually appealing marketing + catalog website that generates leads (measurement requests, callbacks, calculator submissions).
- Full content management via the Payload admin panel: catalog, portfolio, reviews, pages, leads.
- SEO-first: the site competes in local search ("шкаф-купе на заказ Минск" etc.), so server-side rendering is mandatory.
- Entire stack runs via Docker (`docker compose up` for dev and prod).

## 2. Feature Scope (derived from reference sites)

### Public site
| # | Feature | Notes |
|---|---------|-------|
| 1 | Hero section | Full-width imagery/video, USP ("от идеи до установки"), CTA to calculator |
| 2 | Catalog | Categories (шкафы-купе, гардеробные, кухни, прихожие, спальни), category pages with filterable product cards, product detail pages with gallery + "от X BYN" pricing |
| 3 | Cost calculator (quiz) | 5-step wizard: type → dimensions → materials → doors/fittings → contact info; discount incentive on completion; submission lands in admin as a lead |
| 4 | Portfolio ("Наши работы") | Masonry/grid gallery, category filter, lightbox, before/after where available |
| 5 | Advantages / trust blocks | Warranty, free measurement + 3D visualization, installments (6–36 months), own production |
| 6 | Process timeline | 5 steps: заявка → замер → 3D-проект → производство → доставка и монтаж |
| 7 | Reviews | Cards with photos, rating; moderated via admin |
| 8 | Team section | Designers/leadership cards |
| 9 | Lead forms | Callback widget, "заказать 3D-проект", contact form; Telegram/Viber/WhatsApp links |
| 10 | Contacts page | Address, hours, phone, email, map embed (Yandex Maps) |
| 11 | SEO/legal pages | FAQ, privacy policy, оферта; sitemap.xml, robots.txt, Open Graph, JSON-LD (LocalBusiness, Product, FAQ) |

### Admin panel (Payload, out of the box + customization)
- **Built in**: auth (email + password, roles via access control), CRUD UI for every collection, media library with automatic sharp resizing (WebP/AVIF variants), drafts & versions, live preview of the public site, localization-ready.
- **Custom work**: collection/field definitions, access rules (admin vs. manager), leads inbox tuning (status workflow, list filters, CSV export via custom endpoint), dashboard widget with recent leads, Russian admin locale (built-in `ru` translation).
- Lead notifications: Payload `afterChange` hook → Telegram bot message and/or email (nodemailer adapter).

## 3. Architecture

Single Next.js 15 application with Payload 3 mounted inside it — no separate API or admin app needed. The frontend is organized by **Feature-Sliced Design (FSD)**; Payload's backend code lives outside the FSD layers in `src/payload/`.

```
closets/
├── src/
│   ├── app/                     # Next.js App Router — thin routing layer only:
│   │   ├── (frontend)/          #   route files re-export page components from views/
│   │   └── (payload)/           #   auto-generated: /admin UI + /api REST + GraphQL
│   │
│   │   # ——— FSD layers (imports flow strictly downward) ———
│   ├── views/                   # FSD “pages” layer (renamed — Next.js reserves pages/):
│   │                            #   home, catalog, category, product, portfolio,
│   │                            #   contacts, faq, legal — page composition + metadata
│   ├── widgets/                 # self-contained page sections: header, footer, hero,
│   │                            #   advantages, process-timeline, portfolio-gallery,
│   │                            #   reviews-slider, team-section, cta-banner
│   ├── features/                # user interactions: cost-calculator, callback-form,
│   │                            #   contact-form, catalog-filter, lightbox, mobile-menu
│   ├── entities/                # domain models + their cards/queries: product,
│   │                            #   category, portfolio-project, review, team-member, lead
│   ├── shared/                  # ui/ (hand-built primitives: Button, Input, Modal,
│   │                            #   Accordion…), styles/ (SCSS variables, mixins,
│   │                            #   typography, globals), lib/ (utils, seo, motion),
│   │                            #   api/ (typed Payload Local API helpers), config/
│   │
│   └── payload/                 # backend (outside FSD): collections/, globals/,
│                                #   hooks/ (revalidation, lead fan-out), payload.config.ts
├── docker/                      # Dockerfiles, nginx config
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env
```

FSD rules: a layer may import only from layers below it (`app → views → widgets → features → entities → shared`); slices on the same layer never import each other; every slice exposes a public API via `index.ts` (deep imports forbidden). Enforced in CI with **Steiger** (the official FSD linter) + `eslint-plugin-boundaries`. Payload-generated types (`payload-types.ts`) are re-exported through `shared/api` so FSD code never imports from `src/payload/` directly.

- **Next.js 15 (App Router) + TypeScript** — public site rendered with SSR/ISR. Because Payload runs in-process, frontend pages query content via the **Local API** (direct DB access, no HTTP hop) — fast and fully typed via `payload generate:types`.
- **Payload 3 (Node.js)** — admin panel at `/admin`, REST API at `/api` (used by client-side form submissions), access control, media pipeline.
- **PostgreSQL** — via `@payloadcms/db-postgres` (Drizzle-based adapter, migrations included).
- **Media storage** — local uploads directory on a Docker volume, served by nginx in prod; sharp variants generated by Payload. S3/MinIO adapter can be swapped in later without content changes.
- **ISR revalidation** — `afterChange`/`afterDelete` hooks call `revalidateTag`/`revalidatePath` directly (same process — no webhook plumbing).
- **nginx** (prod) — TLS via Let's Encrypt, static `/uploads`, proxy to the Next.js standalone server.

### Collections (core entities)

```
Categories        slug, name, description, image, sortOrder, seo group
Products          slug, category rel, name, richText description, priceFrom,
                  gallery (media rels), options (array/blocks), _status (draft)
PortfolioProjects slug, category rel?, title, description, gallery, _status
Reviews           authorName, text, rating, photo?, status (pending|approved)
TeamMembers       name, role, photo, sortOrder
Leads             type (callback|calculator|3d|contact), payload (json),
                  name, phone, status (new|inProgress|closed), admin-only access
FaqItems          question, answer, sortOrder
Media             upload collection, alt, auto variants (thumbnail/card/hero, WebP)
Users             auth-enabled, role (admin|manager)
Globals: SiteSettings — phones, address, hours, socials, discount banner
```

### Lead delivery (contact form, callback, calculator, 3D request)

Every form submission is delivered to **three channels** — the admin panel, Telegram, and email:

```
form → Next.js server action (zod validation, honeypot, rate limit)
     → payload.create({ collection: 'leads', ... })   # 1. admin inbox (source of truth)
     → afterChange hook fans out:
         ├── 2. Telegram Bot API  → sendMessage to manager chat/group
         └── 3. Email (nodemailer/SMTP) → notification to manager inbox
```

1. **Admin panel** — the lead is stored in the `Leads` collection first; this write is the source of truth and appears immediately in the admin leads inbox (status `new`).
2. **Telegram** — a bot (token + `TELEGRAM_CHAT_ID` in env) sends a formatted message to the managers' chat/group: lead type, name, phone, message/calculator answers, link to the lead in the admin panel.
3. **Email** — `@payloadcms/email-nodemailer` over SMTP sends the same summary to `LEADS_EMAIL_TO`; also enables Payload's password-reset emails.

Reliability rules: notifications run *after* the DB write and never block or fail it — a Telegram/SMTP outage still leaves the lead safely in the admin panel; failures are logged (Sentry) and each channel is retried up to 3 times with backoff. Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_HOST/PORT/USER/PASS`, `LEADS_EMAIL_TO`. Anti-spam at the entry point: honeypot field, per-IP rate limit, server-side zod validation (phone format).

## 4. Design Direction

- **Aesthetic**: premium interior look — warm neutral palette (charcoal `#1C1B1A`, warm white `#FAF7F2`, wood/brass accent), large photography, generous whitespace, serif display font (e.g. Playfair Display / STIX) + clean sans for body (Inter/Golos Text — good Cyrillic support is required).
- **Themes** (added 2026-07-27): design tokens are CSS custom properties switched via `data-theme` on `<html>`; the active theme is chosen in the admin (Настройки сайта → Тема оформления). Two themes ship: `premium` (default, described above) and `bright` — a hoff.ru-style marketplace look (white background, blue `#2B5CE0` accent, red prices, 10px button radius, sans-serif headings, light-grey inverted sections).
- **Styling: SCSS Modules, no UI-kit libraries.** Every component gets its own `*.module.scss` colocated in its FSD slice; primitives (buttons, inputs, modals, accordion, tabs, lightbox) are built by hand in `shared/ui/`. Shared style layer in `src/shared/styles/`: `_variables.scss` (design tokens: colors, spacing scale, radii, shadows), `_mixins.scss` (breakpoints, fluid typography via `clamp()`, container), `_typography.scss`, `globals.scss` (reset + base). Naming: camelCase classes for clean `styles.heroTitle` access. Motion & effects strategy in §4.4 (Framer Motion + CSS, optional Lenis).
- **Imagery**: consistent aspect ratios, `next/image` with AVIF/WebP, blur placeholders (full strategy in §4.1).
- **Dark hero, light content** pattern common to premium furniture brands; sticky translucent header; floating CTA (callback) on mobile.
- Fully adaptive and cross-browser: see §4.3.
- Accessibility & semantic markup: see §4.2 — required because primitives are hand-built (no UI-kit accessibility for free) and clean semantics also feed SEO.
- Process: design tokens + component inventory first, build homepage as the reference implementation, then propagate. (Optional: mock key screens in Figma before coding.)
- Admin: Payload's default UI restyled lightly (logo, brand color); Russian locale enabled.

### 4.1 Image Optimization (web & mobile)

A furniture site is image-heavy — galleries dominate page weight, so this is a first-class concern, handled at two stages:

**At upload (Payload + sharp)** — editors upload one original; the Media collection generates variants automatically:
- Size presets matched to real render slots: `thumbnail` 320w, `card` 640w, `gallery` 1080w, `hero` 1920w (+ 2x where needed).
- Originals converted to WebP at upload (`formatOptions`), quality ~80; EXIF stripped; upload validation rejects files > 10 MB or non-image MIME types.
- Enforced `alt` text field (required) — SEO and accessibility.

**At delivery (`next/image`)**:
- AVIF first, WebP fallback via `images.formats`; Next optimizer cache persisted on a Docker volume so conversions survive restarts.
- Correct `sizes` per slot so mobile downloads mobile-sized files, e.g. hero `100vw`, catalog card `(max-width: 768px) 50vw, 25vw`, gallery thumbnails `(max-width: 768px) 33vw, 160px`.
- Hero/LCP image: `priority` + `fetchpriority=high`; everything below the fold lazy-loads (default).
- Explicit width/height or `fill` + `aspect-ratio` everywhere — zero CLS from images.
- Blur placeholders (`plaiceholder`/LQIP generated at upload and stored on the media doc) for perceived speed on slow mobile networks.
- nginx serves `/uploads` and `_next/image` responses with `Cache-Control: public, max-age=31536000, immutable`.

**Budgets & verification**: homepage image payload ≤ 1 MB on mobile viewport; product page ≤ 1.5 MB; verified in the Phase 2 performance pass (Lighthouse mobile ≥ 90, LCP < 2.5 s on throttled 4G) and re-checked at launch QA.

### 4.2 Semantic HTML & ARIA

Semantics first, ARIA second: native elements (`<nav>`, `<button>`, `<details>`, `<dialog>`) carry implicit roles that search engines and screen readers both understand — ARIA fills only the gaps. Since all primitives are hand-built (no UI kit), each interactive component ships with its ARIA contract:

- **Landmarks**: one `<h1>` per page, logical heading hierarchy, `<header>/<nav>/<main>/<footer>`; `aria-label` on repeated landmarks (e.g. `<nav aria-label="Основная навигация">`, breadcrumbs `<nav aria-label="Хлебные крошки">`).
- **Mobile menu / burger**: `aria-expanded`, `aria-controls`, focus trap while open, `Esc` to close.
- **Modals (callback, lightbox)**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, focus restore on close.
- **Accordion (FAQ)**: button with `aria-expanded` + `aria-controls`, panel `role="region"` + `aria-labelledby` — pairs with FAQ JSON-LD.
- **Calculator wizard**: steps announced via `aria-current="step"`, progress `role="progressbar"` with `aria-valuenow/min/max`, validation errors linked with `aria-describedby` + `aria-invalid`, step changes announced in an `aria-live="polite"` region.
- **Forms**: every input has a real `<label>`; submission status (success/error) in `aria-live` region; honeypot field gets `aria-hidden="true"` + `tabindex="-1"`.
- **Galleries/lightbox**: `aria-label` on prev/next controls, `aria-live` slide counter; meaningful `alt` from the Media collection on every image, empty `alt=""` on purely decorative ones.
- **Icon-only buttons** (phone, messengers, close): `aria-label` in Russian.
- Visible focus states (`:focus-visible`), full keyboard operability, 4.5:1 contrast, `prefers-reduced-motion` respected by all Framer Motion animations.
- **Verification**: eslint-plugin-jsx-a11y in CI; axe + Lighthouse accessibility ≥ 95 in the Phase 2 pass; manual keyboard + screen-reader smoke test at launch QA.

### 4.3 Adaptive Layout & Cross-Browser Support

**Browser support matrix** (declared in `browserslist`, drives Autoprefixer + SWC transpilation):
- Desktop: last 2 versions of Chrome, Firefox, Edge, Safari (≥ 16).
- Mobile: iOS Safari ≥ 16, Chrome for Android, Samsung Internet, Yandex Browser (significant in the BY market).
- No IE11. Graceful degradation, not pixel-parity: modern browsers get the full experience; older ones get a functional, unbroken layout.

**Adaptive strategy (mobile-first)**:
- Breakpoints as SCSS mixins: `360` (base), `≥ 480`, `≥ 768` (tablet), `≥ 1024`, `≥ 1280` (desktop), `≥ 1920` (wide); content-driven extra breakpoints allowed inside a slice.
- Fluid typography and spacing via `clamp()`; layout with Grid/Flexbox only — no fixed pixel layouts; `1fr/minmax/auto-fit` grids for catalog and portfolio.
- Touch: tap targets ≥ 44×44 px; hover effects wrapped in `@media (hover: hover)` so they don't stick on touchscreens; swipe support in galleries/sliders; sticky mobile CTA bar respects `env(safe-area-inset-*)` (iPhone notch/home bar).
- `dvh` units (with `vh` fallback) for full-height hero on mobile browsers with collapsing URL bars.
- Tables/wide content scroll inside their own container; no horizontal page scroll at any width from 320 px up.
- Adaptive component behavior, not just reflow: header collapses to burger menu, catalog filters become a bottom sheet, gallery becomes a swipeable slider on mobile.

**Cross-browser hygiene**:
- Autoprefixer (via PostCSS, keyed to browserslist) — no hand-written vendor prefixes.
- Progressive enhancement with `@supports` for newer CSS (e.g. `backdrop-filter` for the translucent header falls back to solid background).
- Normalized form controls (custom Select/checkbox styling identical across engines); consistent focus-visible behavior.
- Test date inputs, `position: sticky`, smooth scrolling, and Framer Motion transforms specifically in Safari — the usual divergence points.

**Verification**:
- Playwright smoke suite runs against Chromium, Firefox, and WebKit in CI (key pages + calculator + form submission at 360 px and 1280 px viewports).
- Manual QA pass in Phase 4 on real devices: iPhone (Safari), Android (Chrome, Samsung Internet), plus desktop Chrome/Firefox/Edge/Safari — checklist covers all breakpoints, landscape orientation, and 200% browser zoom.

### 4.4 Motion & Visual Effects

The site should feel alive and premium, with restrained, purposeful effects — Framer Motion for orchestrated/scroll-driven animation, plain CSS for micro-interactions. Optional: **Lenis** for smooth inertial scrolling (tiny, works with Framer Motion's scroll hooks).

**Effect inventory**:
- **Hero**: slow Ken Burns zoom/pan on the hero image, staggered headline reveal (per-line mask/slide-up), parallax on scroll-out, animated scroll-down indicator.
- **Scroll reveals**: sections fade/slide in with stagger (`whileInView`, once per element); numbers in the advantages block count up when visible (e.g. "2 года гарантии", "500+ проектов").
- **Header**: transparent over the hero → glassmorphism (blur + translucency) after scroll, with smooth height/background transition; hide-on-scroll-down, show-on-scroll-up on mobile.
- **Portfolio/catalog cards**: image scale-in on hover, gradient overlay + title slide-up, subtle card lift with layered shadow; cursor-following tilt (desktop only) on featured cards.
- **Buttons/CTAs**: magnetic hover pull on primary CTAs (desktop), pressed states, animated arrow/icon nudge; pulsing ring on the floating callback button.
- **Calculator**: animated progress bar, step transitions (slide + fade via `AnimatePresence`), option cards with selection spring animation, confetti/success morph on completed submission.
- **Galleries/lightbox**: shared-element zoom from grid thumbnail into lightbox (`layoutId`), swipe with momentum on touch.
- **Process timeline**: line draws itself as you scroll, step nodes pop in sequence.
- **Page transitions**: quick fade/slide between routes; skeleton shimmer while dynamic content loads.
- **Texture/depth**: soft grain/noise overlay on dark sections, large blurred brand-color gradient blobs behind hero/CTA sections, brass-accent underline animations on headings.

**Performance & accessibility guardrails** (non-negotiable):
- Animate only `transform` and `opacity` (GPU-composited); no layout-triggering animations; `will-change` used sparingly and removed after animation.
- Scroll handlers via Framer Motion's `useScroll` (rAF-based) — no raw scroll listeners; heavy effects (tilt, magnetic, parallax) disabled on touch/low-power devices.
- Everything respects `prefers-reduced-motion` via a single `useReducedMotion` gate: reveals become simple fades, parallax/Ken Burns/counters/marquee turn off.
- Effects must not damage the §4.1 budgets: LCP element renders without waiting for animation; entrance animations never delay content visibility beyond 300 ms; 60 fps verified in DevTools performance traces on a throttled mid-range mobile profile.

## 5. Development Phases

### Phase 0 — Foundation (1 day) — ✅ done 2026-07-27 (Next.js 16 + Payload 3.86, Node 22 via Docker)
- Scaffold Next.js 15 + Payload 3 (`create-payload-app`, Postgres adapter), TypeScript strict, ESLint/Prettier, Husky.
- SCSS setup: install `sass`, create `src/shared/styles/` (variables, mixins incl. breakpoints per §4.3, typography, globals), wire Stylelint with the SCSS config; `browserslist` + Autoprefixer (PostCSS) configured to the §4.3 support matrix.
- FSD scaffolding: layer directories with `index.ts` public APIs; Steiger + `eslint-plugin-boundaries` in CI to enforce layer/import rules.
- `docker-compose.yml`: postgres + app with hot-reload bind mounts; `.env` conventions.
- CI skeleton (lint, typecheck, build).

### Phase 1 — Content backbone (2–3 days) — ✅ done 2026-07-27
- Define all collections, globals, access control (admin/manager/public read).
- Media collection with sharp variant presets, WebP conversion, LQIP generation, upload validation (per §4.1); upload volume wiring.
- Leads collection + `afterChange` hook → Telegram + email fan-out per §3 "Lead delivery" (non-blocking, retried, logged).
- Revalidation hooks (`revalidateTag` per collection).
- Seed script with realistic demo content (categories, products, portfolio, reviews, team, FAQ).
- Generate types; smoke-test admin CRUD end to end.

### Phase 2 — Public site (6–8 days) — ✅ done 2026-07-27 (Lighthouse pass pending real content/photos)
- Design tokens in SCSS variables/mixins, `shared/ui` primitives (Button, Input, Select, Modal, Accordion, section wrappers) each with its ARIA contract per §4.2, header/footer widgets, typography scale.
- Homepage: hero, advantages, featured categories, portfolio preview, process timeline, reviews, CTA widgets composed in `views/home` — with §4.4 effects (hero reveal, scroll animations, glass header, counters).
- Motion foundation: `shared/lib/motion` (variants, viewport presets, `useReducedMotion` gate), effect components (Reveal, Counter, Parallax, Magnetic, TiltCard).
- Catalog: category listing, category page, product page (gallery, specs, price, CTA).
- Portfolio with filters + lightbox.
- Cost calculator wizard (multi-step, client state via zustand, zod validation, submits lead).
- Lead forms + callback widget; success states; anti-spam (honeypot + rate limit).
- Contacts (map), FAQ, legal pages.
- SEO: metadata API, JSON-LD, sitemap, robots, OG images.
- Performance pass: Lighthouse ≥ 90 mobile (LCP < 2.5 s), image payload budgets per §4.1.
- Playwright cross-browser smoke suite (Chromium/Firefox/WebKit, mobile + desktop viewports) added to CI per §4.3.

### Phase 3 — Admin polish (1–2 days) — ✅ done 2026-07-27
- Leads inbox: list columns/filters, status workflow, CSV export endpoint, dashboard "recent leads" widget.
- Admin branding + Russian locale; live preview configuration for products/portfolio.
- Editor walkthrough doc (how to add a product, publish a project, process a lead).

### Phase 4 — Production & hardening (2 days) — ✅ done 2026-07-27 (Sentry + Payload migrations for prod schema changes left as follow-ups; real-device QA & Lighthouse pass pending real content)
- Multi-stage production Dockerfile (Next.js `output: 'standalone'`, non-root, alpine), `docker-compose.prod.yml` with nginx + certbot.
- DB backup job (pg_dump cron container), healthchecks, restart policies, uploads volume backup.
- Security: CSP headers, rate limiting, upload validation, `/admin` optionally IP-allowlisted at nginx.
- Analytics (Yandex.Metrika/GA4), error tracking (Sentry).
- Content load-in, real-device cross-browser QA per §4.3 (Playwright matrix + manual device checklist), launch checklist.

**Total estimate: ~12–16 working days** for one developer.

## 6. Docker Topology

```yaml
# dev (docker-compose.yml)
services:
  postgres:   # postgres:16-alpine, volume pgdata
  app:        # node:22-alpine, next dev (site + /admin + /api in one process)
              # bind mounts for hot reload, depends_on postgres
# prod (docker-compose.prod.yml)
  app:        # multi-stage build, standalone output, non-root, healthcheck
  postgres:
  nginx:      # TLS, /uploads static, proxy → app
  certbot:    # cert renewal
  backup:     # nightly pg_dump + uploads rsync to volume
```

Secrets via `.env` files excluded from VCS (`PAYLOAD_SECRET`, `DATABASE_URI`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, SMTP creds, `LEADS_EMAIL_TO`).

## 7. Risks & Open Questions

- **Content source**: real photos/texts needed from the client; plan uses seeded placeholders until then.
- **Calculator pricing logic**: exact formula (materials × dimensions) needs client input; v1 collects answers as a lead without computing a price.
- **Installment/financing block**: display-only vs. real bank integration — assume display-only for v1.
- **Language**: Russian only for v1; Payload localization + next-intl can be added later — keep frontend strings centralized from the start.
- **Admin UX ceiling**: Payload's admin is customizable but opinionated; if a heavily bespoke leads/CRM workflow emerges later, it can be built as custom admin views or a separate app against Payload's API.
- shkaf-graf.by was unreachable during planning; feature list is based on mebel-fbrk.by. Revisit if the original becomes available.
