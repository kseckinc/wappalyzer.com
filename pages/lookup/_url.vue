<template>
  <Page :title="title" :seo-title="seoTitle" :head="meta" no-heading>
    <v-card
      id="form"
      color="secondary"
      style="overflow: hidden"
      class="mt-12 mb-4"
    >
      <v-card-title>
        <v-row align="center">
          <v-col cols="12" sm="4" class="py-0">
            <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
            Lookup
          </v-col>
          <v-col cols="12" sm="8" class="py-0">
            <Credits />
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="pb-0">
        <Url ref="url" :url="url" class="mb-4" @change="submit" />

        <v-alert v-if="error" color="info" class="mb-4" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading" class="mb-4">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>

        <Attributes
          v-if="!loading"
          :hostname="attributes"
          :limited="!isSignedIn"
          @signIn="signInDialog = true"
        />

        <v-card v-if="!loading && technologies.length" class="mb-4">
          <v-card-title class="subtitle-2" style="line-height: 1em">
            Technologies
            <span class="ml-1 text--disabled">({{ technologies.length }})</span>
          </v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <tbody>
                <tr v-for="category in categorised" :key="category.slug">
                  <td>
                    <div
                      v-for="{
                        name,
                        slug,
                        categories,
                        icon,
                      } in category.technologies"
                      :key="name"
                    >
                      <nuxt-link
                        :to="`/technologies/${
                          categories.length ? `${categories[0].slug}/` : ''
                        }${slug}/`"
                        class="d-flex align-center body-2 my-2"
                      >
                        <TechnologyIcon :icon="icon" />
                        {{ name }}
                      </nuxt-link>
                    </div>
                  </td>
                  <th class="text-right font-weight-regular">
                    <nuxt-link
                      :to="`/technologies/${category.slug}/`"
                      class="black--text"
                    >
                      {{ category.name }}
                    </nuxt-link>
                  </th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <p>
      <small>
        Look up 100,000 websites at once with
        <nuxt-link to="/bulk/">Bulk lookup</nuxt-link>.<br />
        Automate lookups with the
        <nuxt-link to="/api/">Lookup API</nuxt-link> or
        <nuxt-link to="/download/">CRM integration</nuxt-link>.<br />
        Get the free
        <nuxt-link to="/download/">browser extension</nuxt-link>.
      </small>
    </p>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiLayersOutline, mdiMagnify, mdiCheck, mdiClose } from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Credits from '~/components/Credits.vue'
import Url from '~/components/Url.vue'
import Attributes from '~/components/Attributes.vue'
import SignIn from '~/components/SignIn.vue'
import { lookup as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'
import states from '~/assets/json/states.json'

function getFullUrl(url) {
  if (!url) {
    return null
  }

  let fullUrl

  try {
    new URL(url) // eslint-disable-line no-new

    return url
  } catch (error) {
    if (url.includes('.')) {
      if (url.startsWith('www.')) {
        fullUrl = `http://${url}`
      } else {
        fullUrl = `http://${url.split('.').length > 2 ? '' : 'www.'}${url}`
      }

      new URL(fullUrl) // eslint-disable-line no-new

      return fullUrl
    }
  } finally {
    // Continue
  }

  return null
}

