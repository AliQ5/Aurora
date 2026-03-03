/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          green: '#e3f5e1',
          purple: '#e2dfff',
          blue: '#1e3a8a',
        },
        surface: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
        },
        text: {
          main: '#0f172a',
          muted: '#64748b',
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -10px rgba(0,0,0,0.05)',
        'premium-hover': '0 25px 50px -12px rgba(0,0,0,0.08)',
        'premium-dark': '0 20px 40px -10px rgba(0,0,0,0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
