/**
 * Public verify API — POST a base64-encoded .skill file, get back exactly
 * what `skill inspect --trust` / `skill verify-trust` would report: no
 * more, no less. Uses the same @skillerr/core code the CLI does, not a
 * separate reimplementation.
 *
 * Privacy: the file is processed in memory for this one request and never
 * written to disk or logged. It's still a real upload to our server (not
 * verified fully client-side) — see docs/verify.md for why, and note that
 * .skill packages are already redacted-by-design (secrets as {{refs}},
 * scrubbed journeys — see docs/PRIVACY.md in the OSS repo) before they're
 * ever sealed, so this is a materially different exposure than uploading
 * raw source.
 */
import {
  validatePackageBytes,
  inspectTrustView,
  verifyRekorAnchor,
  loadTrustStore,
} from "@skillerr/core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Same trust store published at /docs/trust/trust-store.json — read from
// the local file bundled into this function rather than fetching over
// HTTP, so this endpoint has no dependency on the static site being up.
const PUBLISHED_TRUST_STORE_PATH = join(__dirname, "..", "docs", "public", "trust", "trust-store.json");

const MAX_BODY_BYTES = 12 * 1024 * 1024; // generous; protocol's own MAX_UNCOMPRESSED_BYTES gates the real limit

export const config = { api: { bodyParser: { sizeLimit: "16mb" } } };

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

    let trustStore;
    try {
      trustStore = JSON.parse(readFileSync(PUBLISHED_TRUST_STORE_PATH, "utf8"));
    } catch {
      trustStore = { version: 1, keys: [] };
    }
    const trustView = inspectTrustView(bytesArray, { trust_store: trustStore });

    let transparency;
    const anchors = validation.manifest.anchors ?? [];
    const tlogAnchor = anchors.find((a) => a.kind === "transparency_log");
    if (tlogAnchor && trustView.sealed_manifest_digest) {
      const pinnedKey = trustStore.keys?.find((k) => k.key_id === tlogAnchor.issuer);
      transparency = pinnedKey
        ? await verifyRekorAnchor(tlogAnchor, trustView.sealed_manifest_digest, pinnedKey.public_key_pem)
        : { ok: false, error: `No published trust-store entry for issuer "${tlogAnchor.issuer}"` };
    }

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
      ...(transparency ? { transparency } : {}),
      docs: "https://www.skillerr.com/docs/what-is-verifiable",
    });
  } catch (e) {
    res.status(200).json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
