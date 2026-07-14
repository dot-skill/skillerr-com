import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import VerifySkill from "./components/VerifySkill.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component("VerifySkill", VerifySkill);
  },
} satisfies Theme;
