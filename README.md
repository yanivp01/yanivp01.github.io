# yapros.co.uk

Personal site of Dr. Yaniv Proselkov. Built with [Astro](https://astro.build); deploys to GitHub Pages on every push to `main`.

## Editing content

- **Essays:** add a file to `src/content/essays/<slug>.mdx` with frontmatter `title`, `date` (YYYY-MM-DD), `summary`, `cover: { src, alt }`, `tags: [...]`, `linkedin`. The body is Markdown. The URL becomes `/essays/<slug>`; an OG image is generated automatically. `cover` is optional, and its `caption` field is optional too.
- **Papers, talks, courses, videos, testimonials, logos:** edit the JSON files in `src/content/`. Every entry needs a unique `id`. Fields are validated on build (`src/content/schemas.ts`).
- **Images and PDFs:** drop into `public/pictures/` or `public/papers_pdf/` and reference as `/pictures/...`.
- **Copy on pages:** `src/pages/*.astro`.

## Running locally

    pnpm install
    pnpm dev        # http://localhost:4321
    pnpm build && pnpm preview

## Checks

    pnpm check      # types
    pnpm test       # unit tests (schemas, components, redirects)
    pnpm test:e2e   # browser smoke tests against the built site

## Configuration

Set these under Settings → Secrets and variables → Actions:

- `PUBLIC_GA_ID` (**variable**, public — it ships in the page): GA4 measurement ID. Empty = no analytics tag.
- `PUBLIC_CAL_LINK` (**variable**, public — it ships in the page): Cal.com booking page for "Book a talk", e.g. `yaniv/30min`. Empty = the button falls back to a mailto link.
- `CAL_API_KEY` (**secret**, never a variable — it must never ship to the browser): reserved for build-time use only (e.g. calling the Cal.com API to list event types). Nothing reads it yet.

## Deploy

GitHub Pages, source "GitHub Actions". `public/CNAME` holds the custom domain.

Before the first deploy to `main`, switch the repo's Pages source to "GitHub Actions" under Settings → Pages.
