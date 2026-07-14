---
layout: home

hero:
  name: Open .skill Protocol
  text: Sealed, inspectable packages for AI agent skills
  tagline: Chat context vanishes. Markdown skills drift. Sealed .skill packages carry typed I/O, workflow, and inspect-before-run trust — install once, then talk to your AI.
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
---

## Sealed `.skill` packages

The Open `.skill` Protocol is an open specification and portable **`.skill`** format so AI agents can author, inspect, hand off, and run skills across hosts. `skillerr` is the reference implementation CLI.

**Format:** `.skill` (sealed ZIP) · **Status:** Draft 0.5.0  
**Reference CLI:** [`skillerr`](https://www.npmjs.com/package/skillerr) (bin: `skill`)  
**Repo:** [dot-skill/skillerr](https://github.com/dot-skill/skillerr)

## Install once

```bash
npm i -g skillerr
```

Node ≥ 20. After that, talk to your agent — not a human CLI checklist.

## Talk to your AI

<div class="prompt-block">

**Create from this chat**

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
