# Verify a `.skill` file

Upload a `.skill` file to check its trust state — the same result `skill inspect --trust` gives you locally, without installing anything.

<VerifySkill />

## What this checks

- **Structural validity** — the archive is a well-formed `.skill` package with matching content digests
- **Trust state** — `untrusted` / `development` / `self_reported` / `verified_issuer`, using the same [published trust store](/trust/trust-store.json) the CLI can use
- **Transparency-log anchor** (if present) — verifies the Rekor inclusion proof for real, not just that the package claims to have one

It does **not** check whether the skill's content is well-designed, safe to run, or a good fit for your use case — see [What is verifiable](https://github.com/dot-skill/skillerr/blob/main/docs/WHAT-IS-VERIFIABLE.md) for the full breakdown of what a trust state does and doesn't prove.

## Privacy {#privacy}

This tool sends the uploaded file to our server for verification — it does not verify fully client-side in your browser. That's a deliberate tradeoff, not an oversight: correct signature and Merkle-inclusion-proof verification is security-critical code, and reusing the same tested `@skillerr/core` library the CLI runs on is more reliable than re-implementing it fresh in browser JavaScript under time pressure.

What that means in practice:
- The file is processed **in memory for one request** and is never written to disk or logged.
- `.skill` packages are redacted by protocol design before they're ever sealed — secrets as `{{refs}}`, scrubbed provenance journeys (see the OSS repo's `docs/PRIVACY.md`) — so uploading a sealed package is a materially different exposure than uploading raw source with real secrets in it.
- If you'd rather not upload at all, run the exact same check locally and offline: `skill inspect --trust ./file.skill` (`npm i -g skillerr`).

## Verify by digest

If you have a `package_digest` (starts with `sha256:`) but not the file itself, you can check whether it was ever anchored to the public Rekor transparency log:

```bash
curl -s -X POST https://rekor.sigstore.dev/api/v1/index/retrieve \
  -H "Content-Type: application/json" \
  -d '{"hash":"sha256:<your-digest>"}'
```

An empty result means either the digest was never anchored, or it was anchored via a DSSE-kind entry that Rekor's hash-search index may not cover the same way — this is a best-effort check, not a guarantee of absence. Uploading the actual file (above) is the reliable path, since the file's own manifest carries its anchor receipt directly.
