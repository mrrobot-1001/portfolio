# Harsh Rana — Portfolio

Recruiter-first portfolio in a Swiss editorial / modern brutalist style.
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```

## Where the content lives

| File | What it holds |
|---|---|
| `data/profile.ts` | Name, role, copy, email, links, availability, experience, education, certifications, skills, "What I bring" |
| `data/projects.ts` | Per-repo overrides: titles, taglines, stack, case studies, media, ranking corrections, hidden repos |
| `data/github-snapshot.json` | Offline fallback of GitHub data (generated) |
| `public/resume.pdf` | Resume linked from nav, hero and contact |
| `public/images/` | Portrait and project screenshots |

Edit data files, not components.

## GitHub pipeline

```
GitHub REST/GraphQL  →  lib/github.ts      (server-only, revalidated daily, falls back to snapshot)
                     →  lib/ranking.ts     (weighted heuristic, never displayed)
                     →  data/projects.ts   (manual overrides win)
                     →  lib/projects.ts    (normalised Project[]: featured + archive)
                     →  UI
```

- **Selected Work** = repos with `featured: true` in `data/projects.ts`, ordered by `order`, then score.
- **Index / More on GitHub** = remaining eligible public repos ranked by `lib/ranking.ts`
  (forks, empty, tutorial-like and `hidden` repos are excluded).
- Weights: complexity 20 · usefulness 20 · completeness 15 · relevance 20 · documentation 10 · deployment 10 · originality 5.
- Refresh the fallback snapshot: `npm run snapshot` (uses `GITHUB_TOKEN` or `gh auth token`).

### Environment

Copy `.env.example` → `.env.local`.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | for production | Canonical URLs, sitemap, OpenGraph. Falls back to the Vercel production URL. |
| `GITHUB_USERNAME` | no | Defaults to `mrrobot-1001` |
| `GITHUB_TOKEN` | no | Server-only. Higher rate limit + live contribution calendar. Never prefix with `NEXT_PUBLIC_`. |

## Motion system

- `lib/gsap.ts` registers plugins and exports shared media queries (`MQ.desktop`, `MQ.mobile`, `MQ.reduced`).
- Hero and loader use `useGSAP` (above the fold). Everything else uses `useMotion` (`lib/motion.ts`),
  which batches setup into one idle callback and one `ScrollTrigger.refresh()` to keep hydration cheap.
- Sticky sections use CSS `position: sticky`; GSAP only maps scroll progress (no pin spacers).
- The `exhibit:` Tailwind variant (desktop + JS + motion allowed) switches Work and Stack into their
  sticky "exhibition" layouts. Without JS, on mobile, or with reduced motion they are plain vertical lists.
- Content is visible in the server HTML; start states are applied by GSAP only.

## Quality checks (production build, local)

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home — mobile | 93 | 100 | 100 | 100 |
| Home — desktop | 99 | 100 | 100 | 100 |
| Case study — mobile | 94–96 | 100 | 100 | 100 |

## Before publishing — please verify

- `NEXT_PUBLIC_SITE_URL` for the real domain.
- `profile.availableFor` / `profile.workModes` in `data/profile.ts` (currently Full-time · Internships, Remote · Hybrid · Onsite).
- The live demos `showcase.kiraserver.live` and `buconnect.kiraserver.live` were returning HTTP 530 (tunnel origin down) when this was built.
- `public/resume.pdf` is the SDE CV and includes a phone number.
