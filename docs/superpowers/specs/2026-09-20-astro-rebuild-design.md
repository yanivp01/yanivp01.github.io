# yapros.co.uk — Astro rebuild: design spec

**Date:** 2026-09-20
**Branch:** `astro-rebuild` (off `main`; `redesign` is the abandoned static-HTML branch)
**Owner:** Eli Belilty for Dr. Yaniv Proselkov
**Status:** awaiting review

## 1. Goal

Rebuild Yaniv's personal site so it tells one story, converts three audiences (speaker bookings, course commissions, collaborators), surfaces the social proof he already has, and can be measured. The current site is a well-made archive with no claim, no CTA, no proof above the fold, and no analytics.

### Non-goals

- Newsletter, contact form, CMS. Contact is `mailto:yanivproselkov@gmail.com`.
- New domain. `yanivproselkov.com` is available and parked; the site ships on `www.yapros.co.uk`.
- Rewriting essay or paper content. Copy changes are limited to the hero, section intros, lane blurbs and the About narrative.

## 2. Architecture

| Concern | Decision |
|---|---|
| Framework | Astro 5, TypeScript, static output (`output: 'static'`) |
| Styling | Plain CSS. The token system from `css/style.css` is ported to `src/styles/global.css` with the new type stack. Tailwind 4 is installed only because Starwind UI requires it; utilities are used inside Starwind components, never for page layout or typography. |
| Components | Starwind UI (button, badge, tabs) and accessible-astro-components (accordion, modal). Everything else is bespoke `.astro`. |
| Content | Astro content collections. Essays are MDX. Papers, talks, courses, videos, testimonials are JSON collections with Zod schemas. |
| Motion | motion.dev (vanilla `animate`, `inView`, `stagger`). All motion behind `prefers-reduced-motion: no-preference`. |
| Graph | `3d-force-graph` (three.js) as a `client:idle` island on the homepage hero and `client:load` on `/model`. 2D fallback: existing `network.js` logic ported to a canvas island, used when reduced-motion is set or WebGL is unavailable. |
| Fonts | `@fontsource/instrument-serif`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, self-hosted. No Google Fonts request. |
| SEO | `astro-seo` in the base layout; `@astrojs/sitemap`; `astro-og-canvas` for per-essay OG images; JSON-LD `Person` + `WebSite` kept from the current site. |
| Icons | `astro-icon` with Simple Icons (LinkedIn, Google Scholar, ResearchGate) and Lucide (arrows, download, external). |
| Analytics | GA4 gtag in `<Analytics>` component, reading `PUBLIC_GA_ID`. Empty → no tag rendered. |
| Hosting | GitHub Pages via `withastro/action`. `CNAME` moves to `public/`. Cloudflare Pages is a later swap with zero code change. |

### Repo layout

```
astro.config.mjs
package.json
public/
  CNAME  favicon.svg  robots.txt
  pictures/  papers_pdf/  videos/         # moved from repo root, untouched
src/
  layouts/Base.astro                      # html shell, SEO, JSON-LD, Header, Footer, Analytics
  components/
    Header.astro  Footer.astro  Analytics.astro
    Hero.astro  LogoStrip.astro  Lanes.astro  FeaturedWork.astro  EssayList.astro  ClosingBand.astro
    TalkCard.astro  CourseCard.astro  PaperCard.astro  EssayCard.astro  Testimonial.astro
    NetworkGraph3D.astro (+ .ts island)  NetworkGraph2D.astro (+ .ts island)
  content/
    config.ts
    essays/*.mdx
    papers.json  talks.json  courses.json  videos.json  testimonials.json  logos.json
  pages/
    index.astro  speaking.astro  teaching.astro  research.astro  model.astro  about.astro
    essays/index.astro  essays/[slug].astro
    og/[...slug].png.ts                    # astro-og-canvas
  styles/global.css
docs/superpowers/specs/                    # this file
```

### Removed from the repo

`scratch/`, `scratch_linkedin.html`, `widgets/`, `sitemap.html`, `sitemap.xml` (generated), root-level `*.html`, `css/`, `js/`, `data/` (migrated into `src/content/`).

### Redirects

Astro `redirects` config emits a stub page per old URL so every existing inbound link resolves:

