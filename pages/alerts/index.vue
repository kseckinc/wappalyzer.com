<template>
  <div>
    <Page
      :title="title"
      :head="{ title: title, subtitle: meta.subtitle, text: meta.text }"
      hero
    >
      <div class="d-flex justify-center my-12">
        <v-btn-toggle v-model="interval" color="primary" class="mr-4" mandatory>
          <v-btn value="month" class="overline px-8" outlined>
            Monthly
          </v-btn>
          <v-btn value="year" class="overline px-8" outlined>
            Annually
          </v-btn>
        </v-btn-toggle>
      </div>

      <Matrix v-on:select="subscribe" :items="plans" :attrs="attrs" />

      <v-container>
        <small>
          Prices are in Australian dollars.<br />
          By using our services, you agree to our
          <nuxt-link to="/terms">terms of service</nuxt-link>.
        </small>
      </v-container>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        ref="orderDialog"
        v-on:close="orderDialog = false"
        :error="orderError"
        :id="order ? order.id : null"
      />
    </Page>

    <Logos />
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import Matrix from '~/components/Matrix.vue'
import { alerts as meta } from '~/assets/json/meta.json'
import { attrs, plans } from '~/assets/json/alerts.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
    OrderDialog,
    Matrix
  },
  data() {
    return {
      title: meta.title,
      interval: 'month',
      order: false,
      orderError: '',
      attrs,
      meta,
      signInDialog: false,
      subscribing: false
    }
  },
  computed: {
    plans() {
      return Object.keys(plans).reduce((_plans, plan) => {
        if (plans[plan].interval === this.interval) {
          _plans[plan] = plans[plan]
        }

        return _plans
      }, {})
    }
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.subscribing) {
        this.signInDialog = false

        this.subscribe(this.subscribing)
      }
    }
  },
  methods: {
    async subscribe(plan) {
      this.order = false
      this.orderError = ''
      this.subscribing = plan

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.$refs.orderDialog.open()

      try {
        this.order = (
          await this.$axios.put('orders', {
            product: 'Alerts',
            plan
          })
        ).data
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }
    }
  }
}
</script>
