import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "Skillerr",
    description:
      "Open protocol and portable .skill format for AI agents — create, inspect, hand off, and run skills across hosts.",
    lang: "en-US",
    base: "/skillerr-com/",
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
            "Skillerr — open .skill protocol. Install skillerr once, then talk to your AI.",
        },
      ],
      ["meta", { property: "og:site_name", content: "Skillerr" }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:image", content: "https://dot-skill.github.io/skillerr-com/assets/og-banner.png" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:image", content: "https://dot-skill.github.io/skillerr-com/assets/og-banner.png" }],
    ],
    themeConfig: {
      logo: { src: "/assets/skillerr-mark-32.png", width: 28, height: 28 },
      siteTitle: "Skillerr",
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
          ],
        },
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/dot-skill/skillerr" },
      ],
      footer: {
        message: "Open .skill Protocol — Draft 0.5.0",
        copyright: "MIT © Skillerr contributors",
      },
      search: { provider: "local" },
    },
    mermaid: { theme: "neutral" },
  }),
);
