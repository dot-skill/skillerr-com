# How it works

## What you're working with

- **The protocol**: the open specification for what a skill *is* and what "complete" means.
- **The `.skill` format**: one sealed file: manifest, workflow, knowledge, provenance, and signatures. The unit you share.
- **The `skillerr` CLI**: the reference command-line tool (`skill`). Install it once.
- **The `@skillerr/*` reference libraries**: the same capabilities as importable libraries, for hosts that integrate the protocol directly.

## Two profiles

- **Continuity**: a shareable work-in-progress package; partial is fine. Built for handoff between agents or sessions.
- **Release**: the finished, reusable skill: a complete contract plus a recorded human review. `compile --profile release` refuses anything short and tells you exactly what's missing.

## The flow

Agents author (`init → propose → journey`) → a human reviews and approves → `compile` and `mint` seal a release → anyone can `inspect`, `validate`, and `verify-trust` before they run it.

Full command-by-command reference: [CLI](/cli). Protocol-level detail: [Protocol spec](/protocol).
