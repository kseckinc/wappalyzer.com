<template>
  <Page :title="title" :seo-title="seoTitle" :head="meta" no-heading>
    <v-card class="mt-8 mb-4">
      <v-tabs
        v-model="tab"
        slider-color="primary"
        background-color="secondary"
        active-class="primary--text"
      >
        <v-tab><small>Single email</small></v-tab>
        <v-tab><small>Multiple emails</small></v-tab>
      </v-tabs>

      <v-divider />

      <v-tabs-items v-model="tab">
        <v-tab-item eager>
          <v-card-title class="mb-4">
            <v-row align="center">
              <v-col cols="12" sm="4" class="pb-0">
                <div class="d-flex align-center">
                  <v-icon color="primary" left>
                    {{ mdiEmailCheckOutline }}
                  </v-icon>
                  Verify
                </div>
              </v-col>
              <v-col cols="12" sm="8" class="pb-0">
                <Credits />
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" @submit.prevent="submit()">
              <v-text-field
                ref="email"
                v-model="email"
                label="Email address"
                placeholder="info@example.com"
                background-color="white"
                :hint="isSignedIn ? 'Spend 1 credit.' : ''"
                :append-icon="mdiMagnify"
                required
                outlined
                hide-details="auto"
                @click:append="submit()"
              />
            </v-form>

            <v-alert v-if="error" color="error" class="mt-4 mb-0" text>
              {{ error }}
            </v-alert>

            <v-card v-if="loading" class="mt-4" flat>
              <v-card-text class="d-flex justify-center pa-12">
                <v-progress-circular
                  :size="100"
                  color="primary"
                  width="5"
                  style="opacity: 0.2"
                  indeterminate
                ></v-progress-circular>
              </v-card-text>
            </v-card>

            <template v-else-if="Object.keys(verifiedEmail).length">
              <div class="my-4">
                <v-alert
                  v-if="verifiedEmail.reachable === 'safe'"
                  type="success"
                  border="left"
                  outlined
                  prominent
                >
                  <div class="subtitle-2 mb-2">Looks safe!</div>

                  Emails to this address are deliverable and unlikely to bounce.
                </v-alert>
                <v-alert
                  v-else-if="verifiedEmail.reachable === 'risky'"
                  type="warning"
                  border="left"
                  outlined
                  prominent
                  :icon="mdiAlertOutline"
                >
                  <div class="subtitle-2 mb-2">Looks risky!</div>

                  Emails to this address are deliverable but more likely to
                  bounce.
                </v-alert>
                <v-alert
                  v-else-if="verifiedEmail.reachable === 'invalid'"
                  type="error"
                  border="left"
                  outlined
                  prominent
                  :icon="mdiAlertOctagonOutline"
                >
                  <div class="subtitle-2 mb-2">Not safe</div>

                  Emails to this address are undeliverable.
                </v-alert>
                <v-alert v-else type="error" :icon="mdiAlertOctagonOutline">
                  <div class="subtitle-2 mb-2">Not safe</div>

                  Some checks failed to complete.
                </v-alert>
              </div>

              <v-card class="my-4">
                <v-card-title class="subtitle-2">Checks</v-card-title>
                <v-card-text class="pt-0 px-0">
                  <v-simple-table>
                    <tbody>
                      <tr v-for="key in Object.keys(keys)" :key="key">
                        <td>
                          {{ keys[key].text }}

                          <v-tooltip
                            v-if="keys[key].info"
                            max-width="300"
                            right
                          >
                            <template #activator="{ on }">
                              <sup>
                                <v-icon small v-on="on">{{
                                  mdiHelpCircleOutline
                                }}</v-icon>
                              </sup>
                            </template>

                            {{ keys[key].info }}
                          </v-tooltip>
                        </td>
                        <td
                          v-if="
                            [
                              'disposable',
                              'roleAccount',
                              'inboxFull',
                              'catchAll',
                              'disabled',
                            ].includes(key)
                          "
                          class="text-right"
                        >
                          <v-chip
                            v-if="verifiedEmail[key]"
                            :color="
                              ['roleAccount', 'catchAll'].includes(key)
                                ? 'warning'
                                : 'error'
                            "
                            small
                            label
                            outlined
                          >
                            <v-icon left>{{ mdiAlertOutline }}</v-icon>
                            Yes
                          </v-chip>
                          <v-chip v-else color="success" small label outlined>
                            <v-icon left>{{ mdiCheck }}</v-icon>
                            No</v-chip
                          >
                        </td>
                        <td v-else class="text-right">
                          <v-chip
                            v-if="verifiedEmail[key]"
                            color="success"
                            small
                            label
                            outlined
                          >
                            <v-icon left>{{ mdiCheck }}</v-icon>
                            Yes
                          </v-chip>
                          <v-chip v-else color="error" small label outlined>
                            <v-icon left>{{ mdiClose }}</v-icon>
                            No
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>

              <div class="d-flex">
                <v-spacer />
                <v-btn :to="`/lookup/${verifiedEmail.domain}`" depressed>
                  <v-icon left>{{ mdiLayersOutline }}</v-icon>
                  Technology lookup ({{ verifiedEmail.domain }})
                </v-btn>
              </div>
            </template>
          </v-card-text>
        </v-tab-item>

        <v-tab-item eager>
          <v-card-title>
            <v-row align="center">
              <v-col class="pb-0 flex-grow-1 flex-shrink-0">
                <div class="d-flex align-center">
                  <v-icon color="primary" left>
                    {{ mdiEmailMultipleOutline }}
                  </v-icon>
                  Bulk verify
                </div>
              </v-col>
              <v-col class="pb-0 flex-grow-0 flex-shrink-1">
                <v-btn
                  color="primary primary--text lighten-1"
                  depressed
                  small
                  @click="$refs.pricingDialog.open()"
                >
                  <v-icon left>
                    {{ mdiCalculator }}
                  </v-icon>
                  Pricing
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="pt-4">
            <p style="max-width: 600px">
              Upload a list of email addresses and we'll create an up-to-date
              report detailing the validity and deliverability of each address.
            </p>

            <p class="mb-6" style="max-width: 600px">
              The resulting list is in CSV format (<a
                href="/bulk-verify-sample.zip"
                download
                >sample</a
              >).
            </p>

            <v-card class="mb-4">
              <v-card-title class="subtitle-2"> Upload your list </v-card-title>
              <v-card-text>
                <p class="mb-2">
                  Upload a .txt file with up to 100,000 email addresses, each on
                  a separate line.
                </p>

                <v-file-input
                  ref="file"
                  :error-messages="fileErrors"
                  :hint="
                    file
                      ? `${file
                          .split('\n')
                          .length.toLocaleString()} email addresses`
                      : ''
                  "
                  persistent-hint
                  placeholder="Select a file..."
                  accept="text/plain"
                  hide-details="auto"
                  class="mb-4"
                  background-color="white"
                  @change="fileChange"
                />

                <v-checkbox
                  v-model="removeInvalid"
                  v-if="removeInvalid || fileErrors.length"
                  label="Remove invalid email addresses"
                  hide-details="auto"
                />
              </v-card-text>
            </v-card>

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
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <p class="text--disabled">
      <small>
        Automate email verifications with the
        <nuxt-link to="/api/">Verify API</nuxt-link>.
      </small>
    </p>

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signInDialog"
      max-width="400px"
    >
      <SignIn mode-sign-up mode-continue />
    </v-dialog>

    <PricingDialog ref="pricingDialog" product="verify" />
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiEmailCheckOutline,
  mdiEmailMultipleOutline,
  mdiMagnify,
  mdiCalculator,
  mdiArrowRight,
  mdiAlertOutline,
  mdiAlertOctagonOutline,
  mdiLayersOutline,
  mdiHelpCircleOutline,
  mdiCheck,
  mdiClose,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Credits from '~/components/Credits.vue'
