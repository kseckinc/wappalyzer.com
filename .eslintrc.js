module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  rules: {},
  plugins: ['prettier'],
}
