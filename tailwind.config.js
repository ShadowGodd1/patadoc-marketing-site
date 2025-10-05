/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'patadoc-teal': '#006A80',
        'patadoc-orange': '#F57E2F',
        'off-white': '#F4F1ED',
        'charcoal': '#2C3E50',
        'success-green': '#3FBF7F',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontWeight: {
        'regular': '400',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [],
}