/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {keyframes: {
        colorSweep: {
          '0%': { backgroundPosition: 'center' },
          '50%': { backgroundPosition: 'left' },
          '100%': { backgroundPosition: 'right' },
        },
      },
      animation: {
        colorSweep: 'colorSweep 0.6s ease forwards',
      },},
  },
  plugins: [],
}

