/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: "#4f46e5",
        // Adding specific dark-mode compatible colors for your standalone UI
        darkBg: "#0d1117",
        darkCard: "#161b22",
      },
    },
  },

  plugins: [
    // ✅ Essential for the ReactMarkdown rendering in your AI report
    require('@tailwindcss/typography'),
  ],
};