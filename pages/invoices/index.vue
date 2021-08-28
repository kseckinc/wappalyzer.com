<template>
  <Page :title="title" :loading="!invoices && !error" secure>
    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <template v-if="invoices">
      <v-card>
        <v-card-text v-if="!invoices.length">
          <v-alert class="ma-0" color="info" text>
            You don't have any invoices yet.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">Type</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th width="1">Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(invoice, index) in invoices" :key="index">
                <td>
                  <nuxt-link
                    v-if="invoice.type === 'invoice'"
                    :to="`/invoices/${invoice.orderId}`"
                    target="_blank"
                  >
                    Tax invoice<v-icon color="accent" right small>
                      {{ mdiOpenInNew }}
                    </v-icon>
                  </nuxt-link>
                  <a v-else :href="invoice.hosted_invoice_url" target="_blank">
                    {{
                      invoice.type === 'paypal'
                        ? 'Pro forma invoice'
                        : invoice.type === 'stripe_invoice'
                        ? 'Pro forma invoice'
                        : invoice.type === 'stripe_receipt'
                        ? 'Payment receipt'
                        : ''
                    }}<v-icon color="accent" right small>{{
                      mdiOpenInNew
                    }}</v-icon>
                  </a>
                </td>
                <td>
                  <nuxt-link
                    v-if="invoice.orderId"
                    :to="`/orders/${invoice.orderId}/`"
                  >
                    {{ invoice.orderId }}
                  </nuxt-link>
                  <span class="text--disabled" v-else>-</span>
                </td>
                <td>{{ formatDate(new Date(invoice.created * 1000)) }}</td>
                <td>
                  {{ formatCurrency(invoice.total / 100, invoice.currency) }}
                </td>
                <td class="text-center">
                  <v-icon v-if="invoice.status === 'paid'" color="success">
                    {{ mdiCheck }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>
  </Page>
</template>

<script>
import {
  mdiOpenInNew,
  mdiCheck,
  mdiTextBoxOutline,
  mdiTextBoxRemoveOutline,
  mdiDownload,
  mdiDownloadOff,
} from '@mdi/js'
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Invoices',
      error: false,
      invoices: null,
      mdiOpenInNew,
      mdiCheck,
      mdiTextBoxOutline,
      mdiTextBoxRemoveOutline,
      mdiDownload,
      mdiDownloadOff,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.invoices = (await this.$axios.get('invoices')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.invoices = (await this.$axios.get('invoices')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>
