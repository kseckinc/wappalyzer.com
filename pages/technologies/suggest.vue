<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Technologies', to: '/technologies/' }]"
    narrow
  >
    <div class="mt-4 mb-8">
      <p>Thanks for taking the time to suggest a new technology.</p>

      <p>
        Please fill out the form as much or as little as you want. The more
        information you provide, the easier it for us and the more likely we'll
        include the technology.
      </p>
    </div>

    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-card class="mb-4">
      <v-form ref="form" v-model="criteria">
        <v-card-title class="subtitle-2">Criteria</v-card-title>
        <v-card-text>
          <p>The technology&hellip;</p>

          <v-checkbox
            v-model="web"
            hide-details="auto"
            required
            :rules="[
              (v) =>
                !!v || 'Requirement must be met to be considered for inclusion',
            ]"
          >
            <template #label>
              Is web based (identifyable on public-facing websites)
              <v-tooltip max-width="400" top>
                <template #activator="{ on }">
                  <sup>
                    <v-icon small right v-on="on">{{
                      mdiHelpCircleOutline
                    }}</v-icon>
                  </sup>
                </template>

                We only track web technologies. We have no insight into internal
                tools such as HR or accounting software.
              </v-tooltip>
            </template>
          </v-checkbox>
          <v-checkbox
            v-model="userbase"
            label="Has an established userbase of at least 1,000 users"
            hide-details="auto"
            required
            :rules="[
              (v) =>
                !!v || 'Requirement must be met to be considered for inclusion',
            ]"
          />
        </v-card-text>
      </v-form>

      <v-divider />

      <v-form :disabled="!criteria">
        <v-card-title class="subtitle-2">Basic information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.technology"
                label="Technology name"
                placeholder="E.g. Shopify"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="form.category"
                label="Category"
                :items="[
                  { value: '', text: 'Other / not sure' },
                  ...categories,
                ]"
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="form.description"
            label="Description"
            rows="2"
            hint="A short description of the technology in a neutral, factual tone (avoid adjectives)."
            counter="250"
            placeholder="E.g. Shopify is a subscription-based software that allows anyone to set up an online store and sell their products."
          />

          <v-text-field
            v-model="form.website"
            label="Website"
            placeholder="https://shopify.com"
          />
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Logo</v-card-title>
        <v-card-text>
          <p>
            Upload a square icon in SVG format, suitable to be displayed at
            small size. If you can't provide an SVG file, upload a 32x32 PNG
            file instead.
          </p>

          <v-file-input
            v-model="icon"
            placeholder="Select an image..."
            accept="image/svg+xml, image/png"
            hide-details="auto"
            class="mb-4"
          />
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Attributes</v-card-title>
        <v-card-text>
          <p>Select all that apply.</p>

          <v-row class="mb-2">
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.saas" hide-details>
                <template #label>
                  Software as a service

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    Fully managed, not self-hosted.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-checkbox
                v-model="form.oss"
                label="Open-source software"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Pricing models</v-card-title>
        <v-card-text>
          <p>Select all that apply.</p>

          <v-row class="mb-2">
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.recurring" hide-details>
                <template #label>
                  Recurring

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    Subscription based.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.poa" hide-details>
                <template #label>
                  Price on asking

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    Customers are required to contact sales to get a quote.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.onetime" hide-details>
                <template #label>
                  One-time payment

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    No subscription required to make a purchase.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.payg" hide-details>
                <template #label>
                  Pay as you go

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    Cost varies depending on usage or sales. For instance, a
                    payment processor charging a percentage per transaction.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-checkbox v-model="form.freemium" hide-details>
                <template #label>
                  Freemium

                  <v-tooltip max-width="400" top>
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small right v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    Both free and paid plans available.
                  </v-tooltip>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Price range</v-card-title>
        <v-card-text>
          <p>
            An indication of cost, based on a typical plan or average monthly
            price.
          </p>

          <v-radio-group
            v-model="form.price"
            class="mt-0 mb-2"
            hide-details
            mandatory
          >
            <v-row>
              <v-col cols="6" class="">
                <v-radio label="Not applicable / not sure" value="" />
              </v-col>
              <v-col cols="6">
                <v-radio label="Less than US $100/mo" value="low" />
              </v-col>
              <v-col cols="6">
                <v-radio label="Less than US $1,000/mo" value="mid" />
              </v-col>
              <v-col cols="6">
                <v-radio label="More than US $1,000/mo" value="high" />
              </v-col>
            </v-row>
          </v-radio-group>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Fingerprints</v-card-title>
        <v-card-text>
          <p>
            Wappalyzer identifies technologies by analysing web pages, looking
            for unique fingerprints that give away the presence of a technology.
            We inspect HTML code, URLs, network requests, headers, variables,
            cookies, etc.
          </p>

          <p>
            Describe any clues we should look for. This can be a JavaScript
            snippet, button on the page or anything else, as long as it's unique
            to the technology.
          </p>

          <v-textarea
            v-model="form.fingerprints"
            label="How can we identify this technology?"
            rows="5"
            :placeholder="'E.g. Look for the following JavaScript snippet:\n<script>\n  Example code\n</script>'"
          />
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Example websites</v-card-title>
        <v-card-text>
          <p>
            Provide 2-3 links to websites that use the technology for our
            testing.
          </p>

          <v-textarea
            v-model="form.examples"
            label="Websites"
            rows="2"
            :placeholder="`https://example.com\nhttps://www.example.org`"
          />
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Dependencies</v-card-title>
        <v-card-text>
          <p>
            If the technology is built on other technologies, such as a
            framework, programming language or database, list them here. We use
            these to identify technologies that may otherwise be invisible.
          </p>

          <v-textarea
            v-model="form.implies"
            label="Technologies"
            rows="2"
            :placeholder="`PHP\nMySQL`"
          />
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Your contact details</v-card-title>
        <v-card-text>
          <p>We'll follow up when your submission has been processed.</p>

          <v-row>
            <v-col>
              <v-text-field
                v-model="form.name"
                label="Name"
                placeholder="John Connor"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.email"
                label="Email address"
                placeholder="info@example.com"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>

    <v-btn
      color="primary"
      class="mt-4 mb-4"
      large
      :loading="submitting"
      :disabled="!criteria"
      @click="submit"
      >Submit</v-btn
    >
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiHelpCircleOutline } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  async asyncData({ $axios }) {
    return {
      categories: (await $axios.get('categories')).data.map(({ name }) => ({
        value: name,
        text: name,
      })),
    }
  },
  data() {
    return {
      title: 'Suggest a new technology',
      success: '',
      error: '',
      submitting: false,
      web: false,
      userbase: false,
      criteria: false,
      icon: [],
      formInit: {
        technology: '',
        category: '',
        description: '',
        website: '',
        saas: false,
        oss: false,
        recurring: false,
        onetime: false,
        poa: false,
        payg: false,
        freemium: false,
        price: '',
        fingerprints: '',
        examples: '',
        implies: '',
        name: '',
        email: '',
      },
      form: {},
      mdiHelpCircleOutline,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
  },
  watch: {
    user() {
      this.form.name = this.user.name
      this.form.email = this.user.email
    },
  },
  mounted() {
    this.form = { ...this.formInit }
    this.form.name = this.user.name
    this.form.email = this.user.email
  },
  methods: {
    async submit() {
      this.success = ''
      this.error = ''
      this.submitting = true

      try {
        const data = { ...this.form, icon: await this.base64Encode(this.icon) }

        const pricing = [
          this.form.price,
          this.form.recurring ? 'recurring' : null,
          this.form.onetime ? 'onetime' : null,
          this.form.poa ? 'poa' : null,
          this.form.payg ? 'payg' : null,
          this.form.freemium ? 'freemium' : null,
        ].filter((value) => value)

        delete data.price
        delete data.recurring
        delete data.onetime
        delete data.poa
        delete data.payg
        delete data.freemium

        data.pricing = pricing

        await this.$axios.post('technologies/suggest', data)

        this.$refs.form.reset()
        this.icon = []
        this.form = { ...this.formInit }
        this.form.name = this.user.name
        this.form.email = this.user.email

        this.success = "Thank you! We'll follow up via email soon."
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.submitting = false

      this.scrollToTop()
    },
    base64Encode(file) {
      if (!(file instanceof File)) {
        return ''
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        try {
          reader.readAsDataURL(file)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)

          reject(new Error('There was a problem uploading the file.'))
        }

        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => {
          // eslint-disable-next-line no-console
          console.error(error)

          reject(new Error('There was a problem uploading the file.'))
        }
      })
    },
  },
}
</script>
