# TV Channel - Premium National Broadcaster Platform

A production-ready Next.js 15 media platform built for a national TV broadcaster -
live streaming, original shows, breaking news, a video library, presenter profiles
and more, in a cinematic dark UI inspired by Netflix, BBC and Apple TV.

> **Note on the name:** "TV Channel" and its waveform mark are placeholder branding.
> Swap the name, colors, and logo mark (`components/ui/pulse-mark.tsx`) for your
> own channel identity - the rest of the codebase doesn't hardcode the brand name
> anywhere else of consequence except copy strings, which are easy to find/replace.

## Stack

- **Next.js 15** (App Router, Turbopack, React 19)
- **TypeScript** throughout
- **Tailwind CSS v4** (CSS-first config via `@theme inline` in `app/globals.css`)
- **Framer Motion** for animation
- **Radix UI primitives** (`@radix-ui/react-dialog`, etc.) styled in shadcn/ui fashion
- **lucide-react** for iconography (brand/social icons are hand-drawn SVGs - see
  `components/ui/social-icons.tsx` - since lucide-react no longer ships brand marks)

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Requires network access on first build so
`next/font/google` can fetch Space Grotesk and Inter (fonts are then cached).

## Project structure

```
app/                      Route segments (App Router)
  page.tsx                Homepage - assembles all homepage sections
  watch-live/              Live streaming page
  programs/, programs/[slug]/     Program catalogue + detail
  schedule/                TV schedule
  news/, news/[slug]/      Newsroom + article detail
  videos/, videos/[slug]/  Video/episode/podcast library + detail
  presenters/, presenters/[slug]/ Presenter directory + profile
  gallery/, about/, advertise/, contact/
  sitemap.ts, robots.ts    SEO plumbing
components/
  layout/                 Navbar, Footer, floating widgets, search modal
  home/                   All homepage section components
  programs/, news/, videos/, contact/   Page-specific client browsers/forms
  ui/                     Design-system primitives (Button, Badge, etc.)
lib/
  data.ts                 Mock CMS content - swap for real API/CMS calls
  utils.ts                Small helpers (cn, date formatting, countdowns)
types/
  index.ts                Shared content model types
```

## Connecting a real CMS / live stream

- **Content:** every section reads from `lib/data.ts`. Each exported array
  (`shows`, `episodes`, `news`, `presenters`, `podcasts`, `schedule`) matches the
  shapes in `types/index.ts`. Point these at your CMS (Sanity, Strapi, Contentful,
  a headless WordPress instance, etc.) or a database query - no component changes
  required as long as the shape matches.
- **Live video:** the live player sections (`components/home/live-tv-section.tsx`,
  `app/watch-live/page.tsx`) currently render a static preview image with a play
  button. Replace the `<Image>` + button block with your HLS/DASH player of choice
  (Video.js, hls.js, or a Cloudflare Stream / YouTube embed iframe).
- **Forms:** the newsletter and contact forms (`components/home/newsletter.tsx`,
  `components/contact/contact-form.tsx`) simulate submission client-side. Wire the
  `handleSubmit` functions to real API routes (e.g. `app/api/newsletter/route.ts`).

## SEO

- Per-page `generateMetadata` / static `metadata` exports, Open Graph + Twitter
  cards, canonical URLs
- JSON-LD: `TelevisionStation` (root layout), `TVSeries` (program pages),
  `NewsArticle` (news pages), `Person` (presenter pages), `VideoObject` (video pages)
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`
  dynamically from the mock content - update the `siteUrl` constant in each file
  (and in `app/layout.tsx`) to your real domain before deploying

## Accessibility

- Skip-to-content link, visible focus rings, `prefers-reduced-motion` support,
  semantic landmarks, labeled icon-only buttons, and accessible form labels
  throughout. Run `npm run build` + a Lighthouse pass before launch to confirm
  scores on your final content and images.

## Deployment

Ready to deploy to **Vercel** (zero config) or **Cloudflare Pages** (via the
`@cloudflare/next-on-pages` adapter). Remote images currently point at
`picsum.photos` placeholders - update `next.config.ts` `images.remotePatterns`
to match your real media host(s).