| Old | New |
|---|---|
| `/index.html` | `/` |
| `/bio.html` | `/about` |
| `/papers.html` | `/research` |
| `/blog.html` | `/essays` |
| `/essays/<slug>.html` | `/essays/<slug>` |
| `/teaching.html` | `/teaching` |
| `/network.html` | `/model` |
| `/videos.html` | `/speaking#videos` |
| `/sitemap.html` | `/sitemap-index.xml` |

PDF and picture paths are unchanged.

## 3. Information architecture

**Nav:** Speaking · Teaching · Research · Essays · Model · About · **Get in touch** (filled button, `mailto:`). Mobile: hamburger below 800px.

| Route | Purpose | Sections in order |
|---|---|---|
| `/` | Sell all three audiences in one scroll | Hero → LogoStrip → Lanes → FeaturedWork → EssayList (latest 3) → ClosingBand |
| `/speaking` | Bookings | Intro + three signature topics → LogoStrip → past talks (from `talks.json`, newest first, photo where available) → Videos (the two existing, YouTube embed + local mp4) → Testimonials → ClosingBand |
| `/teaching` | Commissions | Intro → CourseCards (Entrepreneurship 8-week; Digital Technology in Business modular) each with accordion syllabus, format, audience, languages → Recent deliveries with photos → "Bespoke commissions" note → ClosingBand |
| `/research` | Credibility | Academic papers, theses, think-tank pieces from `papers.json` with thumbnails; Scholar / ResearchGate links |
| `/essays` | Voice, SEO | Cards with cover, date, tags, one-line summary |
| `/essays/[slug]` | Reading | Article layout (760px), cover, per-essay OG image, "Discussed on LinkedIn" link, related essays (same tag, max 3), prev/next |
| `/model` | Differentiator | Full-bleed 3D graph, layer legend, node-star panel, three PDF links |
| `/about` | Story | Narrative bio (≤300 words) → selected highlights → CV sections (Education, Experience, Ventures, Awards, Speaking) collapsed by default → "Beyond work" → headshot downloads |

Videos is folded into Speaking. The nav label is "Model"; the page title is "Ecosystem Model".

## 4. Homepage

### Hero

Two columns (7/5) at ≥1024px, stacked below. Content, top to bottom:

1. Eyebrow — Geist Mono 12px, +0.14em tracking, uppercase, muted: `Researcher & Strategist · AI Engineer · Public Speaker`
2. H1 — Instrument Serif 78px desktop / 44px mobile, line-height 0.98, three lines:
   ```
   I study how things spread through networks
   money, risk, ideas          ← italic, accent blue, own line
   and build the systems that steer them.
   ```
3. Verb line — Geist 19px: `I **speak**, **teach** and **build** across AI, supply-chain finance and innovation ecosystems.`
   - `.verb`: weight 600; hover → colour `#1f4ed8`, 2px underline in the same blue.
   - `.subj`: hover → colour `#3b6ff0`, background `#eaf0ff`, 4px radius.
   - Hover only; no click action.
4. Roles — 2-column list, blue 6px dot markers, Geist 15px:
   - `PhD, University of Cambridge` / `Institute for Manufacturing` (two lines)
   - `AI Engineer, AIOS`
   - `Director of Research, Global Cambridge`
   - `Co-founder, Venture Scholar Studio`
5. Buttons — filled blue pill **Book a talk** (`mailto:` with subject "Speaking enquiry"); ghost pill **See the research** (`/research`).

Right column: `NetworkGraph3D` island, 22 nodes from the ecosystem model data, ink nodes, blue edges at 35% opacity, slow auto-rotate, pointer-reactive, no labels. Behind it at 12% opacity a B&W portrait (from the album, cropped square). Reduced-motion → `NetworkGraph2D` static render.

Entrance: eyebrow → H1 lines → verb line → roles → buttons, `stagger(0.06)`, 600ms total, `ease-out`; graph fades in over 800ms after.

### LogoStrip

Eyebrow "Spoken at", then greyscale marks at 70% opacity, full colour on hover: Cambridge arms + "Cambridge Judge" wordmark in Instrument Serif; London Business School; Imperial College London; The Alan Turing Institute; Barclays; BT. Sources are the Wikimedia Commons files already vetted (Barclays uses `Barclays-Logo.svg` with a tightened viewBox). Logos live in `public/logos/` and are listed in `logos.json` so the strip is reused on `/speaking`.

