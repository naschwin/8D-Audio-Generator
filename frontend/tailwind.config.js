/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/components/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('/background.jpg')",
      },
    },
  },
  plugins: [],
}

