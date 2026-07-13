# Convert a SKILL.md

Already have a `SKILL.md` or a skill-creator folder (`SKILL.md` + `scripts/`,
`references/`, `assets/`, `evals/`)? The Open `.skill` Protocol isn't a
competing format — it's the integrity and evaluation layer above it.
`skill ingest` upgrades one in a single command, without you re-typing
anything into a contract by hand.

## Prompt your agent

```text
Run these exact commands in your terminal, in order:

1. npm i -g skillerr          (skip if `skill --version` already works)
2. export SKILL_HOST=cursor   (replace "cursor" with your actual tool name —
                                claude-code, codex, ollama, etc.)
3. skill ingest ./SKILL.md    (adjust the path if your SKILL.md lives elsewhere)

Then show me the output path and exactly what's still missing before it can
be a release. Don't invent contract fields to make it look more complete
than it is.
```

## What actually happens

`skill ingest` reads the `SKILL.md` file (or the whole folder) and maps it
onto the protocol's structured contract:

| SKILL.md | Maps to |
|---|---|
| YAML frontmatter `name` | Contract `title` |
| YAML frontmatter `description` | Contract `intent`, plus candidate `triggers` split from any "use when ..." clause |
| Body `##` sections | Knowledge items, preserved verbatim |
| `scripts/*` | `resources/scripts/*` + a stub capability per script (`side_effect_class: "exec"`, `fallback: "ask_human"`) — **never wired into a runnable step, never auto-authorized** |
| `references/*.md` | `resources/references/*` |
| `evals/evals.json` | Contract `verification` assertions |

The output is always a **continuity** draft — never a claimed-complete
release. `skill ingest` reports exactly which fields are still missing
(almost always just `provenance.human_review`, since a human genuinely
hasn't reviewed it yet — ingest can't fabricate that).

## Finish the release path

Once a human has actually reviewed the ingested contract:

```bash
skill contract-check .skill/contract.json --profile release
skill compile -m "reviewed" --approve --profile release
skill mint --host cursor
```

## Why this is safe by construction

A bundled script never executes just because it was imported. It needs a
declared capability **and** a matching permission **and** a workflow step
that actually invokes it — `skill ingest` only ever creates the first of
those three. See [Bundled scripts](https://github.com/dot-skill/skillerr/blob/main/docs/RESOURCES.md)
for the full authorization chain.

## Related

- [Evaluate & score](/evaluate-and-score) — measure the ingested skill against real test prompts before you trust it
- [Create a skill](/create-a-skill) — the from-scratch authoring path
- [FAQ](/faq)
