const { colors } = require("@mui/material");

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React projesindeki dosyalar
  ],
  theme: {
    theme: {},
    extend: {
      colors: {
        themeOrange: "#e8b400",
      },
    },
  },
  plugins: [],
};
