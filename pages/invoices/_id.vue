<template>
  <Page
    :title="title"
    :loading="!invoice && !error"
    :crumbs="false"
    no-head
    no-side-bar
    no-subscribe
    secure
  >
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="invoice">
      <v-row class="align-center mb-2">
        <v-col>
          <Logo />
        </v-col>
        <v-col class="text-right font-weight-bold text-h3">TAX INVOICE</v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="6">
          <v-card outlined>
            <v-card-text class="pa-0">
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <th width="40%">Company name</th>
                    <td class="font-weight-bold">Wappalyzer Pty Ltd</td>
                  </tr>
                  <tr>
                    <th>ABN</th>
                    <td>87645916043</td>
                  </tr>
                  <tr>
                    <th>Email address</th>
                    <td>info@wappalyzer.com</td>
                  </tr>
                  <tr>
                    <th>Postal address</th>
                    <td>
                      PO Box 934<br />
                      North Melbourne<br />
                      3051 VIC<br />
                      AUSTRALIA
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-text class="pa-0">
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <th width="40%">Reference</th>
                    <td class="font-weight-bold">{{ invoice.id }}</td>
                  </tr>
                  <tr>
                    <th>Issue date</th>
                    <td>
                      {{ formatDate(new Date(invoice.updatedAt * 1000)) }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="6">
          <v-card outlined>
            <v-card-title>Bill to</v-card-title>

            <v-card-text class="pa-0">
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <th width="40%">Company name</th>
                    <td class="font-weight-bold">
                      {{
                        user.billingName ||
                        user.name ||
                        user.billingEemail ||
                        user.email
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Tax ID</th>
                    <td>{{ user.billingTaxId }}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{{ billingAddress }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mb-4" outlined>
        <v-card-title>Items</v-card-title>
        <v-card-text class="pa-0">
          <v-simple-table dense>
            <tbody>
              <tr>
                <th width="60%">Product</th>
                <th width="20%" class="text-right">Price</th>
              </tr>
              <tr>
                <td>{{ invoice.product }}</td>
                <td class="text-right">
                  {{
                    formatCurrency(
                      invoice.subtotal / 100,
                      invoice.currency,
                      true
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td class="text-right">Subtotal</td>
                <td class="text-right">
                  {{
                    formatCurrency(
                      invoice.subtotal / 100,
                      invoice.currency,
                      true
                    )
                  }}
                </td>
              </tr>
              <tr v-if="invoice.discount">
                <td class="text-right">Discount</td>
                <td class="text-right">
                  {{
                    formatCurrency(
                      invoice.discount / 100,
                      invoice.currency,
                      true
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td class="text-right">
                  Tax ({{
                    invoice.taxPercent &&
                    user.billingCountry &&
                    user.billingCountry.toLowerCase() === 'au'
                      ? 'GST '
                      : ''
                  }}{{ invoice.taxPercent }}%)
                </td>
                <td class="text-right">
                  {{
                    formatCurrency(invoice.tax / 100, invoice.currency, true)
                  }}
                </td>
              </tr>
              <tr>
                <td class="text-right font-weight-bold">Total</td>
                <td class="text-right font-weight-bold">
                  {{
                    formatCurrency(invoice.total / 100, invoice.currency, true)
                  }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <p v-if="invoice.currency === 'usd'">
        <small
          >Prices are in
          <span class="font-weight-bold">United States dollars</span>.</small
        >
      </p>
    </template>
  </Page>
</template>

<script>
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Page,
    Logo,
  },
  layout: 'full',
  data() {
    return {
      title: 'Invoice',
      error: false,
      invoice: null,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
    }),
    billingAddress() {
      return [
        this.user.billingAddress1,
        this.user.billingAddress2,
        this.user.billingCity,
        this.user.billingPostcode,
        this.user.billingState,
        this.user.billingCountry,
      ]
        .filter((value) => value)
        .join(', ')
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        const { id } = this.$route.params

        try {
          this.invoice = (await this.$axios.get(`invoices/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      const { id } = this.$route.params

      try {
        this.invoice = (await this.$axios.get(`invoices/${id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>

<style>
.logo {
  height: 50px !important;
  width: 200px;
}
</style>
