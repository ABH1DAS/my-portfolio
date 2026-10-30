/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        border: "var(--line-card)",
        accent: {
          DEFAULT: "var(--acc)",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "var(--mut)",
          foreground: "var(--mut-dim)"
        }
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px"
      }
    }
  },
  plugins: []
};
