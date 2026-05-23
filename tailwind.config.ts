import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: "var(--ink)",
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        border: "var(--border)",
        muted: "var(--muted)",
        blue: "var(--blue)",
        red: "var(--red)",
        yellow: "var(--yellow)",
        green: "var(--green)",
        "score-low": "var(--score-low)",
        "score-mid": "var(--score-mid)",
        "score-high": "var(--score-high)",
      },
      fontFamily: {
        display: [
          '"Google Sans"',
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "pulse-ring": "pulseRing 1.4s ease-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
