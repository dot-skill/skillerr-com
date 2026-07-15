---
layout: home

hero:
  name: Open .skill Protocol
  text: Sealed, inspectable packages for AI agent skills
  tagline: Chat context vanishes. Markdown skills drift. Sealed .skill packages carry typed I/O, workflow, and cryptographically verifiable trust — install once, then talk to your AI.
  actions:
    - theme: brand
      text: Getting started
      link: /getting-started
    - theme: alt
      text: Protocol spec
      link: /protocol
    - theme: alt
      text: Download fixtures
      link: /fixtures

features:
  - icon: 🤖
    title: Agent-first
    details: Humans install skillerr once, then paste prompts. Agents run init, propose, checkpoint, compile, inspect, and dry-run.
  - icon: 📦
    title: Portable .skill
    details: Sealed ZIP with typed I/O, workflow, pinned knowledge, redacted provenance, digests, and optional mint — not a chat dump.
  - icon: 🔍
    title: Inspect before run
    details: TrustView exposes digests and seals without executing. Validate, dry-run, then opt in to execute.
  - icon: 🔀
    title: Continuity handoff
    details: Checkpoint mid-work packages for AI↔AI resume. Release compile refuses incomplete contracts.
  - icon: 🔗
    title: Independently verifiable
    details: Optional Rekor transparency-log anchoring and Fulcio keyless mint — every check produces a public sigstore.dev link anyone can verify, not just this tool's word.
  - icon: 🧾
    title: Verified vs. self-reported
    details: Every trust claim is split into two separate lists — cryptographically checked, or asserted-but-unverified. Nothing can misrepresent one as the other.
  - icon: 🔐
    title: Source of truth, by construction
    details: Two independent digests bind content and permissions/capabilities into the signed seal. Edit a byte, the seal breaks — a real foundation for skills as sellable, licensable assets.
  - icon: 🛡️
    title: Deny-by-default runtime
    details: Execute refuses unsigned/untrusted packages and undeclared capabilities unless explicitly allowed — not an opt-out safety net.
---

## Sealed `.skill` packages

The Open `.skill` Protocol is an open specification and portable **`.skill`** format so AI agents can author, inspect, hand off, and run skills across hosts. `skillerr` is the reference implementation CLI.

