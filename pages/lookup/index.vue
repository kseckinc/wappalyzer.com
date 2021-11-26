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
            <v-card-title class="subtitle-2">Upload your list</v-card-title>
            <v-card-text>
              <p class="mb-6">
                Upload a CSV or TXT file with up to
                {{ live ? '10,000' : '100,000' }} URLs, each on a separate
                line.<br />
              </p>

              <v-alert v-if="error" type="error" class="mb-4" text>
                {{ error }}
              </v-alert>

              <v-file-input
                persistent-hint
                placeholder="Select a file..."
                accept="text/plain,text/csv"
                hide-details="auto"
                background-color="white"
                outlined
                @change="fileChange"
              />

              <v-radio-group v-model="live" hide-details mandatory>
                <v-radio
                  label="Include cached results where possible (recommended)"
                  :value="false"
                />
                <v-radio label="Live results only" :value="true" />
              </v-radio-group>

              <v-alert color="secondary" border="left" class="mt-6 mb-2" dense>
                <small>
                  Cached results have been verified within the last 30 days, are
                  more complete and have a high success rate. Live results are
                  more up-to-date but cost more (2 credits instead of 1).
                </small>
              </v-alert>
            </v-card-text>
            <template v-if="inputFile">
              <v-divider />

              <v-card-title class="subtitle-2">Preview</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-select
                      v-model="csvHeader"
                      label="Header row"
                      :items="csvHeaders"
                      hide-details
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="csvDelimiter"
                      label="Delimiter"
                      :items="csvDelimiters"
                      hide-details
                      outlined
                      dense
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="csvTextQualifier"
                      label="Text qualifier"
                      :items="csvTextQualifiers"
                      hide-details
                      outlined
                      dense
                    />
                  </v-col>
                </v-row>

                <v-select
                  v-model="csvUrlColumn"
                  label="Website URL column"
                  class="mt-4"
                  :items="csvColumns"
                  hide-details
                  outlined
                  dense
                />
              </v-card-text>
              <v-card-text class="pa-0" v-if="inputFile">
                <template v-if="preview.length">
                  <v-divider />

                  <v-simple-table dense>
                    <tbody>
                      <tr>
                        <th width="1"></th>
                        <th v-for="column in preview[0]" class="pl-0">
                          <div class="d-flex align-center">
                            <v-divider
                              class="mr-4"
                              style="height: 1.7rem"
                              vertical
                            />

                            <small>
                              {{ column }}
                            </small>
                          </div>
                        </th>
                      </tr>
                      <tr
                        v-for="(columns, index) in preview.slice(1, 11)"
                        :key="index"
                      >
                        <th>
                          <small>
                            {{ index + 1 }}
                          </small>
                        </th>
                        <td
                          v-for="(key, index) in preview[0]"
                          class="pl-0"
                          :style="
                            csvUrlColumn === index
                              ? 'background-color: #f0ebf9;'
                              : ''
                          "
                          :key="key"
                        >
                          <div class="d-flex align-center">
                            <v-divider
                              class="mr-4"
                              style="height: 1.7rem"
                              vertical
                            />

                            <small
                              style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 200px;
                              "
                            >
                              {{ columns[csvHeader ? key : index] }}
                            </small>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </template>
                <v-alert v-else color="accent" class="mx-4 mb-4" text>
                  Preview not available.
                </v-alert>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Validation</v-card-title>
              <v-card-text>
                <v-alert
                  v-if="previewError || fileErrors.length"
                  type="error"
                  class="mb-0"
                  prominent
                  text
                >
                  <div class="subtitle-2 mb-2">
                    Sorry, something doesn't seem right
                  </div>

                  <p class="mb-2">
                    Please ensure the file is formatted correctly and you have
                    selected the right options.
                  </p>

                  <small v-if="previewError">
                    {{ previewError }}
                  </small>
                  <template v-else>
                    <div v-for="error in fileErrors">
                      <small>
                        {{ error }}
                      </small>
                    </div>
                  </template>
                </v-alert>

                <v-alert v-else type="success" class="mb-0" prominent text>
                  <div class="subtitle-2 mb-2">Looks good!</div>

                  <p class="mb-2">
                    We found
                    {{ file.split('\n').length.toLocaleString() }}
                    URLs.
                  </p>

                  Before you continue, please ensure the preview looks correct
                  and the column containing URLs is highlighted in purple.
                </v-alert>

                <v-checkbox
                  v-model="removeInvalid"
                  v-if="removeInvalid || fileErrors.length"
                  label="Remove invalid URLs"
                  hide-details="auto"
                />
              </v-card-text>
            </template>
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

    <PricingDialog ref="pricingDialog" product="lookup" />

    <template #footer>
      <Logos />
    </template>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import parse from 'csv-parse/lib/sync'
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
import Pro from '~/components/Pro.vue'
import { lookup as meta } from '~/assets/json/meta.json'

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
    Pro,
  },
  data() {
    return {
      title: 'Technology lookup',
      australia: false,
      compliance: 'include',
      error: false,
      file: '',
      fileErrors: [],
      live: false,
      previewError: false,
      csvHeader: false,
      csvHeaders: [
        { text: 'None', value: false },
        { text: 'First line', value: true },
      ],
      csvDelimiter: ',',
      csvDelimiters: [
        { text: 'Comma', value: ',' },
        { text: 'Tab', value: '\t' },
        { text: 'Space', value: ' ' },
      ],
      csvUrlColumn: 0,
      csvTextQualifier: '"',
      csvTextQualifiers: [
        { text: 'Double quote', value: '"' },
        { text: 'Single quote', value: "'" },
        { text: 'None', value: '' },
      ],
      inputFile: '',
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
    preview() {
      try {
        const csv = parse(this.inputFile.split('\n').slice(0, 11).join('\n'), {
          columns: this.csvHeader,
          delimiter: this.csvDelimiter,
          quote: this.csvTextQualifier,
        })

        this.previewError = false

        const header = csv.length
          ? this.csvHeader
            ? Object.keys(csv[0])
            : Object.keys(csv[0]).length === 1
            ? ['URL']
            : Object.keys(csv[0]).map(
                (index) =>
                  (Math.ceil((index + 1) / 26) > 1
                    ? String.fromCharCode(
                        63 + (Math.ceil((index + 1) / 26) % 26)
                      )
                    : '') + String.fromCharCode(65 + (index % 26))
              )
          : []

        return [header, ...csv]
      } catch (error) {
        console.log(error)

        this.previewError = this.getErrorMessage(error)
      }

      return []
    },
    csvColumns() {
      return this.preview.length
        ? this.preview[0].map((text, value) => ({
            text,
            value,
          }))
        : []
    },
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
    csvHeader() {
      const csvUrlColumn =
        this.csvHeader && this.preview.length ? this.preview[0][0] : 0

      if (csvUrlColumn !== this.csvUrlColumn) {
        this.autoSetCsvUrlColum()
      }

      this.fileChange()
    },
    csvDelimiter() {
      this.fileChange()
    },
    csvTextQualifier() {
      this.fileChange()
    },
    csvUrlColumn() {
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

        if (this.hostnameBlacklisted(hostname)) {
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
              live: this.live,
              columns: this.csvColumns.map(({ text }) => text),
              header: this.csvHeader,
              delimiter: this.csvDelimiter,
              textQualifier: this.csvTextQualifier,
              urlColumn: this.csvUrlColumn,
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
      if (!file) {
        this.inputFile = ''

        return
      }

      if (file !== this.inputFile) {
        this.inputFile = file ? await file.text() : ''

        const header = this.inputFile.split('\n')[0]

        this.csvHeader = file.type === 'text/csv' && !/\bhttps?:/.test(header)
        this.csvDelimiter = header.includes('\t') ? '\t' : ','

        this.autoSetCsvUrlColum()
      }

      this.file = this.inputFile.split('\n')
      this.fileErrors = []

      if (!this.inputFile) {
        return
      }

      try {
        const csv = parse(this.inputFile.split('\n').slice(0, 11).join('\n'), {
          columns: this.csvHeader,
          delimiter: this.csvDelimiter,
          quote: this.csvTextQualifier,
        })

        const urls = csv.map(
          (row) => (row && Object.values(row)[this.csvUrlColumn]) || ''
        )

        for (let index = urls.length - 1; index >= 0; index--) {
          const url = !/^https?:\/\//.test(urls[index].trim())
            ? `http://${urls[index].trim()}`
            : urls[index].trim()

          try {
            if (!url.includes('.')) {
              throw new Error('Invalid URL')
            }

            new URL(url) // eslint-disable-line no-new
          } catch (error) {
            if (this.removeInvalid) {
              this.file.splice(index, 1)
            } else {
              this.fileErrors.push(
                `Invalid URL on line ${index + 1}: ${urls[index]}`
              )
            }
          }
        }

        if (urls.length > (this.live ? 10000 : 100000)) {
          this.fileErrors.push(
            `Limit of (${this.live ? '10,000' : '100,000'}) URLs exceeded`
          )
        }
      } catch (error) {
        console.log(error)

        this.fileErrors = [this.getErrorMessage(error)]
      }

      this.fileErrors = this.fileErrors.slice(-5).reverse()

      this.file = this.file.filter((line) => line)

      if (
        !this.fileErrors.length && this.file.length <= this.csvHeader ? 1 : 0
      ) {
        this.fileErrors = ['No valid URLs found.']
      }

      if (this.csvHeader) {
        this.file.shift()
      }

      this.file = this.file.join('\n').trim()
    },
    autoSetCsvUrlColum() {
      this.csvUrlColumn =
        this.csvHeader && this.preview.length
          ? Math.max(
              0,
              this.preview[0].findIndex(
                (key) =>
                  key.toLowerCase().includes('url') ||
                  key.toLowerCase().includes('website') ||
                  key.toLowerCase().includes('hostname') ||
                  key.toLowerCase().includes('domain')
              )
            )
          : Math.max(
              0,
              (this.preview[1] || []).findIndex(
                (value) =>
                  value.toLowerCase().includes('http') ||
                  value.toLowerCase().includes('www') ||
                  value.toLowerCase().includes('.')
              )
            )
    },
  },
}
</script>
