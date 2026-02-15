import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Source Sans 3", "sans-serif"],
        body: ["Source Sans 3", "sans-serif"],
        // Brutalist Graffiti fonts
        heading: ["Inter Tight", "Syne", "Manrope", "sans-serif"],
        stencil: ["Impact", "Arial Black", "sans-serif"],
        marker: ["Permanent Marker", "Comic Sans MS", "cursive"],
      },
      colors: {
        // Brutalist Graffiti color palette
        coral: {
          DEFAULT: "#F06543",
          dark: "#D85436",
        },
        teal: {
          DEFAULT: "#0D9488",
          dark: "#0B7A70",
        },
        ink: {
          DEFAULT: "#1F2937",
        },
        ghost: {
          DEFAULT: "#F9FAFB",
        },
      },
      boxShadow: {
        // Brutalist hard shadows
        brutal: "8px 8px 0px 0px rgba(31, 41, 55, 1)",
        "brutal-sm": "4px 4px 0px 0px rgba(31, 41, 55, 1)",
        "brutal-lg": "12px 12px 0px 0px rgba(31, 41, 55, 1)",
        "brutal-coral": "8px 8px 0px 0px rgba(240, 101, 67, 1)",
        "brutal-teal": "8px 8px 0px 0px rgba(13, 148, 136, 1)",
      },
      animation: {
        "marker-draw": "marker-draw 0.6s ease-out forwards",
      },
      keyframes: {
        "marker-draw": {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
    },
  },
  plugins: [
    heroui({
      layout: {
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "8px",
          medium: "12px",
          large: "16px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        dark: {
          layout: {},
          colors: {
            background: {
              DEFAULT: "#0A0A0A",
              foreground: "#FFFFFF",
            },
            foreground: {
              DEFAULT: "#FFFFFF",
              foreground: "#0A0A0A",
            },
            divider: {
              DEFAULT: "#2A2A2A",
              foreground: "#FFFFFF",
            },
            overlay: {
              DEFAULT: "#000000",
              foreground: "#FFFFFF",
            },
            focus: {
              DEFAULT: "#00563B",
              foreground: "#FFFFFF",
            },
            content1: {
              DEFAULT: "#1A1A1A",
              foreground: "#FFFFFF",
            },
            content2: {
              DEFAULT: "#2A2A2A",
              foreground: "#FFFFFF",
            },
            content3: {
              DEFAULT: "#3A3A3A",
              foreground: "#FFFFFF",
            },
            content4: {
              DEFAULT: "#4A4A4A",
              foreground: "#FFFFFF",
            },
            default: {
              DEFAULT: "#1A1A1A",
              foreground: "#FFFFFF",
            },
            primary: {
              DEFAULT: "#00401A",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#00563B",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#17C964",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#F5A524",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#F31260",
              foreground: "#FFFFFF",
            },
          },
        },
        light: {
          layout: {},
          colors: {
            background: {
              DEFAULT: "#FFFFFF",
              foreground: "#0A0A0A",
            },
            foreground: {
              DEFAULT: "#0A0A0A",
              foreground: "#FFFFFF",
            },
            divider: {
              DEFAULT: "#E5E5E5",
              foreground: "#0A0A0A",
            },
            overlay: {
              DEFAULT: "#FFFFFF",
              foreground: "#0A0A0A",
            },
            focus: {
              DEFAULT: "#00563B",
              foreground: "#FFFFFF",
            },
            content1: {
              DEFAULT: "#FFFFFF",
              foreground: "#0A0A0A",
            },
            content2: {
              DEFAULT: "#F5F5F5",
              foreground: "#0A0A0A",
            },
            content3: {
              DEFAULT: "#ECECEC",
              foreground: "#0A0A0A",
            },
            content4: {
              DEFAULT: "#E0E0E0",
              foreground: "#0A0A0A",
            },
            default: {
              DEFAULT: "#F5F5F5",
              foreground: "#0A0A0A",
            },
            primary: {
              DEFAULT: "#00401A",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#00563B",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#17C964",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#F5A524",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#F31260",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};

export default config;