**Format:** `.skill` (sealed ZIP) · **Status:** {{ $protocolVersion }} (Stable)  
**Reference CLI:** [`skillerr`](https://www.npmjs.com/package/skillerr) @ **{{ $packageVersion }}** (bin: `skill`)  
**Repo:** [dot-skill/skillerr](https://github.com/dot-skill/skillerr)

## Install once

```bash
npm i -g skillerr
```

Node ≥ 20. After that, talk to your agent — not a human CLI checklist.

## Talk to your AI

The whole point: you don't need to learn the CLI. Install it, then just ask.

<div class="prompt-block">

**Simplest — just ask**

```text
npm i -g skillerr

Then tell your AI:
"Use skillerr to turn this conversation into a .skill I can reuse."
```

Your agent runs `skill agent-guide` itself to learn the exact steps — you don't
have to know them.

</div>

<div class="prompt-block">

**More control — exact sections, redaction, mint**

```text
Run these exact commands in your terminal, in order:

1. npm i -g skillerr          (skip if `skill --version` already works)
2. export SKILL_HOST=cursor   (replace "cursor" with your actual tool name)

Then, from this conversation, create a portable .skill with a redacted journey
and exact sections I approved (secrets as {{refs}}). Checkpoint for handoff, or
compile --approve --mint when release-complete. Do not invent filler. Show
status and the output path.
```

</div>

<div class="prompt-block">

**Inspect before run**

```text
Inspect ./file.skill TrustView without executing. Validate, then dry-run.
Summarize trust warnings. Do not execute for real unless I ask.
```

</div>

More starters: [Getting started](/getting-started) · [Convert a SKILL.md](/convert-a-skill-md) · [Evaluate & score](/evaluate-and-score) · [Agents](/agents) · [Workflows](/workflows)

Prefer running commands yourself instead of prompting an agent? See the [full CLI reference](/cli) — every command and every flag, in one page.

## Why `.skill` is a source of truth, not just a file

A `.skill` binds two independent digests into one signed seal: `package_digest` covers the actual content (workflow, knowledge, provenance — edit a byte, it breaks), and `sealed_manifest_digest` covers identity plus the full permissions/capabilities/policy declaration. Mint signs both together. `skill verify-trust` recomputes and compares them independently, offline — it doesn't trust the file's own claims about itself.

That's what turns a `.skill` package into something more than a convenient format: a **tamper-evident unit of knowledge**, authored by a human, an AI, or both, that a third party can verify without asking the author to vouch for it. Every trust claim is split into `verified` (cryptographically checked) and `self_reported` (asserted, not checked) — never blended, never presented as more certain than it is (`skill inspect --trust --claims`).

That honesty is the foundation for skills as **licensable, sellable assets**: a manifest-level `license` / `license_url` slot ships today, and a buyer can verify exactly what they're getting — down to the byte — before trusting it. Independent public verification (below) means that trust doesn't depend on taking the seller's word for it either.

## Independently verifiable, not just self-certified

Optional mint-time anchoring logs the sealed digest to a public transparency log, so anyone can check an entry themselves — not just trust this tool:

- **`skill mint --transparency`** — anchors to [sigstore's](https://www.sigstore.dev) public Rekor log using your own signing key. Permanent, world-readable, independently queryable at `search.sigstore.dev`.
- **`skill mint --keyless`** — a second, independent anchor via Fulcio, bound to your CI's OIDC identity (zero setup inside GitHub Actions — the same mechanism npm's own trusted publishing uses). No long-lived key to leak.

`skill verify-trust` re-derives both checks from scratch — inclusion proof, signature, and (for keyless) the signer's identity straight off the certificate — and prints the same public verification URL so a stranger can double-check independently. See [Trust and security](/trust-and-security) and [Verify a skill](/verify).

**Do you need a blockchain for any of this? No.** The transparency log above already gives you a permanent, public, tamper-evident record today. A distributed-ledger anchor is on the roadmap as one more *optional* permanence kind for the future — never a requirement to mint, verify, or trust a `.skill`. See [Roadmap](/roadmap).

## Continuity: handoff between AIs, not just humans

`skill checkpoint` and `skill load` exist because agent-to-agent handoff is a different problem than "save a file." A continuity package:

- Redacts the journey summary at write time — never a raw transcript or chain-of-thought.
- **Cannot be minted** — continuity and release are structurally different compile profiles; the CLI refuses to seal a continuity package even if asked.
- Carries a completeness report (what's done, what's missing) instead of pretending partial work is finished.
- Rejects sections a human tried to hand-edit into an agent-authored slot — provenance is checked on read, not just trusted.

Any agent — same host or a different one entirely — runs `skill load ./file.skill` and gets back exactly that: typed knowledge, redacted journey, and an honest completeness report to resume from. That's the AI↔AI resume story, not a file copy with extra steps.

## What's in a `.skill`

```text
example.skill
├── skill.json           # manifest, digests, profile, completeness
├── workflow.json        # runnable steps
├── knowledge/           # pinned decisions / rules
├── provenance/          # redacted journey + generation_usage
└── signatures/          # mint attestation (release)
```

## Reference packages

| Surface | Role |
|---------|------|
| `skillerr` | Reference CLI |
| `@skillerr/protocol` | SkillContract, schemas, types |
| `@skillerr/core` | Compile, pack, validate, mint |
| `@skillerr/runtime` | Inspect / dry-run / execute |
| `@skillerr/workspace` | Local `.skill/` working tree |
| `@skillerr/registry` | Optional local transparency log |
