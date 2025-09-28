// tailwind.config.js
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
            circular: ['circular-web', 'sans-serif'],
            "general": ['general', 'sans-serif'],
            robertm: ['robert-medium', 'sans-serif'],
            robertr: ['robert-regular', 'sans-serif'],
            "zentry": ['zentry', 'sans-serif'],
          },
      },
    },
    plugins: [],
  };
  