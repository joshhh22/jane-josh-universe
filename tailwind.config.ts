import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8F3EA",
        ink: "#171717",
        pink: "#FFB7C5",
        rose: "#EFA3B5",
        lavender: "#C9C2FF",
        blue: "#B9D9FF",
        yellow: "#FFE39A",
        green: "#C8E6C9",
        white: "#FFFDF8",
        cream: "#F5EDD6",
        mauve: "#D4B4C8",
        // Neubrutalist accent
        brutal: {
          shadow: "#171717",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        neu: "4px 4px 0px #171717",
        "neu-sm": "2px 2px 0px #171717",
        "neu-lg": "6px 6px 0px #171717",
        "neu-xl": "8px 8px 0px #171717",
        "neu-pink": "4px 4px 0px #EFA3B5",
        "neu-lavender": "4px 4px 0px #C9C2FF",
        "neu-blue": "4px 4px 0px #B9D9FF",
        "neu-yellow": "4px 4px 0px #FFE39A",
      },
      borderRadius: {
        neu: "12px",
        "neu-sm": "8px",
        "neu-lg": "16px",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        bounce: "bounce 1s infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pop-in": "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-12px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
