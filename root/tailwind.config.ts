import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        card: "var(--color-card)"
      },
      borderRadius: { xl: "1rem" },
      boxShadow: { subtle: "0 2px 10px rgba(0,0,0,0.25)" },
      transitionTimingFunction: { std: "cubic-bezier(0.2, 0, 0, 1)" }
    }
  },
  plugins: []
};
export default config;

