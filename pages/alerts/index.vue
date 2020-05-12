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

      <v-row class="plans__matrix mt-12" no-gutters>
        <v-col>
          <v-responsive :height="Object.keys(plans).length > 1 ? 155 : 125" />
          <template v-for="attr in planAttrs">
            <v-divider />
            <v-responsive :key="attr.text" height="60">
              <v-card-text>
                {{ attr.text }}
              </v-card-text>
            </v-responsive>
          </template>
        </v-col>
        <v-col
          v-for="(plan, id) in plans"
          :class="plan.raised ? 'plans__col--raised' : ''"
          :key="plan.size"
        >
          <v-responsive v-if="!plan.raised" height="20"> </v-responsive>
          <v-card :raised="plan.raised" class="text-center">
            <v-responsive v-if="!plan.raised" height="10"> </v-responsive>
            <v-responsive
              v-if="plan.raised && Object.keys(plans).length > 1"
              height="30"
            >
              <v-card-subtitle class="overline">
                Most popular
              </v-card-subtitle>
            </v-responsive>
            <v-responsive height="60">
              <v-card-title class="justify-center">
                {{ plan.size }}
              </v-card-title>
            </v-responsive>
            <v-responsive height="65">
              <v-card-actions>
                <v-btn
                  @click="subscribe(id)"
                  :text="!plan.raised"
                  color="primary white-text"
                  class="mx-auto"
                  >Order</v-btn
                >
              </v-card-actions>
            </v-responsive>
            <template v-for="(attr, name) in planAttrs">
              <v-divider />
              <v-responsive height="60">
                <v-card-text :key="name" class="text-center">
                  <template v-if="attr.type === 'currency'">
                    <template v-if="plan.attrs[name]">
                      <span class="font-weight-medium">
                        {{ formatCurrency(plan.attrs[name] / 100) }}
                      </span>
                      <template v-if="name === 'amount'">
                        / {{ plan.interval }}
                      </template>
                    </template>
                    <template v-else>
                      Free
                    </template>
                  </template>
                  <template v-else-if="attr.type === 'number'">
                    <template v-if="plan.attrs[name]">
                      {{ formatNumber(plan.attrs[name]) }}
                    </template>
                    <template v-else>
                      Unlimited
                    </template>
                  </template>
                  <template v-else>
                    {{ plan.attrs[name] }}
                  </template>
                </v-card-text>
              </v-responsive>
            </template>
            <v-responsive v-if="plan.raised" height="20"> </v-responsive>
          </v-card>
        </v-col>
      </v-row>

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
import { alerts as meta } from '~/assets/json/meta.json'
import { planAttrs, plans } from '~/assets/json/alerts.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
    OrderDialog
  },
  data() {
    return {
      title: meta.title,
      interval: 'month',
      order: false,
      orderError: '',
      planAttrs,
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
.plans__matrix {
  min-width: 850px;
}

.plans__col--raised {
  z-index: 2;
}

th.apis__col--highlight,
tr:not(:hover) td.apis__col--highlight {
  background-color: #fafafa;
}

th.apis__col--highlight {
}
</style>
