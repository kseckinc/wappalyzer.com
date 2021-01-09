<template>
  <div>
    <Page :title="title" :head="meta">
      <p>
        Upload your list to get an instant and obligation free quote. Results
        are available within hours, depending on the size of the list. Websites
        we haven't seen before are crawled and analysed immediately.
      </p>

      <v-btn
        color="accent"
        class="mt-4 mb-8"
        outlined
        @click="$refs.pricingDialog.open()"
      >
        <v-icon left>{{ mdiCalculator }}</v-icon>
        Pricing
      </v-btn>

      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>

      <v-form ref="form">
        <v-card class="mb-8">
          <v-card-title class="subtitle-2"> Upload your list </v-card-title>
          <v-card-text>
            <ul>
              <li>
                Upload a .txt file containing URLs, each on a separate line
              </li>
              <li>Include up to 5,000 URLs</li>
              <li>
                The resulting list is in CSV and JSON format (<a
                  href="/bulk-sample.zip"
                  download
                  >sample</a
                >)
              </li>
            </ul>

            <v-file-input
              :error-messages="fileErrors"
              placeholder="Select a file..."
              accept="text/plain"
              hide-details="auto"
              class="mb-4"
              @change="fileChange"
            />
          </v-card-text>
        </v-card>

        <v-btn
          :disabled="!!(!file || fileErrors.length)"
          color="primary"
          large
          @click="submit"
          >Get a quote <v-icon right>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </v-form>

      <p class="mt-4">
        <small>
          Automate lookups with the
          <nuxt-link to="/api/">Lookup API</nuxt-link> or
          <nuxt-link to="/download/">CRM integration</nuxt-link>.<br />
          By using our services, you agree to our
          <nuxt-link to="/terms/" target="_blank">terms of service</nuxt-link>.
        </small>
      </p>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        :id="order ? order.id : null"
        ref="orderDialog"
        :error="orderError"
        @close="orderDialog = false"
      />

      <PricingDialog ref="pricingDialog" product="bulk" />

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiCalculator,
  mdiFormatListChecks,
  mdiInformationOutline,
  mdiArrowRight,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import { bulk as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
    OrderDialog,
    PricingDialog,
  },
  data() {
    return {
      title: meta.title,
      error: false,
      file: '',
      fileErrors: [],
      signInDialog: false,
      mdiCalculator,
      mdiFormatListChecks,
      mdiInformationOutline,
      mdiArrowRight,
      meta,
      order: false,
      orderError: '',
      ordering: false,
      sets,
    }
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.ordering) {
        this.signInDialog = false

        this.submit()
      }
    },
  },
  methods: {
    async submit() {
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

      if (this.file.length > 5000) {
        this.fileErrors.push('Limit of 5,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
  },
}
</script>