import SignIn from '~/components/SignIn.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import { verify as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Credits,
    SignIn,
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
  }) {
    const { email } = route.params

    if (email) {
      try {
        const { verifiedEmail } = (
          await $axios.get(`verify-site${isSignedIn ? '' : '/public'}/${email}`)
        ).data

        return {
          email,
          lastEmail: email,
          verifiedEmail,
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return { email, lastEmail: email, signInDialog: true }
        }

        return {
          email,
          lastEmail: email,
          error: error.message || error.toString(),
        }
      }
    }
  },
  data() {
    return {
      title: 'Email verification',
      error: false,
      file: '',
      fileErrors: [],
      inputFile: null,
      loading: false,
      removeInvalid: false,
      keys: {
        connection: {
          text: 'Mail server found',
          info: "A connection with the email domain's mail server has been established.",
        },
        deliverable: {
          text: 'Inbox accepts email',
          info: 'The email address exists and is open to receive email.',
        },
        inboxFull: {
          text: 'Inbox is full',
          info: 'The email address exists but the inbox is full and unable to receive email.',
        },
        disabled: {
          text: 'Inbox is turned off',
          info: 'The email address exists but the inbox has been disabled by the provider.',
        },
        roleAccount: {
          text: 'Role account',
          info: 'The email address is likely associated with a team or company, rather than a person.',
        },
        catchAll: {
          text: 'Catch-all email address',
          info: 'Emails to this address are delivered to a catch-all inbox.',
        },
        disposable: {
          text: 'Disposable email address',
          info: 'The email address is registered with known throw-away email address provider.',
        },
        mxValid: {
          text: 'MX DNS records configured',
          info: 'DNS records for the email domain have been set up correctly.',
        },
      },
      meta,
      verifiedEmail: {},
      mdiEmailCheckOutline,
      mdiEmailMultipleOutline,
      mdiMagnify,
      mdiCalculator,
      mdiArrowRight,
      mdiAlertOutline,
      mdiAlertOctagonOutline,
      mdiLayersOutline,
      mdiHelpCircleOutline,
      mdiCheck,
      mdiClose,
      ordering: false,
      email: '',
      lastEmail: '',
      signInDialog: false,
      tab: null,
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
    seoTitle() {
      if (this.email) {
        return `Is ${this.lastEmail} a valid email address?`
      }

      return 'Email verification'
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        this.verifiedEmail = {}

        await this.getCredits()

        if (this.tab === 0 && this.email) {
          this.lastEmail = null

          this.submit()
        }

        if (this.tab === 1 && this.ordering) {
          this.submitBulk()
        }
      }
    },
    tab(index) {
      if (index === 1) {
        if (this.$route.hash !== '#bulk') {
          this.$router.replace({ path: '/verify/', hash: '#bulk' })
        }
      } else if (this.$route.hash === '#bulk') {
        this.$router.replace({ path: '/verify/' })
      }
    },
    removeInvalid() {
      this.fileChange()
    },
  },
  async mounted() {
    if (this.$route.hash === '#bulk') {
      this.tab = 1
    }

    if (this.isSignedIn) {
      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async submit(email = this.email) {
      this.verifiedEmail = {}

      if (
        !email ||
        (email === this.lastEmail && Object.keys(this.verifiedEmail).length)
      ) {
        return
      }

      if (!email.includes('@')) {
        this.error = 'Please enter a valid email address'

        return
      }

      history.pushState({}, null, `/verify/${email}`)

      this.lastEmail = email

      this.error = false

      if (this.isSignedIn) {
        if (!this.credits) {
          this.error = 'Insufficient credits.'

          return
        }
      }

      this.loading = true

      let credits

      try {
        if (this.isSignedIn) {
          ;({ credits, verifiedEmail: this.verifiedEmail } = (
            await this.$axios(`verify-site/${encodeURIComponent(email)}`)
          ).data)
        } else {
          try {
            ;({ verifiedEmail: this.verifiedEmail } = (
              await this.$axios(
                `verify-site/public/${encodeURIComponent(email)}`
              )
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

      this.verifiedEmail = this.verifiedEmail || {}

      this.loading = false
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
            product: 'Email verification',
            bulk: {
              input: this.file,
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
          const email = line.trim()

          const domain = `http://${email.split('@').pop()}`

          try {
            new URL(domain) // eslint-disable-line no-new
          } catch (error) {
            if (this.removeInvalid) {
              return null
            } else {
              this.fileErrors.push(
                `Invalid email address on line ${i + 1}: ${line}`
              )
            }
          }

          return email
        })
        .filter((line) => line)

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 100000) {
        this.fileErrors.push('Limit of 100,000 email addresses exceeded')
      }

      this.file = this.file.join('\n')
    },
  },
}
</script>
