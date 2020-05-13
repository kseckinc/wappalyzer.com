<template>
  <Page
    :title="subscription ? subscription.planName : 'Subscription'"
    :head="{ title: subscription ? subscription.planName : 'Subscription' }"
    :crumbs="[{ title: 'Subscriptions', to: '/subscriptions' }]"
    :loading="!subscription && !error"
    secure
  >
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="subscription">
      <v-alert v-if="subscription.status === 'Pending'" type="info" outlined>
        Your subscription is awaiting payment and is not currently active.
      </v-alert>

      <v-btn
        v-if="isAdmin"
        :href="`https://dashboard.stripe.com/subscriptions/${subscription.id}`"
        color="success"
        target="_blank"
        outlined
      >
        Stripe subscription
        <v-icon right>mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn
        v-if="subscription.planId.startsWith('api_')"
        to="/apikey"
        color="accent"
        outlined
        ><v-icon left>mdi-key-variant</v-icon> API key</v-btn
      >

      <v-btn
        v-if="subscription.planId.startsWith('alerts_')"
        to="/alerts/manage"
        color="accent"
        outlined
        ><v-icon left>mdi-bullhorn</v-icon> Alerts</v-btn
      >

      <v-card class="my-4">
        <v-card-text class="px-0 pb-0">
          <v-simple-table>
            <tbody>
              <tr>
                <th>Price</th>
                <td>
                  {{
                    formatCurrency(
                      subscription.planAmount / 100,
                      subscription.planCurrency
                    )
                  }}
                  / {{ subscription.planInterval }}
                </td>
              </tr>
              <tr>
                <th>Payment method</th>
                <td>
                  <CreditCard
                    v-if="subscription.paymentMethodId"
                    :brand="subscription.paymentMethodBrand"
                    :last4="subscription.paymentMethodLast4"
                    :expMonth="subscription.paymentMethodExpMonth"
                    :expYear="subscription.paymentMethodExpYear"
                  />
                  <template v-else>
                    Use default
                  </template>
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  {{ subscription.status }}
                </td>
              </tr>
              <template v-if="subscription.status !== 'Cancelled'">
                <tr v-if="subscription.cancelAt" class="red--text">
                  <th>Cancels at</th>
                  <td>
                    {{ formatDate(new Date(subscription.cancelAt * 1000)) }}
                  </td>
                </tr>
                <tr v-else>
                  <th>Renews after</th>
                  <td>
                    {{
                      formatDate(new Date(subscription.currentPeriodEnd * 1000))
                    }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-card-actions
          v-if="!subscription.cancelAt && subscription.status !== 'Cancelled'"
        >
          <v-spacer />
          <v-btn @click="paymentMethodDialog = true" color="accent" text>
            <v-icon left>mdi-credit-card-outline</v-icon> Change payment
          </v-btn>
          <v-btn @click="cancel(false)" color="error" text>
            <v-icon left>mdi-calendar-remove</v-icon> Cancel subscription
          </v-btn>
        </v-card-actions>
      </v-card>

      <small>Prices are in Australian dollars.</small>

      <v-dialog v-model="cancelDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Cancel subscription
          </v-card-title>

          <v-card-text>
            <v-alert v-if="cancelError" type="error">
              {{ cancelError }}
            </v-alert>

            Your subscription will be cancelled at the end of the billing
            period.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelDialog = false" color="accent" text
              >Cancel</v-btn
            >
            <v-btn
              @click="cancel(true)"
              :loading="cancelling"
              color="error"
              text
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="paymentMethodDialog" max-width="600px" eager>
        <v-card>
          <v-card-title>
            Payment method
          </v-card-title>
          <v-card-text class="px-2">
            <v-alert v-if="paymentMethodError" type="error">
              {{ paymentMethodError }}
            </v-alert>

            <div
              v-if="paymentMethodsLoading || paymentMethodSaving"
              class="text-center my-4"
            >
              <v-progress-circular color="accent" indeterminate />
            </div>
            <v-alert
              v-else-if="!paymentMethods.length"
              color="info"
              class="mx-4 mb-0"
              outlined
            >
              You don't currently have any
              <nuxt-link to="/paymentmethods">payment methods</nuxt-link>.
            </v-alert>
            <v-simple-table v-else>
              <thead>
                <tr>
                  <th>Name on card</th>
                  <th>Card details</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="paymentMethod in paymentMethods"
                  :key="paymentMethod.id"
                  @click="savePaymentMethod(paymentMethod.id)"
                >
                  <td>{{ paymentMethod.name }}</td>
                  <td>
                    <CreditCard
                      :brand="paymentMethod.brand"
                      :last4="paymentMethod.last4"
                      :expMonth="paymentMethod.expMonth"
                      :expYear="paymentMethod.expYear"
                    />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="paymentMethodDialog = false" color="accent" text
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import Page from '~/components/Page.vue'
import CreditCard from '~/components/CreditCard.vue'

export default {
  components: {
    Page,
    CreditCard
  },
  data() {
    return {
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      error: false,
      paymentMethodDialog: false,
      paymentMethodError: false,
      paymentMethodSaving: false,
      paymentMethods: false,
      paymentMethodsLoading: false,
      subscription: null,
      success: false
    }
  },
  computed: {
    ...mapState({
      isAdmin: ({ user }) => user.attrs.admin || user.impersonating
    })
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        const { id } = this.$route.params

        try {
          this.subscription = (
            await this.$axios.get(`subscriptions/${id}`)
          ).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    async paymentMethodDialog(isOpen) {
      if (isOpen) {
        this.success = false
        this.paymentMethodError = false
        this.paymentMethodsLoading = true

        const { data: paymentMethods } = await this.$axios.get('paymentmethods')

        this.paymentMethods = paymentMethods

        this.paymentMethodsLoading = false
      }
    }
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      const { id } = this.$route.params

      try {
        this.subscription = (await this.$axios.get(`subscriptions/${id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async cancel(confirm) {
      this.success = false
      this.cancelError = false

      if (!confirm) {
        this.cancelDialog = true

        return
      }

      this.cancelling = true

      try {
        await this.$axios.delete(`subscriptions/${this.subscription.id}`)

        this.subscription = (
          await this.$axios.get(`subscriptions/${this.subscription.id}`)
        ).data

        this.cancelDialog = false

        this.success =
          'Your subscription will be cancelled at the end of the billing period'
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
    async savePaymentMethod(id) {
      this.paymentMethodError = false
      this.paymentMethodSaving = true

      try {
        await this.$axios.patch(`subscriptions/${this.subscription.id}`, {
          default_payment_method: id
        })

        this.subscription = (
          await this.$axios.get(`subscriptions/${this.subscription.id}`)
        ).data

        this.success = 'The payment method has been udpated'

        this.paymentMethodDialog = false
      } catch (error) {
        this.paymentMethodError = this.getErrorMessage(error)
      }

      this.scrollToTop()

      this.paymentMethodSaving = false
    }
  }
}
</script>
