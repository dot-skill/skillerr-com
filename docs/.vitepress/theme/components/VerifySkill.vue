<script setup lang="ts">
import { ref } from "vue";

type ApiResult = {
  ok: boolean;
  valid?: boolean;
  package_digest?: string;
  skill_id?: string;
  title?: string;
  trust_state?: string;
  trust_label?: string;
  mint_status?: string;
  issuer_class?: string;
  anchored?: boolean;
  transparency?: { ok: boolean; log_index?: string; integrated_time?: string; rekor_url?: string; error?: string };
  keyless?: { ok: boolean; owner_identity?: string; owner_issuer?: string; log_index?: string; rekor_url?: string; error?: string };
  claims?: {
    verified: Array<{ field: string; value: string; method: string }>;
    self_reported: Array<{ field: string; value: string; note: string }>;
  };
  issues?: Array<{ severity: string; code: string; message: string }>;
  error?: string;
  docs?: string;
};

const dragOver = ref(false);
const loading = ref(false);
const result = ref<ApiResult | null>(null);
const apiUnavailable = ref(false);
const fileName = ref("");

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function verifyFile(file: File) {
  loading.value = true;
  result.value = null;
  apiUnavailable.value = false;
  fileName.value = file.name;
  try {
    const fileBase64 = await fileToBase64(file);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileBase64 }),
    });
    if (res.status === 404) {
      apiUnavailable.value = true;
      return;
    }
    result.value = (await res.json()) as ApiResult;
  } catch (e) {
    result.value = { ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    loading.value = false;
  }
}

function onDrop(e: DragEvent) {
  dragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) verifyFile(file);
}

function onPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) verifyFile(file);
}

function trustClass(state?: string) {
  if (state === "verified_issuer") return "trust-verified";
  if (state === "self_reported") return "trust-self-reported";
  if (state === "development") return "trust-development";
  return "trust-untrusted";
}
</script>