export default {
  components: {
    Page,
    Progress,
    TechnologyIcon,
    Credits,
    Url,
    Attributes,
    SignIn,
  },
  async asyncData({
    route,
    $axios,
    store: {
      state: {
        user: { isSignedIn },
      },
    },
    redirect,
  }) {
    const { url } = route.params

    const fullUrl = getFullUrl(url)

    if (fullUrl) {
      try {
        const { technologies, attributes } = (
          await $axios.get(
            `lookup-site${isSignedIn ? '' : '/public'}/${encodeURIComponent(
              fullUrl
            )}`
          )
        ).data
        return { url: fullUrl, lastUrl: fullUrl, technologies, attributes }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return { url: fullUrl, lastUrl: fullUrl, signInDialog: true }
        }

        return {
          url: fullUrl,
          lastUrl: fullUrl,
          error: error.message || error.toString(),
        }
      }
    } else if (url) {
      return { url, lastUrl: url }
    }
  },
  data() {
    return {
      title: 'Technology lookup',
      error: false,
      loading: false,
      meta,
      sets,
      attributes: {},
      mdiLayersOutline,
      mdiMagnify,
      mdiCheck,
      mdiClose,
      url: '',
      lastUrl: '',
      signInDialog: false,
      socialBaseUrls: {
        twitter: 'https://www.twitter.com/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        github: 'https://www.github.com/',
        tiktok: 'https://www.tiktok.com/',
        youtube: 'https://www.youtube.com/',
        pinterest: 'https://www.pinterest.com/',
        linkedin: 'https://www.linkedin.com/',
      },
      technologies: [],
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
    seoTitle() {
      const fullUrl = getFullUrl(this.url)

      if (fullUrl) {
        const { hostname } = new URL(fullUrl)

        return `Technologies used on ${hostname.replace(/^www\./, '')}`
      }

      return 'Technology lookup'
    },
    categorised() {
      return Object.values(
        this.technologies.reduce((categories, technology) => {
          technology.categories.forEach((category) => {
            categories[category.slug] = categories[category.slug] || {
              ...category,
              technologies: [],
            }

            categories[category.slug].technologies.push(technology)
          })

          return categories
        }, {})
      )
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        this.technologies = []
        this.attributes = {}

        await this.getCredits()

        if (this.url) {
          this.lastUrl = null

          this.submit()
        }
      }
    },
    url() {
      const fullUrl = getFullUrl(this.url)

      if (fullUrl) {
        const { hostname } = new URL(fullUrl)

        history.pushState({}, null, `/lookup/${hostname.replace(/^www\./, '')}`)
      }
    },
  },
  async mounted() {
    if (this.isSignedIn) {
      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }

    if (this.url && !this.technologies.length) {
      this.$refs.url.search()
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async submit(url = this.url) {
      url = getFullUrl(url) || url

      if (!url || (url === this.lastUrl && this.technologies.length)) {
        return
      }

      this.url = url

      try {
        new URL(url) // eslint-disable-line no-new
      } catch (error) {
        this.error = 'Please enter a valid URL, including http:// or https://'

        return
      }

      this.lastUrl = url

      this.error = false

      if (this.isSignedIn) {
        if (!this.credits) {
          this.error = 'Insufficient credits.'

          return
        }
      }

      this.loading = true
      this.technologies = []
      this.attributes = {}

      let credits

      try {
        if (this.isSignedIn) {
          ;({
            credits,
            technologies: this.technologies,
            attributes: this.attributes,
          } = (
            await this.$axios(`lookup-site/${encodeURIComponent(url)}`)
          ).data)
        } else {
          try {
            ;({
              technologies: this.technologies,
              attributes: this.attributes,
            } = (
              await this.$axios(`lookup-site/public/${encodeURIComponent(url)}`)
            ).data)
          } catch (error) {
            if (error.response && error.response.status === 401) {
              this.signInDialog = true
              this.loading = false

              return
            }

            throw error
          }
        }

        this.$store.commit('credits/set', credits)
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data)) ||
          this.getErrorMessage(error)
      }

      this.loading = false
    },
    getCountry(code) {
      const country = countries.find(
        ({ value }) => value.toUpperCase() === code.toUpperCase()
      )

      return country ? country.text : code
    },
    getRegion(countryCode, regionCode) {
      if (states[countryCode.toUpperCase()]) {
        const region = states[countryCode.toUpperCase()].find(
          ({ value }) => value.toUpperCase() === regionCode.toUpperCase()
        )

        return region ? region.text : regionCode
      }

      return regionCode
    },
    getLanguage(code) {
      for (const name in languages) {
        if (typeof languages[name] === 'string') {
          if (languages[name].toUpperCase() === code.toUpperCase()) {
            return name
          }
        } else {
          for (const variant in languages[name]) {
            if (languages[name][variant].toUpperCase() === code.toUpperCase()) {
              return name === variant ? name : `${name} (${variant})`
            }
          }
        }
      }

      return code
    },
  },
}
</script>
