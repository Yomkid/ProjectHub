module.exports = {
    darkMode: 'class', // or 'media'
    // ...

    // ...
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          ".no-scrollbar": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
          ".no-scrollbar::-webkit-scrollbar": {
            display: "none",
          },
        });
      },
    ],
  
  };
  