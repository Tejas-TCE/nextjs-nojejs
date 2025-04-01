/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3182ce",
        secondary: "#4fd1c5",
        background: "#f8fafc",
        text: "#2d3748",
        success: "#48bb78",
        error: "#f56565",
      },
    },
  },
  plugins: [],
}; 