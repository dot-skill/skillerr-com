#!/usr/bin/env node
/**
 * Build .skill fixtures from skillerr examples into docs/public/fixtures/.
 * Requires DOT_SKILL_ROOT or a sibling ../skillerr checkout with CLI built.
 *
 * The release-profile fixture is also minted. If FIXTURES_SIGNING_KEY (a
 * PEM-encoded Ed25519 private key, set as a GitHub Actions secret — see
 * .github/workflows/pages.yml) is present in the environment, it mints
 * with a real configured issuer key (issuer_class=configured_ed25519,
 * verifiable as trust_state=verified_issuer against the published public
 * key at docs/public/trust-store.json). Without the secret (e.g. local
 * `npm run fixtures:build`), it falls back to the public-dev HMAC —
 * mint_status=minted but trust_state=development, same as any local
 * `skill mint` with no --signer-key. Either way the fixture is honestly
 * labeled in manifest.json; nothing here fabricates a trust level.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, "..");
const dotSkillRoot =
  process.env.DOT_SKILL_ROOT ?? resolve(siteRoot, "../skillerr");
const cli = join(dotSkillRoot, "packages/cli/dist/cli.js");
const examples = join(dotSkillRoot, "examples");
const outDir = join(siteRoot, "docs/public/fixtures");

const FIXTURE_SIGNER_KEY_ID = "skillerr-com-fixtures-2026";

const specs = [
  {
    name: "knowledge-only",
    src: join(examples, "knowledge-only/recipe.json"),
    args: ["--approve", "--profile", "continuity"],
  },
  {
    name: "parameterized-integration",
    src: join(examples, "parameterized-integration/recipe.json"),
    args: ["--approve", "--profile", "continuity"],
  },
  {
    name: "code-changing",
    src: join(examples, "code-changing/recipe.json"),
    args: ["--approve", "--profile", "continuity"],
  },
  {
    name: "contract-foundation",
    src: join(examples, "contract-foundation/source.json"),
    args: ["--profile", "release"],
    mint: true,
  },
];

mkdirSync(outDir, { recursive: true });

const manifest = { built_at: new Date().toISOString(), fixtures: [] };
const env = {
  ...process.env,
  SKILL_HOST: "example-agent",
  SKILL_SESSION_ID: process.env.SKILL_SESSION_ID ?? "ses_fixture_build",
};

let signerKeyPath;
if (process.env.FIXTURES_SIGNING_KEY) {
  const dir = mkdtempSync(join(tmpdir(), "skillerr-fixtures-key-"));
  signerKeyPath = join(dir, "signer.pem");
  writeFileSync(signerKeyPath, process.env.FIXTURES_SIGNING_KEY, { mode: 0o600 });
}

for (const spec of specs) {
  const out = join(outDir, `${spec.name}.skill`);
  const json = execFileSync(
    "node",
    [cli, "pack", spec.src, ...spec.args, "-o", out],
    { env, encoding: "utf8" },
  );
  const meta = JSON.parse(json);

  let trust = { mint_status: "draft", trust_state: "untrusted" };
  if (spec.mint) {
    const mintArgs = [cli, "mint", out, "--host", "example-agent"];
    if (signerKeyPath) {
      mintArgs.push("--signer-key", signerKeyPath, "--key-id", FIXTURE_SIGNER_KEY_ID);
    }
    execFileSync("node", mintArgs, { env, encoding: "utf8" });
    trust = signerKeyPath
      ? { mint_status: "minted", trust_state: "verified_issuer", issuer_class: "configured_ed25519" }
      : { mint_status: "minted", trust_state: "development", issuer_class: "public_dev_hmac" };
  }

  manifest.fixtures.push({
    name: spec.name,
    file: `/fixtures/${spec.name}.skill`,
    skill_id: meta.skill_id,
    package_digest: meta.package_digest,
    completeness: meta.completeness,
    ...trust,
  });
  console.log(
    `built ${spec.name}.skill (${meta.package_digest.slice(0, 19)}…)` +
      (spec.mint ? ` [${trust.trust_state}]` : ""),
  );
}

if (signerKeyPath) rmSync(dirname(signerKeyPath), { recursive: true, force: true });

writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`manifest → ${join(outDir, "manifest.json")}`);
