/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: "#7afcff",
        darkBlue: "#0f1b33",
        lightBlue: "#eaf4ff",
        neonGreen: "#00ffb3",
      },
      backgroundImage: {
        "cyber-gradient":
          "radial-gradient(circle at 20% 20%, #0f1b33, #05091a 80%)",
      },
    },
  },
  plugins: [],
};
