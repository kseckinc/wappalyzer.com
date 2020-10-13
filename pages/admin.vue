<template>
  <Page :title="title" :hero="false" no-subscribe>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-6">
          <v-card-title class="subtitle-2">
            Sign in as
          </v-card-title>
          <v-card-text>
            <v-alert v-if="success" type="success">
              {{ success }}
            </v-alert>
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>

            <v-form ref="form" @submit.prevent="submit">
              <v-text-field
                v-model="userId"
                label="Email address or user ID"
                required
                hide-details="auto"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="submitting" color="accent" text @click="submit">
              <v-icon left>{{ mdiAccount }}</v-icon>
              Sign in
            </v-btn>
          </v-card-actions>
        </v-card>

        <template v-if="Object.keys(recentOrders).length">
          <v-card>
            <template v-for="(orders, status) in recentOrders">
              <div v-if="orders.length" :key="status">
                <v-card-title class="subtitle-2">
                  {{ status }} orders
                </v-card-title>
                <v-card-text class="px-0">
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th width="15%">ID</th>
                        <th>User ID</th>
                        <th width="15%">Product</th>
                        <th width="15%">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="order in orders">
                        <tr :key="order.createdAt">
                          <td>
                            {{ order.id }}
                          </td>
                          <td>{{ order.userId }}</td>
                          <td>
                            {{ order.product }}
                          </td>
                          <td
                            v-if="
                              ['Insufficient', 'Calculating'].includes(
                                order.status
                              )
                            "
                          >
                            -
                          </td>
                          <td v-else-if="order.paymentMethod === 'credits'">
                            {{ formatNumber(order.totalCredits) }}
                            Credits
                          </td>
                          <td v-else>
                            {{
                              formatCurrency(order.total / 100, order.currency)
                            }}
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </div>
            </template>
          </v-card>
        </template>
      </v-col>

      <v-col cols="12" md="6">
        <template v-if="!error">
          <template v-if="stats">
            <v-card class="mb-4">
              <v-card-title class="subtitle-2">
                Recent orders
              </v-card-title>

              <v-card-text>
                <GChart
                  type="LineChart"
                  :data="stats.orders"
                  :options="lineChartOptions"
                />
              </v-card-text>

              <v-divider />

              <v-card-text>
                <GChart
                  type="LineChart"
                  :data="stats.values"
                  :options="{
                    ...lineChartOptions,
                    vAxis: { format: 'currency' },
                  }"
                />
              </v-card-text>

              <v-divider />

              <v-card-text>
                <GChart
                  type="ColumnChart"
                  :data="stats.products"
                  :options="columnChartOptions"
                />
              </v-card-text>
            </v-card>
          </template>
        </template>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiAccount } from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
    GChart,
  },
  data() {
    return {
      title: 'Administration',
      userId: '',
      error: false,
      mdiAccount,
      recentOrders: {},
      submitting: false,
      success: false,
      stats: null,
      lineChartOptions: {
        series: {
          0: {
            lineDashStyle: [2, 2],
            lineWidth: 2,
          },
        },
        lineWidth: 2,
        legend: { position: 'top' },
        colors: ['#a182d5', '#4608ad'],
      },
      columnChartOptions: {
        isStacked: true,
        legend: { position: 'top' },
      },
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
  },
  async created() {
    if (!this.user.admin) {
      return this.$nuxt.error({ statusCode: 404 })
    }

    try {
      this.stats = (await this.$axios.get('orders/stats')).data

      this.stats = Object.keys(this.stats).reduce((stats, key) => {
        stats[key] = this.stats[key].map((row, index) => {
          const [date] = row

          return index ? [new Date(date), ...row.slice(1)] : row
        })

        return stats
      }, {})

      this.recentOrders = (await this.$axios.get('orders/recent')).data
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }
  },
  methods: {
    async submit() {
      this.error = false
      this.success = false
      this.submitting = true

      if (this.userId && this.$refs.form.validate()) {
        try {
          await this.signInAs(this.userId)

          this.userId = ''

          this.$router.push('/account')
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }

      this.submitting = false
    },
  },
}
</script>
