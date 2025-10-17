import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.json",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        card: "var(--color-card)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 0.72, 0.12, 1)",
      },
      boxShadow: {
        "card-hover": "0 0 0 1px rgba(255,255,255,0.06) inset, 0 14px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