<template>
  <div class="verify-skill">
    <div
      class="dropzone"
      :class="{ 'drag-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <p>Drag a <code>.skill</code> file here, or</p>
      <label class="pick-button">
        Choose file
        <input type="file" accept=".skill" @change="onPick" style="display: none" />
      </label>
      <p class="privacy-note">
        The file is sent to our server for verification (using the same code the <code>skill</code> CLI uses),
        processed in memory, and never stored or logged. See
        <a href="/verify#privacy">why this isn't fully client-side</a> below.
      </p>
    </div>

    <div v-if="loading" class="status">Verifying…</div>

    <div v-if="apiUnavailable" class="status error">
      This feature needs the production site: visit
      <a href="https://www.skillerr.com/docs/verify">www.skillerr.com/docs/verify</a> (not available on the
      GitHub Pages mirror, which is static-only).
    </div>

    <div v-if="result" class="result">
      <p v-if="fileName" class="filename">{{ fileName }}</p>

      <template v-if="result.ok && result.valid">
        <p class="trust-badge" :class="trustClass(result.trust_state)">{{ result.trust_label }}</p>
        <table>
          <tbody>
            <tr><td>Title</td><td>{{ result.title }}</td></tr>
            <tr><td>skill_id</td><td><code>{{ result.skill_id }}</code></td></tr>
            <tr><td>package_digest</td><td><code>{{ result.package_digest }}</code></td></tr>
            <tr><td>mint_status</td><td>{{ result.mint_status }}</td></tr>
            <tr v-if="result.issuer_class"><td>issuer_class</td><td>{{ result.issuer_class }}</td></tr>
          </tbody>
        </table>
        <div v-if="result.transparency">
          <p v-if="result.transparency.ok" class="transparency-ok">
            ✓ Transparency-log anchor verified: logged at index {{ result.transparency.log_index }}.
            <a v-if="result.transparency.rekor_url" :href="result.transparency.rekor_url" target="_blank" rel="noopener">
              Check this entry yourself on sigstore's public log →
            </a>
          </p>
          <p v-else class="transparency-fail">
            ✗ Transparency-log anchor present but failed verification: {{ result.transparency.error }}
          </p>
        </div>
        <div v-if="result.keyless">
          <p v-if="result.keyless.ok" class="transparency-ok">
            ✓ Keyless (Fulcio) identity anchor verified: {{ result.keyless.owner_identity }}
            <span v-if="result.keyless.owner_issuer">(via {{ result.keyless.owner_issuer }})</span>.
            <a v-if="result.keyless.rekor_url" :href="result.keyless.rekor_url" target="_blank" rel="noopener">
              Check this entry yourself on sigstore's public log →
            </a>
          </p>
          <p v-else class="transparency-fail">
            ✗ Keyless identity anchor present but failed verification: {{ result.keyless.error }}
          </p>
        </div>
        <p v-if="result.anchored === false" class="transparency-none">
          Not publicly anchored to a transparency log: trust here rests on the signature and trust-store check
          above, not on independent third-party verification.
        </p>
        <p class="docs-link"><a :href="result.docs">What does this trust state actually prove?</a></p>

        <div v-if="result.claims" class="claims">
          <h4>Claims: verified vs. self-reported</h4>
          <p class="claims-note">
            Every field above is in exactly one of these two lists, never both: nothing here can structurally
            present a self-reported claim as verified.
          </p>
          <div class="claims-column claims-verified">
            <p class="claims-heading">✓ Cryptographically verified</p>
            <ul>
              <li v-for="c in result.claims.verified" :key="c.field">
                <code>{{ c.field }}</code>: {{ c.value }}
                <span class="claims-method">· {{ c.method }}</span>
              </li>
            </ul>
          </div>
          <div class="claims-column claims-self-reported">
            <p class="claims-heading">⚠ Self-reported (not independently checked)</p>
            <ul>
              <li v-for="c in result.claims.self_reported" :key="c.field">
                <code>{{ c.field }}</code>: {{ c.value }}
                <span class="claims-method">· {{ c.note }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <template v-else-if="result.ok === false && result.valid === false">
        <p class="status error">Not a valid .skill package.</p>
        <ul>
          <li v-for="(issue, i) in result.issues" :key="i">{{ issue.code }}: {{ issue.message }}</li>
        </ul>
      </template>

      <template v-else>
        <p class="status error">{{ result.error }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.verify-skill {
  margin: 24px 0;
}
.dropzone {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
}
.dropzone.drag-over {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.pick-button {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: white;
  cursor: pointer;
  margin: 8px 0;
}
.privacy-note {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  max-width: 480px;
  margin: 8px auto 0;
}
.status {
  margin-top: 16px;
}
.status.error {
  color: var(--vp-c-danger-1);
}
.result {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.filename {
  font-weight: 600;
  word-break: break-all;
}
.trust-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 12px;
}
.trust-verified { background: #d1f7d6; color: #0a5c1f; }
.trust-self-reported { background: #fff3cd; color: #7a5b00; }
.trust-development { background: #fde2c8; color: #8a4a00; }
.trust-untrusted { background: #fbdada; color: #8a1f1f; }
table {
  width: 100%;
  border-collapse: collapse;
}
td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  word-break: break-all;
}
td:first-child {
  color: var(--vp-c-text-2);
  white-space: nowrap;
  width: 1%;
}
.transparency-ok { color: #0a5c1f; }
.transparency-fail { color: #8a1f1f; }
.transparency-none { color: var(--vp-c-text-2); font-size: 0.9em; }
.docs-link {
  margin-top: 12px;
}
.claims {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}
.claims h4 {
  margin: 0 0 4px;
  font-size: 1em;
}
.claims-note {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  margin: 0 0 12px;
}
.claims-column {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 6px;
}
.claims-verified {
  background: #d1f7d622;
  border: 1px solid #0a5c1f33;
}
.claims-self-reported {
  background: #fff3cd22;
  border: 1px solid #7a5b0033;
}
.claims-heading {
  font-weight: 600;
  margin: 0 0 6px;
  font-size: 0.9em;
}
.claims-verified .claims-heading { color: #0a5c1f; }
.claims-self-reported .claims-heading { color: #7a5b00; }
.claims-column ul {
  margin: 0;
  padding-left: 18px;
}
.claims-column li {
  font-size: 0.85em;
  margin-bottom: 4px;
  word-break: break-word;
}
.claims-method {
  color: var(--vp-c-text-2);
}
</style>
