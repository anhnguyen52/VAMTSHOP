/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {  
      fontFamily: {
        rubik: ['Roboto', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 0.5s',
        'slide-up': 'slideUp 0.5s',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(0%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0%)', opacity: '0' },
          '100%': { transform: 'translateY(-100%)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

