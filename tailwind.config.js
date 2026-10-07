/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#D5DAE1"
        },
        black: {
          DEFAULT: "#000",
          500: "#1D2235"
        },
        blue: {
          500: "#2b77e7"
        },
        brand: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899"
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Work Sans", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        space: ["Space Grotesk", "monospace"],
        worksans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        pixel: ['"Pixelify Sans"', '"Press Start 2P"', '"Silkscreen"', "monospace"],
        pressStart: ['"Press Start 2P"', "cursive", "monospace"],
        silkscreen: ['"Silkscreen"', "monospace"],
      },
      boxShadow: {
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        glow: "0 0 25px -5px rgba(59, 130, 246, 0.4)",
        "glow-lg": "0 0 40px -10px rgba(99, 102, 241, 0.5)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
      }
    },
  },
  plugins: [],
}


