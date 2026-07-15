# Roadmap

Status: protocol **{{ $protocolVersion }} (Stable)**; the `@skillerr/*` reference packages are at **{{ $packageVersion }}**. Future protocol changes go through the open RFC process, not silent revisions. The goal remains an open, interoperable contract — multiple conforming hosts and runtimes, not a single CLI.

Public, contribution-oriented items only. Timing is not guaranteed. Site: [skillerr.com](https://www.skillerr.com/docs/).

## Available in the reference today

- `.skill` container + digests  
- Mint + creation attestation (reference implementation)  
- Free local transparency-log registry  
- Reference runtime + CLI (`skillerr` / `skill`)  
- Conformance tests, docs, governance, CI  
- Local / offline agent provenance (Ollama, LM Studio, llama.cpp, custom)  
- Transferable `SkillContract`, assessment APIs, and JSON Schema  
- Structured contract-to-manifest / workflow compilation  
- Production-grade signing — real Ed25519 issuer keys + a local trust store
  (`skill keygen`, `skill mint --signer-key`, `skill verify-trust --trust-store`),
  not just the bundled development-only key  
- Adversarial package corpus (zip bombs, path tricks, hash mismatch, and
  more) — runs on every push in CI, not just described here  
- Public [RFCs](https://github.com/dot-skill/skillerr/wiki/RFCs) — six RFCs; asymmetric signing has since
  shipped as real code, the rest remain spec-only proposals open for
  discussion  
- Optional public transparency-log anchoring (`skill mint --transparency`),
  built on the official sigstore/Rekor client libraries — see
  [Trust and security](/trust-and-security)  
- Fulcio keyless mint (`skill mint --keyless`) — an OIDC-bound identity
  anchor, zero setup inside GitHub Actions  
- Independent Rekor verification link on every anchored trust check, in
  both the CLI and the [verify page](/verify) — a link to sigstore's own
  public log, not just this tool's word  
- Per-claim assurance model (`skill inspect --trust --claims`) — every
  claim split into two structurally separate lists, verified vs.
  self-reported, so nothing can misrepresent one as the other  
- License/terms manifest slot (SPDX identifier + terms URL)  
- Public verify utility on this site — upload a `.skill` file, get the
  same TrustView `skill inspect --trust` reports, without installing
  anything  

## Next (good contribution targets)

- Independent implementation validating the published authoring schema  
- Interactive/browser-login OIDC provider for `skill mint --keyless` run
  locally, outside CI (the CI-ambient path already ships)  
- HTTP transparency-log server (same log format as the local registry)  
- Stronger `verify` assertion language + fixtures  
- Host adapters: local OpenAI-compatible, Cursor, Claude Code, Codex  
- Second language runtime (Go or Rust) — ecosystem growth, not a
  stability prerequisite: the protocol is versioned {{ $protocolVersion }} (Stable) against
  this reference implementation's own corpus already  
- Official `SKILL.md` round-trip adapter tests  

## Later

- Multi-issuer trust roots / key transparency  
- Optional ledger anchors as one permanence kind (**never required**)
