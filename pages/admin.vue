<template>
  <Page :title="title" :hero="false" narrow no-subscribe>
    <v-card class="mb-4">
      <v-card-title>
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
            v-model="email"
            :rules="[(v) => !v || /@/.test(v) || 'Enter a valid email address']"
            label="Email address"
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

    <template v-if="!error">
      <h2 class="mt-8 mb-4">Recent orders</h2>

      <Progress v-if="!Object.keys(recentOrders).length" />
      <template v-else>
        <v-card class="mb-4">
          <template v-for="(orders, status) in recentOrders">
            <div v-if="orders.length" :key="status">
              <v-card-title class="subtitle-2">
                {{ status }}
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
                        <td v-if="order.status === 'Calculating'">
                          <Spinner />
                        </td>
                        <td v-else-if="order.status === 'Insufficient'">
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
    </template>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiAccount } from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    Page,
    Progress,
  },
  data() {
    return {
      title: 'Administration',
      email: '',
      error: false,
      mdiAccount,
      recentOrders: {},
      submitting: false,
      success: false,
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

      if (this.email && this.$refs.form.validate()) {
        this.$store.commit('user/setImpersonating', this.email)

        await new Promise((resolve) => {
          this.$nextTick(async () => {
            try {
              const user = (await this.$axios.get('user')).data

              this.$store.commit('user/setAttrs', user)

              this.success = `Signed in as ${this.email}`
              this.email = ''
            } catch (error) {
              this.$store.commit('user/setImpersonating', '')

              this.error = this.getErrorMessage(error)
            }

            resolve()
          })
        })
      }

      this.submitting = false
    },
  },
}
</script>
