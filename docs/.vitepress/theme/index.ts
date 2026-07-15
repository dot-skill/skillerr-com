import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import VerifySkill from "./components/VerifySkill.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component("VerifySkill", VerifySkill);
    // Exposes {{ $protocolVersion }} / {{ $packageVersion }} for use directly in
    // markdown prose, sourced from the real installed packages — see version.ts.
    const versions = (ctx.siteData.value.themeConfig as { versions?: { protocol: string; package: string } })
      .versions;
    if (versions) {
      ctx.app.config.globalProperties.$protocolVersion = versions.protocol;
      ctx.app.config.globalProperties.$packageVersion = versions.package;
    }
  },
} satisfies Theme;
