<template>
  <Page :title="title" :head="meta" no-heading>
    <div class="mt-6 mb-6">
      <v-btn to="/apps/" class="mb-2 mr-2" depressed>
        <v-icon left>
          {{ mdiLaptop }}
        </v-icon>
        Browser extension
      </v-btn>
      <v-btn to="/apps/" class="mb-2 mr-2" depressed>
        <v-icon left>
          {{ mdiFaceAgent }}
        </v-icon>
        CRM integration
      </v-btn>
      <v-btn to="/api/" class="mb-2" depressed>
        <v-icon left>
          {{ mdiConsole }}
        </v-icon>
        API
      </v-btn>
    </div>

    <v-expansion-panels v-model="panels" class="mb-6" accordion>
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-1 font-weight-medium"
          ><span class="d-flex align-center"
            ><v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon> Look
            up a website</span
          ></v-expansion-panel-header
        >
        <v-expansion-panel-content class="pb-2" eager>
          <v-form @submit.prevent="submit">
            <v-text-field
              ref="search"
              v-model="url"
              :loading="loading"
              label="Enter a website address"
              :hint="
                isSignedIn
                  ? `1 Credit per lookup. You have ${formatNumber(
                      credits
                    )} credits.`
                  : ''
              "
              placeholder="Example or example.com"
              background-color="white"
              hide-details="auto"
              :append-icon="mdiMagnify"
              outlined
              @click:append="submit"
            />
          </v-form>

          <v-alert v-if="error" type="info" class="mt-4 mb-0" prominent text>
            {{ error }}
          </v-alert>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-1 font-weight-medium"
          ><span class="d-flex align-center"
            ><v-icon color="primary" left>{{ mdiFileTableOutline }}</v-icon>
            Upload a list of websites</span
          ></v-expansion-panel-header
        >
        <v-expansion-panel-content class="pb-2 body-2" eager>
          <p style="max-width: 600px">
            Supply your own list of websites and we'll report back with the
            technologies they use, as well as any metadata we find. On a
            <v-chip to="/pro/" color="primary" x-small outlined> PRO </v-chip>
            plan, company and contact information is included where available.
          </p>

          <p class="mb-6" style="max-width: 600px">
            The resulting list is in CSV and JSON format (<a
              href="/bulk-sample.zip"
              download
              >sample</a
            >).
          </p>

          <v-card class="mb-4">
            <v-card-title class="subtitle-2"> Upload your list </v-card-title>
            <v-card-text>
              <p class="mb-6">
                Upload a .txt file with up to 100,000 URLs, each on a separate
                line.<br />
              </p>

              <v-alert v-if="error" type="error" class="mb-4" text>
                {{ error }}
              </v-alert>

              <v-file-input
                :error-messages="fileErrors"
                :hint="
                  file ? `${file.split('\n').length.toLocaleString()} URLs` : ''
                "
                persistent-hint
                placeholder="Select a file..."
                accept="text/plain"
                hide-details="auto"
                background-color="white"
                outlined
                @change="fileChange"
              />

              <v-checkbox
                v-model="removeInvalid"
                v-if="removeInvalid || fileErrors.length"
                label="Remove invalid URLs"
                hide-details="auto"
              />
            </v-card-text>
          </v-card>

          <v-expansion-panels class="mb-4">
            <v-expansion-panel ref="compliance">
              <v-expansion-panel-header class="subtitle-2">
                Compliance
                <span class="body-2">
                  <v-chip color="primary" class="ml-2" x-small outlined
                    >PRO</v-chip
                  >
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <Pro class="mx-n6 mb-4" small />

                <v-radio-group
                  v-model="compliance"
                  class="my-0"
                  :disabled="!isPro"
                  mandatory
                >
                  <v-radio
                    value="include"
                    class="mt-0"
                    hide-details
                    :disabled="australia"
                  >
                    <template #label> Include contact details </template>
                  </v-radio>
                  <v-radio
                    value="excludeEU"
                    class="mt-0"
                    hide-details
                    :disabled="!isPro || australia"
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
                  :disabled="!isPro"
                  hide-details
                />

                <v-alert
                  color="secondary"
                  border="left"
                  class="mt-8 mb-2"
                  dense
                >
                  <small>
                    We're unable to supply email addresses and phone numbers if
                    you're in Australia or carry on business or activities in
                    Australia.
                  </small>
                </v-alert>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-card
            v-if="!isPro"
            color="primary lighten-1 primary--text"
            class="mb-4"
            flat
          >
            <v-card-title class="subtitle-2">
              <v-icon color="primary" size="20" left>
                {{ mdiLockOpenVariantOutline }}
              </v-icon>
              Unlock pro features
            </v-card-title>
            <v-card-text class="primary--text pb-0">
              Subscribe to a
              <v-chip to="/pro/" color="primary" x-small outlined> PRO </v-chip>
              plan to include company and contact information in lookups.
            </v-card-text>
            <v-card-actions>
              <v-spacer />

              <v-btn to="/pricing/" color="primary" text>
                Compare plans
                <v-icon right>
                  {{ mdiArrowRight }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-row>
            <v-col>
              <v-btn
                :disabled="!!(!file || fileErrors.length)"
                :loading="ordering"
                color="primary"
                large
                depressed
                @click="submitBulk"
              >
                Get a quote
                <v-icon right>
                  {{ mdiArrowRight }}
                </v-icon>
              </v-btn>
            </v-col>
            <v-col class="flex-shrink-1 flex-grow-0">
              <v-btn
                color="primary primary--text lighten-1"
                depressed
                large
                @click="$refs.pricingDialog.open()"
              >
                <v-icon left>
                  {{ mdiCalculator }}
                </v-icon>
                Pricing
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signInDialog"
      max-width="400px"
    >
      <SignIn mode-sign-up mode-continue />
    </v-dialog>

    <PricingDialog ref="pricingDialog" product="bulk" />

    <template #footer>
      <Logos />
    </template>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiLayersOutline,
  mdiMagnify,
  mdiFileTableOutline,
  mdiCalculator,
  mdiArrowRight,
  mdiLockOpenVariantOutline,
  mdiLaptop,
  mdiConsole,
  mdiFaceAgent,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import SignIn from '~/components/SignIn.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import Logos from '~/components/Logos.vue'
import { lookup as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'

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
    TechnologyIcon,
    SignIn,
    PricingDialog,
    Logos,
  },
  data() {
    return {
      title: 'Technology lookup',
      australia: false,
      compliance: 'include',
      error: false,
      file: '',
      fileErrors: [],
      inputFile: null,
      loading: false,
      removeInvalid: false,
      meta,
      mdiLayersOutline,
      mdiFileTableOutline,
      mdiMagnify,
      mdiCalculator,
      mdiArrowRight,
      mdiLockOpenVariantOutline,
      mdiLaptop,
      mdiConsole,
      mdiFaceAgent,
      order: false,
      ordering: false,
      url: '',
      signInDialog: false,
      sets,
      panels: 0,
      technologies: [],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user, credits }) =>
        user.loading || (user.signingIn && credits.loading),
      isPro: ({ credits }) => credits.pro,
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        if (this.user?.billingCountry?.toLowerCase() === 'au') {
          this.australia = true
        }

        this.signInDialog = false

        await this.getCredits()

        if (this.tab === 0 && this.url) {
          this.lastUrl = null

          this.submit()
        }

        if (this.tab === 1 && this.ordering) {
          this.submitBulk()
        }

        this.compliance = this.isPro && !this.australia ? 'include' : 'exclude'
      }
    },
    isLoading() {
      if (!this.isLoading) {
        this.compliance = this.isPro && !this.australia ? 'include' : 'exclude'
      }
    },
    panels(index) {
      this.error = false

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
    removeInvalid() {
      this.fileChange()
    },
  },
  async mounted() {
    if (this.$route.hash === '#bulk') {
      this.panels = 1
    }

    if (this.isSignedIn) {
      if (this.user?.billingCountry?.toLowerCase() === 'au') {
        this.australia = true
      }

      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }

    if (!this.isLoading) {
      if (!this.isLoading) {
        this.compliance = this.isPro && !this.australia ? 'include' : 'exclude'
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
    async submit() {
      const url = getFullUrl(this.url) || this.url

      if (!url) {
        return
      }

      try {
        const { hostname } = new URL(url) // eslint-disable-line no-new

        if (
          /^(?:[\d.]+|(?:[a-f0-9:]+:+)+[a-f0-9]+|localhost)$/.test(hostname)
        ) {
          throw new Error('Invalid URL')
        }

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
        this.error = 'Please enter a valid website address, e.g. example.com.'

        return
      }

      this.error = false

      if (this.isSignedIn) {
        if (!this.credits) {
          this.error = 'Insufficient credits.'

          return
        }
      }

      this.$refs.search.blur()

      this.loading = true

      this.$router.push(`/lookup/${encodeURIComponent(url)}`)
    },
    async submitBulk() {
      this.ordering = true

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      try {
        const { id } = (
          await this.$axios.put('orders', {
            product: 'Technology lookup',
            bulk: {
              input: this.file,
              sets: this.sets
                .filter(({ disabled, value }) => value && !disabled)
                .map(({ key }) => key),
              compliance: this.compliance,
            },
          })
        ).data

        this.$router.push(`/orders/${id}`)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.ordering = false
    },

    async fileChange(file = this.inputFile) {
      this.inputFile = file

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
            if (this.removeInvalid) {
              return null
            } else {
              this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
            }
          }

          return url
        })
        .filter((line) => line)

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 100000) {
        this.fileErrors.push('Limit of 100,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
  },
}
</script>
