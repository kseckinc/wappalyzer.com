import axios from 'axios'

require('dotenv').config({
  path: `.env.${
    process.env.NODE_ENV === 'development' || process.env.ENVIRONMENT === 'beta'
      ? 'beta'
      : 'v2'
  }`,
})

export default {
  mode: 'universal',
  target: 'static',
  generate: {
    fallback: '200.html',
    concurrency: 25,
    async routes() {
      const categories = (
        await axios.get(`${process.env.BASE_URL}/categories`)
      ).data.map(({ slug }) => `/technologies/${slug}`)

      const technologies = (
        await axios.get(`${process.env.BASE_URL}/technologies`)
      ).data
        .filter(({ categories }) => categories.length)
        .map(
          ({ slug, categories: [{ slug: categorySlug }] }) =>
            `/technologies/${categorySlug}/${slug}`
        )

      return [...categories, ...technologies]
    },
  },
  head: {
    titleTemplate: (title) => `${title ? `${title} - ` : ''}Wappalyzer`,
    meta: [
      { charset: 'utf-8' },
      { theme_color: '#4608ad' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  csp: {
    reportOnly: true,
    hashAlgorithm: 'sha256',
    policies: {
      'default-src': ["'self'"],
      'img-src': ['https:', '*.google-analytics.com'],
      'worker-src': ["'none'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        '*.google-analytics.com',
        '*.stripe.com',
        '*.wdfl.co',
        '*.driftt.com',
      ],
      'connect-src': [
        '*.google-analytics.com',
        '*.stripe.com',
        '*.wappalyzer.com',
      ],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'frame-src': ['*.stripe.com', '*.driftt.com'],
      'object-src': ["'none'"],
    },
  },
  loading: { color: '#fff' },
  css: ['~/assets/scss/styles.scss'],
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
    '~/plugins/gtag.js',
    { src: '~/plugins/prism', ssr: false },
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/dotenv',
      { filename: `.env.${process.env.ENVIRONMENT || 'beta'}` },
    ],
    '@nuxtjs/vuetify',
  ],
  modules: ['@nuxtjs/axios', 'nuxt-stripe-module', 'nuxtjs-mdi-font'],
  axios: {
    baseURL: process.env.BASE_URL,
    secure: true,
    retry: { retries: 1, retryDelay: () => 500 },
  },
  stripe: {
    version: 'v3',
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  },
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    defaultAssets: false,
    treeShake: true,
    options: {
      customProperties: true,
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: {
            base: '#4608ad',
            lighten1: '#f0ebf9',
            darken1: '#32067c',
            darken2: '#150233',
          },
          accent: '#2196f3',
          secondary: '#fafafa',
          anchor: '#2196f3',
        },
      },
    },
  },
  build: {
    extend(config, ctx) {},
    followSymlinks: true,
  },
}
