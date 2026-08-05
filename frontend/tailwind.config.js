/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Every color routes through a CSS variable (defined in src/index.css)
        // so the whole app can be reskinned by editing one place once the
        // real NBSS brand palette is supplied.
        brand: {
          DEFAULT: "var(--color-brand)",
          dark: "var(--color-brand-dark)",
          light: "var(--color-brand-light)",
        },
        saffron: "var(--color-saffron)",
        indiagreen: "var(--color-green)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
