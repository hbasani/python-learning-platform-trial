import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          canvas: "hsl(var(--background-canvas) / <alpha-value>)",
          subtle: "hsl(var(--background-subtle) / <alpha-value>)",
          raised: "hsl(var(--background-raised) / <alpha-value>)",
          inverse: "hsl(var(--background-inverse) / <alpha-value>)"
        },
        border: {
          DEFAULT: "hsl(var(--border) / <alpha-value>)",
          strong: "hsl(var(--border-strong) / <alpha-value>)",
          focus: "hsl(var(--border-focus) / <alpha-value>)"
        },
        content: {
          DEFAULT: "hsl(var(--content-primary) / <alpha-value>)",
          secondary: "hsl(var(--content-secondary) / <alpha-value>)",
          muted: "hsl(var(--content-muted) / <alpha-value>)",
          inverse: "hsl(var(--content-inverse) / <alpha-value>)"
        },
        primary: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#baddff",
          300: "#8ac8ff",
          400: "#53a7ff",
          500: "#2f7df4",
          600: "#1d5fe3",
          700: "#184cc0",
          800: "#1a439c",
          900: "#1a3a7b",
          DEFAULT: "#1d5fe3",
          foreground: "#ffffff"
        },
        secondary: {
          50: "#f4f8f7",
          100: "#dfece9",
          200: "#c3ddd6",
          300: "#9ac7bc",
          400: "#6ba99d",
          500: "#498d82",
          600: "#397168",
          700: "#315c56",
          800: "#2b4b47",
          900: "#263f3c",
          DEFAULT: "#397168",
          foreground: "#ffffff"
        },
        success: {
          50: "#effaf3",
          100: "#d7f4df",
          200: "#b2e9c3",
          300: "#7fd99d",
          400: "#49c272",
          500: "#24a853",
          600: "#188640",
          700: "#166936",
          800: "#15542f",
          900: "#124528",
          DEFAULT: "#188640",
          foreground: "#ffffff"
        },
        warning: {
          50: "#fff8eb",
          100: "#ffedc6",
          200: "#ffd889",
          300: "#ffbf4a",
          400: "#ffa51f",
          500: "#f27f0c",
          600: "#d75c07",
          700: "#b33d0a",
          800: "#91300f",
          900: "#77290f",
          DEFAULT: "#d75c07",
          foreground: "#211403"
        },
        error: {
          50: "#fff1f2",
          100: "#ffe1e5",
          200: "#ffc8d1",
          300: "#ffa2b2",
          400: "#fc718a",
          500: "#ef4365",
          600: "#db234d",
          700: "#b8173e",
          800: "#991638",
          900: "#831735",
          DEFAULT: "#db234d",
          foreground: "#ffffff"
        },
        coin: {
          50: "#fff9db",
          100: "#fff0a8",
          200: "#ffe266",
          300: "#ffd12e",
          400: "#f7b80b",
          500: "#d99605",
          DEFAULT: "#d99605"
        },
        xp: {
          50: "#f0f7ff",
          100: "#ddebff",
          200: "#c1dcff",
          300: "#96c6ff",
          400: "#64a4ff",
          500: "#3f7fff",
          DEFAULT: "#3f7fff"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        heading: ["var(--font-heading)", "Satoshi", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Satoshi", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"]
      },
      fontSize: {
        "display-lg": ["4.5rem", { lineHeight: "0.92", letterSpacing: "-0.06em", fontWeight: "760" }],
        "display-md": ["3.5rem", { lineHeight: "0.96", letterSpacing: "-0.052em", fontWeight: "740" }],
        "display-sm": ["2.75rem", { lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "720" }],
        "heading-xl": ["2rem", { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "720" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.16", letterSpacing: "-0.028em", fontWeight: "700" }],
        "heading-md": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "680" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", letterSpacing: "-0.01em", fontWeight: "450" }],
        "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "-0.006em", fontWeight: "450" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "-0.002em", fontWeight: "450" }],
        caption: ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.01em", fontWeight: "560" }]
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem"
      },
      borderRadius: {
        xs: "0.375rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem"
      },
      boxShadow: {
        premium: "0 24px 80px -24px rgb(15 23 42 / 0.24)",
        card: "0 16px 44px -24px rgb(15 23 42 / 0.22)",
        glow: "0 0 0 1px rgb(255 255 255 / 0.72), 0 24px 72px -32px rgb(29 95 227 / 0.55)",
        inset: "inset 0 1px 0 rgb(255 255 255 / 0.72)"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms"
      }
    }
  },
  plugins: []
};

export default config;
