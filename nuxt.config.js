import axios from 'axios'

require('dotenv').config({
  path: `.env.${
    process.env.NODE_ENV === 'development' || process.env.ENVIRONMENT === 'beta'
      ? 'beta'
      : 'v2'
  }`,
})

const publicRuntimeConfig = {
  AWS_REGION: 'ap-southeast-2',
  COGNITO_USER_POOL_ID: 'ap-southeast-2_Tz6DGDkmB',
  COGNITO_CLIENT_ID: '17uprj6843uiev15qqdkn3l5h7',
  COGNITO_IDENTITY_POOL_ID:
    'ap-southeast-2:6b7b7db4-96fd-450f-88fc-2a6feb55cb8e',
  BASE_URL: 'https://api.wappalyzer.com/',
  DATASETS_BASE_URL: 'https://datasets.wappalyzer.com/',
  BULK_LOOKUP_BASE_URL: 'https://bulk.wappalyzer.com/',
  RELEASE_URL:
    'https://s3.dualstack.ap-southeast-2.amazonaws.com/assets.wappalyzer.com/release.json',
  ...(process.env.NODE_ENV === 'development' ||
  process.env.ENVIRONMENT === 'beta'
    ? {
        WEBSITE_URL: 'https://beta.wappalyzer.com',
        API_VERSION: 'beta',
        STRIPE_PUBLIC_KEY: 'pk_test_m0X44lIHlqdzZNoJ8hY9OOkv',
      }
    : {
        WEBSITE_URL: 'https://www.wappalyzer.com',
        API_VERSION: 'v2',
        STRIPE_PUBLIC_KEY: 'pk_live_JVYAmAPFVBvmnes65xsp3itH',
      }),
}

export default {
  mode: 'universal',
  target: 'static',
  generate: {
    // crawler: false,
    fallback: '200.html',
    concurrency: 20,
    exclude: [/^\/compare\/.+/],
    /*
    async routes() {
      const categories = (
        await axios.get(
          `${publicRuntimeConfig.BASE_URL}categories/${publicRuntimeConfig.API_VERSION}`
        )
      ).data.map(({ slug }) => `/technologies/${slug}`)

      const technologies = (
        await axios.get(
          `${publicRuntimeConfig.BASE_URL}technologies/${publicRuntimeConfig.API_VERSION}`
        )
      ).data
        .filter(({ categories }) => categories.length)
        .map(
          ({ slug, categories: [{ slug: categorySlug }] }) =>
            `/technologies/${categorySlug}/${slug}`
        )

      return [...categories, ...technologies]
    },
    */
  },
  router: {
    routes: {
      name: 'lookup',
      path: '/lookup/:url?',
      component: 'pages/lookup/_id.vue',
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
        href: 'https://www.google-analytics.com',
      },
      {
        rel: 'apple-touch-icon',
        href: '/images/logo/icon_192.png',
      },
    ],
  },
  loading: { color: '#fff' },
  css: ['~/assets/scss/styles.scss'],
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
    { src: '~/plugins/prism', ssr: false },
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/svg',
    '@nuxtjs/vuetify',
    [
      '@nuxtjs/dotenv',
      { filename: `.env.${process.env.ENVIRONMENT || 'beta'}` },
    ],
    '@nuxtjs/pwa',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    'nuxt-stripe-module',
    'cookie-universal-nuxt',
    '@nuxtjs/google-gtag',
    [
      'nuxt-canonical',
      { baseUrl: publicRuntimeConfig.WEBSITE_URL, trailingSlashes: true },
    ],
    '@nuxtjs/pwa',
  ],
  'google-gtag': {
    id: 'UA-216336-5',
  },
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
  pwa: {
    icon: {
      source: '~/static/images/logo/icon_512.png',
    },
    meta: {
      theme_color: '#4608ad',
    },
    manifest: {
      name: 'Wappalyzer',
      short_name: 'Wappalyzer',
    },
  },
  build: {
    extend(config, ctx) {},
    followSymlinks: true,
  },
}
