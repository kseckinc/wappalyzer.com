import axios from 'axios'

const publicRuntimeConfig = {
  COGNITO_USER_POOL_ID: 'ap-southeast-2_Tz6DGDkmB',
  COGNITO_CLIENT_ID: '17uprj6843uiev15qqdkn3l5h7',
  COGNITO_IDENTITY_POOL_ID:
    'ap-southeast-2:6b7b7db4-96fd-450f-88fc-2a6feb55cb8e',
  DATASETS_BASE_URL: 'https://lists.wappalyzer.com/',
  BULK_LOOKUP_BASE_URL: 'https://lookup.wappalyzer.com/',
  RELEASE_URL: 'https://s3.amazonaws.com/assets.wappalyzer.com/release.json',
  ...(process.env.NODE_ENV === 'development' ||
  process.env.ENVIRONMENT === 'beta'
    ? {
        WEBSITE_URL: 'http://localhost:3000',
        BASE_URL: 'https://api.wappalyzer.com/beta/',
        STRIPE_PUBLIC_KEY: 'pk_test_m0X44lIHlqdzZNoJ8hY9OOkv',
        PIPEDRIVE_CLIENT_ID: '6406b42d1ba763c8',
        HUBSPOT_CLIENT_ID: '249959d8-60d3-4689-91ad-d02d90d81e35',
        HUBSPOT_APP_ID: '239694',
      }
    : {
        WEBSITE_URL: 'https://www.wappalyzer.com',
        BASE_URL: 'https://api.wappalyzer.com/v2/',
        STRIPE_PUBLIC_KEY: 'pk_live_JVYAmAPFVBvmnes65xsp3itH',
        PIPEDRIVE_CLIENT_ID: 'c13f52b93ab427e3',
        HUBSPOT_CLIENT_ID: 'cac4bea5-5678-444c-902f-24f1d9f5e235',
        HUBSPOT_APP_ID: '234667',
      }),
}

export default {
  target: 'static',
  generate: {
    fallback: '200.html',
    concurrency: 20,
    exclude: [/^\/compare\/.+/],
    async routes() {
      const categories = (
        await axios.get(`${publicRuntimeConfig.BASE_URL}categories`)
      ).data.map(({ slug }) => `/technologies/${slug}`)

      const technologies = (
        await axios.get(`${publicRuntimeConfig.BASE_URL}technologies`)
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
      {
        rel: 'preconnect',
        href: 'https://www.googletagmanager.com',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
    ],
  },
  loading: { color: '#fff' },
  css: ['~/assets/scss/styles.scss'],
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
  ],
  buildModules: ['@nuxtjs/svg', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    'nuxt-stripe-module',
    'cookie-universal-nuxt',
    '@nuxtjs/gtm',
    '@nuxtjs/recaptcha',
    [
      'nuxt-canonical',
      { baseUrl: publicRuntimeConfig.WEBSITE_URL, trailingSlashes: true },
    ],
  ],
  gtm: {
    id: 'GTM-53QHPFF',
    pageTracking: true,
    respectDoNotTrack: false,
    debug: process.env.ENVIRONMENT === 'beta',
  },
  recaptcha: {
    siteKey: '6LeW3NobAAAAACuVCOX8MLhIHtJCitFkuUZjRPRo',
    version: 2,
  },
  axios: {
    baseURL: publicRuntimeConfig.BASE_URL,
    secure: true,
    retry: { retries: 1, retryDelay: () => 500 },
  },
  stripe: {
    publishableKey: publicRuntimeConfig.STRIPE_PUBLIC_KEY,
  },
  sitemap: {
    hostname: publicRuntimeConfig.WEBSITE_URL,
    exclude: [
      '/admin',
      '/account',
      '/apikey',
      '/credits',
      '/css',
      '/installed',
      '/integrations',
      '/invoices',
      '/lists/all',
      '/organisation',
      '/orders',
      '/paymentmethods',
      '/reviews',
      '/signout',
      '/subscriptions',
      '/technologies/deprecated',
      '/unsubscribe',
      '/upgraded',
    ],
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
            // lighten2: '#f4f1fa',
            darken1: '#32067c',
            darken2: '#150233',
          },
          accent: {
            base: '#2196f3',
            lighten1: '#e4f2fe',
          },
          secondary: '#fafafa',
          anchor: '#2196f3',
        },
      },
    },
  },
  build: {
    extend(config) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.csv$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/,
      })
    },
    followSymlinks: true,
  },
  hooks: {
    'build:done'() {
      const modulesToClear = ['vue', 'vue/dist/vue.runtime.common.prod']
      modulesToClear.forEach((entry) => {
        delete require.cache[require.resolve(entry)]
      })
    },
  },
}
