# Agents: creating skills

You are an AI agent using the Open `.skill` Protocol (Skillerr). Portable skills are sealed procedures other hosts and agents can ingest.

Humans install the reference CLI once and **point you at the work**. You drive create / inspect / load / run. They review and approve releases.

Two jobs matter: **create** a `.skill`, and **ingest / load / run** one someone else produced. Your host may expose these via IDE tools, host APIs, or the reference CLI (`skill`); the contract is the same.

## Install (reference CLI)

```bash
npm i -g skillerr
# one-shot:
npx -y skillerr --help
```

Bin: `skill`. Product hosts may wrap the `@skillerr/core` / `@skillerr/runtime` libraries instead of shelling out. Docs: [skillerr.com](https://www.skillerr.com/docs/).

## Mandatory rules

1. **Set `SKILL_HOST`** to your real host id (`cursor`, `ollama`, `lmstudio`, `claude`, `codex`, …).  
   **Never** use denylisted values: `human`, `cli`, `shell`, `manual`, `bash`, `terminal`, … — mint refuses them.
2. Prefer `SKILL_AGENT_INVOCATION=1` or `SKILL_SESSION_ID` from the agent runtime. Env-only host claims stay `self_reported`.
3. **Never invent filler** to force a release compile. If incomplete, stop and list `missing`.
4. Prefer **exact** section bodies the human approved — do not paraphrase approved meaning when proposing.
5. Secrets only as `{{refs}}` / env refs.
6. Use **`skill checkpoint`** for mid-work handoff; **`skill compile --approve --mint`** only when release-complete.
7. Record tokens when known: `SKILL_INPUT_TOKENS` / `SKILL_OUTPUT_TOKENS` or `--input-tokens`.
8. Before running a received package: **inspect TrustView → validate → dry-run**.
9. Execute mode refuses unsigned / dev seals unless the host explicitly allows untrusted run.

## Create path (what you run)

```bash
export SKILL_HOST=cursor
export SKILL_AGENT_INVOCATION=1

skill init --title "…"
skill journey --summary "Redacted human+AI journey…"
skill propose --json '[
  {"title":"…","body":"…","type":"decision"},
  {"title":"…","body":"Call {{base_url}}","type":"integration"}
]'
skill status
skill checkpoint -m "WIP"                 # continuity (partial OK)
skill compile -m "…" --approve --mint      # release (complete or compile_refused)
```

## Multi-skill identify

```bash
skill agent-guide
skill extract ./journey.json -o ./extraction
# select candidates → one workspace each → contract-check → compile
```

Segmentation is not compilation. Only a selected, complete `SkillContract` becomes release compile input.

## On `compile_refused`

Tell the human what is missing. Complete those parts, then compile again. **Do not pack a fake release skill.**

## Completeness vs continuity

| Goal | Command | Incomplete OK? |
|------|---------|----------------|
| Handoff to another AI / host | `skill checkpoint` | Yes |
| Ship a reusable skill | `skill compile --approve --mint` | No — refuse |

## Provenance honesty

Creation records **declared** agent provenance (`SKILL_HOST`). That is self-reported context, not cryptographic proof — especially for local LLMs. Humans review and approve release compilation.

## Ingest / run (what you run)

```bash
skill inspect ./file.skill --trust
skill validate ./file.skill
skill verify-trust ./file.skill --allow-development-issuer
skill load ./file.skill
skill run ./file.skill
skill run ./file.skill --mode execute --allow-untrusted   # explicit unsafe
```

Prompts humans paste: [Getting started](/getting-started). See also: [Create a skill](/create-a-skill) · [Trust and security](/trust-and-security) · [CLI](/cli)
