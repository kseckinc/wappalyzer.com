<template>
  <Page :title="title" :loading="!invoices && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="invoices">
      <v-card>
        <v-card-text v-if="!invoices.length">
          <v-alert class="ma-0" color="info" outlined>
            You don't have any invoices yet.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">Number</th>
                <th>Date</th>
                <th>Total</th>
                <th width="1">Paid</th>
                <th width="1">Order</th>
                <th width="1">PDF</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in invoices" :key="invoice.number">
                <td>
                  <a :href="invoice.hosted_invoice_url" target="_blank">
                    {{ invoice.number
                    }}<v-icon color="accent" right small>{{
                      mdiOpenInNew
                    }}</v-icon>
                  </a>
                </td>
                <td>{{ formatDate(new Date(invoice.created * 1000)) }}</td>
                <td>
                  {{ formatCurrency(invoice.total / 100, invoice.currency) }}
                </td>
                <td>
                  <v-btn v-if="invoice.status === 'paid'" icon>
                    <v-icon color="success">{{
                      mdiCheckboxMarkedOutline
                    }}</v-icon>
                  </v-btn>
                  <v-btn v-else disabled icon>
                    <v-icon>{{ mdiCheckboxBlankOutline }}</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    v-if="invoice.orderId"
                    :to="`/orders/${invoice.orderId}/`"
                    icon
                  >
                    <v-icon color="accent">{{ mdiFileDocumentOutline }}</v-icon>
                  </v-btn>
                  <v-btn v-else disabled icon>
                    <v-icon>{{ mdiFileDocumentRemoveOutline }}</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    :href="invoice.invoice_pdf"
                    :disabled="!invoice.invoice_pdf"
                    target="_blank"
                    icon
                  >
                    <v-icon color="accent">{{
                      invoice.invoice_pdf ? mdiDownload : mdiDownloadOff
                    }}</v-icon>
                  </v-btn>
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
  mdiCheckboxMarkedOutline,
  mdiCheckboxBlankOutline,
  mdiFileDocumentOutline,
  mdiFileDocumentRemoveOutline,
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
      mdiCheckboxMarkedOutline,
      mdiCheckboxBlankOutline,
      mdiFileDocumentOutline,
      mdiFileDocumentRemoveOutline,
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
