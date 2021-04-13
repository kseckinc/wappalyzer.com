<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <p class="mb-8">
      Credits can be spent on any product, including technology lookups, APIs
      and datasets. <nuxt-link to="/pricing/">Sign up for a plan</nuxt-link> to
      get monthly credits at a lower price.
    </p>

    <div class="mb-4">
      <v-btn
        v-if="isAdmin"
        color="success"
        class="mr-2"
        outlined
        @click="addDialog = true"
      >
        <v-icon left>{{ mdiAlphaCCircle }}</v-icon>
        Add credits
      </v-btn>

      <v-btn color="accent" class="mr-2" depressed @click="orderDialog = true"
        ><v-icon left>{{ mdiAlphaCCircle }}</v-icon> Buy credits</v-btn
      >

      <v-btn href="/faq/credits" color="accent" class="mr-2" outlined>
        <v-icon left>{{ mdiForum }}</v-icon>
        FAQs
      </v-btn>

      <v-btn href="/pricing" color="accent" class="mr-2" outlined>
        <v-icon left>{{ mdiCalculator }}</v-icon>
        Plans &amp; pricing
      </v-btn>
    </div>

    <template v-if="!loading">
      <v-card>
        <v-card-title> Packs </v-card-title>
        <v-card-text v-if="!adds.length" class="pb-0">
          <v-alert color="info" class="mb-0" outlined>
            You don't have any active credit packs.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">Description</th>
                <th width="20%">Added</th>
                <th width="20%">Expires</th>
                <th width="15%">Credits</th>
                <th width="15%">Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in adds" :key="index">
                <td
                  v-if="item.subscriptionId && item.subscriptionId !== 'free'"
                >
                  <nuxt-link :to="`/subscriptions/${item.subscriptionId}/`">
                    {{ item.description }}
                  </nuxt-link>
                </td>
                <td v-else-if="item.orderId">
                  <nuxt-link :to="`/orders/${item.orderId}/`">
                    {{ item.description }}
                  </nuxt-link>
                </td>
                <td v-else>
                  {{ item.description }}
                </td>
                <td>
                  {{ formatDate(new Date(item.createdAt * 1000)) }}
                </td>
                <td>
                  {{ formatDate(new Date(item.expiresAt * 1000)) }}
                </td>
                <td>
                  {{ formatNumber(item.credits) }}
                </td>
                <td>
                  {{ formatNumber(item.creditsRemaining) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-divider />

        <v-card-title> Usage </v-card-title>
        <v-card-text class="pb-0">
          These are your credit spends for the last 60 days.
        </v-card-text>
        <v-card-text v-if="!spends.length">
          <v-alert color="info" class="mb-0" outlined>
            You don't have credit usage.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Description</th>
                <th width="20%">Date</th>
                <th width="20%">Credits</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in spends" :key="index">
                <td v-if="item.orderId">
                  <nuxt-link :to="`/orders/${item.orderId}/`">
                    {{ item.description }}
                  </nuxt-link>
                </td>
                <td v-else>
                  {{ item.description }}
                </td>
                <td>
                  {{ formatDate(new Date(item.createdAt * 1000)) }}
                </td>
                <td>
                  {{ formatNumber(item.credits) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-dialog v-model="orderDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Pricing </v-card-title>
          <v-card-text class="px-0">
            <v-alert v-if="orderError" type="error" class="mx-6">
              {{ orderError }}
            </v-alert>

            <v-simple-table class="mb-4" outlined dense>
              <thead>
                <tr>
                  <th class="pl-6" width="50%">Credits</th>
                  <th class="pr-6" width="50%">Price per credit</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(tier, index) in Object.keys(creditTiers)"
                  :key="index"
                >
                  <td class="pl-6 caption">
                    {{
                      formatNumber(
                        index
                          ? parseInt(Object.keys(creditTiers)[index - 1], 10) +
                              1
                          : 1
                      )
                    }}
                    {{
                      index === Object.keys(creditTiers).length - 1
                        ? '+'
                        : `- ${formatNumber(parseInt(tier, 10))}`
                    }}
                  </td>
                  <td class="pr-6 caption">
                    {{ formatCurrency(creditTiers[tier] / 100, 'USD', true) }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <p class="px-6 mb-0">
              <small>
                Prices are in United States dollars.<br />
                Credits expire after 365 days.
              </small>
            </p>
          </v-card-text>

          <v-divider />

          <v-card-title> Order </v-card-title>
          <v-card-text class="pb-0">
            <v-form @submit.prevent="submit">
              <v-row>
                <v-col cols="7" class="py-0">
                  <v-text-field
                    v-model="credits"
                    :rules="rules.credits"
                    label="Credits"
                    placeholder="1000"
                    dense
                  />
                </v-col>
                <v-col class="py-0">
                  <v-text-field
                    :value="
                      formatCurrency(
                        creditsToCents(parseInt(credits, 10)) / 100
                      )
                    "
                    label="Price"
                    disabled
                    dense
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="orderDialog = false"
              >Cancel</v-btn
            >
            <v-btn :loading="submitting" color="accent" text @click="submit"
              >Create order</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Add credits </v-card-title>
          <v-card-text class="pb-0">
            <v-alert v-if="addError" type="error">
              {{ addError }}
            </v-alert>

            <v-form>
              <v-text-field
                v-model="credits"
                :rules="rules.credits"
                label="Credits"
              />
              <v-text-field v-model="description" label="Description" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="addDialog = false">Cancel</v-btn>
            <v-btn :loading="adding" color="accent" text @click="add"
              >Add</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiAlphaCCircle, mdiForum, mdiCalculator } from '@mdi/js'
import { creditTiers } from '~/assets/json/pricing.json'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Credits',
      adds: [],
      addDialog: false,
      adding: false,
      addError: false,
      credits: 100,
      creditTiers,
      description: 'Complimentary credits',
      mdiAlphaCCircle,
      mdiForum,
      mdiCalculator,
      rules: {
        credits: [
          (v) => /^[0-9]+$/.test(v),
          (v) =>
            parseInt(v) >= 100 || this.isAdmin ? true : 'Minimum 100 credits',
          (v) => (parseInt(v) < 10000000 ? true : 'Maximum 10,000,000 credits'),
        ],
      },
      orderDialog: false,
      orderError: false,
      order: false,
      submitting: false,
      spends: [],
      error: false,
      loading: true,
      success: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ add: this.adds, spend: this.spends } = (
            await this.$axios.get('credits/usage')
          ).data)

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        await Promise.all([
          ({ add: this.adds, spend: this.spends } = (
            await this.$axios.get('credits/usage')
          ).data),
        ])

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }

    if (this.$route.query.buy) {
      this.orderDialog = true
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async add() {
      this.addError = ''
      this.adding = true

      try {
        await this.$axios.put('credits', {
          credits: parseInt(this.credits, 10),
          description: this.description,
        })

        this.getCredits()
        ;({ add: this.adds, spend: this.spends } = (
          await this.$axios.get('credits/usage')
        ).data)
      } catch (error) {
        this.addError = this.getErrorMessage(error)
      }

      this.adding = false
      this.addDialog = false
    },
    async submit() {
      this.orderError = ''
      this.submitting = true

      try {
        const order = (
          await this.$axios.put('orders', {
            product: 'Credits',
            credits: Math.min(
              10000000,
              Math.max(100, parseInt(this.credits, 10))
            ),
          })
        ).data

        this.$router.push(`/orders/${order.id}`)
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }

      this.submitting = false
    },
  },
}
</script>
