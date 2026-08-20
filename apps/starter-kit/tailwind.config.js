/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {                                                                                                                           
        silver: '#9C9C9C',
        // accent: '#c4e1df',
        // accent: '#eb6b60'
        accent: '#4fabf0'
      }
    },
  },
  plugins: [],
}
