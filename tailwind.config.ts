import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          700: "#4A2D5C",
          800: "#2D1B33",
          900: "#1a1025",
        },
        sand: {
          100: "#F5F0E8",
          200: "#E8DCC8",
          300: "#D4C5A9",
          400: "#C4B394",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
