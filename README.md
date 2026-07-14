# skillerr.com

Public agent-first documentation site for the **Open `.skill` Protocol** — [skillerr.com](https://dot-skill.github.io/skillerr-com/).

This repo is **website only** (VitePress, fixtures gallery, `llms.txt`). The open protocol, reference CLI, and implementer docs live in the OSS repo:

**[dot-skill/skillerr](https://github.com/dot-skill/skillerr)** — `.skill` format, packages, `docs/*.md`, examples.

## Run locally

```bash
# Clone sibling OSS repo (examples + CLI for fixtures)
git clone https://github.com/dot-skill/skillerr.git ../skillerr
cd ../skillerr && npm run build && cd -

npm install
DOT_SKILL_ROOT=../skillerr npm run fixtures:build
npm run dev              # http://localhost:5173
```

## Build

```bash
npm run build            # fixtures + vitepress → docs/.vitepress/dist
npm run preview
npm run fixtures:test
```

## Deploy

GitHub Pages from **this repo** — see [DEPLOY.md](./DEPLOY.md) for DNS and custom domain (`skillerr.com`).

Workflow: [`.github/workflows/pages.yml`](./.github/workflows/pages.yml)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE)
