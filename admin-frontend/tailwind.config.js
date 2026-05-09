export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#0f3d2e",
        },

        gold: {
          50: "#fffdf0",
          100: "#fefce8",
          200: "#fef9c3",
          300: "#fef08a",
          400: "#fde047",
          500: "#facc15",
          600: "#eab308",
          700: "#ca8a04",
          800: "#a16207",
          900: "#854d0e",
          950: "#7a5c00", // FIXED (true dark gold)
        },

        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0b0f14",
        },

        glass: {
          light: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.10)",
          heavy: "rgba(255, 255, 255, 0.14)",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },

      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.25)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.15)",
        "gold-glow": "0 0 20px rgba(250, 204, 21, 0.3)",
        "green-glow": "0 0 20px rgba(34, 197, 94, 0.3)",
      },

      backdropBlur: {
        xs: "2px",
      },

      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(250, 204, 21, 0.25)" },
          "100%": { boxShadow: "0 0 30px rgba(250, 204, 21, 0.45)" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },

  plugins: [],
};