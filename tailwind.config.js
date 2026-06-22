/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepsea: {
          950: '#01060b',
          900: '#03101c',
          800: '#071f36',
          700: '#0b3052',
          600: '#124570',
        },
        biolum: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          teal: '#20c997',
        }
      },
      animation: {
        'bubble': 'bubble 15s linear infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
        'float': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        bubble: {
          '0%': { transform: 'translateY(110vh) scale(0)', opacity: 0 },
          '10%': { opacity: 0.8, transform: 'translateY(90vh) scale(1)' },
          '90%': { opacity: 0.8, transform: 'translateY(10vh) scale(1)' },
          '100%': { transform: 'translateY(-10vh) scale(0)', opacity: 0 },
        },
        glow: {
          '0%': { opacity: 0.4, transform: 'scale(0.95)' },
          '100%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}