### Lanes

Three equal cards, one line each, arrow link, hover lifts 2px with `--shadow-md`:

1. **Book a talk** — Keynotes and panels on AI, supply-chain finance and innovation ecosystems. In English or with Chinese interpretation. → `/speaking`
2. **Commission a course** — From a 90-minute executive session to an 8-week entrepreneurship programme. → `/teaching`
3. **Collaborate** — Research, venture strategy and ecosystem design with AIOS, Global Cambridge and partners. → `/about#work`

### FeaturedWork

Three larger cards with real thumbnails: the IJPR *Financial Ripple Effect* paper; the *Mushrooms, not Ecosystems* essay; the Ecosystem Model (still of the graph, "Explore the interactive model").

### EssayList

Latest three: mono date · title · one-line summary. "All essays →".

### ClosingBand

Full-width `--color-ink` band: "Working on something at the intersection of networks, capital and AI?" + **Get in touch** + LinkedIn / Scholar / ResearchGate pills. Footer beneath: sitemap link, ©, the Y mark.

### Rhythm

Hero min-height 100vh (capped at 960px) → strip → lanes → featured → essays → band. Sections alternate `--color-surface` white and `--color-bg` grey. Grids max 1100px, prose max 760px.

## 5. Design system

### Tokens (`global.css`)

```
--color-bg #eef0f3   --color-bg-2 #e7eaef   --color-surface #ffffff   --color-surface-2 #f6f7f9
--color-ink #0e0e10  --color-text #1f2024   --color-muted #6a6a72     --color-faint #9a9aa2
--color-line #e1e3e8 --color-line-2 #ececef --color-rule #cdd1d8
--color-accent #1f4ed8   --color-accent-2 #3b6ff0   --color-accent-soft #eaf0ff
--radius 6px  --radius-lg 10px  --radius-pill 999px
--max-width 760px  --max-width-wide 1100px
--font-serif 'Instrument Serif', Georgia, serif
--font-sans 'Geist Variable', system-ui, sans-serif
--font-mono 'Geist Mono Variable', Menlo, monospace
--shadow-sm / -md / -lg  (unchanged from current site)
--ease cubic-bezier(.4,0,.2,1)   --dur-fast 180ms   --dur 320ms
```

Accent stays cool blue. No warm accent.

### Type scale

| Role | Face | Size (desktop / mobile) | Weight | Tracking |
|---|---|---|---|---|
| Display / H1 | Instrument Serif | 78 / 44 | 400 | −0.015em |
| H2 | Instrument Serif | 44 / 32 | 400 | −0.01em |
| H3 | Instrument Serif | 28 / 24 | 400 | 0 |
| Card title | Geist | 18 | 600 | −0.01em |
| Body | Geist | 17 / 16 | 400 | 0 |
| Small | Geist | 14 | 400 | 0 |
| Eyebrow | Geist Mono | 12 | 500 | +0.14em, uppercase |
| Date / meta | Geist Mono | 13 | 400 | +0.02em |

Instrument Serif has no bold: emphasis inside headings is italic and/or accent colour, never `font-weight`.

### Components

| Component | Notes |
|---|---|
| Button | Starwind `Button`, restyled: pill radius, 46px height, filled = accent bg/white text, ghost = 1px `--color-rule`, text = accent underline on hover. |
| Card | 1px `--color-line`, `--radius`, `--shadow-sm`; hover `translateY(-2px)` + `--shadow-md`, 180ms. Left-border-on-hover pattern from the old site is dropped. |
| Badge | Starwind `Badge`; tags on essays and talk types (Keynote / Panel / Lecture). |
| Accordion | accessible-astro-components; course syllabi and About CV sections. |
| Tabs | Starwind `Tabs`; on `/model` for "Full graph / Node-star". |
| Header | Sticky, 72px, blur backdrop, active link underline 2px accent. Hamburger below 800px opens a full-height sheet. |
| Footer | Dark, centred, social pills, sitemap link, ©. |
| LogoStrip, Lanes, FeaturedWork, EssayList, ClosingBand | As in §4. |
| TalkCard | Photo (16:9) or thumbnail, badge, title, venue · city · year, one-line blurb, LinkedIn link. |
| CourseCard | Title, format/duration/audience/languages as a mono spec row, accordion syllabus, CTA. |
| PaperCard | Ported from `papers.js` with thumbnail, byline, blurb, links. |
| EssayCard | Cover, date, title, summary, tags. |
| Testimonial | Quote in Instrument Serif italic 24px, name + role in Geist 14px. Rendered only when `testimonials.json` is non-empty. |

