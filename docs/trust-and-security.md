# Trust and security

A conforming host **SHOULD** expose **TrustView** (digests, seals, issuer class) before any execute path. Skills are portable; trust decisions MUST travel with the package, not with the originating app.

## Practice

1. **Inspect before run** — digests and seals without executing the skill or feeding package bodies to a model.  
2. **Validate** structure and hash integrity.  
3. **Dry-run** before execute.  
4. Treat **unsigned / open** packages as **untrusted**.  
5. Treat the reference **public-dev HMAC** mint as **development-only** — never production identity proof.

```bash
skill inspect ./file.skill --trust
skill validate ./file.skill
skill verify-trust ./file.skill
skill run ./file.skill                    # dry-run default
```

## TrustView states

| Seal situation | TrustView | Production `execute` |
|----------------|-----------|----------------------|
| Unsigned / open | `untrusted` | Refuse unless `--allow-untrusted` |
| Public-dev HMAC | `development` | Refuse (forgeable) |
| Configured key + self-reported host | `self_reported` | Refuse unless opted in |
| Configured key + verified host binding | `verified_issuer` | Allowed |

Trust profiles (protocol): `open` | `minted` | `anchored` | `issuer:<id>`.

## The trust ladder (mint-time provenance)

TrustView states above answer "does the runtime's execute gate trust this signature." A separate, complementary axis is how much publicly-checkable provenance a package carries at mint time:

| Rung | How it's sealed | What a verifier gets |
|---|---|---|
| **Development** | Public dev HMAC key (default, zero setup) | Local iteration only. Forgeable by design, labeled `development` everywhere it appears, never production trust. |
| **Verified issuer** | Configured Ed25519 key (`skill keygen` + `--signer-key`) | Cryptographic proof of authorship and integrity, once a verifier pins your key in their trust store. |
| **Publicly anchored** | Rekor transparency log (`--transparency`) and/or Fulcio keyless OIDC (`--keyless`) | A public, independently-checkable record, anyone can confirm the entry on Sigstore's own infrastructure. |

Anchoring is orthogonal to TrustView state and always additive, an anchored package can still be `development` or `self_reported` trust; the anchor never replaces the seal. **Inclusion is not endorsement:** logging a package proves auditability, not goodness.

`skill publish` makes the publicly-anchored rung frictionless: the public Rekor log needs a signing key but no login, so a per-user key is auto-provisioned on first use. That key alone is not `verified_issuer`, without real agent-runtime evidence the seal binds `self_reported`, and third parties earn `verified_issuer` for your packages only once they pin your key. The public URL works either way; it never inflates what the seal claims.

The `PermanenceAnchor` slot this ladder's third rung uses is an open extension point: the wire format already reserves a `ledger` anchor kind alongside the shipped ones, a documented, unimplemented [roadmap item](/roadmap), never required, always additive if it ships. skillerr does not mint tokens, issue NFTs, or move value; "minting" a `.skill` creates a cryptographic attestation, not a financial instrument.

## Seals and digests

- Digests: `sha256:<hex>`
- `package_digest` covers package content (excludes `skill.json` and `signatures/**`)
- **`sealed_manifest_digest`** binds title, intent, permissions, policy, capabilities, input sensitivity, content digests, and contract summary — not only workflow / knowledge bytes
- Creation attestation records agent host / provider / model, `host_claim_binding` (`self_reported` | `verified_issuer`), and `issuer_class` (`public_dev_hmac` | `configured_hmac` | `verified_issuer`)

Inspect without side effects:

```bash
skill inspect ./file.skill --trust
```

## SKILL_HOST and anti-spoof

- Mint **refuses** denylisted hosts: `human`, `cli`, `shell`, `manual`, `bash`, `terminal`, …
- Exporting `SKILL_HOST=cursor` alone **cannot** produce `verified_issuer` trust
- Agent runtime markers (`SKILL_AGENT_INVOCATION`, `SKILL_SESSION_ID`, IDE markers) strengthen the mint path but remain **locally spoofable**
- Seals record claim binding and issuer class so TrustView can distinguish self-reported vs verified issuer

## Runtime deny-by-default

- Undeclared network / filesystem / secret capabilities are refused
- Missing consent fails closed for side-effecting steps
- `execute` / `resume` refuse unsigned, open, public-dev HMAC, and self_reported seals unless `--allow-untrusted`

```bash
skill run ./file.skill --mode execute --allow-untrusted   # explicit unsafe opt-in
```

## Secrets

Never embed API keys, tokens, `.env`, or private customer data in sections or journey text. Use `{{refs}}` / env refs. Continuity and release packages default to shareable-redacted journey content.

## Residual risk (honest)

A seal proves which key signed which claims. It **cannot** prove that a named **local LLM** was honest about authorship. Treat host / provider / model fields as claims under that key’s honesty — especially offline and self-hosted models.

The bundled development HMAC signer (`issuer_class=public_dev_hmac`) is **never** production trust.

## Threats to keep in mind

Malicious packages, prompt injection via resources, tool escalation, dependency confusion (including similarly named npm packages). Prefer verifying package identity and digests before run.

## Reporting

For the `skillerr` reference implementation, use private vulnerability reporting via [skillerr.com](https://www.skillerr.com/docs/). Do not open public issues with exploit details.
