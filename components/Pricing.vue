<template>
  <div>
    <div
      class="
        d-flex
        flex-row
        align-center
        body-2
        font-weight-medium
        mb-6
        mt-4 mt-md-0
      "
    >
      <v-spacer />
      <span class="font-weight-regular mr-2">Billing </span>
      <span @click="annually = !annually">Monthly</span>
      <v-switch
        v-model="annually"
        class="my-0 ml-4"
        inset
        hide-details
      ></v-switch>
      <span @click="annually = !annually">
        Annually <span class="font-weight-regular ml-1">(discounted)</span>
      </span>
      <v-spacer />
    </div>

    <Matrix
      :items="plans"
      :attrs="attrs"
      button-text="Sign up"
      @select="subscribe"
    />

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>

    <OrderDialog
      :id="order ? order.id : null"
      ref="orderDialog"
      :error="orderError"
      @close="orderDialog = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Matrix from '~/components/Matrix.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import { attrs, plans } from '~/assets/json/plans.json'

export default {
  components: {
    Matrix,
    SignIn,
    OrderDialog,
  },
  props: {
    billing: {
      type: String,
      default: 'annually',
    },
  },
  data() {
    return {
      attrs,
      annually: true,
      order: false,
      orderError: '',
      signInDialog: false,
      subscribing: false,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    plans() {
      return Object.keys(plans).reduce((_plans, plan) => {
        if (plans[plan].interval === (this.annually ? 'year' : 'month')) {
          _plans[plan] = plans[plan]
        }

        return _plans
      }, {})
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn && this.subscribing) {
        this.signInDialog = false

        this.subscribe(this.subscribing)
      }
    },
  },
  created() {
    this.annually = this.billing === 'annually'
  },
  methods: {
    async subscribe(plan) {
      this.order = false
      this.orderError = ''
      this.subscribing = plan

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.$refs.orderDialog.open()

      if (this.isMember) {
        this.orderError =
          'Subscriptions can only be created by the account owner.'

        return
      }

      try {
        this.order = (
          await this.$axios.put('orders', {
            product: 'Subscription',
            plan,
          })
        ).data
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }
    },
  },
}
</script>
