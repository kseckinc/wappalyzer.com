<template>
  <div>
    <Page :title="title" :head="meta" hero>
      <v-btn
        @click="$refs.pricingDialog.open()"
        color="accent"
        class="mt-4 mb-8"
        outlined
      >
        <v-icon left>mdi-calculator</v-icon>
        Pricing
      </v-btn>

      <h3 class="mb-4">Upload your list</h3>

      <v-alert icon="mdi-information-outline" outlined>
        <ul>
          <li>
            Upload a .txt file containing URLs, each on a separate line
          </li>
          <li>URLs must start with http:// or https://</li>
          <li>Include up to 5,000 URLs</li>
          <li>
            The resulting dataset is in CSV and JSON format (<a
              href="/bulk-sample.zip"
              download
              >sample</a
            >)
          </li>
        </ul>
      </v-alert>

      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>

      <v-row>
        <v-col sm="8" class="py-0">
          <v-form ref="form">
            <v-file-input
              v-on:change="fileChange"
              :error-messages="fileErrors"
              placeholder="Select a file..."
              accept="text/plain"
              hide-details="auto"
              class="mb-8"
            />

            <v-btn
              @click="submit"
              :disabled="!!(!fileContent || fileErrors.length)"
              color="primary"
              large
              >Request quote <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-form>
        </v-col>
      </v-row>

      <p class="mt-4">
        <small>
          By using our services, you agree to our
          <nuxt-link to="/terms" target="_blank">terms of service</nuxt-link>.
        </small>
      </p>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        ref="orderDialog"
        v-on:close="orderDialog = false"
        :error="orderError"
        :id="order ? order.id : null"
      />

      <PricingDialog product="bulk" ref="pricingDialog" />

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import { bulk as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
    OrderDialog,
    PricingDialog
  },
  data() {
    return {
      title: meta.title,
      error: false,
      file: '',
      fileContent: '',
      fileErrors: [],
      signInDialog: false,
      meta,
      order: false,
      orderError: '',
      ordering: false
    }
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.ordering) {
        this.signInDialog = false

        this.submit()
      }
    }
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
              input: this.fileContent
            }
          })
        ).data
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }

      this.ordering = false
    },
    async fileChange(file) {
      this.fileContent = ''
      this.fileErrors = []

      if (!file) {
        return
      }

      this.fileContent = await file.text()

      const lines = this.fileContent.trim().split('\n')

      if (lines.length > 5000) {
        this.fileErrors.push('Limit of 5,000 URLs exceeded')
      }

      lines.forEach((line, i) => {
        const a = document.createElement('a')

        a.href = line

        const { hostname } = a

        if (!/^https?:\/\//.test(line) || !hostname) {
          this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
        }
      })
    }
  }
}
</script>
