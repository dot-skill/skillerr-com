# FAQ

## What is "Skillerr"?

"Skillerr" names the reference CLI package (`npm i -g skillerr`), not the project. The project is the **Open `.skill` Protocol** — an open specification and portable **`.skill`** format so AI apps and agents can author, inspect, version, and run skills interoperably. Full breakdown of every name involved (protocol, format, npm scope, CLI, wire identifiers): [Naming](https://github.com/dot-skill/skillerr/wiki/Naming). Site: [skillerr.com](https://www.skillerr.com/docs/).

## What is the Open `.skill` Protocol?

An open specification for **portable AI skills**: a sealed `.skill` package with typed inputs, workflow, pinned knowledge, redacted journey provenance, integrity digests, and optional mint attestation. Conforming hosts adopt the same create / ingest / trust / run lifecycle.

## What is the `skillerr` package?

[`skillerr`](https://www.npmjs.com/package/skillerr) is the **reference implementation** CLI (bin: `skill`) — one conforming surface for create, inspect, and run. The protocol is not limited to this package; hosts may integrate the `@skillerr/*` protocol libraries or ship an independent conforming port.

## How do I use it?

Install once, then **talk to your AI** — paste a prompt that points the agent at create, inspect, load, or handoff. You review and approve releases.

```bash
npm i -g skillerr
```

See [Getting started](/getting-started).

## Why would an app implement the protocol?

So skills are interoperable: one package moves between tools with inspectable digests, TrustView before execute, continuity handoffs, and release completeness gates — instead of proprietary chat dumps or free-form markdown alone.

## How is this different from `SKILL.md`?

Structured package + digests + mint + continuity handoff + release compile gates. `skill to-skill-md` (single file, quick) is a lossy adapter; `skill export-skill` (a full folder) preserves frontmatter (license/compatibility/metadata/allowed-tools) and `scripts/`/`references/`/`assets/`.

## How is skillerr different from `npx skills add` or a skills directory?

They solve different problems and work together. Installers like [vercel-labs/skills](https://github.com/vercel-labs/skills) and directories like [skills.sh](https://skills.sh) get a skill onto your machine; they don't check its integrity or provenance before you run it. skillerr is the verification layer: `skill ingest` wraps a standard Agent Skills folder in a typed contract, an integrity seal, and provenance, so you can inspect and verify a skill, whether you wrote it or installed it, before running it.

## Continuity vs release?

- **Continuity** — work handoff between agents or hosts (partial OK, not mintable).  
- **Release** — complete reusable skill or `compile_refused`.

## Who creates skills?

Agents create (declared host required). Humans install once, prompt the agent, review and approve release compilation. Declared host/model provenance is self-reported unless a verified issuer is configured.

## Can I set `SKILL_HOST=human`?

No. Denylisted hosts (`human`, `cli`, `shell`, `manual`, …) cannot mint. Do not fake a human host.

## How do I create a skill?

Ask your agent (see [Getting started](/getting-started)). The agent sets `SKILL_HOST` and runs `init` → `propose` → `checkpoint` or `compile --approve --mint`. Prefer exact human-approved section bodies. See [Create a skill](/create-a-skill) and [Agents](/agents).

## How do I ingest or run a skill?

Ask your agent to inspect first, then validate, then dry-run. See [Ingest a skill](/ingest-a-skill).

## Where do I publish?

Share the `.skill` file directly. Optional local transparency log: `skill registry …`. Hosted registries are out of scope for the protocol.

## How do I get a public, verifiable provenance URL?

Run `skill publish <file.skill>`. It seals a release and anchors the digest to the public [Sigstore](https://www.sigstore.dev) Rekor transparency log, then prints an independently-checkable `search.sigstore.dev` URL. Zero setup: the public log needs a signing key but **no login/account/OIDC**, so a per-user key is auto-generated on first run and reused after. Only the digest and skill id are logged, never your content. Rekor entries are **permanent and world-readable**, so never publish a secret skill. This is a public provenance record, not a marketplace. See [Trust and security](/trust-and-security).

## Do I need a blockchain?

No. skillerr does not mint tokens, issue NFTs, or move value, and none of that is required to author, verify, or run a skill today. A ledger anchor is a documented, unimplemented roadmap item, one optional `PermanenceAnchor` kind among several, never required. See [Trust and security](/trust-and-security) for the full extensibility story.

## Is this ready to use?

Yes, for real use today — digests, validation, inspect-before-run, and the runtime capability gate are all real, tested code. The protocol spec is versioned {{ $protocolVersion }} (Stable) — future changes go through the open RFC process, not silent revisions.

For production trust, configure a real Ed25519 issuer key (`skill keygen` + `--signer-key`) so mints earn `verified_issuer` trust — the bundled zero-setup key is for trying the CLI, not for shipping. A configured key alone isn't enough, though: `verified_issuer` also requires real agent-runtime evidence (a session id or runtime markers), or the mint fails loudly with a clear error rather than silently downgrading. See the OSS repo's [Key ceremony](https://github.com/dot-skill/skillerr/blob/main/docs/KEY-CEREMONY.md) for the full generate → mint → pin walkthrough, and [What is verifiable](https://github.com/dot-skill/skillerr/blob/main/docs/WHAT-IS-VERIFIABLE.md) for exactly what a signature proves either way.

## Do local / offline agents work?

Yes. Ask your agent to set `SKILL_HOST` / provider / model / deployment for Ollama, LM Studio, llama.cpp, and similar. Runtime dry-run stays local; model invocation in execute mode needs a host adapter.

## What does unsigned mean?

**Untrusted.** Execute refuses unless the host explicitly allows untrusted run.

## Can a seal prove which local model wrote the skill?

No. A seal proves which key signed which claims. Local LLMs can still misreport authorship. See [Trust and security](/trust-and-security).

## Claude Desktop claims `.skill` on macOS — is that Skillerr?

**No.** On macOS, Claude Desktop may register the `.skill` extension for its own **Agent Skills** format (a zip with `SKILL.md` inside). Skillerr `.skill` files are a **different** sealed package (typed contract, digests, mint, assets) — same extension, different format.

**What to do:** Use the CLI (`skill inspect ./file.skill`) or your AI agent to identify the file. In Finder, use **Open With** → your editor or terminal instead of double-clicking if the wrong app opens. Do not assume every `.skill` file is Claude-native or Skillerr-native without inspecting.
