import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SetterFlo Brand Colors (dark-first)
        background: {
          DEFAULT: '#050A14', // Deeper Navy/Black
          secondary: '#0B1426', // Card background
          tertiary: '#12203D', // Hover states
        },
        primary: {
          DEFAULT: '#00B9AD', // Primary Teal
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00B9AD',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        accent: {
          purple: {
             DEFAULT: '#8b5cf6',
             400: '#a78bfa',
             500: '#8b5cf6',
             600: '#7c3aed',
          },
        },
        text: {
          primary: '#FFFFFF', // White primary text
          secondary: '#94A3B8', // Muted text
          muted: '#64748B', // More muted
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)', // Subtle borders
          muted: 'rgba(255,255,255,0.04)',
          hover: 'rgba(255,255,255,0.15)',
        },
        // Support colors
        success: {
          50: '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb', 
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "Montserrat", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Refined Type Scale
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        // Strict 4px grid system
        "18": "4.5rem",
        "22": "5.5rem",
        "section-y": "6rem",
        "section-y-sm": "4rem",
      },
      maxWidth: {
        "content": "1200px",
        "prose": "65ch",
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { 
            boxShadow: "0 0 5px #00B9AD, 0 0 10px #00B9AD",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px #00B9AD, 0 0 30px #00B9AD",
            transform: "scale(1.05)"
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, rgba(14,27,54,0) 0%, #0E1B36 100%)',
        'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
