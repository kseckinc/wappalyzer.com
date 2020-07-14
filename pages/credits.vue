<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="!loading">
      <v-card>
        <v-card-title>
          Packs
        </v-card-title>
        <v-card-text v-if="!add.length" class="pb-0">
          <v-alert color="info" class="mb-0" outlined>
            You don't have any active credit packs.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%">Description</th>
                <th width="20%">Added</th>
                <th width="20%">Expires</th>
                <th width="20%">Credits</th>
                <th width="20%">Remaining</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in add">
                <td>
                  {{ item.product }}
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
        <v-card-actions>
          <v-spacer />
          <v-btn @click="orderDialog = true" color="accent" text
            ><v-icon left>mdi-alpha-c-circle</v-icon> Buy credits</v-btn
          >
        </v-card-actions>

        <v-divider />

        <v-card-title>
          Usage
        </v-card-title>
        <v-card-text v-if="!spend.length">
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
              <tr v-for="item in spend">
                <td>
                  {{ item.product }}
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
          <v-card-title>
            Pricing
          </v-card-title>
          <v-card-text class="px-0">
            <v-alert v-if="orderError" type="error" class="mx-6">
              {{ orderError }}
            </v-alert>

            <v-simple-table outlined>
              <thead>
                <tr>
                  <th class="pl-6" width="50%">Credits</th>
                  <th class="pr-6" width="50%">Price per credit</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tier in Object.keys(creditPrices)">
                  <td class="pl-6">
                    {{ formatNumber(Math.max(100, parseInt(tier, 10))) }}+
                  </td>
                  <td class="pr-6">
                    {{ formatCurrency(creditPrices[tier] / 100, 'AUD', true) }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <p class="px-6 mb-0">
              <small>
                Prices are in Australian dollars.<br />
                Credits expire after 365 days.
              </small>
            </p>
          </v-card-text>

          <v-divider />

          <v-card-title>
            Order
          </v-card-title>
          <v-card-text class="pb-0">
            <v-form v-on:submit.prevent="submit">
              <v-row>
                <v-col cols="7">
                  <v-text-field
                    v-model="credits"
                    :rules="rules.credits"
                    label="Credits"
                    placeholder="1000"
                    dense
                  />
                </v-col>
                <v-col>
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
            <v-btn @click="orderDialog = false" color="error" text
              >Cancel</v-btn
            >
            <v-btn @click="submit" :loading="submitting" color="accent" text
              >Create order</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Credits',
      add: [],
      credits: 100,
      rules: {
        credits: [
          (v) => /^[0-9]+$/.test(v),
          (v) => (parseInt(v) >= 100 ? true : 'Minimum 100 credits'),
          (v) => {
            const credits = parseInt(this.credits, 10)
            const tiers = Object.keys(this.creditPrices)

            const tier = tiers
              .filter((tier) => parseInt(tier, 10) <= credits)
              .reduce((max, tier) => Math.max(max, parseInt(tier, 10)), 0)

            const nextTier = parseInt(
              // eslint-disable-next-line standard/computed-property-even-spacing
              tiers[
                tiers.findIndex((_tier) => parseInt(_tier, 10) === tier) + 1
              ],
              10
            )

            if (
              nextTier &&
              this.creditsToCents(nextTier) <= this.creditsToCents(credits)
            ) {
              return `Get ${this.formatNumber(
                nextTier
              )} credits for ${this.formatCurrency(
                this.creditsToCents(nextTier) / 100
              )}`
            }

            return true
          }
        ]
      },
      orderDialog: false,
      orderError: false,
      order: false,
      submitting: false,
      spend: [],
      error: false,
      loading: true,
      success: false
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ usage: this.add } = (await this.$axios.get('credits/add')).data)
          ;({ usage: this.spend } = (
            await this.$axios.get('credits/spend')
          ).data)

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    }
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        await Promise.all([
          ({ usage: this.add } = (await this.$axios.get('credits/add')).data),
          ({ usage: this.spend } = (
            await this.$axios.get('credits/spend')
          ).data)
        ])

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async submit() {
      this.orderError = ''
      this.submitting = true

      try {
        const order = (
          await this.$axios.put('orders', {
            product: 'Credits',
            credits: Math.min(100, parseInt(this.credits, 10))
          })
        ).data

        this.$router.push(`/orders/${order.id}`)
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }

      this.submitting = false
    }
  }
}
</script>
