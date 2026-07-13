# Create a skill

Under the Open `.skill` Protocol, **agents author** portable skills; **humans review and approve** release. Point your AI at the work — do not treat the CLI as a human click-ops checklist.

Want the full interview-driven walkthrough instead of a single prompt —
every field explained, in order, with the reasoning behind it? Point your
agent at [`examples/skillerr-authoring/SKILL.md`](https://github.com/dot-skill/skillerr/blob/main/examples/skillerr-authoring/SKILL.md)
in the `skillerr` repo. It takes an agent from a plain conversation to a
minted `.skill` without hand-writing the contract JSON.

## Prompt your agent

```text
Run these exact commands in your terminal, in order:

1. npm i -g skillerr          (skip if `skill --version` already works)
2. export SKILL_HOST=cursor   (replace "cursor" with your actual tool name)

Then, from this conversation, create a portable .skill with a redacted journey
and exact sections I approved (secrets as {{refs}}). Checkpoint for handoff, or
compile --approve --mint when release-complete. Do not invent filler. Show
status and the output path.
```

## What your agent will do

| Step | Agent runs |
|------|------------|
| Init workspace | `skill init --title "…"` |
| Redacted journey | `skill journey --summary "…"` |
| Propose sections | `skill propose --json '[…]'` (exact approved bodies) |
| Status | `skill status` |
| Mid-work handoff | `skill checkpoint -m "WIP"` |
| Release | `skill compile -m "…" --approve --mint` |

Required env when creating:

```bash
export SKILL_HOST=cursor
export SKILL_AGENT_INVOCATION=1   # preferred
```

## Workspace model

Local working tree (git-like):

```text
.skill/
  config.json
  sections/*.json
  index.json          # staged ids
  HEAD.json
  objects/*.skill
```

| git | skill (agent surface) |
|-----|------------------------|
| init | `skill init` |
| edit | `skill propose` |
| add | `skill add` |
| status | `skill status` |
| stash / WIP | `skill checkpoint` |
| commit | `skill compile` |
| tag / sign | `skill mint` |

No marketplace publish in the happy path — share the `.skill` file.

Prefer verbatim human-approved bodies. Secrets only as `{{refs}}`. If incomplete → `compile_refused` with missing fields. Fix and compile again. Do not invent filler.

Contract helpers the agent may use: `skill contract-template`, `skill contract-check contract.json --profile release`.

## Multi-skill from a journey

Prompt:

```text
Using skillerr, run agent-guide then extract from ./journey.json into ./extraction.
For each candidate I select, open its own workspace, fill missing contract fields,
and only compile a release when complete — otherwise checkpoint.
```

What the agent runs: `skill agent-guide` → `skill extract ./journey.json -o ./extraction` → one workspace per selected candidate → contract-check → checkpoint or compile.

## Local / offline create

Ask the agent to set Ollama (or similar) provenance, then the same propose / checkpoint / compile path. Provenance remains self-reported unless a deployment adds a verified issuer.

## What success looks like

- Continuity: handoff file loads in another agent with gaps visible  
- Release: complete package, mint attestation present, inspectable TrustView  

Next: [Ingest a skill](/ingest-a-skill) · [Agents](/agents)
