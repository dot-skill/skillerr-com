# Contributing

This repo is the docs/site only (VitePress, fixtures gallery, `llms.txt`). For the protocol itself, the reference CLI, and implementer docs, see [dot-skill/skillerr](https://github.com/dot-skill/skillerr) and its [CONTRIBUTING.md](https://github.com/dot-skill/skillerr/blob/main/CONTRIBUTING.md).

## What belongs here

- Site copy, guides, and navigation (`docs/`)
- Fixture generation (`scripts/build-fixtures.mjs`): pulls examples from a sibling `dot-skill/skillerr` checkout
- Anything specific to rendering/deploying `skillerr.com`

Protocol semantics, CLI behavior, and package code changes belong in the OSS repo, not here.

## Dev setup

See [README.md](./README.md#run-locally).

## Branch flow

`main` only accepts merges from a `release/*` or `hotfix/*` branch (enforced by CI, see `enforce-branch-flow.yml`). Feature/doc work branches off `develop` and PRs back into `develop` instead. `release/*` is cut from `develop` when it's time to ship; `hotfix/*` branches off `main` directly for something urgent, then merges back into both `main` and `develop`.

## Pull requests

No direct commits to any branch's protected target. Branch, PR, and let CI (`Deploy skillerr.com`, `enforce-branch-flow` on PRs into `main`) pass before merging. Keep doc changes scoped: don't rewrite unrelated sections in the same PR.

Sign-off (DCO) follows the same convention as the OSS repo, see [dot-skill/skillerr/DCO.md](https://github.com/dot-skill/skillerr/blob/main/DCO.md).
