# Contributing

This repo is the docs/site only (VitePress, fixtures gallery, `llms.txt`). For the protocol itself, the reference CLI, and implementer docs, see [dot-skill/skillerr](https://github.com/dot-skill/skillerr) and its [CONTRIBUTING.md](https://github.com/dot-skill/skillerr/blob/main/CONTRIBUTING.md).

## What belongs here

- Site copy, guides, and navigation (`docs/`)
- Fixture generation (`scripts/build-fixtures.mjs`) — pulls examples from a sibling `dot-skill/skillerr` checkout
- Anything specific to rendering/deploying `skillerr.com`

Protocol semantics, CLI behavior, and package code changes belong in the OSS repo, not here.

## Dev setup

See [README.md](./README.md#run-locally).

## Pull requests

No direct commits to `main` — branch, PR, and let CI (`Deploy skillerr.com`) pass before merging. Keep doc changes scoped: don't rewrite unrelated sections in the same PR.

Sign-off (DCO) follows the same convention as the OSS repo — see [dot-skill/skillerr/DCO.md](https://github.com/dot-skill/skillerr/blob/main/DCO.md).
