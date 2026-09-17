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
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },

        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },

        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#1e293b",
          800: "#131b26",
          900: "#0b0f17",
          950: "#070a0f",
        },

        glass: {
          light: "rgba(255, 255, 255, 0.04)",
          medium: "rgba(255, 255, 255, 0.08)",
          heavy: "rgba(255, 255, 255, 0.12)",
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
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.3)",
        "emerald-glow": "0 0 25px rgba(16, 185, 129, 0.28)",
        "cyan-glow": "0 0 25px rgba(6, 182, 212, 0.25)",
        "green-glow": "0 0 25px rgba(16, 185, 129, 0.28)",
        "gold-glow": "0 0 20px rgba(16, 185, 129, 0.20)",
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
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" },
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