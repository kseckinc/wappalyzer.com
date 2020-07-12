<template>
  <div>
    <Page :title="title" hero>
      <div class="mt-4">
        <v-btn color="accent" to="/faq" class="mb-2" outlined>
          <v-icon left>mdi-forum</v-icon>
          FAQs
        </v-btn>
      </div>

      <div class="d-flex justify-center my-12">
        <v-btn-toggle v-model="interval" color="primary" class="mr-4" mandatory>
          <v-btn value="month" class="caption px-8" outlined>
            MONTHLY
          </v-btn>
          <v-btn value="year" class="caption px-8" outlined>
            ANNUALLY &nbsp; (two months free)
          </v-btn>
        </v-btn-toggle>
      </div>

      <Matrix
        v-on:select="subscribe"
        :items="plans"
        :attrs="attrs"
        button-text="Subscribe"
      />

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
          Credit usage
        </v-card-title>
        <v-card-text class="pa-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="33%">Product</th>
                <th width="33%">Credit spend / unit</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><nuxt-link to="/lookup">Technology lookup</nuxt-link></td>
                <td>
                  1
                </td>
                <td>
                  Domain
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/datasets">Datasets</nuxt-link></td>
                <td>
                  1
                </td>
                <td>
                  Domain
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/alerts">Website alert</nuxt-link></td>
                <td>
                  5
                </td>
                <td>
                  Alert / month
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/bulk">Bulk lookup</nuxt-link></td>
                <td>
                  1
                </td>
                <td>
                  Domain
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/api/lookup">Lookup API</nuxt-link></td>
                <td>
                  1
                </td>
                <td>
                  Domain
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/api/analyze">Analyze API</nuxt-link></td>
                <td>
                  2
                </td>
                <td>
                  Web page
                </td>
              </tr>
              <tr>
                <td><nuxt-link to="/api/crawl">Crawl API</nuxt-link></td>
                <td>
                  4
                </td>
                <td>
                  Domain
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

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
import { attrs, plans } from '~/assets/json/plans.json'

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
      title: 'Plans & pricing',
      attrs,
      order: false,
      orderError: '',
      interval: 'month',
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
