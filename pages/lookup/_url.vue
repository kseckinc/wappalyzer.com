<template>
  <Page :title="title" :seo-title="seoTitle" :head="meta" no-heading>
    <v-card class="mt-8 mb-4">
      <v-tabs
        v-model="tab"
        slider-color="primary"
        background-color="secondary"
        active-class="primary--text"
      >
        <v-tab><small>Single website</small></v-tab>
        <v-tab><small>Multiple websites</small></v-tab>
      </v-tabs>

      <v-divider />

      <v-tabs-items v-model="tab">
        <v-tab-item active-class="secondary">
          <v-card-title>
            <v-row align="center">
              <v-col cols="12" sm="4" class="pb-0">
                <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
                Lookup
              </v-col>
              <v-col cols="12" sm="8" class="pb-0">
                <Credits />
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <Url ref="url" :url="url" class="mt-4" @change="submit" />

            <v-alert v-if="error" color="info" class="mt-4 mb-0" outlined>
              {{ error }}
            </v-alert>

            <v-card v-if="loading" class="mt-4">
              <v-card-text class="d-flex justify-center">
                <Progress />
              </v-card-text>
            </v-card>

            <v-expansion-panels
              v-if="
                !loading && (Object.keys(attributes).length || keywords.length)
              "
              class="mt-4"
            >
              <Attributes
                v-if="Object.keys(attributes).length"
                :hostname="attributes"
                :limited="!isSignedIn"
                @signIn="signInDialog = true"
              />

              <v-expansion-panel v-if="keywords && keywords.length" flat>
                <v-expansion-panel-header
                  class="subtitle-2"
                  style="line-height: 1em"
                >
                  Keywords
                  <span>
                    <v-chip class="ml-2 text--disabled" small outlined>{{
                      keywords.length
                    }}</v-chip>
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group column>
                    <v-chip
                      v-for="keyword in keywords"
                      :key="keyword"
                      :to="`/websites/${keyword}/`"
                      color="accent"
                      small
                      outlined
                      label
                    >
                      {{ keyword }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-card v-if="!loading && technologies.length" class="mt-4">
              <v-card-title class="subtitle-2" style="line-height: 1em">
                Technologies
                <span>
                  <v-chip class="ml-2 text--disabled" small outlined>{{
                    technologies.length
                  }}</v-chip>
                </span>
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
                          class="text--disabled"
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
        </v-tab-item>

        <v-tab-item active-class="secondary">
          <v-card-title>
            <v-row align="center">
              <v-col class="pb-0 flex-grow-1 flex-shrink-0">
                <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
                Bulk lookup
              </v-col>
              <v-col class="pb-0 flex-grow-0 flex-shrink-1">
                <v-btn
                  color="primary"
                  outlined
                  small
                  @click="$refs.pricingDialog.open()"
                >
                  <v-icon left>{{ mdiCalculator }}</v-icon>
                  Pricing
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-6" style="max-width: 600px">
              Supply your own list of websites and we'll report back with the
              technologies they use, as well as any contact details and meta
              data we find. The resulting list is in CSV and JSON format (<a
                href="/bulk-sample.zip"
                download
                >sample</a
              >).
            </p>

            <v-card class="mb-4">
              <v-card-title class="subtitle-2"
                >Upload a list of websites</v-card-title
              >
              <v-card-text>
                <p class="mb-2">
                  Upload a .txt file with up to 100,000 URLs, each on a separate
                  line.<br />
                </p>

                <v-file-input
                  :error-messages="fileErrors"
                  placeholder="Select a file..."
                  accept="text/plain"
                  hide-details="auto"
                  class="mb-4"
                  background-color="white"
                  @change="fileChange"
                />
              </v-card-text>
            </v-card>

            <v-expansion-panels class="mb-4">
              <v-expansion-panel ref="compliance">
                <v-expansion-panel-header class="subtitle-2">
                  Compliance
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-radio-group v-model="compliance" class="my-0" mandatory>
                    <v-radio
                      value="include"
                      class="mt-0"
                      hide-details
                      :disabled="australia"
                    >
                      <template #label>Include contact details</template>
                    </v-radio>
                    <v-radio
                      value="excludeEU"
                      class="mt-0"
                      hide-details
                      :disabled="australia"
                    >
                      <template #label>
                        Exclude contact details of EU websites
                      </template>
                    </v-radio>
                    <v-radio value="exclude" class="mt-0" hide-details>
                      <template #label> Exclude all contact details </template>
                    </v-radio>
                  </v-radio-group>

                  <v-checkbox
                    v-model="australia"
                    label="I'm in or do business in Australia"
                    class="mt-0"
                    hide-details
                  />

                  <v-alert
                    color="secondary"
                    border="left"
                    class="mt-8 mb-2"
                    dense
                  >
                    <small>
                      We're unable to supply email addresses and phone numbers
                      if you're in Australia or carry on business or activities
                      in Australia.
                    </small>
                  </v-alert>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-btn
              :disabled="!!(!file || fileErrors.length)"
              color="primary"
              large
              @click="submitBulk"
              >Get a quote <v-icon right>{{ mdiArrowRight }}</v-icon>
            </v-btn>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <p class="text--disabled">
      <small>
        Get the free
        <nuxt-link to="/apps/">browser extension</nuxt-link> to see the
        technologies on websites you visit.<br />
        Automate lookups with the
        <nuxt-link to="/api/">Lookup API</nuxt-link> or
        <nuxt-link to="/apps/">CRM integrations</nuxt-link>.
      </small>
    </p>

    <v-dialog v-if="!isLoading" v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up mode-continue />
    </v-dialog>

    <OrderDialog
      :id="order ? order.id : null"
      ref="orderDialog"
      :error="orderError"
      @close="orderDialog = false"
    />

    <PricingDialog ref="pricingDialog" product="bulk" />
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiLayersOutline,
  mdiMagnify,
  mdiCheck,
  mdiClose,
  mdiCalculator,
  mdiArrowRight,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Credits from '~/components/Credits.vue'
import Url from '~/components/Url.vue'
import Attributes from '~/components/Attributes.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import PricingDialog from '~/components/PricingDialog.vue'
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
    OrderDialog,
    PricingDialog,
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
        const { technologies, attributes, keywords } = (
          await $axios.get(
            `lookup-site${isSignedIn ? '' : '/public'}/${encodeURIComponent(
              fullUrl
            )}`
          )
        ).data
        return {
          url: fullUrl,
          lastUrl: fullUrl,
          technologies,
          attributes,
          keywords,
        }
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
      australia: false,
      compliance: 'include',
      error: false,
      file: '',
      fileErrors: [],
      loading: false,
      meta,
      sets,
      attributes: {},
      keywords: [],
      mdiLayersOutline,
      mdiMagnify,
      mdiCheck,
      mdiClose,
      mdiCalculator,
      mdiArrowRight,
      order: false,
      orderError: '',
      ordering: false,
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
      tab: null,
      technologies: [],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user }) => user.loading,
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
        if (this.user && this.user.billingCountry.toLowerCase() === 'au') {
          this.australia = true
        }

        this.signInDialog = false

        this.technologies = []
        this.attributes = {}
        this.keywords = []

        await this.getCredits()

        if (this.tab === 0 && this.url) {
          this.lastUrl = null

          this.submit()
        }

        if (this.tab === 1 && this.ordering) {
          this.submitBulk()
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
    tab(index) {
      if (index === 1) {
        if (this.$route.hash !== '#bulk') {
          this.$router.replace({ path: '/lookup/', hash: '#bulk' })
        }
      } else if (this.$route.hash === '#bulk') {
        this.$router.replace({ path: '/lookup/' })
      }
    },
    australia() {
      if (this.australia) {
        this.compliance = 'exclude'
      }
    },
  },
  created() {
    if (this.$route.hash === '#bulk') {
      this.tab = 1
    }
  },
  async mounted() {
    if (this.isSignedIn) {
      if (this.user && this.user.billingCountry.toLowerCase() === 'au') {
        this.australia = true
      }

      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }

    if (this.url && this.$refs.url && !this.technologies.length) {
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
        const { hostname } = new URL(url) // eslint-disable-line no-new

        if (
          [
            'wappalyzer',
            'google',
            'facebook',
            'twitter',
            'reddit',
            'yahoo',
            'wikipedia',
            'amazon',
            'youtube',
          ].some((ignore) => hostname.includes(ignore))
        ) {
          this.error =
            'This website is excluded from lookups for technical reasons. Please use our free browser extension instead.'

          return
        }
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
      this.keywords = []

      let credits

      try {
        if (this.isSignedIn) {
          ;({
            credits,
            technologies: this.technologies,
            attributes: this.attributes,
            keywords: this.keywords,
          } = (
            await this.$axios(`lookup-site/${encodeURIComponent(url)}`)
          ).data)
        } else {
          try {
            ;({
              technologies: this.technologies,
              attributes: this.attributes,
              keywords: this.keywords,
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

        this.$store.commit('credits/setCredits', credits)
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
    async submitBulk() {
      this.orderError = ''
      this.ordering = true

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.$refs.orderDialog.open()

      try {
        this.order = (
          await this.$axios.put('orders', {
            product: 'Bulk lookup',
            bulk: {
              input: this.file,
              sets: this.sets
                .filter(({ disabled, value }) => value && !disabled)
                .map(({ key }) => key),
              compliance: this.compliance,
            },
          })
        ).data
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }

      this.ordering = false
    },

    async fileChange(file) {
      this.file = ''
      this.fileErrors = []

      if (!file) {
        return
      }

      this.file = (await file.text())
        .trim()
        .split(/[\r\n]/)
        .filter((line) => line)
        .map((line, i) => {
          const url = !/^https?:\/\//.test(line.trim())
            ? `http://${line.trim()}`
            : line.trim()

          try {
            new URL(url) // eslint-disable-line no-new
          } catch (error) {
            this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
          }

          return url
        })

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 100000) {
        this.fileErrors.push('Limit of 100,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
  },
}
</script>
