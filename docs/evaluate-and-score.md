# Evaluate & score

A `.skill` can be run and measured, not just structurally validated. This
is the native counterpart to test-prompt-and-grade authoring loops,
sealed into the package instead of living only in a local workspace.

## Prompt your agent

```text
Run the eval cases declared in this workspace's contract:

skill eval . --attach

Grade only what you can honestly check: leave anything you're not sure
about as pending_human, don't claim it passed. Then compile so the
benchmark gets sealed into the package:

skill compile -m "eval" --approve
```

## What `skill eval` actually checks

`contract.evals[]` is an optional array of test-prompt-plus-assertion
cases. Grading is honest about what it can verify automatically:

- An assertion prefixed `contains: "phrase"`, `not_contains: "phrase"`, or
  `regex: pattern` is graded against a response you supply.
- Everything else (`check: "human"`, or a `runtime` assertion with no
  recognized directive) is reported as **`pending_human`**, never a
  fabricated pass.
- Each case's **executability** (did the workflow itself structurally
  dry-run) is recorded independently of whether its assertions passed.

`skill eval` never calls a model itself. The agent that already ran the
prompt supplies the response for grading: this command's job is
structural dry-run, grading, and sealing, not inference. It never
auto-mints, either: running an eval has no effect on trust state.

## Sealing the result

`skill eval --attach` writes `.skill/benchmark.json` in the workspace. The
**next** `skill compile` picks it up automatically and seals it into
`provenance/benchmark.json`, no separate flag on `compile` itself needed.

## Turning evidence into a score

```text
Score ./file.skill:

skill score --profile release

If provenance/benchmark.json is missing or thin, tell me that means the
confidence is low, not that the quality is low. Those are different claims.
```

`skill score` maps a package's `provenance/benchmark.json` (plus its
structural completeness and provenance-integrity digests) into
`@skillerr/skill-score`'s evidence-receipt format and prints a score,
confidence, and per-dimension breakdown. Confidence and quality are
tracked **separately on purpose**: a skill with no eval evidence at all
gets a neutral quality estimate and low confidence, never scored as if it
were bad.

If `@skillerr/skill-score` isn't installed, `skill score` writes the
mapped `assessment.json` instead and tells you how to score it separately;
it never silently fails or fabricates a number.

## Related

- [Convert a SKILL.md](/convert-a-skill-md): `evals/evals.json` from a
  skill-creator folder maps directly into `contract.evals`
- [Trust and security](/trust-and-security)