### Motion rules

- Entrance and scroll-reveal only on the homepage and section intros; content pages are static.
- `inView` reveal: opacity 0→1, translateY 12px→0, 320ms, once.
- Hover transitions 180ms. No parallax, no smooth-scroll library.
- Everything wrapped in `@media (prefers-reduced-motion: no-preference)`; the 3D graph is not mounted at all under reduced motion.

## 6. Content model

`src/content/config.ts` schemas (Zod):

```ts
essays (MDX): { title, date, summary, cover: {src, alt}, tags: string[], linkedin?: url, ogImage?: string }
papers (JSON): { category: 'academic'|'thesis'|'think-tank', title, authors, venue, year, blurb, image?: {src, alt?}, links: {kind:'pdf'|'ext'|'internal', label?, href}[] }
talks (JSON): { title, kind: 'keynote'|'panel'|'lecture'|'conference', venue, city, year, blurb, image?: {src, alt}, links: {label, href}[], featured?: boolean }
courses (JSON): { title, format, duration, audience: string[], languages: string[], summary, modules: {title, blurb?}[] }
videos (JSON): { title, event, date, youtube?: string, mp4?: string, summary, speakers?: string[] }
testimonials (JSON): { quote, name, role, org }
logos (JSON): { name, src, height, wordmark?: string }
```

Migration: `data/papers.json` splits into `papers.json` (Academic Papers, Theses, Think Tank Pieces) and `talks.json` (Conference Presentations + Invited Talks). `data/essays.json` frontmatter moves into each essay's MDX; essay bodies are converted from the existing HTML.

Publishing workflow for Yaniv: add an `.mdx` file under `src/content/essays/` or an entry to a JSON file, push to `main`, the Action deploys. Documented in `README.md`.

## 7. Build, deploy, quality

- **Node 22**, pnpm. Scripts: `dev`, `build`, `preview`, `check` (`astro check` + `tsc --noEmit`), `lint` (eslint + prettier).
- **CI:** `.github/workflows/deploy.yml` — on push to `main`: install, `astro check`, `astro build`, deploy to Pages. On pull requests: install, check, build only (no deploy).
- **Tests:** Vitest for content-collection schemas (every JSON entry validates) and for the redirect table (every old URL in the current `sitemap.xml` has a target). Playwright smoke test on `preview`: each route returns 200, has exactly one `h1`, has `og:image`, and the hero renders without console errors. Lighthouse CI budget on `/`: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **Accessibility:** all interactive hero text is decorative hover only (no focus trap); logos have `alt`; hamburger is a real `<button aria-expanded>`; colour contrast ≥ 4.5:1 for all text on all backgrounds (`--color-muted` on white passes at 5.3:1).
- **Performance:** three.js is code-split into the graph island; homepage JS budget excluding the island ≤ 40 KB gzipped. Images through `astro:assets` with `width`/`height` set; hero portrait ≤ 120 KB.

## 8. Open items (do not block build)

| Item | Owner | Effect if missing |
|---|---|---|
| GA4 measurement ID | Yaniv | `PUBLIC_GA_ID` empty → no tag; add and redeploy |
| Album download (Google Photos "Yaniv Looking Stylish") | Eli, with Yaniv's OK | Hero and talk photos fall back to existing `pictures/` |
| Attributed testimonials (2–3) | Yaniv | Testimonial section not rendered |
| CJBS official lockup SVG | Yaniv | Cambridge arms + wordmark stays |
| Headshot files for download | Yaniv | About page "Headshots" block hidden |

## 9. Reference

- Font A/B canvas (Option B chosen): https://claude.ai/artifact/2mEyWkJzYXmVRw2bt66JbT
- Comparator sites studied: azeemazhar.com, marianamazzucato.com, chidalgo.com, ben-evans.com, barabasi.com, hannahfry.co.uk.
