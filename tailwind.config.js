import type { Config } from "tailwindcss";

const config: Config = {
 darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#0F766E",

        background: "#F8FAFC",
        foreground: "#0F172A",

        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },

        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },

        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },

        primary: {
          DEFAULT: "#0F766E",
          foreground: "#FFFFFF",

          50: "#E6F3F2",
          100: "#CCE7E5",
          200: "#99CFCB",
          300: "#66B7B1",
          400: "#339F97",
          500: "#0F766E",
          600: "#0C5E58",
          700: "#094742",
          800: "#062F2C",
          900: "#031816",
        },

        secondary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",

          50: "#E6F8F3",
          100: "#CCF1E7",
          200: "#99E3CF",
          300: "#66D5B7",
          400: "#33C79F",
          500: "#10B981",
          600: "#0D9467",
          700: "#0A6F4D",
          800: "#064A33",
          900: "#032519",
        },

        accent: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",

          50: "#FFF8E6",
          100: "#FFF1CC",
          200: "#FFE399",
          300: "#FFD566",
          400: "#FFC733",
          500: "#F59E0B",
          600: "#C47E09",
          700: "#935F07",
          800: "#623F04",
          900: "#312002",
        },
      },

      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        arabic: ["Noto Naskh Arabic", "serif"],
      },
    },
  },

  plugins: [],
};

export default config;