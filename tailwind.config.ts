import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#061225",
        petrol: "#063442",
        ocean: "#0a7cff",
        electric: "#23a7ff",
        mint: "#24d28f",
        cloud: "#f4f8fb",
        line: "#d8e4ef"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(10, 124, 255, 0.22)",
        panel: "0 18px 60px rgba(6, 18, 37, 0.12)"
      },
      animation: {
        "fade-up": "fadeUp 780ms ease both",
        "pulse-line": "pulseLine 2.8s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
