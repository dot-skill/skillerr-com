# Fixtures

Conformance `.skill` packages built from the [dot-skill/skillerr](https://github.com/dot-skill/skillerr) examples tree. Use them to inspect TrustView, validate digests, and dry-run without inventing your own packages.

Build and test locally:

```bash
npm run fixtures:build && npm run fixtures:test
```

## Download

| Fixture | Profile | Description |
|---------|---------|-------------|
| [knowledge-only.skill](/fixtures/knowledge-only.skill) | continuity | Legacy adapter source — knowledge sections |
| [parameterized-integration.skill](/fixtures/parameterized-integration.skill) | continuity | Typed inputs + integration workflow |
| [code-changing.skill](/fixtures/code-changing.skill) | continuity | Code-change workflow fixture |
| [contract-foundation.skill](/fixtures/contract-foundation.skill) | release | Full SkillContract release compile |

Each file is a sealed ZIP. Inspect with:

```bash
skill inspect ./contract-foundation.skill --trust
skill validate ./contract-foundation.skill
skill run ./contract-foundation.skill
```

## Source paths (repo)

| Source | Kind |
|--------|------|
| `examples/knowledge-only/recipe.json` | Legacy adapter |
| `examples/parameterized-integration/recipe.json` | Legacy adapter |
| `examples/code-changing/recipe.json` | Legacy adapter |
| `examples/contract-foundation/source.json` | SkillContract release |
| `examples/multi-skill-extract/journey.json` | `skill extract` input |

Multi-skill identify (journey only — not a `.skill` download):

```bash
skill agent-guide
skill extract examples/multi-skill-extract/journey.json -o /tmp/skillerr-extract
```

## Manifest index

After build, see [fixtures/manifest.json](/fixtures/manifest.json) for `skill_id`, `package_digest`, and completeness reports.

## Honest trust note

The three `continuity`-profile fixtures (`knowledge-only`, `parameterized-integration`, `code-changing`) are **never minted** — continuity drafts are mid-work handoffs, not release artifacts, and the protocol refuses to mint them by design.

`contract-foundation.skill` is a `release`-profile package minted with a real, configured Ed25519 issuer key (`issuer_class: configured_ed25519`). It verifies as `trust_state: verified_issuer` against the published trust store:

```bash
skill verify-trust ./contract-foundation.skill --trust-store https://www.skillerr.com/docs/trust/trust-store.json
```

The signing key (`skillerr-com-fixtures-2026`) is scoped to sign this one site fixture only — it is not a general-purpose issuer key. Its public half is published at [`/trust/trust-store.json`](/trust/trust-store.json). Always inspect TrustView before run regardless of trust state. Details: [Trust and security](/trust-and-security).
