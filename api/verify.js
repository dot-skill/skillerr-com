/**
 * Public verify API: POST a base64-encoded .skill file, get back exactly
 * what `skill inspect --trust` / `skill verify-trust` would report: no
 * more, no less. Uses the same @skillerr/core code the CLI does, not a
 * separate reimplementation.
 *
 * Privacy: the file is processed in memory for this one request and never
 * written to disk or logged. It's still a real upload to our server (not
 * verified fully client-side), see docs/verify.md for why, and note that
 * .skill packages are already redacted-by-design (secrets as {{refs}},
 * scrubbed journeys, see docs/PRIVACY.md in the OSS repo) before they're
 * ever sealed, so this is a materially different exposure than uploading
 * raw source.
 */
import { createRequire } from "node:module";

// Same trust store published at /docs/trust/trust-store.json. Loaded via a
// static require() of a literal path (not a runtime-computed fs.readFileSync
// path) specifically because Vercel's serverless bundler traces static
// require()/import calls to decide which files to include in the deployed
// function. A dynamically-built path is a well-documented way to get
// ENOENT (or FUNCTION_INVOCATION_FAILED) in production despite working
// fine locally, where every file is just... there.
const require = createRequire(import.meta.url);
let PUBLISHED_TRUST_STORE;
try {
  PUBLISHED_TRUST_STORE = require("../docs/public/trust/trust-store.json");
} catch {
  PUBLISHED_TRUST_STORE = { version: 1, keys: [] };
}

const MAX_BODY_BYTES = 12 * 1024 * 1024; // generous; protocol's own MAX_UNCOMPRESSED_BYTES gates the real limit

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST only" });
    return;
  }

  const { fileBase64 } = req.body ?? {};
  if (typeof fileBase64 !== "string" || fileBase64.length === 0) {
    res.status(400).json({ ok: false, error: "Missing fileBase64 in request body" });
    return;
  }

  let bytes;
  try {
    bytes = Buffer.from(fileBase64, "base64");
  } catch {
    res.status(400).json({ ok: false, error: "fileBase64 is not valid base64" });
    return;
  }
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_BODY_BYTES) {
    res.status(400).json({ ok: false, error: `File must be 1 byte to ${MAX_BODY_BYTES} bytes` });
    return;
  }

  let core;
  try {
    core = await import("@skillerr/core");
  } catch (e) {
    res.status(200).json({
      ok: false,
      error: `Failed to load @skillerr/core: ${e instanceof Error ? e.message : String(e)}`,
    });
    return;
  }
  const { validatePackageBytes, inspectTrustView, verifyRekorAnchor, verifyKeylessAnchor, rekorSearchUrl, assessClaims } = core;

  try {
    const bytesArray = new Uint8Array(bytes);
    const validation = validatePackageBytes(bytesArray);
    if (!validation.ok || !validation.manifest) {
      res.status(200).json({
        ok: false,
        valid: false,
        issues: validation.issues,
        docs: "https://www.skillerr.com/docs/what-is-verifiable",
      });
      return;
    }

    const trustView = inspectTrustView(bytesArray, { trust_store: PUBLISHED_TRUST_STORE });

    let transparency;
    const anchors = validation.manifest.anchors ?? [];
    const tlogAnchor = anchors.find((a) => a.kind === "transparency_log");
    if (tlogAnchor && trustView.sealed_manifest_digest) {
      const pinnedKey = PUBLISHED_TRUST_STORE.keys?.find((k) => k.key_id === tlogAnchor.issuer);
      if (!pinnedKey) {
        transparency = { ok: false, error: `No published trust-store entry for issuer "${tlogAnchor.issuer}"` };
      } else {
        const verified = await verifyRekorAnchor(tlogAnchor, trustView.sealed_manifest_digest, pinnedKey.public_key_pem);
        // Independently checkable on sigstore's own UI, not just our word
        // for it. Undefined (no fabricated link) unless the anchor both
        // verified and lives on the public rekor.sigstore.dev instance.
        transparency = verified.ok
          ? { ...verified, rekor_url: rekorSearchUrl(tlogAnchor, verified.log_index) }
          : verified;
      }
    }

    // Same additive pattern as transparency_log above, but checked against
    // Fulcio's CA (part of the trusted root) instead of a trust-store-pinned
    // key, see verifyKeylessAnchor / skill mint --keyless.
    let keyless;
    const keylessAnchor = anchors.find((a) => a.kind === "keyless_identity");
    if (keylessAnchor && trustView.sealed_manifest_digest) {
      const verified = await verifyKeylessAnchor(keylessAnchor, trustView.sealed_manifest_digest);
      keyless = verified.ok
        ? { ...verified, rekor_url: rekorSearchUrl(keylessAnchor, verified.log_index) }
        : verified;
    }

    // Structural split, not just prose: nothing in this response can be
    // read as "verified" unless assessClaims put it there after an actual
    // check, see docs/WHAT-IS-VERIFIABLE.md.
    const claims = assessClaims(trustView, {
      transparency: transparency?.ok ? transparency : undefined,
      keyless: keyless?.ok ? keyless : undefined,
    });

    res.status(200).json({
      ok: true,
      valid: true,
      package_digest: validation.manifest.package_digest,
      skill_id: validation.manifest.id,
      title: validation.manifest.title,
      trust_state: trustView.trust_state,
      trust_label: trustView.label,
      mint_status: validation.manifest.mint?.mint_status ?? "draft",
      issuer_class: trustView.issuer_class,
      // Present (true/false) regardless of whether the anchor verified, so
      // the UI can distinguish "not publicly anchored" from "anchored but
      // couldn't be verified" instead of treating both as silent absence.
      anchored: Boolean(tlogAnchor || keylessAnchor),
      ...(transparency ? { transparency } : {}),
      ...(keyless ? { keyless } : {}),
      claims,
      docs: "https://www.skillerr.com/docs/what-is-verifiable",
    });
  } catch (e) {
    res.status(200).json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
