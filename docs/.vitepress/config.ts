import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { packageVersion, protocolVersion } from "./version.js";

// Two hosting contexts, two base paths:
// - GitHub Pages serves from a subpath (github.io/skillerr-com/): GITHUB_ACTIONS
//   is set automatically in that one build environment.
// - Everything else (Vercel production at docs.skillerr.com, local dev)
//   serves from root. Docs used to live under /docs/ on Vercel, with the
//   bare skillerr.com root reserved for a future product; that product now
//   has its own domain split (docs.skillerr.com), so docs serve at their
//   own root too. Old /docs/* and skillerr.com/* links still resolve via
//   vercel.json's redirects, they just aren't the canonical form anymore.
//
// A named const (not inlined into `base:` below) because the head array's
// hardcoded icon hrefs need this same value: VitePress does NOT auto-prefix
// head-array href/src with `base`, only asset URLs it resolves itself.
const base = process.env.GITHUB_ACTIONS ? "/skillerr-com/" : "/";

export default withMermaid(
  defineConfig({
    title: "Open .skill Protocol",
    description:
      "Portable, verifiable skills for AI agents. Package a skill once as a sealed .skill file: typed inputs, ordered steps, provenance, and a cryptographic seal, so any agent or host can inspect, verify, and run it.",
    lang: "en-US",
    base,
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: [/^\/fixtures\/.*\.skill$/],
    head: [
      // Favicon set + OG image are generated from the single master SVG in
      // the sibling `skillerr` repo (assets/skillerr-mark.svg) via
      // `scripts/build-brand.mjs` there, then copied into docs/public/assets/.
      // See docs/public/assets/README.md for the re-copy procedure.
      ["link", { rel: "icon", href: `${base}assets/favicon.ico`, type: "image/x-icon" }],
      ["link", { rel: "icon", href: `${base}assets/skillerr-mark-32.png`, type: "image/png" }],
      ["link", { rel: "apple-touch-icon", href: `${base}assets/apple-touch-icon.png` }],
      [
        "meta",
        {
          name: "description",
          content:
            "Create, inspect, and run portable .skill packages for AI agents: typed, sealed, and verifiable before anyone runs them.",
        },
      ],
      ["meta", { property: "og:site_name", content: "Open .skill Protocol" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:image", content: "https://docs.skillerr.com/assets/og-banner.png" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:image", content: "https://docs.skillerr.com/assets/og-banner.png" }],
      // Site-wide page-view analytics (Google Analytics). This is the
      // skillerr.com docs/marketing site only, separate from the CLI,
      // which makes no network calls unless explicitly opted into
      // (--transparency/--keyless/--online). See docs/verify.md's Privacy
      // section for the disclosure.
      ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MMJCDCPZ36" }],
      [
        "script",
        {},
        "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-MMJCDCPZ36');",
      ],
    ],
    themeConfig: {
      logo: { src: "/assets/skillerr-mark-32.png", width: 28, height: 28 },
      siteTitle: "Skillerr",
      // Read by theme/index.ts and exposed as $protocolVersion/$packageVersion
      // globals so markdown pages can write `{{ $protocolVersion }}` instead of
      // a hand-typed number. See version.ts for where these actually come from.
      versions: { protocol: protocolVersion, package: packageVersion },
      nav: [
        { text: "Docs", link: "/getting-started" },
        { text: "How it works", link: "/concepts" },
        { text: "Protocol", link: "/protocol" },
        { text: "Verify", link: "/verify" },
        { text: "Fixtures", link: "/fixtures" },
        { text: "Workflows", link: "/workflows" },
        {
          text: "GitHub",
          link: "https://github.com/dot-skill/skillerr",
        },
      ],
      sidebar: [
        {
          text: "Start",
          items: [
            { text: "Overview", link: "/" },
            { text: "How it works", link: "/concepts" },
            { text: "Getting started", link: "/getting-started" },
            { text: "Workflows", link: "/workflows" },
          ],
        },
        {
          text: "Guides",
          items: [
            { text: "Create a skill", link: "/create-a-skill" },
            { text: "Convert a SKILL.md", link: "/convert-a-skill-md" },
            { text: "Evaluate & score", link: "/evaluate-and-score" },
            { text: "Ingest a skill", link: "/ingest-a-skill" },
            { text: "Agents", link: "/agents" },
          ],
        },
        {
          text: "Reference",
          items: [
            { text: "Protocol", link: "/protocol" },
            { text: "CLI", link: "/cli" },
            { text: "Verify a skill", link: "/verify" },
            { text: "Trust and security", link: "/trust-and-security" },
            { text: "Fixtures", link: "/fixtures" },
          ],
        },
        {
          text: "Project",
          items: [
            { text: "FAQ", link: "/faq" },
            { text: "Roadmap", link: "/roadmap" },
            { text: "GitHub", link: "https://github.com/dot-skill/skillerr" },
          ],
        },
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/dot-skill/skillerr" },
      ],
      footer: {
        message: `Open .skill Protocol ${protocolVersion} (Stable) · skillerr CLI v${packageVersion} · MIT`,
        copyright: "MIT © Open .skill Protocol contributors",
      },
      search: { provider: "local" },
    },
    mermaid: { theme: "neutral" },
  }),
);
