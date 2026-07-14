import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "Open .skill Protocol",
    description:
      "A sealed, inspectable package format for AI agent skills — typed contract, integrity digests, trust states, and continuity handoff. Reference implementation: skillerr.",
    lang: "en-US",
    // Three hosting contexts, three base paths:
    // - GitHub Pages serves from a subpath (github.io/skillerr-com/) —
    //   GITHUB_ACTIONS is set automatically in that one build environment.
    // - www.skillerr.com (Vercel, production) serves the docs under /docs/,
    //   deliberately — the bare root is reserved for a future product built
    //   on top of this protocol, not the docs site. See vercel.json for the
    //   root -> /docs/ redirect that makes the bare domain still useful today.
    // - Local dev (`vitepress dev`/`build` with neither env var) defaults to
    //   root, which is simplest for previewing without the /docs/ prefix.
    base: process.env.GITHUB_ACTIONS ? "/skillerr-com/" : process.env.VERCEL ? "/docs/" : "/",
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: [/^\/fixtures\/.*\.skill$/],
    head: [
      // Favicon set + OG image are generated from the single master SVG in
      // the sibling `skillerr` repo (assets/skillerr-mark.svg) via
      // `scripts/build-brand.mjs` there, then copied into docs/public/assets/
      // — see docs/public/assets/README.md for the re-copy procedure.
      ["link", { rel: "icon", href: "/assets/favicon.ico", type: "image/x-icon" }],
      ["link", { rel: "icon", href: "/assets/skillerr-mark-32.png", type: "image/png" }],
      ["link", { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" }],
      [
        "meta",
        {
          name: "description",
          content:
            "Open .skill Protocol — a sealed, inspectable package format for AI agent skills. Install the reference CLI (skillerr) once, then talk to your AI.",
        },
      ],
      ["meta", { property: "og:site_name", content: "Open .skill Protocol" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:image", content: "https://www.skillerr.com/docs/assets/og-banner.png" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:image", content: "https://www.skillerr.com/docs/assets/og-banner.png" }],
    ],
    themeConfig: {
      logo: { src: "/assets/skillerr-mark-32.png", width: 28, height: 28 },
      siteTitle: ".skill",
      nav: [
        { text: "Docs", link: "/getting-started" },
        { text: "Protocol", link: "/protocol" },
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
            { text: "Trust and security", link: "/trust-and-security" },
            { text: "Fixtures", link: "/fixtures" },
          ],
        },
        {
          text: "Project",
          items: [
            { text: "FAQ", link: "/faq" },
            { text: "Roadmap", link: "/roadmap" },
            { text: "Naming", link: "https://github.com/dot-skill/skillerr/blob/main/docs/NAMING.md" },
          ],
        },
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/dot-skill/skillerr" },
      ],
      footer: {
        message: "Open .skill Protocol — Draft 0.5.0",
        copyright: "MIT © Open .skill Protocol contributors",
      },
      search: { provider: "local" },
    },
    mermaid: { theme: "neutral" },
  }),
);
