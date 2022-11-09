module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif: [
        'Lato',
        'system',
        '-apple-system',
        'BlinkMacSystemFont',
        'SFNSDisplay-Regular',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif'
      ]
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
