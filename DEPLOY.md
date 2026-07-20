# Deploy skillerr.com

`main` only receives merges from `release/*` or `hotfix/*` branches (see CONTRIBUTING.md's Branch flow section); day-to-day work happens on `develop`. Whatever lands on `main` deploys automatically, same as before, just from a more deliberate source now.

This site deploys to **two places** from the same `main` branch, independently:

1. **docs.skillerr.com** (Vercel, production): its own subdomain, docs served at root
2. **dot-skill.github.io/skillerr-com/** (GitHub Pages): kept live as a secondary/fallback mirror

Both are driven by the same `npm run build`, just with different `base` paths (see `docs/.vitepress/config.ts`) and different output-directory wiring (see `vercel.json` for Vercel; `.github/workflows/pages.yml` for Pages).

## Domain split: docs.skillerr.com vs. skillerr.com

Docs used to live under `skillerr.com/docs/`, with the bare root reserved for a future product built on top of the Open `.skill` Protocol. That product now has its own home instead: docs moved to their own subdomain, **docs.skillerr.com**, serving at its own root — no more nested `/docs/` path, no more sharing a domain with the product. `skillerr.com`/`www.skillerr.com` now redirect everything to the equivalent `docs.skillerr.com` path (see `vercel.json`'s `redirects`, deliberately temporary/307, not a permanent 301, since that domain's real destination will change again once the product launches there); a separate `/docs/:path*` -> `/:path*` redirect (permanent, this one won't change again) catches anyone still on an old nested-path link, on either domain.

## Vercel (production)

Project imported from **dot-skill/skillerr-com** on Vercel, auto-deploys on push to `main`, serving `docs.skillerr.com` (see the sibling private registry repo for what's happening with `skillerr.com` itself).

- `vercel.json`'s `outputDirectory` points straight at the VitePress build output (`docs/.vitepress/dist`); no path-wrapping needed now that docs serve at root, matching the VitePress `base: "/"` used everywhere except the GitHub Pages build.
- Fixtures build standalone on Vercel via the npm-installed `skillerr` CLI + `fixtures-src/` (vendored example sources), see the comment at the top of `scripts/build-fixtures.mjs`. No sibling repo checkout needed or possible on Vercel.
- `FIXTURES_SIGNING_KEY` isn't set on Vercel today, so the release fixture mints as `development` trust there, not `verified_issuer`; only the GitHub Actions deploy has that secret. Not a bug, just means the two mirrors' fixture trust states can legitimately differ until this secret is also added to Vercel.

## GitHub Pages (secondary)

**dot-skill/skillerr-com** → Settings → Pages → Source: GitHub Actions.

Workflow: `.github/workflows/pages.yml` (runs on push to `main`). CI checks out `dot-skill/skillerr` as a sibling to build real fixtures (the sibling checkout Vercel can't do), then builds this site with `base: "/skillerr-com/"` (`GITHUB_ACTIONS` env var is set automatically in this one environment, see the comment in `docs/.vitepress/config.ts`).

## Local build

```bash
git clone https://github.com/dot-skill/skillerr.git ../skillerr
cd ../skillerr && npm run build && cd -

npm install
DOT_SKILL_ROOT=../skillerr npm run build
npm run fixtures:test
npm run preview        # http://localhost:4173/ (base defaults to / locally)
```

To test the Vercel npm-CLI fallback locally (no sibling checkout; `base` is the same `/` as any other non-Pages build now, so this only exercises the fixtures-source fallback, not a distinct `base`):

```bash
npm install   # picks up the `skillerr` devDependency
VERCEL=1 npm run build
```

## Pages (13 routes, at root on docs.skillerr.com)

| Path | Content |
|------|---------|
| `/` | Overview + hero |
| `/getting-started` | Copy-paste agent prompts |
| `/workflows` | Mermaid create / ingest / extract diagrams |
| `/create-a-skill` | Create path |
| `/convert-a-skill-md` | Convert an existing SKILL.md |
| `/evaluate-and-score` | Eval / score path |
| `/ingest-a-skill` | Ingest path |
| `/agents` | Agent authoring rules |
| `/protocol` | Protocol spec overview |
| `/cli` | CLI reference |
| `/trust-and-security` | TrustView / SKILL_HOST honesty |
| `/fixtures` | Downloadable `.skill` + manifest |
| `/faq` | FAQ |
| `/roadmap` | Public roadmap |
| `/llms.txt` | Agent index |

## Fixtures

Built from `dot-skill/skillerr` `examples/` (sibling checkout) or `fixtures-src/` (vendored copy, Vercel) via `scripts/build-fixtures.mjs`:

- `knowledge-only.skill` (continuity)
- `parameterized-integration.skill` (continuity)
- `code-changing.skill` (continuity)
- `contract-foundation.skill` (release, the only mintable profile)

Manifest: `/fixtures/manifest.json` on every deploy now (production, GitHub Pages, and local all resolve it the same relative-to-`base` way).
