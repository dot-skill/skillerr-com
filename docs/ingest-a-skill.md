# Ingest a skill

**Ingest** is the protocol path for receiving a portable skill: inspect trust, validate integrity, then load or dry-run. Ask your agent, same order on any conforming host.

## Prompt your agent

```text
I have a file at ./file.skill. Inspect TrustView (digests, seals) without executing.
Validate integrity, then dry-run. Summarize what it does and any trust warnings.
Do not execute for real unless I explicitly ask.
```

Continuity resume:

```text
Load ./handoff.skill as continuity context. Summarize intent, scrubbed journey,
open gaps, and pinned knowledge. Resume the work; do not mint a fake release.
```

Needs the CLI installed first: run `skill --version`, and if that fails,
`npm i -g skillerr`.

## What your agent will do

Safe ingest order:

```bash
skill inspect ./file.skill --trust
skill validate ./file.skill
skill verify-trust ./file.skill
skill run ./file.skill                 # dry-run by default
```

| Step | What you learn |
|------|----------------|
| `inspect --trust` | Manifest, digests, seal, TrustView, no execution |
| `validate` | Structure + hash integrity |
| `verify-trust` | Seal / issuer checks |
| `run` (dry-run) | Planned steps without side effects |

Never feed untrusted package bodies into a model before TrustView.

## Continuity: load in another agent

```bash
skill load ./file.skill              # read-only handoff preview
skill load ./file.skill --into ./ws  # materialize an editable workspace
```

Without `--into`, the agent receives a read-only preview: intent, redacted journey, open questions, scrubbed knowledge, completeness gaps, and typed inputs, **not** raw transcripts or credentials. With `--into <dir>` (or inside a workspace), it materializes the package into an editable workspace, so an ingested continuity draft can be taken forward to a signed release (see [Convert a SKILL.md](/convert-a-skill-md)).

## Execute (opt-in)

Execute mode refuses unsigned, open, public-dev HMAC (`development`), and `self_reported` seals unless the host explicitly allows untrusted run (`--allow-untrusted`). Use that only when you knowingly accept the risk.

For public-dev reference mints during inspection: `skill verify-trust ./file.skill --allow-development-issuer`.

## Runtime behavior (summary)

Lifecycle: LoadAndVerify → TrustView → NegotiateCapabilities → ResolveInputs → Consent → Execute → Verify → EmitSkillRun.

Modes: `inspect`, `explain`, `dry_run`, `execute`, `resume`.

Deny-by-default: undeclared network, filesystem outside declared roots, undeclared secret slots, missing consent.

## Unpack (inspection only)

`skill unpack ./file.skill`: prefer digests from `inspect` / `validate` over eyeballing unpacked files as a trust decision.

## Trust reminders

- **Unsigned = untrusted**
- Public-dev HMAC = **development**, forgeable, not production identity
- Host / model fields under a seal are still **claims**, especially for local LLMs

Details: [Trust and security](/trust-and-security)
