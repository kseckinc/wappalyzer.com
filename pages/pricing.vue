<template>
  <div>
    <Page :title="title" :head="meta">
      <div class="mt-4">
        <v-btn color="accent" class="mb-2" outlined @click="faqDialog = true">
          <v-icon left>{{ mdiForum }}</v-icon>
          FAQs
        </v-btn>
      </div>

      <div
        class="d-flex flex-row align-center body-2 font-weight-medium mb-6 mt-4 mt-md-0"
      >
        <v-spacer />
        <span class="font-weight-regular mr-2">Billing </span>
        <span @click="annually = !annually">Monthly</span>
        <v-switch
          v-model="annually"
          class="my-0 ml-3 mr-1"
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

      <small class="text--disabled">
        <nuxt-link to="/contact/">Contact us</nuxt-link> for tailored plans.<br />
        Prices are in United States dollars.<br />
        Credits included in plans expire after 60 days.
      </small>

      <v-row justify="center" class="mt-8">
        <v-col cols="12" sm="6">
          <v-card id="usage">
            <v-card-title> Credit usage </v-card-title>
            <v-card-text class="px-0">
              <v-row>
                <v-col class="py-0" cols="12" md="10">
                  <p class="px-4">
                    Credits can be spent on a range of products, including lead
                    lists, technology lookups and APIs.
                  </p>
                </v-col>
              </v-row>

              <v-simple-table>
                <thead>
                  <tr>
                    <th width="40%">Product</th>
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
        </v-col>

        <v-col cols="12" sm="6">
          <v-card id="credits">
            <v-card-title> Credit pricing </v-card-title>
            <v-card-text class="px-0">
              <v-row>
                <v-col class="py-0" cols="12" md="10">
                  <p class="px-4 pb-2">
                    Additional credits can be purchased at tiered pricing. For
                    example, the price for 1,000 credits is (100 x $0.20) + (400
                    x $0.10) + (500 x $0.06) = $90.
                  </p>
                </v-col>
              </v-row>

              <v-simple-table class="mb-4" outlined dense>
                <thead>
                  <tr>
                    <th width="50%">Credits</th>
                    <th>Price per credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(tier, index) in Object.keys(creditTiers)"
                    :key="index"
                  >
                    <td>
                      <small>
                        {{
                          formatNumber(
                            index
                              ? parseInt(
                                  Object.keys(creditTiers)[index - 1],
                                  10
                                ) + 1
                              : 1
                          )
                        }}
                        {{
                          index === Object.keys(creditTiers).length - 1
                            ? '+'
                            : `- ${formatNumber(parseInt(tier, 10))}`
                        }}
                      </small>
                    </td>
                    <td>
                      <small>
                        {{
                          formatCurrency(creditTiers[tier] / 100, 'USD', true)
                        }}
                      </small>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <p class="px-4 mb-0">
                <small>
                  Prices are in United States dollars.<br />
                  Credits purchased without a plan expire after 365 days.
                </small>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <small class="text--disabled">
        By using our services, you agree to our
        <nuxt-link to="/terms/">terms of service</nuxt-link>.
      </small>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        :id="order ? order.id : null"
        ref="orderDialog"
        :error="orderError"
        @close="orderDialog = false"
      />

      <v-dialog v-model="faqDialog" max-width="600px">
        <v-card>
          <v-card-title>Frequently asked questions</v-card-title>
          <v-card-text class="pb-0">
            <Faqs topic="pricing" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="faqDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiForum } from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import Matrix from '~/components/Matrix.vue'
import Faqs from '~/components/Faqs.vue'
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
    Faqs,
  },
  data() {
    return {
      title: meta.title,
      attrs,
      faqDialog: false,
      order: false,
      orderError: '',
      annually: true,
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
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.subscribing) {
        this.signInDialog = false

        this.subscribe(this.subscribing)
      }
    },
  },
  mounted() {
    const { billing } = this.$route.query

    if (billing === 'monthly') {
      this.annually = false

      this.$router.replace(this.$route.path)
    }
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
