module.exports = {
  theme: {
    extend: {
      colors: {
        smoke: {
          100: "rgba(0, 0, 0, 0.1)",
          200: "rgba(0, 0, 0, 0.25)",
          300: "rgba(0, 0, 0, 0.4)",
          400: "rgba(0, 0, 0, 0.5)",
          500: "rgba(0, 0, 0, 0.6)",
          600: "rgba(0, 0, 0, 0.75)",
          700: "rgba(0, 0, 0, 0.9)"
        }
      },
      width: {
        '1/12': '8.33333333%',
        '2/12': '16.6666666%',
        '1/6': '16.5%',
        '2/6': '33%',
        '5/6': '83%',
        '1/8': '12.5%',
        '1/5' : '20%',
        '1/10': '10%',
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'group-hover', 'first', 'last', 'odd', 'even', 'hover', 'focus', 'active', 'visited', 'disabled']
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
  ]
};
