#!/usr/bin/env node
/**
 * Build .skill fixtures from skillerr examples into docs/public/fixtures/.
 *
 * CLI + example sources resolve in this order:
 * 1. DOT_SKILL_ROOT / a sibling ../skillerr checkout with the CLI built —
 *    local dev and GitHub Actions (pages.yml explicitly checks out
 *    dot-skill/skillerr as a sibling for this).
 * 2. The `skillerr` npm package (a devDependency of this repo) + the
 *    example sources vendored into fixtures-src/ — used on Vercel, which
 *    only checks out this single repo, no sibling. fixtures-src/ is a
 *    deliberate copy, not a symlink: if it drifts from the source repo's
 *    examples/, the resulting package_digest in manifest.json changes
 *    visibly, it doesn't silently diverge unnoticed.
 * Only if neither resolves does this skip regeneration (should not
 * happen now that `skillerr` is a devDependency, but better than a hard
 * crash if node_modules is somehow incomplete).
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
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(__dirname, "..");
const outDir = join(siteRoot, "docs/public/fixtures");

function resolveCliAndExamples() {
  const dotSkillRoot = process.env.DOT_SKILL_ROOT ?? resolve(siteRoot, "../skillerr");
  const siblingCli = join(dotSkillRoot, "packages/cli/dist/cli.js");
  const siblingExamples = join(dotSkillRoot, "examples");
  if (existsSync(siblingCli) && existsSync(siblingExamples)) {
    return { cli: siblingCli, examples: siblingExamples, source: `sibling checkout at ${dotSkillRoot}` };
  }

  const npmCli = join(siteRoot, "node_modules/skillerr/bin/skill.js");
  const vendoredExamples = join(siteRoot, "fixtures-src");
  if (existsSync(npmCli) && existsSync(vendoredExamples)) {
    return { cli: npmCli, examples: vendoredExamples, source: "npm-installed skillerr + fixtures-src/" };
  }

  return null;
}

const resolved = resolveCliAndExamples();
if (!resolved) {
  console.log(
    "Neither a sibling dot-skill/skillerr checkout nor an npm-installed `skillerr` " +
      "package (+ fixtures-src/) is available — skipping fixture regeneration and " +
      "building the site with whatever's already in docs/public/fixtures/.",
  );
  process.exit(0);
}
const { cli, examples } = resolved;
console.log(`Building fixtures from: ${resolved.source}`);

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
