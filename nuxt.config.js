import axios from 'axios'

const publicRuntimeConfig =
  process.env.NODE_ENV === 'development' || process.env.ENVIRONMENT === 'beta'
    ? {
        AWS_REGION: 'ap-southeast-2',
        WEBSITE_URL: 'https://beta.wappalyzer.com',
        BASE_URL: 'https://api.wappalyzer.com/site/beta/',
        COGNITO_USER_POOL_ID: 'ap-southeast-2_Tz6DGDkmB',
        COGNITO_CLIENT_ID: '17uprj6843uiev15qqdkn3l5h7',
        COGNITO_IDENTITY_POOL_ID:
          'ap-southeast-2:6b7b7db4-96fd-450f-88fc-2a6feb55cb8e',
        DATASETS_BASE_URL: 'https://datasets.wappalyzer.com/',
        BULK_LOOKUP_BASE_URL: 'https://bulk.wappalyzer.com/',
        STRIPE_PUBLIC_KEY: 'pk_test_m0X44lIHlqdzZNoJ8hY9OOkv',
        RELEASE_URL:
          'https://s3.dualstack.ap-southeast-2.amazonaws.com/assets.wappalyzer.com/release.json',
      }
    : {
        AWS_REGION: 'ap-southeast-2',
        WEBSITE_URL: 'https://www.wappalyzer.com',
        BASE_URL: 'https://api.wappalyzer.com/site/v2/',
        COGNITO_USER_POOL_ID: 'ap-southeast-2_Tz6DGDkmB',
        COGNITO_CLIENT_ID: '17uprj6843uiev15qqdkn3l5h7',
        COGNITO_IDENTITY_POOL_ID:
          'ap-southeast-2:6b7b7db4-96fd-450f-88fc-2a6feb55cb8e',
        DATASETS_BASE_URL: 'https://datasets.wappalyzer.com/',
        BULK_LOOKUP_BASE_URL: 'https://bulk.wappalyzer.com/',
        STRIPE_PUBLIC_KEY: 'pk_live_JVYAmAPFVBvmnes65xsp3itH',
        RELEASE_URL:
          'https://s3.dualstack.ap-southeast-2.amazonaws.com/assets.wappalyzer.com/release.json',
      }

export default {
  mode: 'universal',
  target: 'static',
  generate: {
    fallback: '200.html',
    concurrency: 20,
    async routes() {
      const categories = (
        await axios.get(`${publicRuntimeConfig.BASE_URL}/categories`)
      ).data.map(({ slug }) => `/technologies/${slug}`)

      const technologies = (
        await axios.get(`${publicRuntimeConfig.BASE_URL}/technologies`)
      ).data
        .filter(({ categories }) => categories.length)
        .map(
          ({ slug, categories: [{ slug: categorySlug }] }) =>
            `/technologies/${categorySlug}/${slug}`
        )

      return [...categories, ...technologies]
    },
  },
  publicRuntimeConfig,
  head: {
    titleTemplate: (title) => `${title ? `${title} - ` : ''}Wappalyzer`,
    meta: [
      { charset: 'utf-8' },
      { theme_color: '#4608ad' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      {
        rel: 'author',
        type: 'text/plain',
        href: `${publicRuntimeConfig.WEBSITE_URL}/humans.txt`,
      },
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
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
    '~/plugins/gtag.js',
    { src: '~/plugins/prism', ssr: false },
  ],
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/svg', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    'nuxt-stripe-module',
    [
      'nuxt-canonical',
      { baseUrl: publicRuntimeConfig.WEBSITE_URL, trailingSlashes: true },
    ],
  ],
  axios: {
    baseURL: publicRuntimeConfig.BASE_URL,
    secure: true,
    retry: { retries: 1, retryDelay: () => 500 },
  },
  stripe: {
    version: 'v3',
    publishableKey: publicRuntimeConfig.STRIPE_PUBLIC_KEY,
  },
  sitemap: {
    hostname: publicRuntimeConfig.WEBSITE_URL,
    exclude: ['/admin'],
    trailingSlash: true,
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
