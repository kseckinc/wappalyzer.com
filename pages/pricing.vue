<template>
  <div>
    <Page :title="title" :head="meta">
      <div class="mt-4">
        <v-btn color="accent" to="/faq/credits" class="mb-2" outlined>
          <v-icon left>{{ mdiForum }}</v-icon>
          FAQs
        </v-btn>
      </div>

      <div
        class="d-flex flex-row align-center body-2 font-weight-medium mt-4 mb-6"
      >
        <v-spacer />
        <span @click="annually = !annually">Monthly</span>
        <v-switch
          v-model="annually"
          class="my-0 ml-3 mr-1"
          hide-details
        ></v-switch>
        <span @click="annually = !annually">
          Annually <span class="font-weight-regular ml-1">(2 months free)</span>
        </span>
        <v-spacer />
      </div>

      <Matrix
        :items="plans"
        :attrs="attrs"
        button-text="Sign up"
        @select="subscribe"
      />

      <v-container>
        <small>
          Prices are in Australian dollars.<br />
          Credits included in plans expire after 60 days.<br />
          <nuxt-link to="/contact/">Contact us</nuxt-link> for tailored plans.
        </small>
      </v-container>

      <v-card id="usage" class="mt-12 mb-8">
        <v-card-title>
          Credit usage
        </v-card-title>
        <v-card-text class="pa-0">
          <v-row>
            <v-col class="py-0" md="8">
              <p class="px-4">
                Credits can be spent on a range of products, including lead
                lists and every API.
              </p>
            </v-col>
          </v-row>

          <v-simple-table>
            <thead>
              <tr>
                <th width="33%">Product</th>
                <th>Credit spend per unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="{ name, to, units } in creditsPerUnit" :key="name">
                <td>
                  <nuxt-link :to="to">{{ name }}</nuxt-link>
                </td>
                <td>
                  {{
                    units
                      .map(({ per, credits }) => `${credits} per ${per}`)
                      .join(' or ')
                  }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-card id="credits" class="mt-12 mb-4">
        <v-card-title>
          Credit pricing
        </v-card-title>
        <v-card-text class="px-0">
          <v-row>
            <v-col class="py-0" md="8">
              <p class="px-4">
                Additional credits can be purchased at tiered pricing. For
                example, the price for 1,000 credits is (100 x $0.20) + (400 x
                $0.10) + (500 x $0.06) = $90 AUD.
              </p>
            </v-col>
          </v-row>

          <v-simple-table class="mb-4" outlined>
            <thead>
              <tr>
                <th width="33%">Credits</th>
                <th>Price per credit</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tier, index) in Object.keys(creditTiers)"
                :key="index"
              >
                <td>
                  {{
                    formatNumber(
                      index
                        ? parseInt(Object.keys(creditTiers)[index - 1], 10) + 1
                        : 1
                    )
                  }}
                  {{
                    index === Object.keys(creditTiers).length - 1
                      ? '+'
                      : `- ${formatNumber(parseInt(tier, 10))}`
                  }}
                </td>
                <td>
                  {{ formatCurrency(creditTiers[tier] / 100, 'AUD', true) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>

          <p class="px-4 mb-0">
            <small>
              Prices are in Australian dollars.<br />
              Credits purchased without a plan expire after 365 days.
            </small>
          </p>
        </v-card-text>
      </v-card>

      <v-container>
        <small>
          By using our services, you agree to our
          <nuxt-link to="/terms/">terms of service</nuxt-link>.
        </small>
      </v-container>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        :id="order ? order.id : null"
        ref="orderDialog"
        :error="orderError"
        @close="orderDialog = false"
      />

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mdiForum } from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import Matrix from '~/components/Matrix.vue'
import { attrs, plans } from '~/assets/json/plans.json'
import { creditsPerUnit, creditTiers } from '~/assets/json/pricing.json'
import { pricing as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
    OrderDialog,
    Matrix,
  },
  data() {
    return {
      title: meta.title,
      attrs,
      order: false,
      orderError: '',
      annually: false,
      creditsPerUnit,
      creditTiers,
      mdiForum,
      meta,
      signInDialog: false,
      subscribing: false,
      text: meta.text,
    }
  },
  computed: {
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
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.subscribing) {
        this.signInDialog = false

        this.subscribe(this.subscribing)
      }
    },
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
