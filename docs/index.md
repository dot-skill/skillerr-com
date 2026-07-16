---
layout: home

hero:
  name: Open .skill Protocol
  text: The cryptographic trust standard for AI skills.
  tagline: Package a skill once as a sealed .skill, content-addressed, cryptographically signed, and independently verifiable before anyone runs it. Create, inspect, sign, and run portable .skill packages for AI agents, the integrity and provenance layer on top of your SKILL.md.
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: Read the protocol
      link: /protocol
    - theme: alt
      text: How it works
      link: /concepts

features:
  - icon: 📐
    title: Typed contract, not freeform prose
    details: Every skill declares its intent, triggers, inputs and outputs, ordered steps, required permissions, and verification checks — so the same package means the same thing to every agent and host.
  - icon: 🔒
    title: Content integrity built in
    details: A content-addressed skill_id and SHA-256 package and manifest digests make any change after packaging detectable. A license/terms slot travels with the package too.
  - icon: 🔍
    title: Inspect before you run
    details: See the seal, issuer, and digests — and a clean split of cryptographically verified vs. self-reported claims — without executing anything.
  - icon: 🪜
    title: A real trust ladder
    details: Seal with a development key for local work, a configured Ed25519 issuer key for verifiable authorship, or anchor the digest in a public transparency log that anyone can check independently.
  - icon: 🔀
    title: Continuity and release, as first-class modes
    details: Hand off work-in-progress between agents as a continuity package; cut a release only when the contract is complete and a human has reviewed it — release compiles refuse anything less.
  - icon: 🧾
    title: Provenance you can trust
    details: Agents author; humans review and approve. Declared agent host and model travel with the package, and self-reported claims are never presented as verified.
  - icon: ⬆️
    title: Upgrade your existing SKILL.md
    details: One command converts a SKILL.md or skill-creator folder into a sealed, inspectable .skill package.
  - icon: 🌐
    title: Open protocol, portable format
    details: The .skill container is defined by the spec, not the tool — skillerr and the @skillerr/* reference libraries are one implementation, and independent implementations are welcome.
---

## Where skillerr fits

The Agent Skills ecosystem has three layers, and skillerr owns the third, complementary to the other two, not competing with either:

| Layer | Job | Who |
|---|---|---|
| Authoring | Defines the `SKILL.md` format itself | [Agent Skills spec](https://agentskills.io/specification) |
| Distribution | Installs a skill onto your machine | [vercel-labs/skills](https://github.com/vercel-labs/skills), [skills.sh](https://skills.sh) |
| Trust / integrity | Seals, signs, records provenance, lets you inspect before you run | **skillerr** |

`npx skills add owner/repo` installs unverified instructions and executable scripts from any repo, with no integrity or provenance check. Distribution tools install a skill; skillerr lets you verify one, its integrity, issuer, and provenance, before you run it.

**No telemetry, no tracking.** skillerr makes no network calls unless you explicitly opt in (`--transparency`, `--keyless`, `--online`).

## Install once

```bash
npm i -g skillerr
```

Node ≥ 20. `skillerr` is the reference CLI (bin: `skill`).

## Getting started

**Humans** install once, then direct your agent:

```bash
npm i -g skillerr        # reference CLI, bin: skill
```

**Agents** start by reading their own instructions:

```bash
skill agent-guide        # the exact create / inspect / handoff protocol
```

<div class="prompt-block">

**Simplest — just ask**

```text
npm i -g skillerr

Then tell your AI:
"Use skillerr to turn this conversation into a .skill I can reuse."
```

</div>

<div class="prompt-block">

**Inspect before run**

```text
Inspect ./file.skill TrustView without executing. Validate, then dry-run.
Summarize trust warnings. Do not execute for real unless I ask.
```

</div>

More starters: [Getting started](/getting-started) · [Convert a SKILL.md](/convert-a-skill-md) · [Evaluate & score](/evaluate-and-score) · [Agents](/agents) · [Workflows](/workflows) · [Full CLI reference](/cli)

## Cryptographic foundation

A skill is only as trustworthy as your ability to verify it. `.skill` gives every skill a verifiable identity, provable authorship, and independently checkable provenance, the same guarantees the software supply chain now expects, applied to AI skills.

| Pillar | What it gives you |
|---|---|
| **Identity** | Content-addressed `skill_id` and SHA-256 `package_digest`/`manifest_digest`. Change one byte after sealing and the identity changes. |
| **Authorship** | A configured Ed25519 issuer key (`verified_issuer`), or an OIDC identity bound with Sigstore Fulcio keyless signing, both using the standard DSSE attestation envelope. |
| **Provenance** | The sealed digest anchored to the public Sigstore Rekor transparency log, verified offline against the log's signed tree head by default, with a `search.sigstore.dev` link so anyone can check independently. |
| **Assurance** | `--claims` splits every field into `verified` (crypto-checked) and `self_reported` (asserted), two separate arrays, never blurred together. |

**No telemetry, no tracking.** skillerr makes no network calls unless you explicitly opt in (`--transparency`, `--keyless`, `--online`).

## The trust ladder

Trust is explicit and layered, you choose how much you need, and verifiers can always tell which rung a package sits on:

1. **Development.** Sealed for local iteration with the public dev HMAC key. Clearly labeled, never mistaken for production trust.
2. **Verified issuer.** Signed with your configured Ed25519 key (`skill keygen` + `--signer-key`); verifiers who pin your key get cryptographic proof of authorship and integrity.
3. **Publicly anchored.** The sealed digest is logged to a public transparency log ([sigstore](https://www.sigstore.dev)'s Rekor via `--transparency`, and/or Fulcio keyless OIDC via `--keyless`), independently verifiable by anyone without trusting the tool.

Anchoring is orthogonal to trust state and always additive, an anchored package can still be development or self-reported trust. **Inclusion is not endorsement:** logging a package proves auditability, not goodness. A seal proves who issued a package and that it hasn't changed, never that the skill is correct or safe. See [Trust & security](/trust-and-security).

## Built to be verified today, and owned tomorrow

The primitives that make a `.skill` verifiable are, by design, a foundation a future ownership layer could build on: on-chain provenance, programmable royalties for skill authors, decentralized skill marketplaces. This is deliberate architecture, not a promise of features.

- **Content-addressed identity** already gives every skill a unique, tamper-evident id, the same reference primitive on-chain assets use to point at off-chain content.
- **Cryptographic authorship** is already key-based (Ed25519, optionally Fulcio-bound OIDC identity), the same shape as wallet-based identity.
- **Pluggable anchors:** the permanence-anchor slot is an open extension point. The wire format already reserves a `ledger` anchor kind alongside the shipped ones; no ledger-anchoring implementation exists yet, it's a tracked [roadmap item](/roadmap), addable without breaking existing packages.
- **A neutral core:** the spec has no marketplace, no token, and no commerce code, so any ownership layer could build on the verifiable foundation without the standard picking winners.

**What this is not, today:** skillerr does not mint tokens, issue NFTs, or move value. "Minting" a `.skill` creates a cryptographic attestation, not a financial instrument. On-chain ownership is a roadmap extension point, not a shipped feature, and it will always be optional, never required to author, verify, or run a skill. Nothing here is investment advice or a claim of future value.

## What's in a `.skill`

```text
example.skill
├── skill.json           # manifest, digests, profile, completeness
├── workflow.json        # runnable steps
├── knowledge/           # pinned decisions / rules
├── provenance/          # redacted journey + generation_usage
└── signatures/          # mint attestation (release)
```

## Bare `SKILL.md` vs. sealed `.skill`

| | Bare `SKILL.md` | Sealed `.skill` |
|---|---|---|
| Structure | Freeform prose | Typed contract: intent, triggers, I/O, steps, permissions, verification |
| Integrity | None | Content-addressed id + SHA-256 digests; tamper-evident |
| Trust before run | None | Inspect seal, issuer, and verified-vs-self-reported claims without executing |
| Authorship | None | Development → verified-issuer → publicly anchored, your choice |
| Handoff | Copy the chat | Continuity package: typed, redacted, resumable |

## Reference packages

| Surface | Role |
|---------|------|
| `skillerr` | Reference CLI |
| `@skillerr/protocol` | SkillContract, schemas, types |
| `@skillerr/core` | Compile, pack, validate, mint |
| `@skillerr/runtime` | Inspect / dry-run / execute |
| `@skillerr/workspace` | Local `.skill/` working tree |
| `@skillerr/registry` | Optional local transparency log |

## Agent Skills ecosystem

[Agent Skills specification](https://agentskills.io/specification) (authoring format) · [vercel-labs/skills](https://github.com/vercel-labs/skills) (`npx skills add`, distribution) · [skills.sh](https://skills.sh) (directory) · [Claude Code skills docs](https://code.claude.com/docs/en/skills)
