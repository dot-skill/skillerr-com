---
layout: home

hero:
  name: Open .skill Protocol
  text: Portable, verifiable skills for AI agents.
  tagline: Package a skill once as a sealed .skill file — typed inputs, ordered steps, provenance, and a cryptographic seal — and any agent or host can inspect, verify, and run it. The integrity layer on top of your SKILL.md.
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

## The trust ladder

Trust is explicit and layered — you choose how much you need, and verifiers can always tell which rung a package sits on:

1. **Development** — sealed for local iteration. Clearly labeled, never mistaken for production trust.
2. **Verified issuer** — signed with your Ed25519 key; verifiers who pin your key get cryptographic proof of authorship and integrity.
3. **Publicly anchored** — the sealed digest is logged to a public transparency log ([sigstore](https://www.sigstore.dev)'s Rekor/Fulcio), independently verifiable by anyone without trusting the tool.

A seal proves who issued a package and that it hasn't changed — never that the skill is correct or safe. See [What is verifiable](/trust-and-security).

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
