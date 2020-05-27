<template>
  <div>
    <Page
      :title="title"
      :head="{ title: title, subtitle: api.description, text: meta.text }"
      :crumbs="[{ title: 'APIs', to: '/api' }]"
      hero
    >
      <div class="mt-4">
        <v-btn color="accent" to="/faq/api" class="mb-2" outlined>
          <v-icon left>mdi-forum</v-icon>
          FAQs
        </v-btn>
        <v-btn
          color="accent"
          href="https://wappalyzer.com/docs/api"
          class="mb-2"
          outlined
        >
          <v-icon left>mdi-book-open-page-variant</v-icon>
          API reference
        </v-btn>
      </div>

      <div
        v-if="$route.params.id !== 'dataset'"
        class="d-flex justify-center my-12"
      >
        <v-btn-toggle v-model="interval" color="primary" class="mr-4" mandatory>
          <v-btn value="month" class="overline px-8" outlined>
            Monthly
          </v-btn>
          <v-btn value="year" class="overline px-8" outlined>
            Annually
          </v-btn>
        </v-btn-toggle>
      </div>

      <Matrix v-on:select="subscribe" :items="plans" :attrs="planAttrs" />

      <v-container>
        <small>
          Prices are in Australian dollars.<br />
          <nuxt-link to="/contact">Contact us</nuxt-link> for firehose access
          and tailored plans.<br />
          By using our services, you agree to our
          <nuxt-link to="/terms">terms of service</nuxt-link>.
        </small>
      </v-container>

      <div class="py-2" />

      <v-card class="mt-12 mb-6">
        <v-card-title>
          Compare APIs
        </v-card-title>
        <v-card-text class="pa-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%"></th>
                <th
                  v-for="_api in apis"
                  :key="_api.name"
                  :class="
                    `text-center ${
                      _api.name === api.name ? 'apis__col--highlight' : ''
                    }`
                  "
                  width="20%"
                >
                  <v-btn :to="_api.to" color="accent" small text>{{
                    _api.name
                  }}</v-btn>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(attr, name) in attrs">
                <td width="20%" class="caption">{{ attr.text }}</td>
                <td
                  v-for="_api in apis"
                  :key="_api.name"
                  :class="
                    `text-center ${
                      _api.name === api.name ? 'apis__col--highlight' : ''
                    }`
                  "
                >
                  <v-icon v-if="_api.attrs[name] === true" color="success">
                    mdi-check
                  </v-icon>
                  <small v-else>
                    {{ _api.attrs[name] }}
                  </small>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <small>* Subject to availability</small>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        ref="orderDialog"
        v-on:close="orderDialog = false"
        :error="orderError"
        :id="order ? order.id : null"
      />

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
import Matrix from '~/components/Matrix.vue'
import { apis as meta } from '~/assets/json/meta.json'
import { attrs, planAttrs, apis } from '~/assets/json/apis.json'

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
      title: `${apis[this.$route.params.id].name} API`,
      api: apis[this.$route.params.id],
      apis,
      attrs,
      order: false,
      orderError: '',
      interval: this.$route.params.id === 'dataset' ? 'year' : 'month',
      meta,
      planAttrs,
      signInDialog: false,
      subscribing: false
    }
  },
  computed: {
    plans() {
      return Object.keys(this.api.plans).reduce((plans, plan) => {
        if (this.api.plans[plan].interval === this.interval) {
          plans[plan] = this.api.plans[plan]
        }

        return plans
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
            product: 'API',
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

<style>
th.apis__col--highlight,
tr:not(:hover) td.apis__col--highlight {
  background-color: #fafafa;
}

th.apis__col--highlight {
}
</style>
