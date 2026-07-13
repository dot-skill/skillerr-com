# Deploy skillerr.com (GitHub Pages)

Free static hosting from **dot-skill/skillerr-com** — website-only repo, separate from the OSS protocol repo.

## What ships

- VitePress site (agent-first pages, brand mark, Mermaid workflows)
- Tested `.skill` fixtures in `docs/public/fixtures/` (built from [dot-skill/skillerr](https://github.com/dot-skill/skillerr) `examples/` at deploy)
- `llms.txt` at site root for agents
- CNAME: `skillerr.com`

## One-time GitHub setup

1. **dot-skill/skillerr-com** → Settings → Pages  
   - Source: **GitHub Actions**
2. Settings → Pages → Custom domain: `skillerr.com`  
   - Enforce HTTPS after DNS propagates and the cert is ready

Workflow: `.github/workflows/pages.yml` (runs on push to `main`). CI checks out `dot-skill/skillerr` to build fixtures, then builds this site.

Project Pages URL (before custom domain): `https://dot-skill.github.io/skillerr-com/`

## DNS (registrar)

Apex `skillerr.com` (GitHub Pages A records — unchanged):

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Optional `www`:

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `dot-skill.github.io` |

**Note:** Custom domain must be configured on **skillerr-com** (not `dot-skill/skillerr`). After migration, remove any custom domain from the OSS repo Pages settings if it was set there.

Verify: `dig skillerr.com +short` should return the four A records.

## Local build

```bash
git clone https://github.com/dot-skill/skillerr.git ../skillerr
cd ../skillerr && npm run build && cd -

npm install
DOT_SKILL_ROOT=../skillerr npm run build
npm run fixtures:test
npm run preview        # http://localhost:4173
```

## Pages (13 routes)

| Path | Content |
|------|---------|
| `/` | Overview + hero |
| `/getting-started` | Copy-paste agent prompts |
| `/workflows` | Mermaid create / ingest / extract diagrams |
| `/create-a-skill` | Create path |
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

Built from `dot-skill/skillerr` `examples/` via `scripts/build-fixtures.mjs`:

- `knowledge-only.skill` (continuity)
- `parameterized-integration.skill` (continuity)
- `code-changing.skill` (continuity)
- `contract-foundation.skill` (release)

Manifest: `/fixtures/manifest.json`
